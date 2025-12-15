import { useState } from "react";
import { Calculator, ChevronDown, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TAX_REGIONS, getRegionById, calculateAfterTaxProfit, calculateTaxAmount } from "@/lib/taxRates";
import { formatCurrency } from "@/lib/calculations";
import { YearlyProjection } from "@/types/canvas";
import { useLanguage } from "@/contexts/LanguageContext";

interface TaxCalculatorProps {
  projections: YearlyProjection[];
  region: string;
  customTaxRate: number;
  onRegionChange: (region: string) => void;
  onCustomTaxRateChange: (rate: number) => void;
}

export function TaxCalculator({
  projections,
  region,
  customTaxRate,
  onRegionChange,
  onCustomTaxRateChange,
}: TaxCalculatorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useLanguage();

  const selectedRegion = getRegionById(region);
  const effectiveTaxRate = region === "custom" ? customTaxRate : (selectedRegion?.corporateTaxRate || 30);

  // Group regions by zone
  const regionsByZone = TAX_REGIONS.reduce((acc, r) => {
    if (!acc[r.zone]) acc[r.zone] = [];
    acc[r.zone].push(r);
    return acc;
  }, {} as Record<string, typeof TAX_REGIONS>);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-primary" />
              {t("tax.title")}
            </CardTitle>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Region Selection */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("tax.selectRegion")}</Label>
                <Select value={region} onValueChange={onRegionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("tax.choosePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {Object.entries(regionsByZone).map(([zone, regions]) => (
                      <div key={zone}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/50">
                          {zone}
                        </div>
                        {regions.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name} ({r.corporateTaxRate}%)
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {region === "custom" && (
                <div className="space-y-2">
                  <Label>{t("tax.customRate")}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={customTaxRate}
                    onChange={(e) => onCustomTaxRateChange(Number(e.target.value))}
                  />
                </div>
              )}
            </div>

            {/* Selected Region Info */}
            {selectedRegion && region !== "custom" && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
                <Info className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <p className="font-medium">{selectedRegion.name}</p>
                  <p className="text-muted-foreground">
                    {t("tax.corporateTax")}: {selectedRegion.corporateTaxRate}% • {t("tax.vat")}: {selectedRegion.vatRate}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedRegion.description}
                  </p>
                </div>
              </div>
            )}

            {/* Profit Analysis Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">{t("common.year")}</th>
                    <th className="text-right py-2 font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="flex items-center gap-1 ml-auto">
                            {t("tax.preTaxProfit")}
                            <Info className="h-3 w-3" />
                          </TooltipTrigger>
                          <TooltipContent>{t("tax.tooltipPreTax")}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </th>
                    <th className="text-right py-2 font-medium text-destructive">
                      Tax ({effectiveTaxRate}%)
                    </th>
                    <th className="text-right py-2 font-medium text-green-600">
                      {t("tax.afterTaxProfit")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map((p) => {
                    const tax = calculateTaxAmount(p.profit, effectiveTaxRate);
                    const afterTax = calculateAfterTaxProfit(p.profit, effectiveTaxRate);
                    return (
                      <tr key={p.year} className="border-b border-border/50">
                        <td className="py-3 font-medium">{t("common.year")} {p.year}</td>
                        <td className="py-3 text-right">
                          {formatCurrency(p.profit)}
                        </td>
                        <td className="py-3 text-right text-destructive">
                          {p.profit > 0 ? `-${formatCurrency(tax)}` : "—"}
                        </td>
                        <td className="py-3 text-right font-semibold text-green-600">
                          {formatCurrency(afterTax)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td className="py-3">{t("tax.threeYearTotal")}</td>
                    <td className="py-3 text-right">
                      {formatCurrency(projections.reduce((sum, p) => sum + p.profit, 0))}
                    </td>
                    <td className="py-3 text-right text-destructive">
                      -{formatCurrency(
                        projections.reduce((sum, p) => sum + calculateTaxAmount(p.profit, effectiveTaxRate), 0)
                      )}
                    </td>
                    <td className="py-3 text-right text-green-600">
                      {formatCurrency(
                        projections.reduce((sum, p) => sum + calculateAfterTaxProfit(p.profit, effectiveTaxRate), 0)
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className="text-xs text-muted-foreground">
              {t("tax.disclaimer")}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
