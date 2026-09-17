# Definition of Done — W0 Day 4

- 状态：草案（任务级 DoD；与 `CLAUDE.md` §9、v1.1 §34 一致）
- 相关：[git-workflow](git-workflow.md)、[ai-roles](ai-roles.md)、[pre-production-risk-checklist](../security/pre-production-risk-checklist.md)

## 风险分级（决定 DoD 强度，已确认）

| 变更类型 | 要求 |
|---|---|
| **docs-only**（纯文档，`docs:`） | 可**豁免** integration / staging；仍需 no-secret + human review |
| **普通代码** | **完整 DoD**（下方全部适用项） |
| **高风险代码**（Auth/Gateway/Storage/SSI/RSS/Screenshot/Domain/Token/Admin，或触及租户隔离/出站请求/密钥） | **完整 DoD + Security Review**（[ai-roles](ai-roles.md) chain） |

合并前置（main）：**CI green + human review**（见 [git-workflow](git-workflow.md)）。

## 每个任务完成必须满足（普通/高风险代码）

- [ ] requirement implemented（需求已实现，且不超出任务范围）
- [ ] unit tests（单元测试）
- [ ] failure path tests（失败/异常路径测试）
- [ ] permission / tenant isolation reviewed when relevant（涉及时审权限与租户隔离）
- [ ] integration test when relevant（涉及 DB/S3/Redis/queue 时补集成测试）
- [ ] lint passes
- [ ] typecheck passes
- [ ] no secret introduced（未引入 secret；secret 扫描通过）
- [ ] documentation updated（README/ADR/runbook/change notes 已更新）
- [ ] staging verified（已在 staging 验证）
- [ ] rollback understood（回滚/kill switch/canary 已明确）
- [ ] human review completed（你完成最终 diff review）

## 高风险模块附加项

Auth / Gateway / Storage / SSI / RSS / Screenshot / Domain / Token / Admin 额外要求：

- [ ] 关联 STRIDE threat/test 已更新（见 [threat-register](../threat-model/threat-register.md)）
- [ ] actor / resource / permission / capability 明确，并有 negative/security 测试
- [ ] 异常路径：timeout / retry / idempotency / circuit / 错误码定义齐全
- [ ] 可观测：logs / metrics / traces / request_id + alert / runbook
- [ ] 涉及 DB：附 lock / runtime / compatibility 报告
- [ ] 涉及持久数据：说明 restore / consistency 行为

## 说明

- 「只改代码不补测试」不算完成（安全修复尤甚）。
- DoD 未满足**不合并**（[git-workflow](git-workflow.md) 规则 8）。
- 生产相关动作另走 [pre-production-risk-checklist](../security/pre-production-risk-checklist.md)，由人类执行。
