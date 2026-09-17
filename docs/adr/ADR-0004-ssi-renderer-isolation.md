# ADR-0004：SSI Renderer 独立进程与熔断

- 状态：Proposed（待你签字）
- 日期：2026-09-17
- 相关：威胁 SSI-001~005；INV-6；ADR-0002；v1.1 §18–20

## 问题

SSI 对用户内容做动态渲染（include、block、flastmod 等），是最危险的执行路径：路径穿越、递归 include、stored XSS、CPU/内存耗尽。若在 Static Gateway 内联执行，SSI 的 timeout/panic/OOM 会直接拖垮静态读路径。

## 决定

SSI Renderer 作为**独立服务**（Go/Rust），Static Gateway 仅在命中 SSI 路由时经 gRPC/Unix socket 调用。renderer 超时/panic/OOM/整体不可用时只影响 SSI 请求；连续超时/崩溃达阈值时 Gateway 打开 **SSI circuit breaker**，静态链路继续服务，SSI 页面返回受控 503 或旧缓存。include 路径必须是 directive 字面量，运行时字符串不参与拼接。

## 原因

隔离最危险的动态执行面，保证 INV-6（故障隔离）与静态可用性优先级；熔断把 SSI 故障限制在 SSI 请求内。

## 替代方案

- **Gateway 内联 SSI**：省一跳，但 SSI 故障即静态 outage；拒绝。
- **无熔断的独立服务**：仍会因 renderer 抖动导致 SSI 请求堆积并回压；必须配熔断。

## 后果

- 正面：SSI 故障可整体降级/回滚而不影响 hosting。
- 代价：额外服务、pool 容量与 budget 管理、circuit 状态监控。
- 影响：M3 Gate 要求“SSI 故障不影响静态”；Chaos 需 kill SSI pool 验证。
