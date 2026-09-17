# Rollback Policy & Runbook — W0 Day 5

- 状态：草案
- 权威：本文件是回滚策略的**单一来源**。
- 相关：[severity-levels](../incidents/severity-levels.md)、[slo-baseline](../operations/slo-baseline.md)、[production-access-policy](../security/production-access-policy.md)、[pre-production-risk-checklist](../security/pre-production-risk-checklist.md)、v1.1 §26
- 红线：production rollback / restore / DNS / 迁移由**人类**执行（AI 只产出方案）。

## 1. 必须停止继续发布的触发条件（Stop-the-line）

出现以下任一，**立即冻结发布**并按 SEV 处理：

- cross-tenant access（跨租户访问）
- unexplained data corruption（无法解释的数据损坏）
- SSRF reaching protected network（SSRF 触达受保护网络）
- domain takeover（域名接管）
- authentication bypass（认证绕过）
- significant unexplained 5xx increase（显著且无法解释的 5xx 上升）
- destructive migration issue（破坏性迁移问题）
- active_version / current_version consistency problem（版本一致性问题）
- payment entitlement corruption（支付/权益状态损坏）

> 前 5 项 + 版本一致性/支付损坏通常为 SEV-1；其余至少 SEV-2。

## 2. 回滚原则

1. **优先恢复旧稳定版本**（已发布静态站与控制面回到上一个已知良好版本）。
2. **事故期间不堆新 feature**（只做止血，不引入新变更）。
3. **DB schema rollback 不假设 down migration 永远安全**：schema 用兼容代码迁移（expand→contract），必要时**forward-fix** 而非盲目 down。
4. 必要时 **forward-fix**（当回退比修复更危险时，优先小步前向修复）。
5. **用户已发布静态站优先保持 read availability**（读路径可用性高于其他一切非安全目标）。
6. **无法确认数据正确性时停止写入**（进入只读，先验证一致性再恢复写）。

## 3. 通用流程

```
Detect              监控/告警/报告发现异常，命中 §1 触发条件
  → Stop deployment 立即冻结发布（canary 停止放量）
  → Assess impact   确定 blast radius、受影响租户/站点、SEV 分级
  → Decide          rollback / failover / feature kill（择一或组合）
  → Verify          验证止血生效、数据一致性（consistency checker）、无跨租户残留
  → Monitor         观察 5xx/p95/circuit/3 Redis/queue age/blocked egress
  → Document        timeline / root cause / action owner；补回归测试
```

### 决策要点

- **rollback**：回上一个稳定镜像/版本（无状态服务优先，最快）。
- **failover**：切副本/区域（存储/DB 区域故障时）。
- **feature kill**：用独立 kill switch 关闭 Screenshot / RSS / SSI / 注册；开启只读模式（保住静态托管）。
- 破坏性/生产操作前先过 [pre-production-risk-checklist](../security/pre-production-risk-checklist.md)，人类审批并记录。

## 4. 发布管线参考（回滚点）

`main tag → 签名镜像 → staging → migration dry-run → smoke/e2e/security → DB expand migration → canary 5% → metrics gate → 25% → 100% → 部署后验证 → contract migration（独立窗口）`。**任何 Security/Reliability Gate 失败即停止放量并回滚**。Migration Gate 失败条件见 [slo-sev-rollback](../00-week0/slo-sev-rollback.md)。

## 5. Owner

- 决策与执行：你（人类）。AI 辅助产出方案、诊断查询、回归测试。
