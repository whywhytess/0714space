# P0 Threats — 汇总（W0 Day 2）

- 状态：草案。所有条目 **Mitigation status = Planned**（W0 未实现，不得写 Resolved）。
- 来源：[threat-register.md](threat-register.md)。每条含 Threat / Mitigation status / Required test / Blocking condition。
- 通用 Blocking condition：**对应能力上线前，其 Required test（负向测试）必须通过；未通过则 block 对应里程碑 Gate**（多数为 Beta Security Gate 必过项）。
- 统计：识别 **51** 条威胁，其中 **P0 = 36**（本页），P1 = 15。

## Auth（W2 / M1）

| Threat | Mitigation status | Required test | Blocking condition |
|---|---|---|---|
| AUTH-001 credential stuffing | Planned | 超阈值触发挑战/锁定，不放行 | 注册/登录上线（W2） |
| AUTH-002 brute force | Planned | N 次失败后账号受限且不泄漏存在性 | W2 |
| AUTH-003 session theft / sibling-subdomain cookie | Planned | 用户子域 `document.cookie` 取不到平台 session | W2/W4 Gate（Cookie isolation） |
| AUTH-004 CSRF | Planned | 无 CSRF/Origin 的写请求失败 | W2 |
| AUTH-006 privilege bypass | Planned | 低权限访问高权限端点 403 无副作用 | W2 |

## Static Gateway（W4 / M1）

| Threat | Mitigation status | Required test | Blocking condition |
|---|---|---|---|
| GW-001 Host header abuse | Planned | 畸形/内部 Host 不进 site lookup | Gateway 上线（W4） |
| GW-002 path traversal | Planned | `..`/编码全部 404，不读 root 外对象 | W4 |
| GW-004 tenant confusion | Planned | 歧义 Host 无法读他租户对象 | W4（跨租户，最高优先） |

## Storage / 发布（W3–W7 / M1）

| Threat | Mitigation status | Required test | Blocking condition |
|---|---|---|---|
| STORAGE-001 object key traversal | Planned | `../` 文件名无法越 site 前缀 | 文件写入上线（W3/W5） |
| STORAGE-002 cross-tenant object access | Planned | Bob 读 Alice 对象 403/404 | W3（跨租户） |
| STORAGE-004 manifest corruption | Planned | 篡改对象后 hash 校验失败拒绝 serve | 发布/恢复（W7/M5） |
| STORAGE-006 destructive deletion | Planned | 删除可在恢复窗口回滚；无绕过 soft-delete | 删除功能上线（W5） |

## SSI（W17 / M4）

| Threat | Mitigation status | Required test | Blocking condition |
|---|---|---|---|
| SSI-001 path traversal | Planned | 动态/`..`/编码 include 全部阻断 | SSI 上线（W17） |
| SSI-003 stored XSS | Planned | 注入脚本无法越站点/控制面边界 | W17（+ W8 Explore XSS） |
| SSI-004 sensitive file access | Planned | include 系统/隐藏文件被拒 | W17 |

## RSS Fetcher（W10 / M2）

| Threat | Mitigation status | Required test | Blocking condition |
|---|---|---|---|
| RSS-001 SSRF | Planned | 请求 metadata IP 返回 SECURITY_BLOCK | RSS 上线（W10）· Beta Security Gate |
| RSS-002 redirect to private IP | Planned | 302 到私网被拒 | W10 |
| RSS-003 DNS rebinding | Planned | 二次解析私网连接被拒 | W10 |
| RSS-004 XXE | Planned | 外部实体不触发文件读/外连 | W10 |

## Screenshot Worker（W9 / M2）

| Threat | Mitigation status | Required test | Blocking condition |
|---|---|---|---|
| SCREENSHOT-001 SSRF | Planned | 页面内私网子资源被网络层阻断 | 截图上线（W9）· Beta Security Gate |
| SCREENSHOT-002 metadata access | Planned | 访问 metadata 被 deny，取不到凭证 | W9 |
| SCREENSHOT-003 DNS rebinding | Planned | rebinding 连接被拒 | W9 |
| SCREENSHOT-004 Chromium blast radius | Planned | 渲染进程崩溃无 host/控制面影响 | W9（沙箱隔离） |

## Domain / DNS / TLS（W13 / M3）

| Threat | Mitigation status | Required test | Blocking condition |
|---|---|---|---|
| DOMAIN-001 domain takeover | Planned | 未验证归属无法绑定/接管 | 自定义域上线（W13） |
| DOMAIN-002 ownership verification bypass | Planned | 伪造验证响应不通过 | W13 |
| DOMAIN-005 hostname collision | Planned | 绑定平台子域/内部名被拒 | W13 |

## API Token（W12 / M3）

| Threat | Mitigation status | Required test | Blocking condition |
|---|---|---|---|
| TOKEN-001 token leak | Planned | 泄漏样本无法还原可用明文 | API 上线（W12） |
| TOKEN-002 scope escalation | Planned | 只读 token 写操作被拒 | W12 |
| TOKEN-003 site_id bypass | Planned | A 的 token 访问 B 返回 403 | W12（跨租户） |
| TOKEN-004 path_prefix bypass | Planned | 越 path_prefix 操作被拒 | W12 |
| TOKEN-005 revoked token reuse | Planned | 撤销后立即 401 | W12 |

## Admin（W15 / M2–M3）

| Threat | Mitigation status | Required test | Blocking condition |
|---|---|---|---|
| ADMIN-001 privilege escalation | Planned | 普通用户调 admin 端点 403 | Admin 上线（W15） |
| ADMIN-002 accidental destructive op | Planned | 批量删除可恢复/可回滚 | W15 |
| ADMIN-003 audit bypass | Planned | 任一管理操作产生不可篡改审计 | W15 |
| ADMIN-004 evidence deletion | Planned | 隔离后证据仍可取证 | W15 |
| ADMIN-005 compromised admin session | Planned | 缺 CSRF/Origin 的 admin 请求被拒 | W15 |

## 放行门槛（W0 Gate）

- [ ] 以上 36 条 P0 均有 mitigation 设计 + 可自动化 Negative Test（设计层面）——**已满足（Planned）**。
- [ ] 各 P0 在其能力上线周实现并使 Negative Test 变 Verified（后续周）。
- [ ] Beta Security Gate 必过项（SSRF / Cookie isolation / Token escalation / traversal / XSS / domain / header injection）全部 Verified —— M2 前。
