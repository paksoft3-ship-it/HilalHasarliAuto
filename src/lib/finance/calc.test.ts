import { describe, it, expect } from "vitest";
import { computeDealFinancials } from "./calc";

describe("computeDealFinancials", () => {
  it("broker: gross = commission, net subtracts ad cost + expenses", () => {
    const f = computeDealFinancials(
      { type: "broker_commission", actualCommission: 10000, adCostAllocated: 1500 },
      500,
    );
    expect(f.grossRevenue).toBe(10000);
    expect(f.netProfit).toBe(10000 - 1500 - 500);
  });

  it("direct: gross = resale - purchase", () => {
    const f = computeDealFinancials(
      { type: "direct_purchase_resale", directPurchasePrice: 80000, directResalePrice: 95000, adCostAllocated: 2000 },
      1000,
    );
    expect(f.grossRevenue).toBe(15000);
    expect(f.netProfit).toBe(15000 - 2000 - 1000);
  });

  it("applies manual adjustment", () => {
    const f = computeDealFinancials(
      { type: "broker_commission", actualCommission: 5000, netProfitAdjustment: 250 },
      0,
    );
    expect(f.netProfit).toBe(5250);
  });

  it("undecided deal yields zero gross", () => {
    const f = computeDealFinancials({ type: "undecided" }, 0);
    expect(f.grossRevenue).toBe(0);
  });
});
