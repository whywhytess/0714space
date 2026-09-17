# Production 权限边界（Production Access Policy）— W0 Day 3

- 状态：草案
- 相关：`CLAUDE.md` §2/§8、[secret-policy](secret-policy.md)、[environment-model](../environments/environment-model.md)、[solo-ai-workflow](../00-week0/solo-ai-workflow.md)
- 原则：AI / coding agent 在 LOCAL/STAGING 有充分自主权；任何触及 PRODUCTION 数据、凭证、可用性或不可逆动作的操作，一律人类执行 + 记录审批。

## 1. AI / coding agent 可以

- 修改代码（应用/基础设施代码）
- 写测试（unit / integration / E2E / security / negative）
- 创建 migration（脚本与前向/回退方案，不对 prod 执行）
- `terraform validate`
- `terraform plan`（只读预演，不 apply）
- `docker compose`（本地/staging 非破坏性）
- local test
- staging test（非破坏性）
- log analysis（脱敏日志）

## 2. AI / coding agent 不允许

- production deploy
- `terraform apply` against production
- DNS production mutation
- destructive DB migration（prod 上执行）
- production Secret access
- billing operation
- CA private key access
- production account suspension
- permanent user data deletion

> 出现上述需求时，AI 只产出**方案 + Runbook + 审批清单**，交由人类执行。

## 3. Human approval required（仅人类可执行，须记录审批）

- production deployment
- DNS change
- IAM change
- payment configuration
- destructive migration
- backup restore into production
- account ban
- domain quarantine
- TLS / CA credential changes

## 4. 执行与审计约定

- 每次上述人类操作记录：操作人、时间、变更内容、审批链接、回滚方式（进入 [runbooks](../runbooks/) / 审计）。
- 破坏性/不可逆操作前，先过 [pre-production-risk-checklist](pre-production-risk-checklist.md)。
- 与工作制度一致：合并串行、AI 四眼、停止条件（跨租户/SSRF/域名接管/支付错误即停）。

## 5. 与红线的关系

本策略是 `CLAUDE.md` §2「AI 不能直接执行 production deploy / destructive migration / DNS / 支付 / 封禁」的落地细化；如两者冲突，以 `CLAUDE.md` 红线为准（更严格者优先）。
