# ADR-0005：Safe Fetch / SSRF 防御（RSS + Screenshot）

- 状态：Proposed（待你签字）
- 日期：2026-09-17
- 相关：威胁 RSS-001~006、SCREENSHOT-001~006；INV-4；v1.1 §12

## 问题

RSS 抓取与 Screenshot 需访问用户提供的公网 URL，是典型 SSRF 入口：指向 metadata（169.254.169.254）、私网、loopback、控制面网段，或经 DNS rebinding / redirect 绕过校验；还面临 XXE、解压炸弹、超大响应。

## 决定

统一 Safe Fetch 策略 + 网络层隔离：
- 仅 http/https；每次 redirect 重做 scheme/DNS/IP/TLS 校验；连接目的 IP 必须属于**刚验证的解析结果**。
- 拒绝 loopback / RFC1918 / link-local / ULA / metadata / 控制面网段。
- 限制响应体大小、解压量、超时、redirect 次数；禁用 DTD/XXE。
- RSS/Screenshot 作为 **hostile workload** 通过 **Egress Proxy + 网络层 ACL + 受限 DNS Resolver** 访问公网；worker 被攻陷也无法访问控制面/DB/metadata。

## 原因

SSRF 是本平台最高价值攻击面之一，代码层校验不足以对抗 rebinding/redirect，必须叠加网络层 egress deny（纵深防御），满足 INV-4。

## 替代方案

- **仅应用层 URL 校验**：无法防 DNS rebinding / TOCTOU；拒绝。
- **允许 worker 直连公网**：攻陷即触及内网；必须走 egress proxy + ACL。

## 后果

- 正面：即便解析器被攻陷，网络边界仍兜底。
- 代价：需维护 egress proxy、DNS resolver、网段 ACL；调试复杂度上升。
- 影响：M2 Beta Security Gate 必过项（RSS scheme、DNS rebinding、Screenshot egress）。
