# Git Workflow — W0 Day 4

- 状态：草案（分支/提交的**权威**文档；[solo-ai-workflow](../00-week0/solo-ai-workflow.md) 为 W0 摘要）
- 相关：`CLAUDE.md` §8/§11、[definition-of-done](definition-of-done.md)、[ai-roles](ai-roles.md)

## 分支模型

```
main   ← 始终可部署
  ↑
feature branch   ← 同一时间只有一个主要
  ↑ (必要时)
fix branch       ← 最多一个紧急修复
```

## 规则

1. 同一时间只有**一个主要 feature branch**。
2. 最多额外**一个紧急 fix branch**。
3. 不长期维护多个并行分支。
4. **main 必须始终可以部署**。
5. feature 应尽可能**每天集成**（进 staging）。
6. 巨型功能必须拆分（进不了当天 staging 就拆小）。
7. 未完成能力使用 **feature flag** 或保持**未接入**（不暴露半成品）。
8. **不通过测试不合并**（DoD 未满足不合并）。

## 分支命名

- `feature/W<week>-<seq>-<slug>` — 例：`feature/W1-01-monorepo`、`feature/W2-03-session`
- `fix/W<week>-<area>-<slug>` — 例：`fix/W4-gateway-cache`
- `docs/<slug>`、`chore/<slug>`（低风险杂项）
- 分支内的具体任务用任务编号 `W<周>-<域>-<序号>`（见 [任务编号](../00-week0/solo-ai-workflow.md#4-任务编号规则)）。

## Commit 约定

前缀（Conventional 风格）：

| 前缀 | 用途 |
|---|---|
| `feat:` | 新功能 |
| `fix:` | 缺陷修复 |
| `test:` | 测试 |
| `docs:` | 文档 |
| `refactor:` | 重构（无行为变化） |
| `chore:` | 杂项/依赖/脚手架 |
| `security:` | 安全修复/加固（必附回归测试） |

示例：`feat: W2-AUTH-03 session 存入 Redis-auth`

### 提交署名（强制，见 CLAUDE.md §11）

- **不**添加 Co-Authored-By trailers。
- **不**添加 Claude attribution。
- **不**添加 "Generated with Claude Code"。
- 仅以你配置的 Git 身份提交：`whywhytess <jiang_0744@student.usm.my>`。
- **AI 不自动 commit / push / production deploy**；提交与放量由你执行。

## History 与合并

- **不强制修改现有 git history**（不 rewrite 已推送历史）。
- 合并策略：AI 输出可并行，**合并必须串行**；合并前过 [DoD](definition-of-done.md) 与 [AI role chain](ai-roles.md)。
- **main 合并前置（已确认）**：**CI green + human review**（W1 CI 落地后强制为分支保护规则）。
- **DoD 强度按风险分级（已确认）**：docs-only 可豁免 integration/staging；普通代码走完整 DoD；高风险代码 = 完整 DoD + Security Review（见 [definition-of-done](definition-of-done.md)）。
