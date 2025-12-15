// Mobile-optimized Equipment Section
import { HardDrive, Plus, Trash2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./SectionHeader";
import { Equipment } from "@/types/canvas";
import { formatCurrency, calculateDepreciation } from "@/lib/calculations";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

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
        title="Equipment & Materials"
        subtitle="Assets with depreciation calculation"
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
          Add Equipment
        </Button>
        <div className="flex flex-col sm:flex-row gap-3 text-sm bg-muted/50 p-3 rounded-lg">
          <div className="flex-1">
            <span className="text-muted-foreground">Total Investment:</span>{" "}
            <span className="font-mono font-semibold text-foreground block sm:inline mt-1 sm:mt-0">
              {formatCurrency(totalInvestment)}
            </span>
          </div>
          <div className="flex-1">
            <span className="text-muted-foreground">Monthly Depreciation:</span>{" "}
            <span className="font-mono font-semibold text-primary block sm:inline mt-1 sm:mt-0">
              {formatCurrency(totalMonthlyDepreciation)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile Equipment Card with collapsible details
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
            placeholder="Equipment name"
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
            <label className="text-xs text-muted-foreground mb-1 block">Name</label>
            <Input
              placeholder="Equipment name"
              value={item.name}
              onChange={(e) => onUpdate(item.id, { name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Qty</label>
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
            <label className="text-xs text-muted-foreground mb-1 block">Unit Value</label>
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
            <label className="text-xs text-muted-foreground mb-1 block">Life (months)</label>
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
              <label className="text-xs text-muted-foreground mb-1 block">Monthly Dep.</label>
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
            <span>Total Value:</span>
            <span className="font-mono">{formatCurrency(item.unitValue * item.quantity)}</span>
          </div>
          <div className="flex justify-between">
            <span>Monthly Depreciation:</span>
            <span className="font-mono text-primary">{formatCurrency(depreciation)}</span>
          </div>
        </div>
      </div>

      {/* Mobile: Collapsible details */}
      <CollapsibleContent className="sm:hidden">
        <div className="px-3 pb-3 space-y-3 border-t pt-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
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
              <label className="text-xs text-muted-foreground mb-1 block">Unit Value</label>
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
            <label className="text-xs text-muted-foreground mb-1 block">Lifespan (months)</label>
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
            Remove Equipment
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
// import { HardDrive, Plus, Trash2 } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { SectionHeader } from "./SectionHeader";
// import { Equipment } from "@/types/canvas";
// import { formatCurrency, calculateDepreciation } from "@/lib/calculations";

// interface EquipmentSectionProps {
//   items: Equipment[];
//   onAdd: () => void;
//   onUpdate: (id: string, updates: Partial<Equipment>) => void;
//   onRemove: (id: string) => void;
// }

// export function EquipmentSection({
//   items,
//   onAdd,
//   onUpdate,
//   onRemove,
// }: EquipmentSectionProps) {
//   const totalInvestment = items.reduce(
//     (sum, eq) => sum + eq.unitValue * eq.quantity,
//     0
//   );
//   const totalMonthlyDepreciation = items.reduce((sum, eq) => {
//     const dep = calculateDepreciation(eq.unitValue, eq.quantity, eq.lifespan);
//     return sum + dep.monthly;
//   }, 0);

//   return (
//     <div className="section-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
//       <SectionHeader
//         icon={HardDrive}
//         title="Equipment & Materials"
//         subtitle="Assets with depreciation calculation"
//       />

//       <div className="space-y-3">
//         {items.map((item, index) => {
//           const dep = calculateDepreciation(item.unitValue, item.quantity, item.lifespan);
//           return (
//             <div
//               key={item.id}
//               className="grid gap-3 p-4 rounded-lg bg-muted/50 items-end grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
//               style={{ animationDelay: `${index * 0.05}s` }}
//             >
//               <div className="col-span-2 sm:col-span-1">
//                 <label className="text-xs text-muted-foreground mb-1 block">Name</label>
//                 <Input
//                   placeholder="Equipment name"
//                   value={item.name}
//                   onChange={(e) => onUpdate(item.id, { name: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label className="text-xs text-muted-foreground mb-1 block">Qty</label>
//                 <Input
//                   type="number"
//                   min="1"
//                   value={item.quantity}
//                   onChange={(e) =>
//                     onUpdate(item.id, { quantity: parseInt(e.target.value) || 1 })
//                   }
//                 />
//               </div>
//               <div>
//                 <label className="text-xs text-muted-foreground mb-1 block">Unit Value</label>
//                 <Input
//                   type="number"
//                   min="0"
//                   value={item.unitValue}
//                   onChange={(e) =>
//                     onUpdate(item.id, { unitValue: parseFloat(e.target.value) || 0 })
//                   }
//                 />
//               </div>
//               <div>
//                 <label className="text-xs text-muted-foreground mb-1 block">Life (months)</label>
//                 <Input
//                   type="number"
//                   min="1"
//                   value={item.lifespan}
//                   onChange={(e) =>
//                     onUpdate(item.id, { lifespan: parseInt(e.target.value) || 60 })
//                   }
//                 />
//               </div>
//               <div className="flex items-end gap-2">
//                 <div className="flex-1">
//                   <label className="text-xs text-muted-foreground mb-1 block">Monthly Dep.</label>
//                   <div className="h-10 flex items-center px-3 rounded-lg bg-background text-sm font-mono text-muted-foreground">
//                     {formatCurrency(dep.monthly)}
//                   </div>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => onRemove(item.id)}
//                   className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
//         <Button variant="outline" size="sm" onClick={onAdd}>
//           <Plus className="h-4 w-4 mr-1" />
//           Add Equipment
//         </Button>
//         <div className="flex gap-6 text-sm">
//           <div>
//             <span className="text-muted-foreground">Total Investment:</span>{" "}
//             <span className="font-mono font-semibold text-foreground">
//               {formatCurrency(totalInvestment)}
//             </span>
//           </div>
//           <div>
//             <span className="text-muted-foreground">Monthly Depreciation:</span>{" "}
//             <span className="font-mono font-semibold text-primary">
//               {formatCurrency(totalMonthlyDepreciation)}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
