import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCanvasData } from "@/hooks/useCanvasData";
import { useAuth } from "@/hooks/useAuth";
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
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const {
    data,
    metrics,
    projections,
    loading: dataLoading,
    saving,
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
  } = useCanvasData(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your canvas...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onReset={resetData} 
        onSignOut={signOut} 
        userEmail={user.email}
        saving={saving}
      />

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
