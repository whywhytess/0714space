# W0 Gate — 开工门槛（Week 0 Exit）

- 状态：**待你放行**（本文件是 W0 Gate 的**单一来源**；[00-week0/w0-gate.md](../00-week0/w0-gate.md) 已指向此处）
- 勾选口径：`[x]` 表示**文档层面已完成**（documented/defined/drafted/created/identified）。**签字类**审批列在末尾，只有你能勾。
- 复核见 [W0-review.md](W0-review.md)。

## Scope Freeze

- [x] v1.2 scope documented → [scope-freeze-v1.2](../scope/scope-freeze-v1.2.md)
- [x] W0–W7 Hosting Alpha frozen（里程碑映射至 M1/W7）
- [x] deferred features listed（延期清单）
- [x] out-of-scope listed（非目标清单）

## Architecture

- [x] ADR framework exists → [adr/README](../adr/README.md) + [模板](../adr/adr-template.md)
- [x] major security architecture ADRs drafted → ADR-0001–0008（**drafted / Proposed**，签字见末尾）

## Threat Model

- [x] Auth reviewed（AUTH-001..006）
- [x] Gateway reviewed（GW-001..006）
- [x] Storage reviewed（STORAGE-001..006）
- [x] SSI reviewed（SSI-001..005）
- [x] RSS reviewed（RSS-001..006）
- [x] Screenshot reviewed（SCREENSHOT-001..006）
- [x] Domain reviewed（DOMAIN-001..005）
- [x] Token reviewed（TOKEN-001..006）
- [x] Admin reviewed（ADMIN-001..005）
- [x] P0 threats identified → [p0-threats](../threat-model/p0-threats.md)（51 total，36 P0，全部 `Planned`）

## Environment

- [x] Local defined → [environment-model](../environments/environment-model.md)
- [x] Staging defined
- [x] Production defined
- [x] Secret policy defined → [secret-policy](../security/secret-policy.md) + [.env.example](../../.env.example)
- [x] AI production access prohibited → [production-access-policy](../security/production-access-policy.md)

## Workflow

- [x] Git workflow defined → [git-workflow](../workflow/git-workflow.md)
- [x] AI roles defined → [ai-roles](../workflow/ai-roles.md)
- [x] Definition of Done defined → [definition-of-done](../workflow/definition-of-done.md)
- [x] Daily integration process defined → [daily-routine](../workflow/daily-routine.md)

## Operations

- [x] SLO baseline defined → [slo-baseline](../operations/slo-baseline.md)（initial targets，数值待签字）
- [x] SEV classification defined → [severity-levels](../incidents/severity-levels.md)
- [x] rollback policy defined → [rollback](../runbooks/rollback.md)
- [x] Public Beta Gate framework created → [public-beta-gate](public-beta-gate.md)（全部 NOT TESTED）

---

## 仅你可勾（Human sign-off required，进入 W1 前）

> 以上文档均已就绪；以下为只有你能批准的事项，未勾不代表工作缺失，而是待你决策/签字。

- [ ] Scope Freeze 签字（范围/优先级/里程碑）
- [ ] ADR-0001–0008 由 `Proposed` → `Accepted`（签字）
- [ ] 初始 SLO 数值确认（D-03）
- [ ] 关键 open-decisions 至少定调：D-01 域名、D-04 云/区域、D-05 供应商（可先给方向，细节延后）
- [ ] 批准进入 Week 1

## 结论

- W0 **文档交付**：完成。
- W0 **正式放行**：待上述签字（见 [W0-review](W0-review.md) 的 NEEDS HUMAN DECISION）。
