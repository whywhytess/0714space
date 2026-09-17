# AI Roles & Review Chain — W0 Day 4

- 状态：草案
- 相关：`CLAUDE.md` §8、[git-workflow](git-workflow.md)、[definition-of-done](definition-of-done.md)、[prompts/](prompts/)、[威胁模型](../threat-model/README.md)

## 角色

| 角色 | 职责 | 你必须检查 |
|---|---|---|
| **Planner** | 把任务拆成 **3–6 个可验证步骤**，明确 DoD | 拆分是否覆盖异常/权限/回滚 |
| **Implementer** | 写代码**和测试**（小 diff、不跨任务范围） | 边界、事务、错误处理、依赖版本 |
| **Reviewer** | **只读 diff** 找 bug（不改代码） | 结论是否有证据；避免盲信 |
| **Security Reviewer** | 检查 auth / permissions / tenant isolation / SSRF / XSS / path traversal / token / secret | 高风险模块必过；对照威胁 ID |
| **Test Engineer** | 补 unit / integration / E2E / **negative tests** | 是否验证真实不变量 |
| **Ops Writer** | 更新 README / ADR / runbook / change notes | 命令是否适用真实环境 |

## Review Chain（关键改动强制）

```
Implementer
   ↓
Reviewer
   ↓
Security Review   ← 高风险模块（Auth/Gateway/Storage/SSI/RSS/Screenshot/Domain/Token/Admin）
   ↓
Human diff review
   ↓
merge
```

## 硬规则

- **禁止**把同一个 AI 的“我已经检查过没问题”作为唯一 review（四眼机制：Implementer 与 Reviewer 必须是不同上下文；Reviewer 不参考 Implementer 的结论）。
- Security Review 对触及租户隔离/认证/出站请求/密钥的改动**必做**。
- 最终 diff review 与 merge 由**你**执行；AI 不自动 merge/commit。
- 停止条件（出现即停新功能、先修复）：数据一致性不明、跨租户风险、SSRF、域名接管、支付错误。

## 与 Prompt 模板的映射

各角色的可复用 prompt 见 [prompts/](prompts/)：[implementer](prompts/implementer.md)、[reviewer](prompts/reviewer.md)、[security-reviewer](prompts/security-reviewer.md)、[test-engineer](prompts/test-engineer.md)。
