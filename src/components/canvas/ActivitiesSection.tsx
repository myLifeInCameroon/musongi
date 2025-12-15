import { Cog, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { Activity } from "@/types/canvas";
import { formatCurrency } from "@/lib/calculations";
import { useLanguage } from "@/contexts/LanguageContext";

interface ActivitiesSectionProps {
  items: Activity[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Activity>) => void;
  onRemove: (id: string) => void;
}

export function ActivitiesSection({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: ActivitiesSectionProps) {
  const { t } = useLanguage();
  const totalMonthlyCost = items.reduce(
    (sum, a) => sum + a.unitValue * a.monthlyCount,
    0
  );

  return (
    <div className="section-card animate-fade-in" style={{ animationDelay: "0.25s" }}>
      <SectionHeader
        icon={Cog}
        title={t("activities.title")}
        subtitle={t("activities.subtitle")}
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 p-4 rounded-lg bg-muted/50 items-end grid-cols-2 sm:grid-cols-5"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-muted-foreground mb-1 block">{t("activities.activity")}</label>
              <Input
                placeholder={t("activities.activityPlaceholder")}
                value={item.name}
                onChange={(e) => onUpdate(item.id, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("activities.monthlyCount")}</label>
              <Input
                type="number"
                min="0"
                value={item.monthlyCount}
                onChange={(e) =>
                  onUpdate(item.id, { monthlyCount: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("activities.unitCost")}</label>
              <Input
                type="number"
                min="0"
                value={item.unitValue}
                onChange={(e) =>
                  onUpdate(item.id, { unitValue: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("activities.monthlyCost")}</label>
              <div className="h-10 flex items-center px-3 rounded-lg bg-background text-sm font-mono text-muted-foreground">
                {formatCurrency(item.unitValue * item.monthlyCount)}
              </div>
            </div>
            <div className="flex items-end justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          {t("activities.add")}
        </Button>
        <div className="text-sm">
          <span className="text-muted-foreground">{t("activities.totalMonthlyCost")}:</span>{" "}
          <span className="font-mono font-semibold text-foreground">
            {formatCurrency(totalMonthlyCost)}
          </span>
        </div>
      </div>
    </div>
  );
}
