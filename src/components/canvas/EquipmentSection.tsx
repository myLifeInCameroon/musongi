import { HardDrive, Plus, Trash2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { Equipment } from "@/types/canvas";
import { formatCurrency, calculateDepreciation } from "@/lib/calculations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EquipmentSectionProps {
  items: Equipment[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Equipment>) => void;
  onRemove: (id: string) => void;
}

export function EquipmentSection({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: EquipmentSectionProps) {
  const { t } = useLanguage();
  const totalInvestment = items.reduce(
    (sum, eq) => sum + eq.unitValue * eq.quantity,
    0
  );
  const totalMonthlyDepreciation = items.reduce((sum, eq) => {
    const dep = calculateDepreciation(eq.unitValue, eq.quantity, eq.lifespan);
    return sum + dep.monthly;
  }, 0);

  return (
    <div className="section-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <SectionHeader
        icon={HardDrive}
        title={t("equipment.title")}
        subtitle={t("equipment.subtitle")}
      />

      <div className="space-y-3">
        {items.map((item, index) => {
          const dep = calculateDepreciation(item.unitValue, item.quantity, item.lifespan);
          return (
            <MobileEquipmentCard
              key={item.id}
              item={item}
              depreciation={dep.monthly}
              onUpdate={onUpdate}
              onRemove={onRemove}
              index={index}
            />
          );
        })}
      </div>

      <div className="mt-4 space-y-3">
        <Button variant="outline" size="sm" onClick={onAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          {t("equipment.add")}
        </Button>
        <div className="flex flex-col sm:flex-row gap-3 text-sm bg-muted/50 p-3 rounded-lg">
          <div className="flex-1">
            <span className="text-muted-foreground">{t("equipment.totalInvestment")}:</span>{" "}
            <span className="font-mono font-semibold text-foreground block sm:inline mt-1 sm:mt-0">
              {formatCurrency(totalInvestment)}
            </span>
          </div>
          <div className="flex-1">
            <span className="text-muted-foreground">{t("equipment.monthlyDepreciationTotal")}:</span>{" "}
            <span className="font-mono font-semibold text-primary block sm:inline mt-1 sm:mt-0">
              {formatCurrency(totalMonthlyDepreciation)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileEquipmentCard({
  item,
  depreciation,
  onUpdate,
  onRemove,
  index,
}: {
  item: Equipment;
  depreciation: number;
  onUpdate: (id: string, updates: Partial<Equipment>) => void;
  onRemove: (id: string) => void;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-lg bg-muted/50 overflow-hidden"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="p-3 sm:p-4">
        {/* Mobile: Compact header with name and total */}
        <div className="flex items-center justify-between gap-2 mb-2 sm:hidden">
          <Input
            placeholder={t("equipment.namePlaceholder")}
            value={item.name}
            onChange={(e) => onUpdate(item.id, { name: e.target.value })}
            className="flex-1 h-9 text-sm"
          />
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>

        {/* Desktop: Full layout */}
        <div className="hidden sm:grid gap-3 grid-cols-6 items-end">
          <div className="col-span-1">
            <label className="text-xs text-muted-foreground mb-1 block">{t("equipment.name")}</label>
            <Input
              placeholder={t("equipment.namePlaceholder")}
              value={item.name}
              onChange={(e) => onUpdate(item.id, { name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("equipment.quantity")}</label>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                onUpdate(item.id, { quantity: parseInt(e.target.value) || 1 })
              }
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("equipment.unitValue")}</label>
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
            <label className="text-xs text-muted-foreground mb-1 block">{t("equipment.lifespan")}</label>
            <Input
              type="number"
              min="1"
              value={item.lifespan}
              onChange={(e) =>
                onUpdate(item.id, { lifespan: parseInt(e.target.value) || 60 })
              }
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">{t("equipment.monthlyDepreciation")}</label>
              <div className="h-10 flex items-center px-3 rounded-lg bg-background text-sm font-mono text-muted-foreground">
                {formatCurrency(depreciation)}
              </div>
            </div>
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

        {/* Mobile: Summary info */}
        <div className="sm:hidden text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>{t("equipment.totalValue")}:</span>
            <span className="font-mono">{formatCurrency(item.unitValue * item.quantity)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("equipment.monthlyDepreciationTotal")}:</span>
            <span className="font-mono text-primary">{formatCurrency(depreciation)}</span>
          </div>
        </div>
      </div>

      {/* Mobile: Collapsible details */}
      <CollapsibleContent className="sm:hidden">
        <div className="px-3 pb-3 space-y-3 border-t pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("equipment.quantity")}</label>
              <Input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  onUpdate(item.id, { quantity: parseInt(e.target.value) || 1 })
                }
                className="h-9"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">{t("equipment.unitValue")}</label>
              <Input
                type="number"
                min="0"
                value={item.unitValue}
                onChange={(e) =>
                  onUpdate(item.id, { unitValue: parseFloat(e.target.value) || 0 })
                }
                className="h-9"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("equipment.lifespanMobile")}</label>
            <Input
              type="number"
              min="1"
              value={item.lifespan}
              onChange={(e) =>
                onUpdate(item.id, { lifespan: parseInt(e.target.value) || 60 })
              }
              className="h-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(item.id)}
            className="w-full text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("equipment.remove")}
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
