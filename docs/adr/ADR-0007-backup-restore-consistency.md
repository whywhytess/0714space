# ADR-0007：备份 / 恢复一致性（PITR + object manifest + checker）

- 状态：Proposed（待你签字）
- 日期：2026-09-17
- 相关：威胁 STORAGE-004；INV-2；v1.1 §25；ADR-0008

## 问题

DB 记录站点版本元数据，对象存储保存文件内容。若两者独立备份/恢复，可能出现 DB 指向缺失对象、或 orphan object、hash mismatch 的静默不一致状态，破坏数据正确性。

## 决定

- PostgreSQL PITR，目标 RPO ≤ 15 min；每日快照；跨故障域。
- Object Storage：Versioning + delete protection + replication；复制延迟目标接近 DB RPO。
- `site_version` manifest 记录 object key + immutable versionId + hash。
- 恢复流程强制运行 **consistency checker**：dangling DB references / orphan objects / hash mismatch；无法恢复当前版本时自动回落最近完整 previous version 并记录 affected sites；先只读开放，抽样 E2E 通过后解除写保护。
- Redis Auth/Queue 独立持久化重建，不依赖 cache snapshot。

## 原因

只有把“DB 版本指针 + 对象版本 + hash”绑定并在恢复时校验，才能保证 INV-2（不返回半成品/错误版本）与 RPO/RTO 一致。

## 替代方案

- **DB 与对象各自独立恢复、无校验**：极易静默不一致；拒绝。
- **仅依赖对象最新版本**：无法定位与某次发布对应的完整快照；用 manifest+versionId 绑定。

## 后果

- 正面：可从备份恢复指定站点/整库且无静默悬挂引用。
- 代价：manifest 维护、复制成本、恢复演练开销。
- 影响：M4 DR Gate（PITR + manifest consistency restore 必过）；Recovery 测试实操。
