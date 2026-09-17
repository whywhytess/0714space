# Threat Model（威胁模型）— W0 Day 2

本目录是 0714space 平台第一版 STRIDE 威胁模型。**仅为安全建模与测试设计**：不实现产品功能、不执行真实攻击、不做 exploitation。

## 文件

| 文件 | 内容 |
|---|---|
| [attack-surface.md](attack-surface.md) | 9 个组件的攻击面：Trusted/Untrusted input、Assets、Trust boundaries、External deps |
| [threat-register.md](threat-register.md) | STRIDE Threat Register（51 条，12 字段 + Prevention/Detection/Negative Test） |
| [p0-threats.md](p0-threats.md) | 全部 P0 威胁（36 条）：Mitigation status / Required test / Blocking condition |
| [security-invariants.md](security-invariants.md) | 全局安全不变量（INV-1..7） |

## 方法与约定

- **框架**：STRIDE（Spoofing / Tampering / Repudiation / Info Disclosure / DoS / Elevation）。
- **编号**：Threat = `<组件>-<序号>`（如 `RSS-001`）；组件前缀：AUTH / GW / STORAGE / SSI / RSS / SCREENSHOT / DOMAIN / TOKEN / ADMIN。
- **等级**：Impact = Low/Medium/High/Critical；Likelihood = Low/Medium/High；Priority = P0/P1/P2（不虚构精确概率）。
- **每条威胁**至少 1 个 Prevention + 1 个 Detection/Monitoring + 1 个 Negative Test（见 register 各条“缓解与测试”）。
- **Status**：`Planned`（缓解未实现）→ `In Progress` → `Verified`（负向测试通过）。W0 阶段均为 `Planned`，**不得写 Resolved**。
- **Owner**：默认 你（单人开发），实现周映射到任务编号。

## 信任边界

- **Control Plane（Trusted）**：`example.com` / `app` / `api` / `admin`（占位域名，D-01）。
- **Data Plane（Untrusted / Hostile）**：`username.<site-domain>`（用户上传 HTML/CSS/JS）。
- **核心不变量 INV-1**：任意用户站点被完全攻陷，不得危及控制面或其他租户。

## 一致性来源

本威胁模型与以下文档保持一致；冲突时以 v1.1 架构基线为准：
- [Scope Freeze](../scope/scope-freeze-v1.2.md)（范围/优先级/里程碑）
- [ADR](../adr/README.md)（ADR-0001..0008：域隔离、三执行面、三 Redis、SSI 隔离、Safe Fetch、Cookie/Token、备份一致性、原子发布）
- [Risk Register](../risks/risk-register.md)（项目/工程风险，安全类引用本模型）

## 覆盖度（W0 Gate B 重点）

跨租户 ✔ · SSRF ✔ · XSS ✔ · path traversal ✔ · token escalation ✔ · domain takeover ✔ · cookie isolation ✔ · DoS ✔（映射见 [threat-register 覆盖度自检](threat-register.md#覆盖度自检w0-gate-b)）。

## 统计

- 威胁总数：**51**
- P0：**36** ｜ P1：**15** ｜ P2：0
