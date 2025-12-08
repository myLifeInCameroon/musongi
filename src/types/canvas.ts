export interface ProjectInfo {
  name: string;
  promoter: string;
  location: string;
  sector: string;
  date: string;
}

export interface Equipment {
  id: string;
  name: string;
  quantity: number;
  unitValue: number;
  lifespan: number; // months
}

export interface Personnel {
  id: string;
  role: string;
  count: number;
  monthlySalary: number;
}

export interface Activity {
  id: string;
  name: string;
  monthlyCount: number;
  unitValue: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  monthlyQuantity: number;
}

export interface CustomerSegment {
  id: string;
  name: string;
  monthlyTarget: number;
}

export interface OtherCharge {
  id: string;
  name: string;
  monthlyValue: number;
}

export interface RawMaterial {
  id: string;
  name: string;
  monthlyValue: number;
}

export interface CanvasData {
  projectInfo: ProjectInfo;
  equipment: Equipment[];
  personnel: Personnel[];
  activities: Activity[];
  products: Product[];
  customers: CustomerSegment[];
  otherCharges: OtherCharge[];
  rawMaterials: RawMaterial[];
  growthRate: number; // annual growth rate percentage
}

export interface FinancialMetrics {
  monthlyRevenue: number;
  monthlyExpenses: number;
  monthlyCashFlow: number;
  semiAnnualRevenue: number;
  semiAnnualExpenses: number;
  semiAnnualCashFlow: number;
  annualRevenue: number;
  annualExpenses: number;
  annualCashFlow: number;
  totalInvestment: number;
  monthlyDepreciation: number;
  breakEvenMonths: number;
}

export interface YearlyProjection {
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
  cumulativeProfit: number;
  roi: number;
}
