import { Users, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { Personnel } from "@/types/canvas";
import { useLanguage } from "@/contexts/LanguageContext";

interface PersonnelSectionProps {
  items: Personnel[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Personnel>) => void;
  onRemove: (id: string) => void;
}

export function PersonnelSection({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: PersonnelSectionProps) {
  const { t, formatCurrencyValue } = useLanguage();
  const totalMonthlyCost = items.reduce(
    (sum, p) => sum + p.monthlySalary * p.count,
    0
  );
  const totalEmployees = items.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="section-card animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <SectionHeader
        icon={Users}
        title={t("personnel.title")}
        subtitle={t("personnel.subtitle")}
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 p-4 rounded-lg bg-muted/50 items-end grid-cols-2 sm:grid-cols-4"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-muted-foreground mb-1 block">{t("personnel.role")}</label>
              <Input
                placeholder={t("personnel.rolePlaceholder")}
                value={item.role}
                onChange={(e) => onUpdate(item.id, { role: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("personnel.count")}</label>
              <Input
                type="number"
                min="1"
                value={item.count}
                onChange={(e) =>
                  onUpdate(item.id, { count: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("personnel.monthlySalary")}</label>
              <Input
                type="number"
                min="0"
                value={item.monthlySalary}
                onChange={(e) =>
                  onUpdate(item.id, { monthlySalary: parseFloat(e.target.value) || 0 })
                }
              />
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
          {t("personnel.add")}
        </Button>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">{t("personnel.totalEmployees")}:</span>{" "}
            <span className="font-mono font-semibold text-foreground">
              {totalEmployees}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">{t("personnel.monthlyCost")}:</span>{" "}
            <span className="font-mono font-semibold text-primary">
              {formatCurrencyValue(totalMonthlyCost)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
