# ADR-0003：Redis 三域分离（Auth / Cache / Queue）

- 状态：Proposed（待你签字）
- 日期：2026-09-17
- 相关：INV-6；v1.1 §25；`CLAUDE.md` §4

## 问题

Session/限流、domain map/元数据缓存、异步任务队列三类负载的持久化与淘汰需求互相冲突。若共用同一 Redis（同一 `maxmemory`/eviction 域），队列积压或缓存膨胀会驱逐 Session，直接造成安全与可用性事故。

## 决定

从 Day 1 起使用三个独立 Redis 实例/域，禁止复用同一 maxmemory/eviction 域：
- **Redis Auth**：Session / Rate Limit / 安全计数。`noeviction` + 持久化。
- **Redis Cache**：domain map / metadata / counts。允许 eviction，可重建，fallback DB。
- **Redis Queue**：BullMQ 任务/延迟/重试。持久化；任务幂等，可由 DB/outbox 重放。

队列积压不得挤出 Auth/Session。

## 原因

隔离淘汰域是唯一能保证“队列/缓存压力不影响认证”的方式；符合故障隔离不变量 INV-6 与数据正确性优先。

## 替代方案

- **单 Redis + 逻辑 DB 分库**：仍共用内存/eviction，无法隔离压力；拒绝。
- **纯内存无持久化**：Auth/Queue 重启即丢，违反恢复要求；拒绝。

## 后果

- 正面：认证稳定性与缓存/队列压力解耦；各域可独立监控与容量规划。
- 代价：三实例的运维、监控、备份成本上升。
- 影响：M1 Gate 要求“三 Redis”；监控项含各域独立指标（见 [slo-baseline](../operations/slo-baseline.md)）。
