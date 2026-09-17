import { describe, expect, it } from "vitest";
import { isBlank, redact } from "./index";

describe("@0714space/observability", () => {
  it("redact always returns [REDACTED] regardless of input", () => {
    expect(redact("super-secret-token")).toBe("[REDACTED]");
    expect(redact(123456)).toBe("[REDACTED]");
    expect(redact(null)).toBe("[REDACTED]");
  });

  it("isBlank detects null / undefined / whitespace-only", () => {
    expect(isBlank(null)).toBe(true);
    expect(isBlank(undefined)).toBe(true);
    expect(isBlank("   ")).toBe(true);
    expect(isBlank("x")).toBe(false);
  });
});
