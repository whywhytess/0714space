# ADR-0001：用户站点域隔离

- 状态：Proposed（待你签字）
- 日期：2026-09-17
- 相关：威胁 XT-01~07；v1.2.1 sibling-subdomain 安全增补；INV-1

## 问题

平台主域与不可信用户子域共用同一 registrable domain：控制面 `example.com` / `app` / `api` / `admin`，用户站点 `alice.example.com` / `username.example.com` 运行用户上传的任意 HTML/CSS/JS。不同 subdomain 提供 Origin 隔离，但**不能**被当作完整安全边界（Cookie tossing / parent-domain cookie / CSRF / CORS / DOM 注入 / Host 操纵等风险）。

## 决定

**Baseline**：允许平台与用户站点共用同一 registrable domain，但必须通过 **Origin、Cookie、API、Gateway、DOM** 五道隔离建立安全边界，不依赖“子域天然独立”的假设。用户 sibling subdomain 一律视为 hostile / untrusted origin。
**Future hardening（可选，非上线前置）**：可迁移用户站点至独立 registrable domain（如 `alice.example-sites.net`）。见 open-decisions D-02。

## 原因

保留 Nekoweb 风格 URL 与品牌一致性，同时用可测试的技术边界（`__Host-` cookie、CSRF/Origin 校验、trusted-origin allowlist、Shadow DOM/sandbox iframe、独立 routing policy）守住 INV-1。第二独立域成本高（第二域名 + DNS/TLS 运维 + 迁移），当前不必要。

## 替代方案

- **强制双独立域名**：隔离更强、Cookie 边界更简单，但增加运维与迁移成本、降低品牌一致性；作为未来可选项保留而非强制。
- **仅依赖 SameSite/子域天然隔离**：不足以防 cookie tossing / same-site 语义歧义；拒绝。

## 后果

- 正面：URL 与品牌不变；隔离要求转化为 W2/W4 的明确测试项与 Gate。
- 代价：Cookie/CSRF/CORS/DOM 隔离必须严格实现并回归测试，否则直接触及 INV-1。
- 影响：W2 Gate（+5 项）、W4 Gate（+6 项，测试 A–E）；见 w0-gate.md E 节。
