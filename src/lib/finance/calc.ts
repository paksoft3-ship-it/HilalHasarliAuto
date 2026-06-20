/**
 * Deal P&L (master prompt §17). Reproducible & documented:
 *  - Broker:  gross = actual commission;        net = gross − ad cost − expenses
 *  - Direct:  gross = resale − purchase;         net = gross − ad cost − expenses
 *  - A manual netProfitAdjustment (with reason) is added on top, audited.
 * All amounts are whole TRY integers.
 */
export interface DealAmounts {
  type: "undecided" | "broker_commission" | "direct_purchase_resale";
  actualCommission?: number | null;
  directPurchasePrice?: number | null;
  directResalePrice?: number | null;
  adCostAllocated?: number | null;
  netProfitAdjustment?: number | null;
}

export interface DealFinancials {
  grossRevenue: number;
  expenses: number;
  adCost: number;
  netProfit: number;
}

export function computeDealFinancials(
  deal: DealAmounts,
  otherExpensesTotal: number,
): DealFinancials {
  const adCost = deal.adCostAllocated ?? 0;
  const adjustment = deal.netProfitAdjustment ?? 0;

  let gross = 0;
  if (deal.type === "broker_commission") {
    gross = deal.actualCommission ?? 0;
  } else if (deal.type === "direct_purchase_resale") {
    gross = (deal.directResalePrice ?? 0) - (deal.directPurchasePrice ?? 0);
  }

  const netProfit = gross - adCost - otherExpensesTotal + adjustment;
  return { grossRevenue: gross, expenses: otherExpensesTotal, adCost, netProfit };
}
