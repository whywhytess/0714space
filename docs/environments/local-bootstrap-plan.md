# Local Bootstrap 设计（规划）— W0 Day 3

- 状态：草案（**仅规划 W1 如何实现，今天不正式实现完整 Compose**）
- 目标：新机器 clone 后 30 分钟内可启动开发环境（W1 Gate）。
- 相关：[environment-model](environment-model.md)、[secret-policy](../security/secret-policy.md)、[ADR-0003 三 Redis](../adr/ADR-0003-redis-three-domain-separation.md)

## 目标流程

```
Developer machine
  → git clone <repo>
  → 安装依赖 (Node / pnpm、Go、Docker)
  → cp .env.example .env   (填本地 dummy 值，不含真实 secret)
  → docker compose up
       ├─ PostgreSQL
       ├─ Redis Auth     (noeviction + 持久化)
       ├─ Redis Cache    (允许 eviction)
       ├─ Redis Queue    (持久化)
       └─ MinIO          (S3 兼容, 建桶 + versioning)
  → 应用启动 (api / gateway / web，dev 模式)
  → 运行数据库 migration (up)
  → 运行 tests (unit + 本地 integration)
```

## W1 将交付（本文件仅登记，不在 Day 3 实现）

| 项 | 内容 | 备注 |
|---|---|---|
| `docker-compose.yml` | Postgres + 3×Redis + MinIO 服务定义 | 三 Redis 独立实例/端口，隔离 eviction 域 |
| `.env.example` | 变量名清单（已在 Day 3 提供） | 只含变量名，无值 |
| `Makefile` / 脚本 | `make up` / `make migrate` / `make test` | 一键启动与验证 |
| MinIO 初始化 | 建桶 + 开启 versioning + 只读凭证给 gateway | 对齐 [ADR-0007](../adr/ADR-0007-backup-restore-consistency.md) |
| 迁移工具 | migration up/down 与 dry-run | 对齐 Migration Gate |
| Healthcheck | 各服务就绪探针 | 保证 `up` 后可用 |

## 约束

- 不连接任何 production / 真实云资源；MinIO 与本地 Redis/PG 全部本机容器。
- Secret 仅 dummy，来自本地 `.env`（gitignored）；见 [secret-policy](../security/secret-policy.md)。
- 三类 Redis 从 Day 1 分离，禁止合并为单实例（[ADR-0003](../adr/ADR-0003-redis-three-domain-separation.md)）。

## 验收（W1，非今日）

- [ ] 新机器 clone 后 30 分钟内 `docker compose up` 全部 healthy。
- [ ] migration up 成功，tests 绿色。
- [ ] `alice.<local-site-domain>` 可从 MinIO 读到 `index.html`（W1 Day 2 目标）。
