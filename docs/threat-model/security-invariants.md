# Security Invariants（安全不变量）

- 状态：草案
- 说明：以下不变量在任何功能、任何里程碑都必须成立；违反即为 SEV 级安全事件（见 [severity-levels](../incidents/severity-levels.md)）。

## 核心不变量

- **INV-1（租户/控制面隔离）**：Compromise of any user-controlled site must not compromise the platform control plane or another tenant.
  - 中文：任意 `username.<site-domain>` 上运行的 HTML/CSS/JS，即使完全恶意，也不能因此获得平台 Session、操作其他用户账户、读取其他站点私有数据、调用内部管理 API、修改 Billing、获得 Admin 权限、或访问数据库/内部网络。

- **INV-2（数据正确性优先于可用性）**：宁可降级/只读，也不返回错误或半成品版本；发布具备原子性，线上任一时刻只呈现单一完整版本。

- **INV-3（最小权限与能力边界）**：每个 `site_id` 操作先 `authorize(user, site, permission)`；所有 DB 查询必带 `site_id`；Capability Token 的 scope/site/path/IP/expiry 是硬边界。

- **INV-4（服务端请求安全）**：所有出站抓取（RSS/Screenshot）仅 http/https，拒绝私网/metadata/控制面网段，每次 redirect 重校验，连接 IP 必须属于刚验证的解析结果。

- **INV-5（Secret 不可逆/不外泄）**：密码 Argon2id；Token 只存 keyed hash + key_id；明文/私钥永不入库、永不交给 AI。

- **INV-6（故障隔离）**：SSI / Screenshot / RSS / NekoVM / 队列 的故障不得升级为 hosting 静态数据面 outage；三类 Redis（Auth/Cache/Queue）不共用 eviction 域。

- **INV-7（不可抵赖）**：管理与安全敏感操作全部审计留痕；隔离动作冻结而非销毁证据。

## 优先级（冲突时）

租户隔离 > 数据正确性 > 静态托管可用性 > 发布原子性 > 服务端请求安全 > 恢复能力 > 滥用控制 > 功能数量。

## 关联

- 威胁映射见 [threat-register.md](threat-register.md)；架构决策见 [../adr/README.md](../adr/README.md)。
