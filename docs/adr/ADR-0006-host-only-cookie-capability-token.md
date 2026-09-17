# ADR-0006：host-only Cookie + Capability Token 认证模型

- 状态：Proposed（待你签字）
- 日期：2026-09-17
- 相关：威胁 XT-01~04、AUTH-*、TOKEN-*；INV-3、INV-5；ADR-0001

## 问题

平台控制面与不可信用户子域共用 registrable domain，Cookie 若设 `Domain` 会被 sibling subdomain 读取/覆盖（cookie tossing）。同时开发者 API 需要可细粒度授权、可撤销、不可逆存储的凭证。

## 决定

- **平台 Session / 站点密码认证 Cookie**：`__Host-` 前缀，Secure + HttpOnly + SameSite=Lax + Path=/，**禁止设 Domain**（host-only）。密码用 Argon2id，明文不存。SameSite 非唯一 CSRF 防线，改状态请求另加 CSRF token / 严格 Origin 校验。
- **Capability Token**：只存 keyed hash + key_id，明文仅创建时展示一次；scope / site / path_prefix / IP / expiry 都是硬能力边界；每次文件操作同时校验 API path 与 `token.path_prefix`；撤销即时生效。
- **Key Ring**：ACTIVE / VERIFY_ONLY / RETIRED 轮换，每条派生数据带 key_id/salt_epoch。

## 原因

host-only cookie 从根上消除 sibling-subdomain cookie 攻击；Capability Token 满足最小权限（INV-3）与 secret 不可逆（INV-5）。

## 替代方案

- **`Domain=<registrable>` 共享 cookie**：方便跨子域，但等于把 session 暴露给用户站点；拒绝。
- **可逆存储/JWT 自包含长期 token**：撤销困难、泄漏即长期有效；改用不透明 + keyed hash + 即时撤销。

## 后果

- 正面：会话与 API 凭证边界清晰、可撤销、可轮换。
- 代价：需 CSRF/Origin 层、token 校验中间件、key ring 运维。
- 影响：W2 Gate（host-only/`__Host-`/CSRF）、Beta Security Gate（Cookie isolation、Token escalation）。
