# Pre-Production Risk Checklist — W0 Day 3

- 状态：草案（模板，随每次生产变更填写并归档）
- 用途：任何 production 变更 / 部署 / 迁移 / 恢复前的强制核对。由**人类**勾选并记录。
- 相关：[production-access-policy](production-access-policy.md)、[secret-policy](secret-policy.md)、[rollback](../runbooks/rollback.md)、[severity-levels](../incidents/severity-levels.md)、[Migration Gate](../00-week0/slo-sev-rollback.md#发布管线与-migration-gate)

## 变更信息

- 变更标题：
- 关联任务/PR：
- 操作人 / 审批人：
- 日期 / 窗口：
- 变更类型：`deploy` / `migration` / `dns` / `iam` / `payment` / `restore` / `ban` / `quarantine` / `tls-ca`

## 核心检查项（必过）

- [ ] no secrets in Git（提交与历史无 secret；secret 扫描通过）
- [ ] migration reviewed（lock / runtime / rewrite / 兼容性 / 前向修复方案已审）
- [ ] rollback exists（回滚 / kill switch / canary 策略明确且可执行）
- [ ] DNS change reviewed（如涉及 DNS：记录、TTL、影响与回退已审）
- [ ] production approval recorded（人工审批已记录，链接可追溯）
- [ ] backup verified when required（如涉及数据风险：备份存在且可恢复已验证）
- [ ] destructive operation confirmed（破坏性操作已二次确认，影响可逆或有恢复窗口）
- [ ] affected tenants understood（受影响租户/站点范围已识别与记录）

## 附加检查（按变更类型）

- [ ] Secret 变更：走 revoke/rotate（key_id/salt_epoch），旧值置 `RETIRED`
- [ ] 迁移：expand → deploy → backfill → verify → contract；大表在线索引方案
- [ ] 恢复：先只读开放 → consistency checker 通过 → 抽样 E2E → 解除写保护
- [ ] 可观测：相关 alert / dashboard / runbook 就绪
- [ ] 停止条件：无未解的跨租户 / SSRF / 域名接管 / 支付错误

## 结论

- [ ] 全部必过项通过，人类批准执行。
- 备注 / 例外（需签字）：
