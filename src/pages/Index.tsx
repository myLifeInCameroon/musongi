import { useCanvasData } from "@/hooks/useCanvasData";
import { Header } from "@/components/canvas/Header";
import { ProjectInfoSection } from "@/components/canvas/ProjectInfoSection";
import { EquipmentSection } from "@/components/canvas/EquipmentSection";
import { PersonnelSection } from "@/components/canvas/PersonnelSection";
import { ProductsSection } from "@/components/canvas/ProductsSection";
import { ActivitiesSection } from "@/components/canvas/ActivitiesSection";
import { OtherChargesSection } from "@/components/canvas/OtherChargesSection";
import { CustomersSection } from "@/components/canvas/CustomersSection";
import { FinancialSummary } from "@/components/canvas/FinancialSummary";
import { ProjectionsChart } from "@/components/canvas/ProjectionsChart";

const Index = () => {
  const {
    data,
    metrics,
    projections,
    updateProjectInfo,
    updateGrowthRate,
    addEquipment,
    updateEquipment,
    removeEquipment,
    addPersonnel,
    updatePersonnel,
    removePersonnel,
    addActivity,
    updateActivity,
    removeActivity,
    addProduct,
    updateProduct,
    removeProduct,
    addCustomer,
    updateCustomer,
    removeCustomer,
    addOtherCharge,
    updateOtherCharge,
    removeOtherCharge,
    addRawMaterial,
    updateRawMaterial,
    removeRawMaterial,
    resetData,
  } = useCanvasData();

  return (
    <div className="min-h-screen bg-background">
      <Header onReset={resetData} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Business Profitability Canvas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Determine your business viability with comprehensive financial analysis 
            and 3-year projections
          </p>
        </div>

        {/* Canvas Sections */}
        <div className="space-y-6">
          <ProjectInfoSection data={data.projectInfo} onUpdate={updateProjectInfo} />

          <div className="grid gap-6 lg:grid-cols-2">
            <EquipmentSection
              items={data.equipment}
              onAdd={addEquipment}
              onUpdate={updateEquipment}
              onRemove={removeEquipment}
            />
            <PersonnelSection
              items={data.personnel}
              onAdd={addPersonnel}
              onUpdate={updatePersonnel}
              onRemove={removePersonnel}
            />
          </div>

          <ProductsSection
            items={data.products}
            onAdd={addProduct}
            onUpdate={updateProduct}
            onRemove={removeProduct}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            <ActivitiesSection
              items={data.activities}
              onAdd={addActivity}
              onUpdate={updateActivity}
              onRemove={removeActivity}
            />
            <CustomersSection
              items={data.customers}
              onAdd={addCustomer}
              onUpdate={updateCustomer}
              onRemove={removeCustomer}
            />
          </div>

          <OtherChargesSection
            charges={data.otherCharges}
            rawMaterials={data.rawMaterials}
            onAddCharge={addOtherCharge}
            onUpdateCharge={updateOtherCharge}
            onRemoveCharge={removeOtherCharge}
            onAddRawMaterial={addRawMaterial}
            onUpdateRawMaterial={updateRawMaterial}
            onRemoveRawMaterial={removeRawMaterial}
          />

          <FinancialSummary metrics={metrics} />

          <ProjectionsChart
            projections={projections}
            growthRate={data.growthRate}
            onGrowthRateChange={updateGrowthRate}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Business Profitability Canvas® — Powered by ECOLIA Labs methodology
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
