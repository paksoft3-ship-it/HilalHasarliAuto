import { describe, it, expect } from "vitest";
import { normalizePhone, quickOfferSchema } from "./schema";
import { generateReference } from "./reference";

describe("normalizePhone", () => {
  it("strips +90 / leading 0 / formatting to 10 digits", () => {
    expect(normalizePhone("+90 532 123 45 67")).toBe("5321234567");
    expect(normalizePhone("0532 123 45 67")).toBe("5321234567");
    expect(normalizePhone("5321234567")).toBe("5321234567");
  });
});

describe("generateReference", () => {
  it("matches PREFIX-YYMMDD-XXXX", () => {
    expect(generateReference("ON")).toMatch(/^ON-\d{6}-[A-Z0-9]{4}$/);
  });
});

describe("quickOfferSchema", () => {
  it("rejects an invalid phone", () => {
    const r = quickOfferSchema.safeParse({
      fullName: "Ali Veli", phone: "123", brand: "Toyota", model: "Corolla",
      damage: "Hurda", city: "İstanbul", consent: "on",
    });
    expect(r.success).toBe(false);
  });

  it("accepts a valid submission", () => {
    const r = quickOfferSchema.safeParse({
      fullName: "Ali Veli", phone: "0532 123 45 67", brand: "Toyota", model: "Corolla",
      damage: "Hurda", city: "İstanbul", consent: "on",
    });
    expect(r.success).toBe(true);
  });

  it("requires consent", () => {
    const r = quickOfferSchema.safeParse({
      fullName: "Ali Veli", phone: "0532 123 45 67", brand: "Toyota", model: "Corolla",
      damage: "Hurda", city: "İstanbul",
    });
    expect(r.success).toBe(false);
  });
});
