# 0714space

多租户静态网站托管平台（Nekoweb 功能对标复刻）。当前处于 **Week 1**：Monorepo 与工程基线。Week 0 交付（范围冻结、架构决策、威胁模型、工作制度、SLO/SEV/回滚与 Gate）见 `docs/`。

- 权威文档（决策来源，二者冲突以架构基线为准）：
  - `../Nekoweb完整复刻_Production_Baseline_v1.1_重构版.pdf` — 生产架构基线
  - `../Nekoweb完整复刻_一人_with_AI_细分工作计划_v1.2.1_含sibling-subdomain安全增补.pdf` — 逐周执行手册（含 sibling-subdomain 安全增补）
- AI 协作规范与工程红线：见仓库根的 `CLAUDE.md`（当前位于上级目录 `../CLAUDE.md`，是否随仓库落地见 [open-decisions](docs/00-week0/open-decisions.md#d-09)）。

## Repository Structure

```
apps/       前端与服务：web(UI) · api(控制面 API) · gateway(Static Gateway) · worker(异步任务)
packages/   共享库：db · auth · storage · permissions · api-contracts · ui · observability
infra/      基础设施：docker · terraform · monitoring
tests/      跨模块测试：integration · e2e · security · migration
docs/       工程文档（Week 0+）
```

- `apps/*`：可部署应用/服务（W1 仅目录骨架 + 职责说明，不含业务功能）。
- `packages/*`：被 apps 复用的共享库（W1 仅骨架；`observability` 含最小 scaffold 用于验证流水线）。
- `infra/`、`tests/`：占位骨架，后续里程碑落地。
- 文档地图见 [`docs/README.md`](docs/README.md)。

## Development

需要 Node ≥ 22 与 pnpm（本仓库通过 corepack 固定 `pnpm@9.15.9`；`corepack enable` 后可用 `pnpm`）。

```bash
pnpm install       # 安装依赖
pnpm lint          # ESLint（所有 TS workspace）
pnpm typecheck     # TypeScript 类型检查（各 workspace）
pnpm test          # Vitest 测试
pnpm format        # Prettier 写入
pnpm format:check  # Prettier 检查
```

> 分支/提交遵循 [git-workflow](docs/workflow/git-workflow.md)；AI 不自动 commit / push / production deploy。

## 工程决策优先级（冲突时按此排序）

租户隔离 > 数据正确性 > 静态托管可用性 > 发布原子性 > 服务端请求安全 > 恢复能力 > 滥用控制 > 功能数量。

## Gate 状态

W0：见 [W0 Gate](docs/gates/W0-GATE.md)（放行需人工签字）。W1 Day 1 devlog：[docs/devlog/W1-D1.md](docs/devlog/W1-D1.md)。本仓库不自动 commit。
