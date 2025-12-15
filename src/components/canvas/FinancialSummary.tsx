import { TrendingUp, TrendingDown, DollarSign, Clock, PiggyBank, BarChart3 } from "lucide-react";
import { FinancialMetrics } from "@/types/canvas";
import { formatCurrency, formatNumber } from "@/lib/calculations";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface FinancialSummaryProps {
  metrics: FinancialMetrics;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  variant?: "default" | "success" | "warning" | "danger";
}

function StatCard({ icon: Icon, label, value, subValue, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-success/5 border-success/20",
    warning: "bg-warning/5 border-warning/20",
    danger: "bg-destructive/5 border-destructive/20",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-destructive/10 text-destructive",
  };

  return (
    <div className={cn("stat-card", variantStyles[variant])}>
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <div className={cn("p-2 rounded-lg", iconStyles[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-lg sm:text-2xl font-mono font-semibold tracking-tight break-all">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
    </div>
  );
}

export function FinancialSummary({ metrics }: FinancialSummaryProps) {
  const { t } = useLanguage();
  const isProfitable = metrics.monthlyCashFlow > 0;

  return (
    <div className="section-card animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 shrink-0">
          <BarChart3 className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-sm sm:text-base">{t("financial.title")}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{t("financial.subtitle")}</p>
        </div>
      </div>

      {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label={t("financial.monthlyRevenue")}
          value={formatCurrency(metrics.monthlyRevenue)}
          subValue={`${formatCurrency(metrics.annualRevenue)}/${t("common.year").toLowerCase()}`}
          variant="success"
        />
        <StatCard
          icon={TrendingDown}
          label={t("financial.monthlyExpenses")}
          value={formatCurrency(metrics.monthlyExpenses)}
          subValue={`${formatCurrency(metrics.annualExpenses)}/${t("common.year").toLowerCase()}`}
          variant="warning"
        />
        <StatCard
          icon={isProfitable ? TrendingUp : TrendingDown}
          label={t("financial.monthlyCashFlow")}
          value={formatCurrency(metrics.monthlyCashFlow)}
          subValue={`${formatCurrency(metrics.annualCashFlow)}/${t("common.year").toLowerCase()}`}
          variant={isProfitable ? "success" : "danger"}
        />
        <StatCard
          icon={Clock}
          label={t("financial.breakEvenPoint")}
          value={metrics.breakEvenMonths < 999 ? `${formatNumber(metrics.breakEvenMonths)} ${t("financial.months")}` : "N/A"}
          subValue={metrics.breakEvenMonths < 999 ? `~${(metrics.breakEvenMonths / 12).toFixed(1)} ${t("financial.years")}` : t("financial.notProfitable")}
          variant={metrics.breakEvenMonths <= 24 ? "success" : metrics.breakEvenMonths <= 36 ? "warning" : "danger"}
        />
      </div>

      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="p-3 sm:p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{t("financial.totalInvestment")}</span>
          </div>
          <p className="text-lg sm:text-2xl font-mono font-semibold tracking-tight text-foreground break-all">
            {formatCurrency(metrics.totalInvestment)}
          </p>
        </div>
        <div className="p-3 sm:p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{t("financial.monthlyDepreciation")}</span>
          </div>
          <p className="text-lg sm:text-2xl font-mono font-semibold tracking-tight text-foreground break-all">
            {formatCurrency(metrics.monthlyDepreciation)}
          </p>
        </div>
      </div>
    </div>
  );
}
