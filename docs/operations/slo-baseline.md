# SLO Baseline — W0 Day 5

- 状态：草案（**initial targets**，数值待你签字 → open-decisions D-03）
- 权威：本文件是 SLO 的**单一来源**；[00-week0/slo-sev-rollback.md](../00-week0/slo-sev-rollback.md) 不再重复 SLO 数值。
- 相关：[severity-levels](../incidents/severity-levels.md)、[rollback](../runbooks/rollback.md)、v1.1 Baseline §25

## 术语

| 术语 | 含义 |
|---|---|
| **SLI** | 实际测量指标（Service Level Indicator） |
| **SLO** | 内部目标（Service Level Objective）——**当前只建立 SLO** |
| **SLA** | 对用户做出的合同承诺（Service Level Agreement）——**W0 不建立**，需商业/法务决策 |

## 初始 SLO（Initial Targets）

> 优先级：静态托管数据面（Gateway 读）> 控制面 > 异步能力（Screenshot/RSS/SSI/统计）。异步能力故障不得拖垮静态读路径。

| 服务 / 能力 | 指标 | 初始目标 | 说明 |
|---|---|---|---|
| Static Gateway | availability | **99.9% 起步** | 月度可用性 |
| Static Gateway | origin p95 | **< 250 ms** | 回源延迟 |
| Control Plane API | p95 | **< 400 ms** | normal CRUD |
| SSI 渲染 | hard timeout | **≤ 150 ms** | 超时即熔断，独立预算 |
| 发布（小站点） | 生效时间 | 目标 **< 5 s** | small site publish |
| Screenshot | 生成时长 | **1–3 min** | 异步，失败不阻断站点 |
| RSS | 抓取周期 | **5–30 min schedule** | 异步 |

> **这些是 initial targets，未来必须根据真实流量重新调整。** 数值签字前记为 D-03（[open-decisions](../00-week0/open-decisions.md)）。

## 必须监控的 SLI（W0 冻结监控项）

HTTP RPS / 4xx / 5xx / p50 / p95 / p99；Gateway cache hit、object latency、auth errors；SSI render latency / timeout / OOM / circuit；DB connections / locks / replication lag / slow queries；Redis Auth latency / memory / rejected writes；Redis Cache hit / eviction；Redis Queue ready / failed / retry / oldest age；Storage bytes / ops / 4xx / 5xx / egress / replication lag；Sandbox blocked egress / DNS rejects / OOM / crash；Security login failures / SSRF blocks / abuse blocks / admin actions。

（数值告警阈值随实现落地；DR 的 RPO/RTO 见 [slo-sev-rollback §DR](../00-week0/slo-sev-rollback.md)。）

## Owner / 签字

- Owner：你（单人）。
- [ ] 初始 SLO 数值确认（D-03）。
- [ ] 明确暂不对外承诺 SLA。
