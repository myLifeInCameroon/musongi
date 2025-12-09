import { useState, useCallback, useMemo, useEffect } from "react";
import { CanvasData, FinancialMetrics, YearlyProjection } from "@/types/canvas";
import { calculateFinancialMetrics, calculate3YearProjections } from "@/lib/calculations";
import { v4 as generateId } from "@/lib/uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProjectSummary } from "@/components/projects/ProjectSelector";

const defaultCanvasData: CanvasData = {
  projectInfo: {
    name: "",
    promoter: "",
    location: "",
    sector: "",
    date: new Date().toISOString().split("T")[0],
  },
  equipment: [],
  personnel: [],
  activities: [],
  products: [],
  customers: [],
  otherCharges: [],
  rawMaterials: [],
  growthRate: 15,
  region: "custom",
  customTaxRate: 30,
};

export function useCanvasData(userId: string | undefined) {
  const [data, setData] = useState<CanvasData>(defaultCanvasData);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const metrics = useMemo(() => calculateFinancialMetrics(data), [data]);
  const projections = useMemo(
    () => calculate3YearProjections(data, metrics),
    [data, metrics]
  );

  // Load all projects for user
  const loadProjects = useCallback(async () => {
    if (!userId) return;

    const { data: projectsData, error } = await supabase
      .from("canvas_data")
      .select("id, project_name, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error loading projects:", error);
      return;
    }

    setProjects(projectsData || []);
    return projectsData;
  }, [userId]);

  // Load specific project
  const loadProject = useCallback(async (projectId: string) => {
    if (!userId) return;

    setLoading(true);

    const { data: canvasData, error } = await supabase
      .from("canvas_data")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error loading project:", error);
      toast.error("Could not load project data.");
      setLoading(false);
      return;
    }

    if (canvasData) {
      setCurrentProjectId(canvasData.id);
      setData({
        projectInfo: {
          name: canvasData.project_name || "",
          promoter: "",
          location: "",
          sector: canvasData.project_description || "",
          date: new Date().toISOString().split("T")[0],
        },
        equipment: (canvasData.equipment as any[]) || [],
        personnel: (canvasData.personnel as any[]) || [],
        activities: (canvasData.activities as any[]) || [],
        products: (canvasData.products as any[]) || [],
        customers: (canvasData.customers as any[]) || [],
        otherCharges: (canvasData.other_charges as any[]) || [],
        rawMaterials: (canvasData.raw_materials as any[]) || [],
        growthRate: Number(canvasData.growth_rate) || 15,
        region: (canvasData.region as string) || "custom",
        customTaxRate: Number(canvasData.custom_tax_rate) || 30,
      });
    }

    setLoading(false);
  }, [userId]);

  // Initial load
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const initLoad = async () => {
      setLoading(true);
      const projectsList = await loadProjects();

      if (projectsList && projectsList.length > 0) {
        // Load the most recent project
        await loadProject(projectsList[0].id);
      } else {
        // Create first project for new user
        await createProject("My First Project");
      }

      setLoading(false);
    };

    initLoad();
  }, [userId, loadProjects, loadProject]);

  // Save data to database (debounced)
  const saveData = useCallback(async (newData: CanvasData, projectId: string | null) => {
    if (!userId || !projectId) return;

    setSaving(true);

    const { error } = await supabase
      .from("canvas_data")
      .update({
        project_name: newData.projectInfo.name || "Untitled Project",
        project_description: newData.projectInfo.sector || null,
        equipment: newData.equipment as any,
        personnel: newData.personnel as any,
        products: newData.products as any,
        activities: newData.activities as any,
        other_charges: newData.otherCharges as any,
        customers: newData.customers as any,
        raw_materials: newData.rawMaterials as any,
        growth_rate: newData.growthRate,
        region: newData.region,
        custom_tax_rate: newData.customTaxRate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error saving canvas data:", error);
      toast.error("Could not save your canvas data.");
    }

    setSaving(false);
  }, [userId]);

  // Auto-save with debounce
  useEffect(() => {
    if (!userId || loading || !currentProjectId) return;

    const timeoutId = setTimeout(() => {
      saveData(data, currentProjectId);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [data, userId, loading, currentProjectId, saveData]);

  // Create new project
  const createProject = useCallback(async (name: string) => {
    if (!userId) return;

    const { data: newProject, error } = await supabase
      .from("canvas_data")
      .insert({
        user_id: userId,
        project_name: name,
      })
      .select("id, project_name, updated_at")
      .single();

    if (error) {
      console.error("Error creating project:", error);
      toast.error("Could not create project.");
      return;
    }

    setProjects(prev => [newProject, ...prev]);
    await loadProject(newProject.id);
    toast.success(`Project "${name}" created!`);
  }, [userId, loadProject]);

  // Delete project
  const deleteProject = useCallback(async (projectId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from("canvas_data")
      .delete()
      .eq("id", projectId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting project:", error);
      toast.error("Could not delete project.");
      return;
    }

    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);

    // If we deleted the current project, switch to another
    if (currentProjectId === projectId && updatedProjects.length > 0) {
      await loadProject(updatedProjects[0].id);
    } else if (updatedProjects.length === 0) {
      // Create a new project if none left
      await createProject("My Project");
    }

    toast.success("Project deleted");
  }, [userId, projects, currentProjectId, loadProject, createProject]);

  // Switch project
  const selectProject = useCallback(async (projectId: string) => {
    if (projectId === currentProjectId) return;
    await loadProject(projectId);
  }, [currentProjectId, loadProject]);

  const updateProjectInfo = useCallback(
    (info: Partial<CanvasData["projectInfo"]>) => {
      setData((prev) => ({
        ...prev,
        projectInfo: { ...prev.projectInfo, ...info },
      }));
    },
    []
  );

  const updateGrowthRate = useCallback((rate: number) => {
    setData((prev) => ({ ...prev, growthRate: rate }));
  }, []);

  const updateRegion = useCallback((region: string) => {
    setData((prev) => ({ ...prev, region }));
  }, []);

  const updateCustomTaxRate = useCallback((rate: number) => {
    setData((prev) => ({ ...prev, customTaxRate: rate }));
  }, []);

  // Equipment CRUD
  const addEquipment = useCallback(() => {
    setData((prev) => ({
      ...prev,
      equipment: [
        ...prev.equipment,
        { id: generateId(), name: "", quantity: 1, unitValue: 0, lifespan: 60 },
      ],
    }));
  }, []);

  const updateEquipment = useCallback(
    (id: string, updates: Partial<CanvasData["equipment"][0]>) => {
      setData((prev) => ({
        ...prev,
        equipment: prev.equipment.map((eq) =>
          eq.id === id ? { ...eq, ...updates } : eq
        ),
      }));
    },
    []
  );

  const removeEquipment = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((eq) => eq.id !== id),
    }));
  }, []);

  // Personnel CRUD
  const addPersonnel = useCallback(() => {
    setData((prev) => ({
      ...prev,
      personnel: [
        ...prev.personnel,
        { id: generateId(), role: "", count: 1, monthlySalary: 0 },
      ],
    }));
  }, []);

  const updatePersonnel = useCallback(
    (id: string, updates: Partial<CanvasData["personnel"][0]>) => {
      setData((prev) => ({
        ...prev,
        personnel: prev.personnel.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    []
  );

  const removePersonnel = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      personnel: prev.personnel.filter((p) => p.id !== id),
    }));
  }, []);

  // Activities CRUD
  const addActivity = useCallback(() => {
    setData((prev) => ({
      ...prev,
      activities: [
        ...prev.activities,
        { id: generateId(), name: "", monthlyCount: 1, unitValue: 0 },
      ],
    }));
  }, []);

  const updateActivity = useCallback(
    (id: string, updates: Partial<CanvasData["activities"][0]>) => {
      setData((prev) => ({
        ...prev,
        activities: prev.activities.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      }));
    },
    []
  );

  const removeActivity = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a.id !== id),
    }));
  }, []);

  // Products CRUD
  const addProduct = useCallback(() => {
    setData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { id: generateId(), name: "", price: 0, monthlyQuantity: 0 },
      ],
    }));
  }, []);

  const updateProduct = useCallback(
    (id: string, updates: Partial<CanvasData["products"][0]>) => {
      setData((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    []
  );

  const removeProduct = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }));
  }, []);

  // Customers CRUD
  const addCustomer = useCallback(() => {
    setData((prev) => ({
      ...prev,
      customers: [
        ...prev.customers,
        { id: generateId(), name: "", monthlyTarget: 0 },
      ],
    }));
  }, []);

  const updateCustomer = useCallback(
    (id: string, updates: Partial<CanvasData["customers"][0]>) => {
      setData((prev) => ({
        ...prev,
        customers: prev.customers.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    []
  );

  const removeCustomer = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      customers: prev.customers.filter((c) => c.id !== id),
    }));
  }, []);

  // Other Charges CRUD
  const addOtherCharge = useCallback(() => {
    setData((prev) => ({
      ...prev,
      otherCharges: [
        ...prev.otherCharges,
        { id: generateId(), name: "", monthlyValue: 0 },
      ],
    }));
  }, []);

  const updateOtherCharge = useCallback(
    (id: string, updates: Partial<CanvasData["otherCharges"][0]>) => {
      setData((prev) => ({
        ...prev,
        otherCharges: prev.otherCharges.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    },
    []
  );

  const removeOtherCharge = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      otherCharges: prev.otherCharges.filter((c) => c.id !== id),
    }));
  }, []);

  // Raw Materials CRUD
  const addRawMaterial = useCallback(() => {
    setData((prev) => ({
      ...prev,
      rawMaterials: [
        ...prev.rawMaterials,
        { id: generateId(), name: "", monthlyValue: 0 },
      ],
    }));
  }, []);

  const updateRawMaterial = useCallback(
    (id: string, updates: Partial<CanvasData["rawMaterials"][0]>) => {
      setData((prev) => ({
        ...prev,
        rawMaterials: prev.rawMaterials.map((r) =>
          r.id === id ? { ...r, ...updates } : r
        ),
      }));
    },
    []
  );

  const removeRawMaterial = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      rawMaterials: prev.rawMaterials.filter((r) => r.id !== id),
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(prev => ({
      ...defaultCanvasData,
      projectInfo: { ...defaultCanvasData.projectInfo, name: prev.projectInfo.name },
    }));
  }, []);

  return {
    data,
    metrics,
    projections,
    loading,
    saving,
    // Project management
    projects,
    currentProjectId,
    selectProject,
    createProject,
    deleteProject,
    // Data updates
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
  };
}
