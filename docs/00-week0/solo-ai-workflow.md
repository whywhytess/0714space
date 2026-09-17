# 单人 + AI 工作制度与任务编号

- 状态：草案
- 来源：v1.2.1 执行手册（执行原则、每日节奏、AI 分工）、`CLAUDE.md` §8

## 1. 并发与集成纪律

- 人工同一时间只保留 **1 个主功能分支** + 最多 **1 个修复分支**。
- AI 输出可并行，**合并必须串行**。
- **每日闭环**：当天代码当天进 staging；进不了 staging 的任务拆小，禁止长期保留巨型未集成分支。

## 2. 分支与提交约定

> 分支/提交的**权威**文档为 [workflow/git-workflow.md](../workflow/git-workflow.md)；本节为摘要。

- 默认分支：`main`（受保护，见 CI Gate 落地后）。
- 分支命名：`feature/W<week>-<seq>-<slug>`、`fix/W<week>-<area>-<slug>`、`docs/<slug>`、`chore/<slug>`。
- 提交信息：遵循 `CLAUDE.md` §11 —— **不添加** Co-Authored-By、Claude 署名、"Generated with Claude Code"；仅以你配置的 Git 身份提交。
- 本仓库当前 Git 身份：`whywhytess <jiang_0744@student.usm.my>`（远端 `origin` → `github.com/whywhytess/0714space`）。
- **AI 不自动 commit / push**；所有提交由你确认后执行。

## 3. AI 四眼机制

- 关键改动至少经过「实现 AI」与「独立审查 AI」（后者不参考前一会话结论），你做最终 diff review。
- 停止条件（出现即停新功能、先修复）：数据一致性不明、跨租户风险、SSRF、域名接管、支付错误。

## 4. 任务编号规则

- 格式：`W<周>-<域>-<序号>`，例如 `W2-AUTH-03`、`W4-GW-01`。
- 域缩写：`AUTH`（认证）、`SITE`（站点/文件）、`GW`（Static Gateway）、`PUB`（发布/版本）、`SSI`、`RSS`、`SHOT`（Screenshot）、`DOM`（域名/TLS）、`TOKEN`（API/Capability）、`ADMIN`、`BILL`（计费）、`OBS`（可观测）、`DR`（恢复）、`SEC`（安全横切）。
- 威胁编号（Threat Register）：`<组件>-<序号>`，如 `SSI-004`、`GW-002`（见威胁模型文档）。
- ADR 编号：`ADR-<四位序号>`。

## 5. 每日节奏（建议模板）

| 时段 | 你负责 | AI 负责 | 结束条件 |
|---|---|---|---|
| 09:00–09:30 | 看告警/CI/遗留，选当天唯一主任务 | 拆成 3–6 个可验证子任务 | 今天 DoD 清晰 |
| 09:30–12:00 | 实现核心接口、审 diff、跑本地集成 | 生成代码/测试/迁移/Mock | 主链路可跑 |
| 13:00–15:30 | 整合 UI/API/infra、处理边界 | 生成失败用例、review、性能建议 | 功能进 staging |
| 15:30–17:00 | 跑 unit/integration/E2E/security | 扩展测试矩阵、fuzz corpus | 测试绿色 |
| 17:00–18:00 | 手工验收、commit、ADR/runbook、排明日 | 写变更摘要、文档、回归清单 | main 可随时部署 |

## 6. AI 交付包（每个功能周）

- 实现 diff：按文件列出改动，不一次生成无法审查的大块代码。
- 测试包：正常路径 + 失败路径 + 权限/隔离 + 幂等/重试。
- Review 包：最高风险 5 项 + 可复现方式 + 建议修复。
- 文档包：README/ADR/runbook/OpenAPI/运维说明按本周模块更新。

## 7. 生产权限边界（红线）

- AI 不持有 production token、数据库密码、对象存储主密钥、支付密钥、CA 私钥、DNS API key。
- AI **不执行**：production deploy、destructive migration、DNS 修改、支付、封禁、创建真实付费云资源（除非你明确批准）。
- 生产部署、回滚、域名、账单、安全放行、封禁全部由 **你** 执行。
