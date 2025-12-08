import { useState, useCallback, useMemo, useEffect } from "react";
import { CanvasData, FinancialMetrics, YearlyProjection } from "@/types/canvas";
import { calculateFinancialMetrics, calculate3YearProjections } from "@/lib/calculations";
import { v4 as generateId } from "@/lib/uuid";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
};

export function useCanvasData(userId: string | undefined) {
  const [data, setData] = useState<CanvasData>(defaultCanvasData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const metrics = useMemo(() => calculateFinancialMetrics(data), [data]);
  const projections = useMemo(
    () => calculate3YearProjections(data, metrics),
    [data, metrics]
  );

  // Load data from database
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      
      const { data: canvasData, error } = await supabase
        .from("canvas_data")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error loading canvas data:", error);
        toast({
          title: "Error loading data",
          description: "Could not load your saved canvas data.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (canvasData) {
        setData({
          projectInfo: {
            name: canvasData.project_name || "",
            promoter: "",
            location: "",
            sector: "",
            date: new Date().toISOString().split("T")[0],
          },
          equipment: (canvasData.equipment as any[]) || [],
          personnel: (canvasData.personnel as any[]) || [],
          activities: (canvasData.activities as any[]) || [],
          products: (canvasData.products as any[]) || [],
          customers: (canvasData.customers as any[]) || [],
          otherCharges: (canvasData.other_charges as any[]) || [],
          rawMaterials: [],
          growthRate: Number(canvasData.growth_rate) || 15,
        });
      }

      setLoading(false);
    };

    loadData();
  }, [userId, toast]);

  // Save data to database (debounced)
  const saveData = useCallback(async (newData: CanvasData) => {
    if (!userId) return;

    setSaving(true);

    const { error } = await supabase
      .from("canvas_data")
      .upsert(
        {
          user_id: userId,
          project_name: newData.projectInfo.name || "Untitled Project",
          project_description: newData.projectInfo.sector || null,
          equipment: newData.equipment as any,
          personnel: newData.personnel as any,
          products: newData.products as any,
          activities: newData.activities as any,
          other_charges: newData.otherCharges as any,
          customers: newData.customers as any,
          growth_rate: newData.growthRate,
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("Error saving canvas data:", error);
      toast({
        title: "Error saving",
        description: "Could not save your canvas data.",
        variant: "destructive",
      });
    }

    setSaving(false);
  }, [userId, toast]);

  // Auto-save with debounce
  useEffect(() => {
    if (!userId || loading) return;

    const timeoutId = setTimeout(() => {
      saveData(data);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [data, userId, loading, saveData]);

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
    setData(defaultCanvasData);
  }, []);

  return {
    data,
    metrics,
    projections,
    loading,
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
  };
}
