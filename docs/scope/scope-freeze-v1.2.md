# Scope Freeze — v1.2

- 状态：**草案，待你签字**
- 冻结日期：2026-09-17（W0）
- 来源：v1.1 Production Baseline（功能范围表、里程碑）、v1.2.1 执行手册（W0–W28）、`CLAUDE.md`
- 基线核对日期：2026-09-10（Nekoweb 公开功能范围）

> 冻结含义：以下**范围内**清单是 v1.2 的承诺交付；**延期**清单在标注里程碑前不占用主线预算；**非目标**清单明确不做。范围变更须走 [open-decisions](../00-week0/open-decisions.md) 并由你签字。

## 1. 产品定位（不可动摇的边界）

- **纯静态输出模型**：仅 HTML/CSS/JS/WASM/字体/图片/静态框架产物。
- **不提供**：PHP-FPM、常驻服务器、用户数据库实例、任意后台 daemon。
- **品牌边界**：仅对标功能与交互；名称/Logo/插画/文案/视觉资产/私有代码独立创作。

## 2. 范围内（P0 / P1）

优先级定义：**P0** 缺失会阻断注册/托管/发布/社区闭环或安全运营；**P1** 公开运营需要，可在 M1 后并行。

| 域 | 能力 | 优先级 | 里程碑 |
|---|---|---|---|
| 账户 | 注册/登录/邮箱验证/密码重置/Session | P0 | M1 |
| 账户 | API Token 与撤销 | P1 | M2 |
| 站点 | `username.<site-domain>` 自动子域名 | P0 | M1 |
| 站点 | 多站点 | P1 | M3 |
| 文件 | 上传/下载/新建/删除/移动/重命名 | P0 | M1 |
| 文件 | 文件夹上传 / ZIP 导入导出 | P0 | M1 |
| 托管 | index 路由 / 404 / MIME / Range / ETag | P0 | M1 |
| 托管 | Pretty URL 与 slash 策略 | P0 | M1 |
| 编辑 | Monaco / Emmet / Prettier / 多文件切换 | P0 | M1 |
| 发布 | 原子发布 / 版本回滚 / CDN 刷新 | P0 | M1 |
| 社区 | Explore / Site Box / elements.css | P0 | M2 |
| 社交 | Follow / Followers / Following | P0 | M2 |
| 社区 | Screenshot 预览（隔离沙箱） | P0 | M2 |
| 统计 | Views/Updates/Followers / 30 日时序 | P1 | M2 |
| 域名 | 自定义域名 / DNS 验证 / 自动 TLS | P1 | M2 |
| 团队 | Owner/Editor 邀请与撤销 | P1 | M3 |
| 高级 | 密码保护路径 | P1 | M3 |
| 高级 | 自定义 HTTP Header | P1 | M3 |
| 运营 | Admin / 举报 / 封禁 / 审计 | P0 | M2 |
| 风控 | Turnstile / Rate Limit / 风险评分 / 扫描 | P0 | M2 |
| 计费 | 免费/付费套餐 / 配额 / 订阅状态 | P1 | M4 |
| 高级能力 | SSI / WebDAV / Git Push→Deploy / 协作 / IDE / NekoVM | P1 | M4（W17–W22） |

> 说明：M4 的高级能力（SSI/WebDAV/Git/IDE/NekoVM）为“功能对标”所需，但均排在 hosting 内核、社区与安全 Gate 之后；任一项威胁其数据面隔离时，按 [工作制度](../00-week0/solo-ai-workflow.md) 的停止条件优先处置。

## 3. 里程碑映射

| 里程碑 | 周 | 退出主题 |
|---|---|---|
| M1 Hosting Alpha | W7 | 注册→编辑→原子发布→子域访问→回滚 |
| M2 Community | W10 | Explore + Screenshot + Follow + RSS + SSRF 边界 |
| M3 Monetizable Beta | W16 | API/Domain/TLS/Password/Admin/Billing |
| M4 Feature Parity | W22 | SSI/WebDAV/Git/协作/IDE/NekoVM |
| M5 Production Ready | W26 | Backup/Restore/Observability/Chaos/Security Gate |
| Closed → Public Beta | W27–W28 | 真实用户迁移 → 公开上线 |

## 4. 明确延期（超周预算时优先牺牲）

- UI 动画、社交装饰、低价值排序与展示优化。
- 非核心兼容性打磨（局部 UI/边缘浏览器）。
- 超出对标范围的“锦上添花”功能（不新增未在 v1.1 表中的产品能力）。

延期不等于取消；每项延期须记录触发条件与恢复里程碑。

## 5. 非目标（v1.2 不做）

- 任意服务端运行时 / 用户后端 / 数据库实例托管。
- 平台侧对用户站点内容的动态渲染（除受控 SSI）。
- 未经安全评审的第三方可执行集成。
- 本文档未列出、且不在权威文档范围内的任何新产品功能（防止“为完整而堆功能”）。

## 6. 待决（不在此擅自决定，见 open-decisions）

- 真实 registrable domain(s)（控制面域 / 用户站点域）——D-01。
- 是否启用第二独立用户站点域（未来 hardening）——D-02。
- 套餐/价格/配额具体数值——D-08。
- 数据保留期限具体天数——D-06。

## 签字

- [ ] 范围、优先级、里程碑映射由 **你** 确认（rule 8：范围为你保留的决策）。
