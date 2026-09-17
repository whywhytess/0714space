# Public Beta Gate — 框架（W0 Day 5）

- 状态：**框架**。所有项默认 **NOT TESTED**。
- 规则：**未实现的项目不得标记 PASS**；测试通过前一律 `NOT TESTED`。状态取值：`NOT TESTED` / `PASS` / `FAIL`。
- 相关：[威胁模型](../threat-model/README.md)、[p0-threats](../threat-model/p0-threats.md)、[rollback](../runbooks/rollback.md)、[slo-baseline](../operations/slo-baseline.md)、v1.1 §27
- 目标里程碑：M5 / Public Beta（W26+）。W0 仅冻结框架。

## Security

| 项 | 状态 | 关联 |
|---|---|---|
| [ ] cross-tenant access tests pass | NOT TESTED | GW-004 / STORAGE-002 / TOKEN-003 |
| [ ] SSRF protections pass | NOT TESTED | RSS-001~003 / SCREENSHOT-001~003 |
| [ ] path traversal tests pass | NOT TESTED | GW-002 / STORAGE-001 / SSI-001 |
| [ ] domain takeover tests pass | NOT TESTED | DOMAIN-001/002 |
| [ ] token escalation tests pass | NOT TESTED | TOKEN-002/003/004 |
| [ ] cookie isolation pass | NOT TESTED | AUTH-003/004 + ADR-0001/0006 |
| [ ] ZIP bomb / traversal pass | NOT TESTED | STORAGE-002（+ 待定 STORAGE-007） |
| [ ] CSS isolation pass | NOT TESTED | XT-05 / SSI-003 |
| [ ] Header injection pass | NOT TESTED | GW-004（CRLF/hop-by-hop） |

## Reliability

| 项 | 状态 |
|---|---|
| [ ] Gateway failure degradation tested | NOT TESTED |
| [ ] Redis Cache failure tested | NOT TESTED |
| [ ] Redis Queue failure tested | NOT TESTED |
| [ ] Storage failure tested | NOT TESTED |
| [ ] rollback tested | NOT TESTED |
| [ ] backup restore tested | NOT TESTED |

## Operations

| 项 | 状态 |
|---|---|
| [ ] monitoring exists | NOT TESTED |
| [ ] alerts exist | NOT TESTED |
| [ ] runbooks exist | NOT TESTED |
| [ ] incident process exists | NOT TESTED |
| [ ] SEV classification exists | NOT TESTED |

> 注：SEV 分级与 incident/rollback runbook 的**文档**已在 W0 起草（[severity-levels](../incidents/severity-levels.md) / [rollback](../runbooks/rollback.md)），但本 Gate 的 `exists` 指**生产就绪并演练通过**，故仍记 `NOT TESTED` 直至 SEV-1 drill 通过。

## Product

| 项 | 状态 |
|---|---|
| [ ] register | NOT TESTED |
| [ ] create site | NOT TESTED |
| [ ] edit | NOT TESTED |
| [ ] upload | NOT TESTED |
| [ ] publish | NOT TESTED |
| [ ] subdomain | NOT TESTED |
| [ ] rollback | NOT TESTED |

## 放行

- [ ] 以上全部 `PASS`（安全类为 Beta Security Gate 必过），且 SEV-1 drill 通过 → 你批准 Public Beta。
