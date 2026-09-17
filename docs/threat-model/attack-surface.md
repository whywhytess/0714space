# Attack Surface（攻击面）— W0 Day 2

- 状态：草案（威胁建模设计文档，**不实现产品功能，不执行真实攻击**）
- 配套：[threat-register.md](threat-register.md)、[p0-threats.md](p0-threats.md)、[security-invariants.md](security-invariants.md)
- 一致性来源：[Scope Freeze](../scope/scope-freeze-v1.2.md)、[ADR](../adr/README.md)、[Risk Register](../risks/risk-register.md)

## 信任边界总览

- **Control Plane（Trusted）**：`example.com` / `app` / `api` / `admin`。占位域名，真实值见 open-decisions D-01。
- **Data Plane（Untrusted / Hostile）**：`username.<site-domain>`，运行用户上传的任意 HTML/CSS/JS。
- 原则（INV-1）：Data Plane 完全攻陷不得危及控制面或其他租户。

---

## 1. Auth

- **Component**：注册 / 登录 / 邮箱验证 / 密码重置 / Session 管理。
- **Trusted input**：内部签发的 session id、服务间调用凭证、来自可信中间件的已校验上下文。
- **Untrusted input**：email、password、cookie、client IP、HTTP headers（含 Origin/Referer/User-Agent）、验证/重置 token、Turnstile token。
- **Assets**：account、session、permissions（角色/能力）、password hash、重置/验证 token。
- **Trust boundaries**：browser → API；API → Redis Auth；API → PostgreSQL；API → Email provider。
- **External dependencies**：Email provider、Turnstile（人机验证）、Redis Auth。

## 2. Static Gateway

- **Component**：Host/Path 路由、密码校验、Header policy、对象只读读取、ETag/Range、非阻塞统计事件（Go）。
- **Trusted input**：内部 domain map（site_id 映射）、只读对象存储凭证、平台注入的安全 header 策略。
- **Untrusted input**：Host header、请求 path、Range/If-* header、Cookie（站点密码）、query、任意客户端 header。
- **Assets**：用户站点对象（只读）、domain→site_id 映射、站点密码校验结果、响应头完整性。
- **Trust boundaries**：Internet → Gateway；Gateway → Redis Cache；Gateway → Object Storage（只读）；Gateway → PostgreSQL（仅 cache miss）；Gateway → SSI Renderer（仅命中 SSI 路由）。
- **External dependencies**：CDN、Object Storage、Redis Cache。
- **注**：Gateway **不执行** SSI/Markdown/抓取/截图/解压/扫描/构建；写操作走 API（ADR-0002）。

## 3. Storage（对象存储 + 文件元数据/发布）

- **Component**：文件 CRUD、文件夹/ZIP、对象 key 管理、site_version manifest、原子发布、配额。
- **Trusted input**：API 已鉴权的写请求、Deployment Service、immutable site UUID 前缀。
- **Untrusted input**：文件名/路径、文件夹结构、ZIP 内容与条目名、文件字节流、MIME 声明、配额相关计数输入。
- **Assets**：用户文件对象、site_version manifest（key + versionId + hash）、current_version 指针、配额账本。
- **Trust boundaries**：API → Object Storage；API → PostgreSQL（manifest）；Deployment Service → Object Storage。
- **External dependencies**：Object Storage（versioning/replication）、PostgreSQL。

## 4. SSI

- **Component**：独立 SSI Renderer（Go/Rust），经 gRPC/Unix socket 被 Gateway 调用（ADR-0004）。
- **Trusted input**：directive 字面量（include 路径必须字面量）、site root 解析结果。
- **Untrusted input**：用户页面中的 SSI directive、被 include 的用户文件内容、Markdown/raw HTML、变量值。
- **Assets**：渲染输出、site root 内文件、renderer 进程 CPU/内存、circuit 状态。
- **Trust boundaries**：Gateway → SSI Renderer（gRPC/Unix socket）；Renderer → Object Storage（site 内只读）。
- **External dependencies**：Object Storage（site 对象）。**无公网出站。**

## 5. RSS Fetcher

- **Component**：按 `next_fetch_at` 抓取用户提供的 feed URL，解析后进入 Following Feed。
- **Trusted input**：内部调度参数、Safe Fetch 校验后的连接目标。
- **Untrusted input**：用户提交的 feed URL、重定向 Location、DNS 解析结果、响应体（XML/Atom）、Content-Encoding。
- **Assets**：Following Feed 数据、fetcher 出站网络位置（不得触达内网）、解析器资源。
- **Trust boundaries**：Fetcher → Egress Proxy → Internet；Fetcher → 受限 DNS Resolver；Fetcher → Redis Queue / PostgreSQL。
- **External dependencies**：Egress Proxy、受限 DNS Resolver、网络层 ACL、任意第三方源站。

## 6. Screenshot Worker

- **Component**：Playwright/Chromium 沙箱，为 Explore 生成站点预览。
- **Trusted input**：内部任务参数（目标 site/URL 由平台生成）、沙箱配置。
- **Untrusted input**：被截图页面的 HTML/CSS/JS（用户内容）、页面发起的子资源/fetch/ws、重定向、DNS 结果。
- **Assets**：预览图对象、worker 出站网络位置、host 资源（CPU/内存）、沙箱边界。
- **Trust boundaries**：Worker → Egress Proxy → Internet；Worker → 受限 DNS Resolver；Worker → Object Storage（写预览）；沙箱 → host（必须隔离）。
- **External dependencies**：Chromium、Egress Proxy、受限 DNS Resolver、网络层 ACL。

## 7. Domain / DNS / TLS

- **Component**：自定义域名绑定、DNS 归属验证、自动 TLS（ACME）、多 CA。
- **Trusted input**：平台生成的验证挑战值、CA 账户密钥（人类持有）、内部域名状态机。
- **Untrusted input**：用户提交的自定义域名、用户 DNS 记录内容、ACME HTTP-01/DNS-01 回调路径、CA 响应。
- **Assets**：域名归属正确性、TLS 证书与私钥、domain→site 绑定、CA 账户。
- **Trust boundaries**：API → DNS Resolver；API → ACME CA；Gateway → 证书存储；用户 DNS ↔ 验证流程。
- **External dependencies**：DNS、ACME CA（主/备）、证书存储。
- **注**：DNS 修改与 CA 私钥属人类操作（红线），AI 不触碰。

## 8. API Token（Capability Token）

- **Component**：开发者 API 鉴权与自动部署，基于 scope/site/path_prefix/IP/expiry 的能力令牌。
- **Trusted input**：token 创建时的服务端签发逻辑、key ring（key_id/salt_epoch）。
- **Untrusted input**：请求携带的 token、请求的 API path、目标 site_id、client IP、header。
- **Assets**：token（keyed hash + key_id）、能力边界（scope/site/path/IP/expiry）、被授权的文件操作。
- **Trust boundaries**：client → API（token 校验中间件）；API → PostgreSQL（token 元数据）；API → key ring。
- **External dependencies**：Secret Manager / key ring、PostgreSQL。

## 9. Admin

- **Component**：Admin 后台、举报、封禁、隔离、审计。
- **Trusted input**：已鉴权管理员操作、审计写入。
- **Untrusted input**：举报内容、管理员浏览器输入（仍需 CSRF/Origin）、被隔离站点的引用参数、批量操作参数。
- **Assets**：管理权限、审计日志（不可抵赖）、被隔离/封禁站点的证据、用户账户状态。
- **Trust boundaries**：admin browser → Admin API；Admin API → PostgreSQL；Admin API → 审计存储；Admin 操作 → 站点/账户状态机。
- **External dependencies**：审计存储、PostgreSQL。
- **注**：真实封禁为红线，AI 不执行。
