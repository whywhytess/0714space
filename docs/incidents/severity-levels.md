# Severity Levels（SEV）— W0 Day 5

- 状态：草案
- 权威：本文件是 SEV 分级的**单一来源**。
- 相关：[rollback](../runbooks/rollback.md)、[slo-baseline](../operations/slo-baseline.md)、v1.1 §25.5（incident 模板将于运维周补入 `docs/incidents/`）

## 通则

- SEV-1/2：指定 Incident Commander；**立即冻结 deploy**，确认 blast radius，执行 mitigation / failover / rollback。
- 对外状态页只发布：确认事实、影响、缓解状态、下次更新时间。
- 收尾必须产出 timeline / root cause / contributing factors / action owner+deadline；**禁止以 "human error" 作为根因结论**。
- 安全类（跨租户/权限/Cookie/SSRF/域名接管）一律按 SEV-1 Security Incident 处理：立即关闭相关能力、撤销 Token/Session。

---

## SEV-1

- **Definition**：平台级中断 / 跨租户数据泄漏 / 持续数据破坏 / 严重权限边界突破。
- **Examples**：大面积站点不可访问；一个租户可读写他人数据；发布持续写坏版本；认证/权限边界被绕过。
- **Immediate Action**：停止 deploy；指定 IC；确定 blast radius；mitigate / rollback / failover；安全类同时撤销 Token/Session、关闭受影响能力。
- **Escalation**：立即（IC + 你本人）；对外状态页；如涉及供应商，启动 vendor escalation。
- **Recovery Condition**：跨租户/破坏路径被证实关闭；数据一致性经 consistency checker 验证；核心链路恢复且监控稳定；postmortem 排期。

## SEV-2

- **Definition**：大量用户受影响 / 高数据风险 / 大规模发布失败 / 存储区域严重故障。
- **Examples**：发布大面积失败；某存储区域故障导致读写降级；关键功能对多数用户不可用。
- **Immediate Action**：停止 deploy；指定 IC；评估影响面；rollback 或切换到降级/只读；保护数据正确性。
- **Escalation**：IC + 你本人；必要时状态页；供应商联系。
- **Recovery Condition**：受影响用户比例回到正常；无持续数据风险；发布/存储链路恢复；监控稳定。

## SEV-3

- **Definition**：单模块明显退化（不影响核心托管）。
- **Examples**：Screenshot / RSS / Explore 大面积延迟或暂时不可用。
- **Immediate Action**：按需 kill switch 关闭该模块（核心静态托管继续）；排查；无需冻结全局 deploy。
- **Escalation**：常规处理；持续恶化或触及数据/安全则升级 SEV-2/1。
- **Recovery Condition**：该模块指标回到 SLO 范围；积压任务可恢复重放。

## SEV-4

- **Definition**：低影响缺陷。
- **Examples**：局部 UI 问题、非核心兼容问题。
- **Immediate Action**：进正常 backlog，按优先级修复。
- **Escalation**：无需即时升级。
- **Recovery Condition**：修复合入并验证。

## 分级速查

| 级别 | 触发关键词 | 是否冻结全局 deploy |
|---|---|---|
| SEV-1 | 平台中断 / 跨租户 / 数据破坏 / 权限突破 | 是 |
| SEV-2 | 大量用户 / 高数据风险 / 大规模发布失败 / 存储区域故障 | 是 |
| SEV-3 | 单模块退化（截图/RSS/Explore） | 否（可 kill 该模块） |
| SEV-4 | 局部 UI / 非核心兼容 | 否 |
