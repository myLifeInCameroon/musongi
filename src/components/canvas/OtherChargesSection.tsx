import { Receipt, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { OtherCharge, RawMaterial } from "@/types/canvas";
import { useLanguage } from "@/contexts/LanguageContext";

interface OtherChargesSectionProps {
  charges: OtherCharge[];
  rawMaterials: RawMaterial[];
  onAddCharge: () => void;
  onUpdateCharge: (id: string, updates: Partial<OtherCharge>) => void;
  onRemoveCharge: (id: string) => void;
  onAddRawMaterial: () => void;
  onUpdateRawMaterial: (id: string, updates: Partial<RawMaterial>) => void;
  onRemoveRawMaterial: (id: string) => void;
}

export function OtherChargesSection({
  charges,
  rawMaterials,
  onAddCharge,
  onUpdateCharge,
  onRemoveCharge,
  onAddRawMaterial,
  onUpdateRawMaterial,
  onRemoveRawMaterial,
}: OtherChargesSectionProps) {
  const { t, formatCurrencyValue } = useLanguage();
  const totalCharges = charges.reduce((sum, c) => sum + c.monthlyValue, 0);
  const totalRawMaterials = rawMaterials.reduce((sum, r) => sum + r.monthlyValue, 0);

  return (
    <div className="section-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
      <SectionHeader
        icon={Receipt}
        title={t("otherCharges.title")}
        subtitle={t("otherCharges.subtitle")}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Other Charges */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">{t("otherCharges.charges")}</h4>
          <div className="space-y-2">
            {charges.map((item) => (
              <div
                key={item.id}
                className="grid gap-2 p-3 rounded-lg bg-muted/50 grid-cols-[1fr_auto_auto] items-center"
              >
                <Input
                  placeholder={t("otherCharges.chargePlaceholder")}
                  value={item.name}
                  onChange={(e) => onUpdateCharge(item.id, { name: e.target.value })}
                  className="h-9"
                />
                <Input
                  type="number"
                  min="0"
                  placeholder={t("common.monthly")}
                  value={item.monthlyValue}
                  onChange={(e) =>
                    onUpdateCharge(item.id, { monthlyValue: parseFloat(e.target.value) || 0 })
                  }
                  className="h-9 w-28"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveCharge(item.id)}
                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3" onClick={onAddCharge}>
            <Plus className="h-4 w-4 mr-1" />
            {t("otherCharges.addCharge")}
          </Button>
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">{t("common.total")}:</span>{" "}
            <span className="font-mono font-medium">{formatCurrencyValue(totalCharges)}</span>
          </div>
        </div>

        {/* Raw Materials */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">{t("otherCharges.rawMaterials")}</h4>
          <div className="space-y-2">
            {rawMaterials.map((item) => (
              <div
                key={item.id}
                className="grid gap-2 p-3 rounded-lg bg-muted/50 grid-cols-[1fr_auto_auto] items-center"
              >
                <Input
                  placeholder={t("otherCharges.materialPlaceholder")}
                  value={item.name}
                  onChange={(e) => onUpdateRawMaterial(item.id, { name: e.target.value })}
                  className="h-9"
                />
                <Input
                  type="number"
                  min="0"
                  placeholder={t("common.monthly")}
                  value={item.monthlyValue}
                  onChange={(e) =>
                    onUpdateRawMaterial(item.id, { monthlyValue: parseFloat(e.target.value) || 0 })
                  }
                  className="h-9 w-28"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveRawMaterial(item.id)}
                  className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-3" onClick={onAddRawMaterial}>
            <Plus className="h-4 w-4 mr-1" />
            {t("otherCharges.addMaterial")}
          </Button>
          <div className="mt-2 text-sm">
            <span className="text-muted-foreground">{t("common.total")}:</span>{" "}
            <span className="font-mono font-medium">{formatCurrencyValue(totalRawMaterials)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
