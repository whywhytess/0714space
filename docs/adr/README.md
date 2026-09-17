# 架构决策记录（ADR）

- 每条重要架构决定必须包含：**问题 / 决定 / 原因 / 替代方案 / 后果**（`CLAUDE.md` rule 8）。
- 编号：`ADR-<四位序号>`。状态：`Proposed` → `Accepted`（你签字）→ `Superseded`（被取代）。
- 模板：[adr-template.md](adr-template.md)。
- 以下 W0 关键 ADR 均为**记录既有权威决策**（源自 v1.1 Baseline 与 v1.2.1 增补），非新增产品决策；状态待你签字。

| ADR | 决策 | 状态 |
|---|---|---|
| [ADR-0001](ADR-0001-user-site-domain-isolation.md) | 用户站点域隔离（共用 registrable domain + 五道隔离；第二独立域为可选 hardening） | Proposed |
| [ADR-0002](ADR-0002-three-plane-execution-isolation.md) | 三执行面隔离：控制面 / 静态数据面 / SSI | Proposed |
| [ADR-0003](ADR-0003-redis-three-domain-separation.md) | Redis 三域分离：Auth / Cache / Queue | Proposed |
| [ADR-0004](ADR-0004-ssi-renderer-isolation.md) | SSI Renderer 独立进程与熔断 | Proposed |
| [ADR-0005](ADR-0005-safe-fetch-ssrf-defense.md) | Safe Fetch / SSRF 防御（RSS + Screenshot egress） | Proposed |
| [ADR-0006](ADR-0006-host-only-cookie-capability-token.md) | host-only Cookie + Capability Token 认证模型 | Proposed |
| [ADR-0007](ADR-0007-backup-restore-consistency.md) | 备份/恢复一致性（PITR + object manifest + checker） | Proposed |
| [ADR-0008](ADR-0008-atomic-publish-versioning.md) | 原子发布与不可变版本 | Proposed |

> 后续里程碑的新决策继续追加 ADR-0009+。
