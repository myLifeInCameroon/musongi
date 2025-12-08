import { Users, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { Personnel } from "@/types/canvas";
import { formatCurrency } from "@/lib/calculations";

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
  const totalMonthlyCost = items.reduce(
    (sum, p) => sum + p.monthlySalary * p.count,
    0
  );
  const totalEmployees = items.reduce((sum, p) => sum + p.count, 0);

  return (
    <div className="section-card animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <SectionHeader
        icon={Users}
        title="Personnel"
        subtitle="Team members and salary structure"
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="grid gap-3 p-4 rounded-lg bg-muted/50 items-end grid-cols-2 sm:grid-cols-4"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs text-muted-foreground mb-1 block">Role</label>
              <Input
                placeholder="e.g., Product Lead"
                value={item.role}
                onChange={(e) => onUpdate(item.id, { role: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Count</label>
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
              <label className="text-xs text-muted-foreground mb-1 block">Monthly Salary</label>
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
          Add Personnel
        </Button>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Total Employees:</span>{" "}
            <span className="font-mono font-semibold text-foreground">
              {totalEmployees}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Monthly Cost:</span>{" "}
            <span className="font-mono font-semibold text-primary">
              {formatCurrency(totalMonthlyCost)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
