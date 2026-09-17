# 0714space

多租户静态网站托管平台（Nekoweb 功能对标复刻）。当前处于 **Week 0（W0）**：项目范围冻结、架构决策、安全威胁建模、开发工作制度、SLO/SEV/回滚与 Gate。W0 **不实现产品功能**。

- 权威文档（决策来源，二者冲突以架构基线为准）：
  - `../Nekoweb完整复刻_Production_Baseline_v1.1_重构版.pdf` — 生产架构基线
  - `../Nekoweb完整复刻_一人_with_AI_细分工作计划_v1.2.1_含sibling-subdomain安全增补.pdf` — 逐周执行手册（含 sibling-subdomain 安全增补）
- AI 协作规范与工程红线：见仓库根的 `CLAUDE.md`（当前位于上级目录 `../CLAUDE.md`，是否随仓库落地见 [open-decisions](docs/00-week0/open-decisions.md#d-09)）。

## 文档地图

| 区域 | 位置 | 说明 |
|---|---|---|
| Week 0 交付 | [`docs/00-week0/`](docs/00-week0/) | 工作制度、运维索引、待决事项 |
| 范围冻结 | [`docs/scope/`](docs/scope/) | Scope Freeze v1.2 |
| 架构决策 | [`docs/adr/`](docs/adr/) | ADR-0001–0008，模板与索引 |
| 威胁模型 | [`docs/threat-model/`](docs/threat-model/) | Attack Surface、STRIDE Threat Register、P0、Invariants |
| 风险登记 | [`docs/risks/`](docs/risks/) | 工程/项目 Risk Register |
| 环境与安全 | [`docs/environments/`](docs/environments/) · [`docs/security/`](docs/security/) | 环境模型、Secret/Access Policy |
| 运维 | [`docs/operations/`](docs/operations/) · [`docs/incidents/`](docs/incidents/) · [`docs/runbooks/`](docs/runbooks/) | SLO、SEV、Rollback |
| Gate | [`docs/gates/`](docs/gates/) | W0 Gate、Public Beta Gate、W0 复核 |
| 文档索引 | [`docs/README.md`](docs/README.md) | 全量文档地图 |

## 工程决策优先级（冲突时按此排序）

租户隔离 > 数据正确性 > 静态托管可用性 > 发布原子性 > 服务端请求安全 > 恢复能力 > 滥用控制 > 功能数量。

## W0 状态

见 [W0 Gate](docs/gates/W0-GATE.md) 与 [W0 复核](docs/gates/W0-review.md)。放行需人工签字；本仓库不自动 commit。
