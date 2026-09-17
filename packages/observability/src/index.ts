/**
 * @0714space/observability — 共享可观测性工具（Week 1 骨架）。
 *
 * 仅包含通用、无业务逻辑的工具函数，用于验证 monorepo 的 lint/typecheck/test 流水线。
 * 真实的 logging / metrics / tracing 实现将在后续里程碑加入。
 */

/**
 * Secret 脱敏占位：始终返回 "[REDACTED]"。
 * 用于避免把敏感值写入日志（见 docs/security/secret-policy.md）。
 */
export function redact(_value: unknown): string {
  return "[REDACTED]";
}

/** 判断字符串是否为 null / undefined / 全空白。 */
export function isBlank(value: string | null | undefined): boolean {
  return value == null || value.trim().length === 0;
}
