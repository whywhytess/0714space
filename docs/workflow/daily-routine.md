# Daily Routine — W0 Day 4

- 状态：草案
- 相关：[ai-roles](ai-roles.md)、[definition-of-done](definition-of-done.md)、[task-template](task-template.md)
- **时间只是建议**；关键是保持同样的**工作闭环**：选任务 → 拆分 → 实现+测试 → 集成进 staging → 测试 → 验收+提交+文档。

## 闭环节奏（建议时段）

| 时段 | 你负责 | AI 负责 | 结束条件 |
|---|---|---|---|
| 09:00–09:30 | 看告警/CI/遗留；**选当天唯一主任务**；拆 3–6 个子任务；明确 DoD | Planner：拆解与验证步骤 | 今日 DoD 清晰 |
| 09:30–12:00 | 核心实现；审 diff；跑本地集成 | Implementer：生成代码**和测试** | 主链路可跑 |
| 13:00–15:30 | 整合 UI/API/infra；处理异常路径；**进入 staging** | 生成失败用例、review、性能建议 | 功能进 staging |
| 15:30–17:00 | 跑 unit / integration / E2E / security | Test Engineer：扩展测试矩阵、fuzz corpus | 测试绿色 |
| 17:00–18:00 | 人工验收；diff review；commit；ADR/runbook；排明日 | Ops Writer：变更摘要、文档、回归清单 | main 可随时部署 |

## 每日闭环要点

- 当天代码当天进 staging；进不了就拆小（[git-workflow](git-workflow.md) 规则 5/6）。
- 关键改动走 [AI role chain](ai-roles.md)：Implementer → Reviewer → Security Review → Human review → merge。
- 收工只合入**能回滚**的版本；未达 Gate 的功能保留 feature flag 或延期。
- commit 由你执行（AI 不自动 commit/push）。

## 每日手工验收（收尾）

- [ ] 真实浏览器从用户视角走一遍主流程。
- [ ] 看 staging logs/metrics：无隐藏 5xx、重试风暴、队列异常、权限告警。
- [ ] 手工制造至少一个失败场景，确认按设计降级。
- [ ] 确认 migration / secret / DNS / 支付 / 对象存储等生产风险未被 AI 自动处理。
