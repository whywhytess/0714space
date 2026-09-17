# 运维基线（索引）— SLO / SEV / 回滚 / DR / Chaos

- 状态：草案（**索引**）
- 来源：v1.1 Baseline §25（DR/Incident/Chaos）、§26（发布/回滚）
- **单一来源指引**（本文不再重复这些内容的细节）：
  - SLO → [operations/slo-baseline.md](../operations/slo-baseline.md)
  - SEV 分级与 Incident → [incidents/severity-levels.md](../incidents/severity-levels.md)
  - 回滚策略与流程 → [runbooks/rollback.md](../runbooks/rollback.md)
- 本文保留以下无独立文档的内容：优雅降级矩阵、DR（RPO/RTO）、供应商降级、Chaos、发布管线与 Migration Gate。

## 优雅降级矩阵（故障 → 行为）

| 故障 | 静态站点 | 受影响能力 | 处置 |
|---|---|---|---|
| SSI Pool 全挂 | 正常 | SSI 页面返回受控 503 / 旧缓存 | 熔断 SSI，扩容/回滚 renderer |
| Redis Queue 全挂 | 已发布站点正常 | 截图/RSS/统计/异步部署延迟 | 阻止新大任务；恢复后重放 |
| Redis Cache outage | 正常（回源 DB） | 延迟上升 | fallback DB；重建 cache |
| RSS 全挂 | 正常 | Feed 停止更新 | 恢复后按 `next_fetch_at` 补抓 |
| Screenshot OOM | 正常 | 预览缺失 | sandbox 回收；无 host 影响 |

**Kill switch（独立开关，关闭后核心静态托管继续）**：Screenshot、RSS、SSI 各自独立；另有只读模式、紧急注册关闭开关。

## 数据恢复目标（RPO / RTO）

| 层 | RPO | RTO | 备注 |
|---|---|---|---|
| PostgreSQL | ≤ 15 min | ≤ 2 h | PITR |
| 用户对象 | ≤ 15–30 min | 目标 ≤ 4 h | Versioning + replication（按供应商能力） |
| 控制面配置 | 无数据丢失 | ≤ 1 h | 无状态镜像 + DB |
| Gateway/SSI | 无状态 | ≤ 15 min | 流量/副本切换 |

**恢复流程（摘要）**：PITR 恢复到隔离环境 → 扫描 `site_versions`/`current_version` manifest → 逐对象校验 versionId/hash（缺失查复制桶/历史版本）→ 无法恢复当前版本则回落最近完整 previous version 并记录 affected sites → 运行 consistency checker（dangling refs / orphan objects / hash mismatch）→ 重建 Redis Cache、校验 Auth/Queue → 先只读开放 → 抽样 E2E 通过后解除写保护。（见 [ADR-0007](../adr/ADR-0007-backup-restore-consistency.md)）

## 供应商故障降级（每项需 owner + fallback）

| 依赖 | 降级/备用 | Owner |
|---|---|---|
| PostgreSQL | Managed HA + PITR；明确 restore/failover 决策 | TBD D-05 |
| Object Storage | 跨区域/第二桶复制；只读模式；一致性检查后恢复写 | TBD D-05 |
| CDN | 保留切换能力；准备 direct origin 或第二 CDN | TBD D-05 |
| ACME CA | CA abstraction；主 CA rate-limit/outage 切第二 CA | TBD D-05 |
| Email | 关键邮件可切第二 provider 或延迟注册开放 | TBD D-05 |

## Chaos（W4 起每周至少一次）

kill Gateway replica / kill SSI pool / Redis Cache outage / Redis Queue outage / PostgreSQL +200ms / S3 5xx+2s / Screenshot OOM / DNS timeout —— 每项都有“必须验证”的降级行为。M2 前完成静态链路/Redis/SSI 故障矩阵；M4 前完成 DB/S3/区域级恢复演练。

## 发布管线与 Migration Gate

- **PR Pipeline**：lint/typecheck → unit → migration 静态分析 → production-like migration benchmark → SAST/SCA/SBOM → 不可变镜像 → integration → security regression → staging preview → review → merge。
- **Production Pipeline**：main tag → 签名镜像 → staging → migration dry-run → smoke/e2e/security → DB expand migration → canary 5% → metrics gate → 25% → 100% → 部署后验证 → contract migration（独立窗口）。
- **Migration Gate 失败条件**：`ACCESS EXCLUSIVE` 锁超预算 / runtime 超窗口 / 大表整体 rewrite 无 online 方案 / 峰值磁盘增长触阈 / 新旧应用无法同时运行 / 无 forward-fix 或兼容回退。
- 回滚原则与 stop-the-line 触发条件 → [runbooks/rollback.md](../runbooks/rollback.md)。

## 待你签字

- [ ] 供应商选型与 fallback owner（D-05）。
- [ ] 数据保留期限（D-06）。
- [ ] SLO 数值见 [slo-baseline](../operations/slo-baseline.md)（D-03）。
