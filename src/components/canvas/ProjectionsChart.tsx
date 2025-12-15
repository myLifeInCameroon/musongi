import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { TrendingUp, Percent } from "lucide-react";
import { YearlyProjection } from "@/types/canvas";
import { formatCurrency, formatPercentage } from "@/lib/calculations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectionsChartProps {
  projections: YearlyProjection[];
  growthRate: number;
  onGrowthRateChange: (rate: number) => void;
}

export function ProjectionsChart({
  projections,
  growthRate,
  onGrowthRateChange,
}: ProjectionsChartProps) {
  const { t } = useLanguage();
  
  const chartData = projections.map((p) => ({
    year: `Y${p.year}`,
    [t("projections.revenue")]: p.revenue,
    [t("projections.expenses")]: p.expenses,
    [t("projections.profit")]: p.profit,
    ROI: p.roi,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-2 sm:p-3 shadow-lg max-w-[200px]">
          <p className="font-medium text-foreground mb-1 sm:mb-2 text-xs sm:text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground truncate">{entry.name}:</span>
              <span className="font-mono font-medium truncate">
                {entry.name === "ROI"
                  ? formatPercentage(entry.value)
                  : formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="section-card animate-fade-in" style={{ animationDelay: "0.45s" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 shrink-0">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-sm sm:text-base">{t("projections.title")}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{t("projections.subtitle")}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="growth-rate" className="text-xs sm:text-sm whitespace-nowrap">
              {t("projections.growthRate")}
            </Label>
          </div>
          {/* full width on mobile, fixed width on desktop so slider stays inline with title */}
          <div className="flex items-center gap-3 w-full sm:w-48">
            <Slider
              value={[growthRate]}
              onValueChange={([value]) => onGrowthRateChange(value)}
              min={0}
              max={100}
              step={1}
              className="flex-1"
            />
            <Input
              id="growth-rate"
              type="number"
              min="0"
              max="100"
              value={growthRate}
              onChange={(e) => onGrowthRateChange(parseInt(e.target.value) || 0)}
              className="w-14 sm:w-16 h-8 text-center text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile: Stack charts vertically */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Revenue vs Expenses Chart */}
        <div>
          <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">{t("projections.revenueVsExpenses")}</h4>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickMargin={8}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  iconSize={10}
                />
                <Bar
                  dataKey={t("projections.revenue")}
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey={t("projections.expenses")}
                  fill="hsl(var(--chart-4))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Trend Chart */}
        <div>
          <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">{t("projections.profitTrend")}</h4>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickMargin={8}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey={t("projections.profit")}
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  fill="url(#profitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Projection Summary Cards - Mobile optimized */}
      <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-3">
        {projections.map((p) => (
          <div
            key={p.year}
            className="p-3 sm:p-4 rounded-lg bg-muted/50 border border-border"
          >
            <h4 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
              {t("common.year")} {p.year}
            </h4>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">{t("projections.revenue")}</span>
                <span className="font-mono text-success truncate ml-2">{formatCurrency(p.revenue)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">{t("projections.expenses")}</span>
                <span className="font-mono truncate ml-2">{formatCurrency(p.expenses)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm pt-1.5 sm:pt-2 border-t border-border">
                <span className="font-medium">{t("projections.profit")}</span>
                <span className={`font-mono font-medium truncate ml-2 ${p.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(p.profit)}
                </span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">{t("projections.roi")}</span>
                <span className={`font-mono ${p.roi >= 100 ? 'text-success' : 'text-warning'}`}>
                  {formatPercentage(p.roi)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
