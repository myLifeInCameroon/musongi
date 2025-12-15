import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useCanvasData } from "@/hooks/useCanvasData";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
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
import { TaxCalculator } from "@/components/canvas/TaxCalculator";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { exportCanvasToPDF } from "@/lib/pdfExport";
import { toast } from "sonner";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t, currency } = useLanguage();
  
  const {
    data,
    metrics,
    projections,
    loading: dataLoading,
    saving,
    projects,
    currentProjectId,
    selectProject,
    createProject,
    deleteProject,
    updateProjectInfo,
    updateGrowthRate,
    updateRegion,
    updateCustomTaxRate,
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

  const handleExportPDF = useCallback(() => {
    try {
      exportCanvasToPDF(data, metrics, projections, currency);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    }
  }, [data, metrics, projections, currency]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm sm:text-base text-muted-foreground">{t("main.loading")}</p>
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
        onExportPDF={handleExportPDF}
        onOpenChat={() => setIsChatOpen(true)}
        userEmail={user.email}
        saving={saving}
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={selectProject}
        onCreateProject={createProject}
        onDeleteProject={deleteProject}
        projectsLoading={dataLoading}
      />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Hero Section - Mobile optimized */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 animate-fade-in px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 leading-tight">
            {t("main.title")}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("main.subtitle")}
          </p>
        </div>

        {/* Canvas Sections - Mobile optimized spacing */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <ProjectInfoSection data={data.projectInfo} onUpdate={updateProjectInfo} />

          {/* Mobile: Stack all sections, Tablet+: 2 columns */}
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 lg:grid-cols-2">
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

          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 lg:grid-cols-2">
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

          <TaxCalculator
            projections={projections}
            region={data.region || "custom"}
            customTaxRate={data.customTaxRate || 30}
            onRegionChange={updateRegion}
            onCustomTaxRateChange={updateCustomTaxRate}
          />
        </div>

        {/* Footer - Mobile optimized */}
        <footer className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-border text-center px-2">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("main.footer.methodology")}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            {t("main.footer.builtby")}{" "}
            <a
              href="https://www.linkedin.com/in/karol-charles-konarski-a4252a199/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Karol Charles Konarski
            </a>
          </p>
        </footer>
      </main>

      {/* AI Chat Panel */}
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
