import { CanvasData, FinancialMetrics, YearlyProjection } from "@/types/canvas";

export function calculateDepreciation(
  value: number,
  quantity: number,
  lifespanMonths: number
): { monthly: number; semiAnnual: number } {
  const totalValue = value * quantity;
  const monthly = lifespanMonths > 0 ? totalValue / lifespanMonths : 0;
  return {
    monthly,
    semiAnnual: monthly * 6,
  };
}

export function calculateFinancialMetrics(data: CanvasData): FinancialMetrics {
  // Calculate total investment (equipment)
  const totalInvestment = data.equipment.reduce(
    (sum, eq) => sum + eq.unitValue * eq.quantity,
    0
  );

  // Calculate monthly depreciation
  const monthlyDepreciation = data.equipment.reduce((sum, eq) => {
    const dep = calculateDepreciation(eq.unitValue, eq.quantity, eq.lifespan);
    return sum + dep.monthly;
  }, 0);

  // Calculate monthly personnel costs
  const monthlyPersonnelCost = data.personnel.reduce(
    (sum, p) => sum + p.monthlySalary * p.count,
    0
  );

  // Calculate monthly activity costs
  const monthlyActivityCost = data.activities.reduce(
    (sum, a) => sum + a.unitValue * a.monthlyCount,
    0
  );

  // Calculate monthly other charges
  const monthlyOtherCharges = data.otherCharges.reduce(
    (sum, c) => sum + c.monthlyValue,
    0
  );

  // Calculate monthly raw materials
  const monthlyRawMaterials = data.rawMaterials.reduce(
    (sum, r) => sum + r.monthlyValue,
    0
  );

  // Calculate monthly revenue
  const monthlyRevenue = data.products.reduce(
    (sum, p) => sum + p.price * p.monthlyQuantity,
    0
  );

  // Total monthly expenses
  const monthlyExpenses =
    monthlyDepreciation +
    monthlyPersonnelCost +
    monthlyActivityCost +
    monthlyOtherCharges +
    monthlyRawMaterials;

  const monthlyCashFlow = monthlyRevenue - monthlyExpenses;

  // Calculate break-even in months
  const breakEvenMonths =
    monthlyCashFlow > 0 ? Math.ceil(totalInvestment / monthlyCashFlow) : Infinity;

  return {
    monthlyRevenue,
    monthlyExpenses,
    monthlyCashFlow,
    semiAnnualRevenue: monthlyRevenue * 6,
    semiAnnualExpenses: monthlyExpenses * 6,
    semiAnnualCashFlow: monthlyCashFlow * 6,
    annualRevenue: monthlyRevenue * 12,
    annualExpenses: monthlyExpenses * 12,
    annualCashFlow: monthlyCashFlow * 12,
    totalInvestment,
    monthlyDepreciation,
    breakEvenMonths: isFinite(breakEvenMonths) ? breakEvenMonths : 999,
  };
}

export function calculate3YearProjections(
  data: CanvasData,
  metrics: FinancialMetrics
): YearlyProjection[] {
  const projections: YearlyProjection[] = [];
  let cumulativeProfit = -metrics.totalInvestment;
  const growthMultiplier = 1 + data.growthRate / 100;

  for (let year = 1; year <= 3; year++) {
    const yearGrowth = Math.pow(growthMultiplier, year - 1);
    const revenue = metrics.annualRevenue * yearGrowth;
    // Expenses grow at half the rate of revenue (efficiency gains)
    const expenseGrowth = 1 + ((data.growthRate / 2) / 100) * (year - 1);
    const expenses = metrics.annualExpenses * expenseGrowth;
    const profit = revenue - expenses;
    cumulativeProfit += profit;

    const roi = metrics.totalInvestment > 0
      ? ((cumulativeProfit + metrics.totalInvestment) / metrics.totalInvestment) * 100
      : 0;

    projections.push({
      year,
      revenue,
      expenses,
      profit,
      cumulativeProfit,
      roi,
    });
  }

  return projections;
}

export function formatCurrency(value: number, currency = "XAF"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(value));
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
