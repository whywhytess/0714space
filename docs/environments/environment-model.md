# 环境模型（Environment Model）— W0 Day 3

- 状态：草案
- 范围：定义 LOCAL / STAGING / PRODUCTION 三套环境的用途、允许项、禁止项与要求。
- 相关：[secret-policy](../security/secret-policy.md)、[production-access-policy](../security/production-access-policy.md)、[ADR-0003 三 Redis](../adr/ADR-0003-redis-three-domain-separation.md)、[SLO/DR](../00-week0/slo-sev-rollback.md)
- 红线：本文件不创建任何真实云资源；PRODUCTION 相关操作由人类执行（见 production-access-policy）。

## 概览

| 维度 | LOCAL | STAGING | PRODUCTION |
|---|---|---|---|
| 用途 | 个人开发 | 集成/E2E/迁移/安全/恢复演练 | 真实用户 |
| 数据 | mock / dummy | synthetic / sanitized | 真实用户数据 |
| Secret | dummy secrets（`.env`） | staging 专用（Secret Manager，非 prod） | Secret Manager + 轮换 |
| 结构 | 可简化 | 尽量与 prod 相同 | 权威结构 |
| 部署 | 手动 | main 绿色后自动 | 人工审批 + canary |
| AI 可操作 | 是 | 是（非破坏性） | 否（仅人类） |

## 1. LOCAL

- **用途**：个人开发、快速迭代、单元/本地集成测试。
- **允许**：
  - mock email（不外发）
  - local PostgreSQL
  - local Redis（Auth / Cache / Queue 三实例或三 DB 分离，遵循 [ADR-0003](../adr/ADR-0003-redis-three-domain-separation.md)）
  - MinIO / 本地 S3 兼容对象存储
  - dummy secrets（仅本机 `.env`，值为占位/随机）
- **禁止**：
  - production user data
  - production credentials
  - 对外发送真实邮件 / 真实支付 / 真实 DNS 变更
- **要求**：可通过 `docker compose up` 一键起全栈（规划见 [local-bootstrap-plan](local-bootstrap-plan.md)）。

## 2. STAGING

- **用途**：integration、E2E、migration test、security test、recovery rehearsal（备份恢复演练）。
- **要求**：**尽量与 production 使用相同结构**（同类网络策略、同类服务拓扑、生产镜像/迁移路径），以保证测试代表性。
- **数据**：synthetic data / sanitized data；生产规模量级用于 migration benchmark。
- **禁止**：**复制真实敏感用户数据**进入 staging（去标识/合成替代）。
- **Secret**：staging 专用凭证，经 Secret Manager 管理，**与 production 隔离**；不得复用 prod secret。
- **AI**：可在 staging 跑测试/日志分析；不得对 staging 执行会污染共享环境的破坏性操作而不通知。

## 3. PRODUCTION

- **用途**：真实用户流量与数据。
- **要求**：
  - **strict IAM**（最小权限、职责分离）
  - **audit**（管理与安全敏感操作全审计，不可抵赖）
  - **backup**（PITR + 对象 versioning，RPO/RTO 见 [SLO/DR](../00-week0/slo-sev-rollback.md)）
  - **monitoring**（SLO/告警/Runbook）
  - **Secret Manager**（key_id / rotation）
  - **manual approval**（部署/迁移/DNS/账单等由人类审批，见 [production-access-policy](../security/production-access-policy.md)）
- **AI 边界**：AI 不接触 production secret，不执行 production deploy / destructive migration / DNS / 支付 / 封禁。

## 环境隔离原则

- 三套环境的 Secret、网络、数据严格隔离；LOCAL/STAGING 不得触达 production 网络或凭证。
- 晋升方向单向：LOCAL → STAGING → PRODUCTION；数据不得从 PRODUCTION 反向复制到低级环境（除经批准的 sanitized 快照）。
