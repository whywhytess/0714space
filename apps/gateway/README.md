# apps/gateway

Static Gateway（计划 Go 实现，见 ADR-0002）。未来承担 Host/Path 路由、对象只读、密码校验、Header policy、ETag/Range。

**不负责**：SSI parser、Screenshot、RSS Fetch、ZIP 解压等高风险工作（走独立面/worker）。

**Week 1：仅目录骨架 + 本说明，不强行写成 TS。**
