import { useState, useCallback, useMemo } from "react";
import { CanvasData, FinancialMetrics, YearlyProjection } from "@/types/canvas";
import { calculateFinancialMetrics, calculate3YearProjections } from "@/lib/calculations";
import { v4 as generateId } from "@/lib/uuid";

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

export function useCanvasData() {
  const [data, setData] = useState<CanvasData>(defaultCanvasData);

  const metrics = useMemo(() => calculateFinancialMetrics(data), [data]);
  const projections = useMemo(
    () => calculate3YearProjections(data, metrics),
    [data, metrics]
  );

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
