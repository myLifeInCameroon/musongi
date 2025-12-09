export interface TaxRegion {
  id: string;
  name: string;
  zone: string;
  corporateTaxRate: number;
  vatRate: number;
  description: string;
}

export const TAX_REGIONS: TaxRegion[] = [
  // CEMAC Zone (Central Africa)
  { id: "cameroon", name: "Cameroon", zone: "CEMAC", corporateTaxRate: 33, vatRate: 19.25, description: "Central Africa" },
  { id: "gabon", name: "Gabon", zone: "CEMAC", corporateTaxRate: 30, vatRate: 18, description: "Central Africa" },
  { id: "congo", name: "Congo", zone: "CEMAC", corporateTaxRate: 28, vatRate: 18, description: "Central Africa" },
  { id: "chad", name: "Chad", zone: "CEMAC", corporateTaxRate: 35, vatRate: 18, description: "Central Africa" },
  { id: "car", name: "Central African Republic", zone: "CEMAC", corporateTaxRate: 30, vatRate: 19, description: "Central Africa" },
  { id: "eq_guinea", name: "Equatorial Guinea", zone: "CEMAC", corporateTaxRate: 35, vatRate: 15, description: "Central Africa" },
  
  // UEMOA Zone (West Africa)
  { id: "senegal", name: "Senegal", zone: "UEMOA", corporateTaxRate: 30, vatRate: 18, description: "West Africa" },
  { id: "ivory_coast", name: "Côte d'Ivoire", zone: "UEMOA", corporateTaxRate: 25, vatRate: 18, description: "West Africa" },
  { id: "mali", name: "Mali", zone: "UEMOA", corporateTaxRate: 30, vatRate: 18, description: "West Africa" },
  { id: "burkina_faso", name: "Burkina Faso", zone: "UEMOA", corporateTaxRate: 27.5, vatRate: 18, description: "West Africa" },
  { id: "benin", name: "Benin", zone: "UEMOA", corporateTaxRate: 30, vatRate: 18, description: "West Africa" },
  { id: "togo", name: "Togo", zone: "UEMOA", corporateTaxRate: 27, vatRate: 18, description: "West Africa" },
  { id: "niger", name: "Niger", zone: "UEMOA", corporateTaxRate: 30, vatRate: 19, description: "West Africa" },
  { id: "guinea_bissau", name: "Guinea-Bissau", zone: "UEMOA", corporateTaxRate: 25, vatRate: 17, description: "West Africa" },
  
  // Other African countries
  { id: "nigeria", name: "Nigeria", zone: "ECOWAS", corporateTaxRate: 30, vatRate: 7.5, description: "West Africa" },
  { id: "ghana", name: "Ghana", zone: "ECOWAS", corporateTaxRate: 25, vatRate: 15, description: "West Africa" },
  { id: "kenya", name: "Kenya", zone: "EAC", corporateTaxRate: 30, vatRate: 16, description: "East Africa" },
  { id: "rwanda", name: "Rwanda", zone: "EAC", corporateTaxRate: 30, vatRate: 18, description: "East Africa" },
  { id: "south_africa", name: "South Africa", zone: "SADC", corporateTaxRate: 27, vatRate: 15, description: "Southern Africa" },
  { id: "morocco", name: "Morocco", zone: "Maghreb", corporateTaxRate: 31, vatRate: 20, description: "North Africa" },
  { id: "egypt", name: "Egypt", zone: "Maghreb", corporateTaxRate: 22.5, vatRate: 14, description: "North Africa" },
  
  // Major Global Regions
  { id: "usa", name: "United States", zone: "North America", corporateTaxRate: 21, vatRate: 0, description: "Federal rate only" },
  { id: "canada", name: "Canada", zone: "North America", corporateTaxRate: 26.5, vatRate: 5, description: "Federal + avg provincial" },
  { id: "uk", name: "United Kingdom", zone: "Europe", corporateTaxRate: 25, vatRate: 20, description: "Standard rate" },
  { id: "france", name: "France", zone: "Europe", corporateTaxRate: 25, vatRate: 20, description: "Standard rate" },
  { id: "germany", name: "Germany", zone: "Europe", corporateTaxRate: 30, vatRate: 19, description: "Including solidarity surcharge" },
  { id: "netherlands", name: "Netherlands", zone: "Europe", corporateTaxRate: 25.8, vatRate: 21, description: "Standard rate" },
  { id: "uae", name: "United Arab Emirates", zone: "Middle East", corporateTaxRate: 9, vatRate: 5, description: "New corporate tax 2023" },
  { id: "singapore", name: "Singapore", zone: "Asia", corporateTaxRate: 17, vatRate: 9, description: "GST" },
  { id: "china", name: "China", zone: "Asia", corporateTaxRate: 25, vatRate: 13, description: "Standard rate" },
  
  // Custom option
  { id: "custom", name: "Custom Region", zone: "Custom", corporateTaxRate: 30, vatRate: 18, description: "Enter your own rates" },
];

export function getRegionById(id: string): TaxRegion | undefined {
  return TAX_REGIONS.find(r => r.id === id);
}

export function getRegionsByZone(zone: string): TaxRegion[] {
  return TAX_REGIONS.filter(r => r.zone === zone);
}

export function calculateAfterTaxProfit(profit: number, taxRate: number): number {
  if (profit <= 0) return profit; // No tax on losses
  return profit * (1 - taxRate / 100);
}

export function calculateTaxAmount(profit: number, taxRate: number): number {
  if (profit <= 0) return 0;
  return profit * (taxRate / 100);
}
