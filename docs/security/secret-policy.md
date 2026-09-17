# Secret Policy — W0 Day 3

- 状态：草案
- 相关：`CLAUDE.md` §2 安全红线、[ADR-0006 Cookie/Token/Key Ring](../adr/ADR-0006-host-only-cookie-capability-token.md)、[production-access-policy](production-access-policy.md)、[environment-model](../environments/environment-model.md)
- 原则：Secret 是能力边界，不是配置。默认不外泄、可撤销、可轮换。

## 1. Secret 范围（受本策略约束）

| Secret | 用途 | 环境 | 管理方式 |
|---|---|---|---|
| `DATABASE_PASSWORD` | PostgreSQL 认证 | 全部 | prod: Secret Manager |
| `DATABASE_URL` | 连接串（可能内嵌口令） | 全部 | 视为 secret |
| `REDIS_PASSWORD` | Redis 认证（Auth/Cache/Queue） | 全部 | prod: Secret Manager |
| `S3_ACCESS_KEY` | 对象存储访问键 | 全部 | 只读键给 gateway |
| `S3_SECRET_KEY` | 对象存储私密键 | 全部 | prod: Secret Manager |
| `DNS_API_TOKEN` | DNS 验证/记录（**红线**） | prod 人类持有 | 不给 AI |
| `SESSION_SIGNING_KEY` | Session/派生签名 | 全部 | key_id + 轮换 |
| `EMAIL_API_KEY` | 邮件发送 | staging/prod | Secret Manager |
| `ACME_ACCOUNT_KEY` / ACME credentials | 自动 TLS 签发（**CA 私钥红线**） | prod 人类持有 | 不给 AI |
| `PAYMENT_SECRET` | 支付网关（**红线**） | prod 人类持有 | 不给 AI |
| `WEBHOOK_SECRET` | 校验入站 webhook 签名 | staging/prod | Secret Manager |

## 2. 规则（强制）

1. **Secret 不进入 Git**（含历史）。
2. **Secret 不进入 README / 文档**。
3. **Secret 不进入普通日志**（应用日志、访问日志、错误栈）。
4. **production secret 不发送给 AI**（AI 不持有 prod token/密码/密钥）。
5. `.env` **只能用于 LOCAL**，且被 `.gitignore` 忽略。
6. repo 提供 `.env.example`，**只包含变量名**，不含任何真实值。
7. **PRODUCTION 使用 Secret Manager**（非文件、非环境明文托管）。
8. 密钥需 **key_id / rotation 策略**（ACTIVE / VERIFY_ONLY / RETIRED；派生数据带 key_id/salt_epoch，见 ADR-0006）。
9. Secret **泄漏后必须支持 revoke / rotate**，并触发安全事件流程（SEV-1 Security Incident，见 [severity-levels](../incidents/severity-levels.md)）。

## 3. Key Rotation（摘要）

- 状态机：`ACTIVE`（签发+校验）→ `VERIFY_ONLY`（仅校验旧数据）→ `RETIRED`（停用）。
- 每条派生数据记录 `key_id` 与 `salt_epoch`，支持并存校验窗口，实现无中断轮换。
- 轮换/撤销 Runbook 属 production 运维，由人类执行（见 production-access-policy）。

## 4. 泄漏响应（Leak Response）

1. 立即 revoke 受影响 secret / token / session。
2. rotate 到新 key_id；标记旧 key `RETIRED`。
3. 评估 blast radius，按 SEV 分级启动 Incident。
4. 记录 timeline / root cause / action owner；补回归（红线：只改不补测试不算完成）。

## 5. 检测

- CI 阶段：secret 扫描（禁止提交匹配 secret 模式的内容）。
- 运行时：日志中 secret 模式扫描告警（不落地明文）。
- 定期：审计 `.env*` 跟踪状态、仓库历史。
