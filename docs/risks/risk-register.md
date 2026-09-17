# Risk Register — 工程 / 项目风险

- 状态：草案
- 范围：**项目/运营/交付**风险（区别于 [安全威胁](../threat-model/threat-register.md)，后者是攻击面 STRIDE）。安全类风险以引用威胁模型为准，不在此重复。
- 等级：Impact = Low/Medium/High/Critical；Likelihood = Low/Medium/High。

| Risk ID | 类别 | 风险 | Impact | Likelihood | 缓解 | Owner | Status |
|---|---|---|---|---|---|---|---|
| R-01 | 人力 | 单人开发 + AI，关键路径无人替补，病假/中断即停摆 | High | Medium | 每日闭环进 staging；文档/runbook 先行；main 随时可部署 | 你 | Open |
| R-02 | 集成 | 巨型未集成分支累积，合并冲突与回归风险 | High | Medium | 1 主 + 1 修复分支；合并串行；任务拆小 | 你 | Open |
| R-03 | 安全隔离 | 跨租户 / sibling-subdomain 隔离实现不到位 | Critical | Medium | 见威胁 XT-*/AUTH-*/GW-*；W2/W4 Gate 强制测试；ADR-0001/0006 | 你 | Open→依赖实现 |
| R-04 | SSRF | RSS/Screenshot 出站被用于打内网/metadata | Critical | Medium | ADR-0005；egress proxy + ACL + 受限 resolver | 你 | Planned |
| R-05 | 数据一致性 | DB 指针与对象存储恢复后不一致（悬挂引用/orphan） | Critical | Low | ADR-0007；consistency checker；恢复演练 | 你 | Planned |
| R-06 | 发布 | 发布非原子导致线上半成品 | High | Low | ADR-0008；version_id 单事务切换；幂等键 | 你 | Planned |
| R-07 | 供应商 | 单一 CA/CDN/DB/对象存储/邮件供应商故障 | High | Low | fallback/第二供应商（D-05）；multi-CA | 你 | TBD D-05 |
| R-08 | 成本 | 误开真实付费云资源或流量/存储费用失控 | Medium | Medium | 账单上限；AI 不建资源；D-04/D-05 由你操作 | 你 | Open |
| R-09 | 迁移 | 大表 migration 锁表/超窗口 | High | Low | Migration Gate；expand→backfill→contract；CONCURRENTLY | 你 | Planned |
| R-10 | 范围蔓延 | 为“完整”堆功能，挤占安全/恢复预算 | Medium | Medium | Scope Freeze；非目标清单；延期策略 | 你 | Open |
| R-11 | 合规/隐私 | 数据保留/删除（DSAR）流程缺失 | Medium | Medium | 数据生命周期设计；保留期限 D-06 | 你 | TBD D-06 |
| R-12 | 依赖供应链 | AI 生成依赖的许可证/维护/供应链风险 | Medium | Medium | 依赖审计；lockfile review；SCA/SBOM in CI | 你 | Open |
| R-13 | 密钥管理 | Secret 泄漏 / 轮换缺失 | Critical | Low | Secret Manager + key ring；AI 不持密钥；ADR-0006 | 你 | Planned |

## 与威胁模型的关系

- 本表的 R-03/R-04/R-05/R-06/R-13 直接对应威胁模型中的 P0 威胁集合，缓解状态以威胁模型与各 ADR 为单一事实来源。
- 新增安全攻击面 → 记入 [threat-register](../threat-model/threat-register.md)；新增项目/交付风险 → 记入本表。

## 待决

- 供应商与 fallback owner（D-05）、云/区域形态（D-04）、数据保留期限（D-06）见 [open-decisions](../00-week0/open-decisions.md)。
