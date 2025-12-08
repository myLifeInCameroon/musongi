import { Target, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { CustomerSegment } from "@/types/canvas";
import { formatNumber } from "@/lib/calculations";

interface CustomersSectionProps {
  items: CustomerSegment[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<CustomerSegment>) => void;
  onRemove: (id: string) => void;
}

export function CustomersSection({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: CustomersSectionProps) {
  const totalCustomers = items.reduce((sum, c) => sum + c.monthlyTarget, 0);

  return (
    <div className="section-card animate-fade-in" style={{ animationDelay: "0.35s" }}>
      <SectionHeader
        icon={Target}
        title="Target Customers"
        subtitle="Customer segments and monthly targets"
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 p-4 rounded-lg bg-muted/50 items-end grid-cols-[1fr_auto_auto]"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Segment Name</label>
              <Input
                placeholder="e.g., Students"
                value={item.name}
                onChange={(e) => onUpdate(item.id, { name: e.target.value })}
              />
            </div>
            <div className="w-32">
              <label className="text-xs text-muted-foreground mb-1 block">Monthly Target</label>
              <Input
                type="number"
                min="0"
                value={item.monthlyTarget}
                onChange={(e) =>
                  onUpdate(item.id, { monthlyTarget: parseInt(e.target.value) || 0 })
                }
              />
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
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" />
          Add Customer Segment
        </Button>
        <div className="text-sm">
          <span className="text-muted-foreground">Total Monthly Target:</span>{" "}
          <span className="font-mono font-semibold text-primary">
            {formatNumber(totalCustomers)}
          </span>
        </div>
      </div>
    </div>
  );
}
