import { Package, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { Product } from "@/types/canvas";
import { formatCurrency } from "@/lib/calculations";

interface ProductsSectionProps {
  items: Product[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onRemove: (id: string) => void;
}

export function ProductsSection({
  items,
  onAdd,
  onUpdate,
  onRemove,
}: ProductsSectionProps) {
  const totalMonthlyRevenue = items.reduce(
    (sum, p) => sum + p.price * p.monthlyQuantity,
    0
  );

  return (
    <div className="section-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <SectionHeader
        icon={Package}
        title="Products & Services"
        subtitle="Revenue-generating offerings"
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 p-4 rounded-lg bg-muted/50 items-end grid-cols-2 sm:grid-cols-5"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-muted-foreground mb-1 block">Name</label>
              <Input
                placeholder="e.g., K-DISCOVERY"
                value={item.name}
                onChange={(e) => onUpdate(item.id, { name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price</label>
              <Input
                type="number"
                min="0"
                value={item.price}
                onChange={(e) =>
                  onUpdate(item.id, { price: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Monthly Qty</label>
              <Input
                type="number"
                min="0"
                value={item.monthlyQuantity}
                onChange={(e) =>
                  onUpdate(item.id, { monthlyQuantity: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Monthly Revenue</label>
              <div className="h-10 flex items-center px-3 rounded-lg bg-background text-sm font-mono text-success">
                {formatCurrency(item.price * item.monthlyQuantity)}
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
          Add Product
        </Button>
        <div className="text-sm">
          <span className="text-muted-foreground">Total Monthly Revenue:</span>{" "}
          <span className="font-mono font-semibold text-success">
            {formatCurrency(totalMonthlyRevenue)}
          </span>
        </div>
      </div>
    </div>
  );
}
