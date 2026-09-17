# Threat Register — STRIDE（W0 Day 2）

- 状态：草案（**安全测试设计**，不实现产品功能、不执行真实攻击、不做 exploitation）
- 一致性来源：[Attack Surface](attack-surface.md)、[Scope Freeze](../scope/scope-freeze-v1.2.md)、[ADR](../adr/README.md)、[Risk Register](../risks/risk-register.md)、[Security Invariants](security-invariants.md)
- 编号：`<组件>-<序号>`。STRIDE = Spoofing / Tampering / Repudiation / Info Disclosure / DoS / Elevation。
- 等级：Impact = Low/Medium/High/Critical；Likelihood = Low/Medium/High；Priority = P0/P1/P2（不虚构精确概率）。
- **Owner**：默认 **你（单人开发）**；实现周分配到具体任务编号（见 [任务编号规则](../00-week0/solo-ai-workflow.md#4-任务编号规则)）。
- **Status**：`Planned`（缓解未实现）/ `In Progress` / `Verified`（有通过的负向测试）。W0 阶段所有均为 `Planned`。

> 说明：为可读性，每个组件先给**总览表**（含 Threat ID / STRIDE / Attack Path / Target Asset / Impact / Likelihood / Priority / Status），随后给**缓解与测试**（每条 threat 含 1 Prevention + 1 Detection/Monitoring + 1 Negative Test）。Component 为章节；Owner/Status 如上。12 项字段齐全。

## 跨租户 / Cookie 隔离交叉映射（最高优先）

sibling-subdomain / cross-tenant 风险贯穿多个组件，集中映射如下（详见各条 + [ADR-0001](../adr/ADR-0001-user-site-domain-isolation.md)、[ADR-0006](../adr/ADR-0006-host-only-cookie-capability-token.md)）：
**AUTH-003**（sibling-subdomain 读 cookie）、**AUTH-004**（CSRF）、**GW-004**（tenant confusion）、**STORAGE-002**（cross-tenant object）、**TOKEN-003**（site_id bypass）、**SSI-003**（XSS 越边界）。

---

## 1. Auth（AUTH）

| Threat ID | STRIDE | Attack Path | Target Asset | Impact | Likelihood | Priority | Status |
|---|---|---|---|---|---|---|---|
| AUTH-001 | S | 用泄漏账号/密码组合批量登录（credential stuffing） | account/session | High | High | P0 | Planned |
| AUTH-002 | S | 对单账号高频猜测密码（brute force） | account | High | Medium | P0 | Planned |
| AUTH-003 | I/E | 经 XSS 或 **sibling-subdomain cookie** 读取/窃取 session | session | Critical | Medium | P0 | Planned |
| AUTH-004 | S/T | 诱导已登录用户发起状态变更请求（CSRF） | account state | High | Medium | P0 | Planned |
| AUTH-005 | E | 预设/固定 session id 让受害者复用（session fixation） | session | High | Low | P1 | Planned |
| AUTH-006 | E | 绕过鉴权访问未授权功能/账户（privilege bypass） | permissions | Critical | Medium | P0 | Planned |

**缓解与测试**
- **AUTH-001** — Prevention：IP+账号双维度限流 + Turnstile + 泄漏口令库比对；Detection：login_failures / 异常地理速率告警；Negative Test：超阈值后必须触发挑战/锁定，返回受控错误而非放行。
- **AUTH-002** — Prevention：指数退避 + 账号锁定 + Argon2id；Detection：单账号失败计数告警；Negative Test：N 次失败后该账号登录被限，且不泄漏“用户是否存在”。
- **AUTH-003** — Prevention：`__Host-` host-only cookie（禁 Domain）、HttpOnly、控制面/数据面分域（ADR-0001/0006）；Detection：跨源 cookie 使用异常、CSP 违规上报；Negative Test：在 `alice.<site-domain>` 执行 `document.cookie` 取不到平台 session；无法通过 sibling subdomain 读平台 cookie。
- **AUTH-004** — Prevention：CSRF token + 严格 Origin/Referer 校验（SameSite 非唯一防线）；Detection：缺失/不匹配 Origin 的写请求计数；Negative Test：无合法 CSRF/Origin 的 POST/PUT/PATCH/DELETE 必须失败。
- **AUTH-005** — Prevention：登录成功后重新签发 session id、绑定要素；Detection：同一 session id 登录前后复用告警；Negative Test：预设 session id 在登录后失效，不被沿用。
- **AUTH-006** — Prevention：每操作 `authorize(user,resource,permission)`；Detection：越权拒绝审计计数；Negative Test：低权限用户访问高权限端点返回 403，且无副作用。

## 2. Static Gateway（GW）

| Threat ID | STRIDE | Attack Path | Target Asset | Impact | Likelihood | Priority | Status |
|---|---|---|---|---|---|---|---|
| GW-001 | S/E | 伪造/畸形 Host 路由到内部服务或控制面 | routing/domain map | High | Medium | P0 | Planned |
| GW-002 | I | `..`/编码路径读取 site root 外对象（path traversal） | user objects | High | Medium | P0 | Planned |
| GW-003 | T | 未规范化 key/header 污染共享缓存（cache poisoning） | cache/domain map | High | Low | P1 | Planned |
| GW-004 | E/I | Host/路由歧义把 A 的请求指向 B 站点（tenant confusion） | cross-tenant objects | Critical | Low | P0 | Planned |
| GW-005 | T | 强制错误 Content-Type 诱导浏览器执行（MIME confusion） | response integrity | Medium | Medium | P1 | Planned |
| GW-006 | D | 高频/大 Range/慢连接拖垮读路径（DoS） | availability | High | Medium | P1 | Planned |

**缓解与测试**
- **GW-001** — Prevention：严格解析 Host，白名单/正则校验，未知/畸形默认拒绝；平台域与用户域独立 routing policy（ADR-0002）；Detection：unknown-host 拒绝率与畸形 Host 告警；Negative Test：`app/api/admin.<site-domain>` 与畸形 Host 不进入用户 site lookup，返回受控拒绝。
- **GW-002** — Prevention：单次 decode → normalize → canonicalize → 拒 `..`/NUL/绝对路径/符号链接 → 解析到 immutable site root；Detection：traversal 拒绝计数；Negative Test：编码绕过/`..` 序列全部 404，不读到 root 外对象。
- **GW-003** — Prevention：缓存 key 含规范化 host+path，剥离不可信 header 出 key；Detection：缓存命中异常/投毒特征告警；Negative Test：注入 header 无法改变其他用户的缓存响应。
- **GW-004** — Prevention：domain→site_id 精确映射，key 前缀用 immutable site UUID；Detection：一次请求跨 site 访问告警；Negative Test：构造歧义 Host 无法读到他租户对象（跨租户返回 404/403）。
- **GW-005** — Prevention：服务端权威 MIME + `X-Content-Type-Options: nosniff`，平台安全头不可被用户覆盖；Detection：异常 Content-Type 分布；Negative Test：用户无法使 `.txt`/未知类型以可执行 MIME 返回。
- **GW-006** — Prevention：只读凭证 + 限流 + Range/连接预算 + 无阻塞任务；Detection：p95/连接数/慢连接告警；Negative Test：2x 峰值压测与大量 Range 请求下读路径不雪崩（设计目标，见 SLO）。

## 3. Storage（STORAGE）

| Threat ID | STRIDE | Attack Path | Target Asset | Impact | Likelihood | Priority | Status |
|---|---|---|---|---|---|---|---|
| STORAGE-001 | I/T | 文件名/路径拼出 site root 外对象 key（key traversal） | objects | High | Medium | P0 | Planned |
| STORAGE-002 | I | 猜测/篡改 id/key 读取他人对象（cross-tenant） | cross-tenant objects | Critical | Medium | P0 | Planned |
| STORAGE-003 | T | 发布/删除中断产生无引用对象（orphan object） | consistency/cost | Medium | Medium | P1 | Planned |
| STORAGE-004 | T | manifest 与对象/hash 不一致（manifest corruption） | version integrity | High | Low | P0 | Planned |
| STORAGE-005 | T | 绕过配额计数超额写入（quota bypass） | quota/cost | Medium | Medium | P1 | Planned |
| STORAGE-006 | T/E | 误/恶意删除站点数据不可恢复（destructive deletion） | user data | Critical | Low | P0 | Planned |

**缓解与测试**
- **STORAGE-001** — Prevention：对象 key = immutable site UUID 前缀 + 规范化相对路径，用户输入不拼桶根；Detection：越界 key 写/读拒绝计数；Negative Test：构造 `../` 文件名无法写/读到 site 前缀外。
- **STORAGE-002** — Prevention：每操作 `authorize(user,site,perm)`，所有查询必带 `site_id`；Detection：跨 site 访问审计；Negative Test：Bob 凭证读 Alice 对象返回 403/404，无数据泄漏。
- **STORAGE-003** — Prevention：发布用 version_id，失败回滚；soft-delete + 异步 GC；Detection：orphan/悬挂引用 consistency checker（ADR-0007）；Negative Test：模拟发布中断后无 current_version 指向缺失对象、无残留可访问半成品。
- **STORAGE-004** — Prevention：manifest 记录 key+versionId+hash，读时校验；Detection：hash mismatch 告警；Negative Test：篡改对象后 hash 校验失败并拒绝 serve 该版本。
- **STORAGE-005** — Prevention：服务端权威配额账本，写前校验；Detection：配额接近/超限告警；Negative Test：并发写不能突破配额（原子计数），超额写被拒。
- **STORAGE-006** — Prevention：删除先 soft-delete + 恢复窗口 + 二次确认；Detection：批量删除速率告警 + 审计；Negative Test：删除后在恢复窗口内可恢复；无绕过 soft-delete 的直接硬删路径。

## 4. SSI（SSI）

| Threat ID | STRIDE | Attack Path | Target Asset | Impact | Likelihood | Priority | Status |
|---|---|---|---|---|---|---|---|
| SSI-001 | I | include 动态路径/`..`/编码读越界文件（path traversal） | site files | High | Medium | P0 | Planned |
| SSI-002 | D | include 环导致无限递归（recursive include） | renderer resources | High | Medium | P1 | Planned |
| SSI-003 | I/E | Markdown/raw HTML 注入脚本越过站点/控制面边界（stored XSS） | sessions/other users | Critical | Medium | P0 | Planned |
| SSI-004 | I | include 读取非公开/敏感文件（sensitive file access） | sensitive files | High | Medium | P0 | Planned |
| SSI-005 | D | 构造昂贵渲染耗尽 CPU/内存（exhaustion） | renderer/availability | High | Medium | P1 | Planned |

**缓解与测试**
- **SSI-001** — Prevention：include 路径必须 directive 字面量，运行时字符串不参与拼接，解析到 site root；Detection：traversal 拒绝计数；Negative Test：动态/`..`/编码 include 全部阻断。
- **SSI-002** — Prevention：include 深度/次数上限 + 环检测；Detection：递归深度/超时告警；Negative Test：自引用/互引用 include 在限制内中止，不耗尽 renderer。
- **SSI-003** — Prevention：渲染后 sanitize，拒 script/iframe/on*/javascript:；输出进沙箱边界（ADR-0001/0004）；Detection：CSP 违规上报、危险标签命中计数；Negative Test：注入 `<script>` 等无法进入控制面或越过用户站点边界执行。
- **SSI-004** — Prevention：仅允许 site 内公开路径，隐藏/系统文件不可 include；Detection：敏感路径 include 尝试告警；Negative Test：include 平台/系统/隐藏文件被拒。
- **SSI-005** — Prevention：per-render CPU/内存/超时预算 + 独立 pool + circuit breaker；Detection：render latency/OOM/circuit 状态；Negative Test：昂贵页面触发预算中止，SSI 全挂时静态文件仍可访问。

## 5. RSS Fetcher（RSS）

| Threat ID | STRIDE | Attack Path | Target Asset | Impact | Likelihood | Priority | Status |
|---|---|---|---|---|---|---|---|
| RSS-001 | I | feed URL 指向内部服务/metadata（169.254.169.254）（SSRF） | internal/metadata | Critical | High | P0 | Planned |
| RSS-002 | I | 30x 重定向到私网绕过初始校验（redirect to private IP） | internal | Critical | Medium | P0 | Planned |
| RSS-003 | I | 二次解析/AAAA 切私网（DNS rebinding） | internal/metadata | Critical | Medium | P0 | Planned |
| RSS-004 | I | feed XML 外部实体读文件/SSRF（XXE） | files/internal | High | Medium | P0 | Planned |
| RSS-005 | D | gzip 炸弹耗尽内存（decompression bomb） | fetcher resources | High | Medium | P1 | Planned |
| RSS-006 | D | 超大响应体耗资源（huge response） | fetcher resources | Medium | Medium | P1 | Planned |

**缓解与测试**
- **RSS-001** — Prevention：仅 http/https + 受控 DNS resolver + 拒 private/link-local/metadata/控制面网段 + egress network policy（ADR-0005）；Detection：SSRF 拦截计数、blocked egress；Negative Test：请求 `http://169.254.169.254/...` 必须返回 `SECURITY_BLOCK`，不发出内网连接。
- **RSS-002** — Prevention：每次 redirect 重做 scheme/DNS/IP/TLS 校验，连接 IP 属刚验证解析结果；Detection：redirect-to-private 拦截计数；Negative Test：初始公网、302 到私网时被拒。
- **RSS-003** — Prevention：解析与连接绑定同一 IP（pin），限制解析结果集，短 TTL 重校验；Detection：解析结果私网命中告警；Negative Test：DNS 先返回公网、二次返回私网（rebinding）连接被拒。
- **RSS-004** — Prevention：禁用 DTD/外部实体（XXE off）；Detection：DTD/实体出现计数；Negative Test：含外部实体的 feed 不触发文件读/外连。
- **RSS-005** — Prevention：解压比与总量上限、流式限额；Detection：解压比异常告警；Negative Test：高压缩比炸弹在阈值处中止，无 OOM。
- **RSS-006** — Prevention：响应体大小 + 超时 + redirect 次数上限；Detection：超限计数；Negative Test：超大响应被截断/拒绝，不耗尽资源。

## 6. Screenshot Worker（SCREENSHOT）

| Threat ID | STRIDE | Attack Path | Target Asset | Impact | Likelihood | Priority | Status |
|---|---|---|---|---|---|---|---|
| SCREENSHOT-001 | I | 页面子资源/fetch 指向内网（SSRF） | internal | Critical | High | P0 | Planned |
| SCREENSHOT-002 | I | 访问云 metadata endpoint | cloud creds | Critical | Medium | P0 | Planned |
| SCREENSHOT-003 | I | rebinding 切私网（DNS rebinding） | internal | Critical | Medium | P0 | Planned |
| SCREENSHOT-004 | E | Chromium 0day 逃逸沙箱（blast radius） | host/worker | Critical | Low | P0 | Planned |
| SCREENSHOT-005 | D | 复杂页面耗内存（OOM） | worker | High | Medium | P1 | Planned |
| SCREENSHOT-006 | D | 无限加载/重定向/动画阻塞（infinite workload） | worker | Medium | Medium | P1 | Planned |

**缓解与测试**
- **SCREENSHOT-001** — Prevention：worker 走 Egress Proxy + 网络层 ACL + 受限 DNS resolver，deny 私网（ADR-0005）；Detection：blocked egress 计数；Negative Test：页面内 `fetch('http://10.0.0.1')`/私网子资源被网络层阻断。
- **SCREENSHOT-002** — Prevention：显式 deny metadata 网段，无云凭证注入沙箱；Detection：metadata 访问尝试告警；Negative Test：访问 `169.254.169.254` 被 deny，取不到凭证。
- **SCREENSHOT-003** — Prevention：解析-连接 IP pin + 重校验；Detection：私网解析命中；Negative Test：rebinding 场景连接被拒。
- **SCREENSHOT-004** — Prevention：沙箱化（seccomp/命名空间/无特权）、最小权限、worker 与控制面网络隔离，故障域限于 worker（INV-6）；Detection：crash/异常 syscall 告警；Negative Test（设计）：模拟渲染进程崩溃时无 host/控制面影响，sandbox 被回收。
- **SCREENSHOT-005** — Prevention：内存/CPU cgroup 限额 + 超时；Detection：OOM/kill 计数；Negative Test：高内存页面触发限额回收，不影响其他任务。
- **SCREENSHOT-006** — Prevention：页面加载超时、导航次数/时长上限；Detection：超时任务计数；Negative Test：无限重定向/长动画页面在超时处终止。

## 7. Domain / DNS / TLS（DOMAIN）

| Threat ID | STRIDE | Attack Path | Target Asset | Impact | Likelihood | Priority | Status |
|---|---|---|---|---|---|---|---|
| DOMAIN-001 | S/E | 绑定他人/悬空域名接管流量（domain takeover） | binding/traffic | Critical | Medium | P0 | Planned |
| DOMAIN-002 | S | 伪造/绕过 DNS 归属验证（verification bypass） | binding | Critical | Medium | P0 | Planned |
| DOMAIN-003 | T | 域名释放后旧绑定仍生效（stale DNS binding） | traffic/cert | High | Low | P1 | Planned |
| DOMAIN-004 | T/D | 争用/滥发证书或触发 CA 限流（TLS issuance conflict） | cert availability | Medium | Medium | P1 | Planned |
| DOMAIN-005 | E/I | 自定义域与子域/内部名冲突（hostname collision） | routing/tenant | High | Low | P0 | Planned |

**缓解与测试**
- **DOMAIN-001** — Prevention：绑定前强制 DNS 归属验证 + 绑定唯一性；Detection：绑定/解绑审计、悬空记录扫描；Negative Test：未验证归属的域无法绑定/接管既有站点。
- **DOMAIN-002** — Prevention：随机挑战值 + 服务端权威校验（HTTP-01/DNS-01），不信任客户端断言；Detection：验证失败率告警；Negative Test：伪造验证响应无法通过归属校验。
- **DOMAIN-003** — Prevention：释放域走冷却 + 撤销证书 + 清缓存/绑定；Detection：stale binding 扫描；Negative Test：域释放后旧绑定不再路由、旧证书被撤销。
- **DOMAIN-004** — Prevention：CA abstraction + multi-CA fallback + 签发限流与去重；Detection：签发失败/限流告警；Negative Test：主 CA 限流/故障时可切第二 CA 完成签发。
- **DOMAIN-005** — Prevention：保留名/内部名黑名单，自定义域不得覆盖平台子域与内部主机名；Detection：冲突绑定尝试告警；Negative Test：尝试绑定 `app.<site-domain>`/内部名被拒。

## 8. API Token（TOKEN）

| Threat ID | STRIDE | Attack Path | Target Asset | Impact | Likelihood | Priority | Status |
|---|---|---|---|---|---|---|---|
| TOKEN-001 | I | 日志/URL/前端泄漏 token（token leak） | token/capability | High | Medium | P0 | Planned |
| TOKEN-002 | E | 执行超出 scope 的操作（scope escalation） | capability | Critical | Medium | P0 | Planned |
| TOKEN-003 | E/I | 用 token 访问非授权 site（site_id bypass） | cross-tenant | Critical | Medium | P0 | Planned |
| TOKEN-004 | E/I | 越过 path_prefix 访问越界路径（path_prefix bypass） | files | High | Medium | P0 | Planned |
| TOKEN-005 | R/E | 撤销后继续使用（revoked token reuse） | capability | High | Low | P0 | Planned |
| TOKEN-006 | E | 过期 token 仍被接受（expired token reuse） | capability | Medium | Low | P1 | Planned |

**缓解与测试**
- **TOKEN-001** — Prevention：只存 keyed hash + key_id，明文仅创建时展示一次，禁止入日志/URL；Detection：日志中 token 模式扫描；Negative Test：DB/日志泄漏样本无法还原可用明文 token。
- **TOKEN-002** — Prevention：scope 为硬边界，每操作校验所需 scope；Detection：越 scope 拒绝计数；Negative Test：只读 token 执行写操作被拒。
- **TOKEN-003** — Prevention：token 绑定 site，操作校验 `token.site == 目标 site`；Detection：跨 site 使用告警；Negative Test：site A 的 token 访问 site B 返回 403。
- **TOKEN-004** — Prevention：每次文件操作同时校验 API path 与 `token.path_prefix`；Detection：越界路径拒绝计数；Negative Test：越 `path_prefix` 的路径操作被拒。
- **TOKEN-005** — Prevention：撤销即时生效（服务端状态权威）；Detection：撤销后使用尝试告警；Negative Test：撤销后立即返回 401。
- **TOKEN-006** — Prevention：expiry 强校验；Detection：过期使用计数；Negative Test：过期 token 返回 401。

## 9. Admin（ADMIN）

| Threat ID | STRIDE | Attack Path | Target Asset | Impact | Likelihood | Priority | Status |
|---|---|---|---|---|---|---|---|
| ADMIN-001 | E | 普通用户提升为管理员（privilege escalation） | everything | Critical | Low | P0 | Planned |
| ADMIN-002 | T | 误批量删除/封禁（accidental destructive operation） | user data/accounts | Critical | Low | P0 | Planned |
| ADMIN-003 | R | 操作不写审计（audit bypass） | non-repudiation | High | Low | P0 | Planned |
| ADMIN-004 | T/R | 隔离/封禁时销毁证据（evidence deletion） | evidence | High | Low | P0 | Planned |
| ADMIN-005 | S/E | admin 会话被劫持（compromised admin session） | everything | Critical | Low | P0 | Planned |

**缓解与测试**
- **ADMIN-001** — Prevention：管理端点独立鉴权 + 角色显式授予，默认拒绝；Detection：权限变更审计；Negative Test：普通用户调用 admin 端点返回 403，无法自我提权。
- **ADMIN-002** — Prevention：破坏性操作二次确认 + 影响范围预览 + soft-delete；Detection：批量操作速率告警；Negative Test：批量删除进入可恢复状态，误操作可回滚。
- **ADMIN-003** — Prevention：所有管理操作强制审计（不可关闭）；Detection：无审计的状态变更告警；Negative Test：任一管理操作必产生不可篡改审计事件。
- **ADMIN-004** — Prevention：隔离=冻结而非删除，证据只读保留；Detection：证据访问/删除审计；Negative Test：隔离站点后证据仍可取证、不可被同一操作销毁。
- **ADMIN-005** — Prevention：admin `__Host-` session + 短时效 + 强 CSRF/Origin + 可选二次验证；Detection：admin 会话异常地理/并发告警；Negative Test：劫持的 admin 请求缺 CSRF/Origin 被拒。

## 覆盖度自检（W0 Gate B）

- [ ] 跨租户：GW-004 / STORAGE-002 / TOKEN-003 ✔
- [ ] SSRF：RSS-001/002/003 / SCREENSHOT-001/002/003 ✔
- [ ] XSS：SSI-003 ✔
- [ ] Path traversal：GW-002 / STORAGE-001 / SSI-001 ✔
- [ ] Token escalation：TOKEN-002/003/004 ✔
- [ ] Domain takeover：DOMAIN-001/002 ✔
- [ ] Cookie isolation：AUTH-003/004（+ ADR-0001/0006）✔
- [ ] DoS：GW-006 / SSI-002/005 / RSS-005/006 / SCREENSHOT-005/006 ✔
- 每个 **P0** 均有 Prevention + Detection + Negative Test（见上）。
