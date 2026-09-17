# 文档索引

本目录承载 0714space 平台的工程文档。当前阶段：**Week 0**。

## Week 0 交付物（对应 W0 Gate）

| 交付 | 文档 | 状态 |
|---|---|---|
| Scope Freeze | [scope/scope-freeze-v1.2.md](scope/scope-freeze-v1.2.md) | 草案，待签字 |
| 单人 + AI 工作制度 / 任务编号（摘要） | [00-week0/solo-ai-workflow.md](00-week0/solo-ai-workflow.md) | 草案 |
| 工作流（详细，Day 4） | [workflow/](workflow/) | 草案 |
| ├ Git Workflow | [workflow/git-workflow.md](workflow/git-workflow.md) | 草案 |
| ├ AI Roles & Review Chain | [workflow/ai-roles.md](workflow/ai-roles.md) | 草案 |
| ├ Definition of Done | [workflow/definition-of-done.md](workflow/definition-of-done.md) | 草案 |
| ├ Daily Routine | [workflow/daily-routine.md](workflow/daily-routine.md) | 草案 |
| ├ Task Template | [workflow/task-template.md](workflow/task-template.md) | 模板 |
| └ AI Prompt Templates | [workflow/prompts/](workflow/prompts/) | 模板 ×4 |
| 运维：SLO Baseline | [operations/slo-baseline.md](operations/slo-baseline.md) | 草案（Day 5，initial targets） |
| 运维：SEV 分级 | [incidents/severity-levels.md](incidents/severity-levels.md) | 草案（Day 5） |
| 运维：Rollback Policy/Runbook | [runbooks/rollback.md](runbooks/rollback.md) | 草案（Day 5） |
| 运维索引：降级/DR/供应商/Chaos/Migration | [00-week0/slo-sev-rollback.md](00-week0/slo-sev-rollback.md) | 草案，含 TBD |
| 威胁模型总览 | [threat-model/README.md](threat-model/README.md) | 草案（Day 2） |
| ├ Attack Surface（9 组件） | [threat-model/attack-surface.md](threat-model/attack-surface.md) | 草案 |
| ├ Threat Register（STRIDE，51 条） | [threat-model/threat-register.md](threat-model/threat-register.md) | 草案 |
| ├ P0 Threats（36 条） | [threat-model/p0-threats.md](threat-model/p0-threats.md) | 草案 |
| └ Security Invariants | [threat-model/security-invariants.md](threat-model/security-invariants.md) | 草案 |
| Risk Register（工程/项目风险） | [risks/risk-register.md](risks/risk-register.md) | 草案 |
| 环境模型（LOCAL/STAGING/PROD） | [environments/environment-model.md](environments/environment-model.md) | 草案（Day 3） |
| Local Bootstrap 设计 | [environments/local-bootstrap-plan.md](environments/local-bootstrap-plan.md) | 草案（Day 3，规划） |
| Secret Policy | [security/secret-policy.md](security/secret-policy.md) | 草案（Day 3） |
| Production Access Policy | [security/production-access-policy.md](security/production-access-policy.md) | 草案（Day 3） |
| Pre-Production Risk Checklist | [security/pre-production-risk-checklist.md](security/pre-production-risk-checklist.md) | 模板（Day 3） |
| 关键 ADR | [adr/README.md](adr/README.md) | ADR-0001–0008 草案 |
| Public Beta Gate（框架） | [gates/public-beta-gate.md](gates/public-beta-gate.md) | 框架（全部 NOT TESTED） |
| **W0 Gate（权威）** | [gates/W0-GATE.md](gates/W0-GATE.md) | 待你放行 |
| W0 复核报告 | [gates/W0-review.md](gates/W0-review.md) | Day 5 |
| 待人工决定事项 | [00-week0/open-decisions.md](00-week0/open-decisions.md) | 进行中 |

## 约定

- **权威来源**：v1.1 Production Baseline（架构/威胁/DR/Gate/DoD）与 v1.2.1 执行手册（逐周/日节奏）。二者冲突以 v1.1 架构基线为准。
- **TBD**：凡计划未定义、且属于产品/商业/运维选型的内容，一律标 `TBD` 并登记到 [open-decisions](00-week0/open-decisions.md)，不代替人类决策。
- **占位域名**：文档中 `example.com` / `*.sites.example` / `example-sites.net` 均为占位符，真实域名见 open-decisions（D-01）。
