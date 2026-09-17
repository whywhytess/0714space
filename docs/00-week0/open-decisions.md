# 待人工决定事项（Open Decisions / TBD Register）

> rule 10：计划未定义、且属于产品/商业/运维选型的内容一律标 TBD，不代替你决策。以下为 W0 识别出的待决项。带“建议”仅为参考，不构成决定。

| ID | 主题 | 说明 | 建议（仅参考） | 阻塞 |
|---|---|---|---|---|
| D-01 | 真实域名 | 控制面域与用户站点域的真实 registrable domain | 控制面 `example.com` / `app` / `api` / `admin`；用户站点 `*.<site-domain>` | 影响 W2/W4 及所有域名文档 |
| D-02 | 第二独立用户站点域 | 是否启用独立 registrable domain 承载用户站点（未来 hardening） | v1.2.1 记录为**可选**，非上线前置 | 不阻塞 W0；影响长期架构 |
| D-03 | SLO 数值目标 | 可用性/延迟/发布成功率等具体数值 | 见 [slo-sev-rollback](slo-sev-rollback.md) §1 建议值 | 影响告警阈值与 Gate |
| D-04 | 云 / 区域 / 部署形态 | 自建 vs 托管；单区域 vs 多故障域 | 需与成本/运维精力权衡 | 影响 W1 基础设施 |
| D-05 | 供应商选型 | PostgreSQL / Object Storage / CDN / ACME CA / Email / Turnstile | 每项需 owner + fallback | 影响 DR 与 W1 |
| D-06 | 数据保留期限 | access log / 统计 / soft-delete 恢复窗口天数 | Baseline 建议 raw access log 7–30 天 | 影响合规与存储 |
| D-07 | 支付 / 计费 provider | 计费网关与结算方式 | M4 才需要 | 不阻塞 W0 |
| D-08 | 套餐 / 价格 / 配额 | 免费/付费档位、配额数值 | 产品与商业决策 | M3/M4 |
| D-09 | CLAUDE.md 归属 | 是否将 `../CLAUDE.md` 复制进本仓库，使推送到 GitHub 的 repo 自包含协作规范 | 建议在仓库内保留一份（便于协作者/CI 读取） | 不阻塞 W0 |
| D-10 | 权威 PDF 是否入库 | 两份 PDF 目前在上级目录，是否纳入 `0714space` 版本控制 | 建议以 `docs/reference/` 链接或入库（注意体积/是否公开） | 不阻塞 W0 |
| D-11 | 首次提交与推送 | 是否将本次 W0 文档提交并推送到 `origin/main` | 由你确认后执行；AI 不自动 commit | 收尾动作 |

## 处理约定

- 任一 D-项确定后：更新本表状态、回填对应文档、必要时新增/修订 ADR。
- 范围类变更（影响 Scope Freeze）须同时更新 [scope-freeze-v1.2](../scope/scope-freeze-v1.2.md) 并由你签字。
