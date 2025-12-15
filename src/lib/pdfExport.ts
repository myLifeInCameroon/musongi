import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CanvasData, FinancialMetrics, YearlyProjection } from "@/types/canvas";
import { formatPercentage } from "./calculations";

// Currency symbols mapping
const currencySymbols: Record<string, string> = {
  XAF: "FCFA",
  USD: "$",
  EUR: "€",
};

// Helper function to format numbers for PDF without special characters
const formatNumberForPDF = (value: number, currency: string = "XAF"): string => {
  const symbol = currencySymbols[currency] || currency;
  const formattedNumber = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace(/\u202F/g, ' ');
  
  if (currency === "USD") {
    return `$${formattedNumber}`;
  } else if (currency === "EUR") {
    return `${formattedNumber} €`;
  }
  return `${formattedNumber} ${symbol}`;
};

// Generate SVG Bar Chart with improved styling
const generateBarChartSVG = (
  labels: string[], 
  dataset1: number[], 
  dataset2: number[], 
  title: string, 
  label1: string, 
  label2: string,
  currency: string
): string => {
  const width = 550;
  const height = 320;
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2 - 30;
  
  const maxValue = Math.max(...dataset1, ...dataset2);
  const barGroupWidth = chartWidth / labels.length;
  const barWidth = barGroupWidth / 3;
  const gap = 8;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#60A5FA;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#F87171;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#EF4444;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#FAFAFA"/>
    <text x="${width / 2}" y="28" font-size="16" font-weight="bold" text-anchor="middle" fill="#1F2937">${title}</text>`;
  
  // Grid lines
  for (let i = 0; i <= 5; i++) {
    const y = padding + 30 + (chartHeight / 5) * i;
    svg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>`;
    const value = maxValue - (maxValue / 5) * i;
    const formattedValue = value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`;
    svg += `<text x="${padding - 8}" y="${y + 4}" font-size="9" text-anchor="end" fill="#6B7280">${formattedValue}</text>`;
  }
  
  // Y-axis
  svg += `<line x1="${padding}" y1="${padding + 30}" x2="${padding}" y2="${height - padding}" stroke="#9CA3AF" stroke-width="2"/>`;
  
  // X-axis
  svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#9CA3AF" stroke-width="2"/>`;
  
  // Bars with rounded corners
  labels.forEach((label, i) => {
    const x = padding + (i * barGroupWidth) + barGroupWidth / 4;
    const h1 = (dataset1[i] / maxValue) * chartHeight;
    const h2 = (dataset2[i] / maxValue) * chartHeight;
    const y1 = height - padding - h1;
    const y2 = height - padding - h2;
    
    svg += `<rect x="${x}" y="${y1}" width="${barWidth}" height="${h1}" fill="url(#blueGrad)" rx="4"/>`;
    svg += `<rect x="${x + barWidth + gap}" y="${y2}" width="${barWidth}" height="${h2}" fill="url(#redGrad)" rx="4"/>`;
    svg += `<text x="${x + barWidth + gap / 2}" y="${height - padding + 18}" font-size="11" font-weight="500" text-anchor="middle" fill="#374151">${label}</text>`;
  });
  
  // Legend
  svg += `<rect x="${width - 160}" y="45" width="150" height="55" fill="white" stroke="#E5E7EB" stroke-width="1" rx="6"/>`;
  svg += `<rect x="${width - 150}" y="55" width="16" height="16" fill="url(#blueGrad)" rx="3"/>`;
  svg += `<text x="${width - 128}" y="68" font-size="11" fill="#374151">${label1}</text>`;
  svg += `<rect x="${width - 150}" y="78" width="16" height="16" fill="url(#redGrad)" rx="3"/>`;
  svg += `<text x="${width - 128}" y="91" font-size="11" fill="#374151">${label2}</text>`;
  
  svg += `</svg>`;
  return svg;
};

// Generate SVG Profit Trend Line Chart
const generateLineChartSVG = (
  labels: string[], 
  values: number[], 
  title: string,
  currency: string
): string => {
  const width = 550;
  const height = 280;
  const padding = 60;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2 - 20;
  
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#10B981;stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:#10B981;stop-opacity:0.05" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="#FAFAFA"/>
    <text x="${width / 2}" y="25" font-size="16" font-weight="bold" text-anchor="middle" fill="#1F2937">${title}</text>`;
  
  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = padding + 20 + (chartHeight / 4) * i;
    svg += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>`;
    const value = maxValue - (range / 4) * i;
    const formattedValue = Math.abs(value) >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`;
    svg += `<text x="${padding - 8}" y="${y + 4}" font-size="9" text-anchor="end" fill="#6B7280">${formattedValue}</text>`;
  }
  
  // Calculate points
  const points: { x: number; y: number }[] = labels.map((_, i) => {
    const x = padding + (i / (labels.length - 1)) * chartWidth;
    const y = padding + 20 + ((maxValue - values[i]) / range) * chartHeight;
    return { x, y };
  });
  
  // Area fill
  const areaPath = `M ${points[0].x} ${height - padding} L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L ${points[points.length - 1].x} ${height - padding} Z`;
  svg += `<path d="${areaPath}" fill="url(#areaGrad)"/>`;
  
  // Line
  const linePath = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
  svg += `<path d="${linePath}" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  
  // Points and labels
  points.forEach((point, i) => {
    svg += `<circle cx="${point.x}" cy="${point.y}" r="6" fill="#10B981" stroke="white" stroke-width="2"/>`;
    svg += `<text x="${point.x}" y="${height - padding + 18}" font-size="11" font-weight="500" text-anchor="middle" fill="#374151">${labels[i]}</text>`;
  });
  
  svg += `</svg>`;
  return svg;
};

// Generate SVG Pie Chart with improved styling
const generatePieChartSVG = (labels: string[], values: number[], title: string): string => {
  const width = 550;
  const height = 300;
  const centerX = 180;
  const centerY = height / 2 + 10;
  const radius = 90;
  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];
  
  const total = values.reduce((a, b) => a + b, 0);
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#FAFAFA"/>
    <text x="${width / 2}" y="28" font-size="16" font-weight="bold" text-anchor="middle" fill="#1F2937">${title}</text>`;
  
  let currentAngle = -Math.PI / 2;
  
  labels.forEach((label, i) => {
    const sliceAngle = (values[i] / total) * 2 * Math.PI;
    const endAngle = currentAngle + sliceAngle;
    
    const x1 = centerX + radius * Math.cos(currentAngle);
    const y1 = centerY + radius * Math.sin(currentAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArc = sliceAngle > Math.PI ? 1 : 0;
    svg += `<path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${colors[i % colors.length]}" stroke="white" stroke-width="2"/>`;
    
    currentAngle = endAngle;
  });
  
  // Legend box
  svg += `<rect x="${centerX + 120}" y="50" width="170" height="${labels.length * 28 + 20}" fill="white" stroke="#E5E7EB" stroke-width="1" rx="6"/>`;
  
  // Legend items
  labels.forEach((label, i) => {
    const percentage = ((values[i] / total) * 100).toFixed(1);
    svg += `<rect x="${centerX + 135}" y="${65 + i * 28}" width="16" height="16" fill="${colors[i % colors.length]}" rx="3"/>`;
    svg += `<text x="${centerX + 158}" y="${78 + i * 28}" font-size="10" fill="#374151">${label} (${percentage}%)</text>`;
  });
  
  svg += `</svg>`;
  return svg;
};

// Convert SVG string to PNG image data using canvas
const svgToPNG = async (svgString: string, scale: number = 2): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const tempSvg = new DOMParser().parseFromString(svgString, 'image/svg+xml');
    const svgElement = tempSvg.documentElement;
    const width = parseInt(svgElement.getAttribute('width') || '500');
    const height = parseInt(svgElement.getAttribute('height') || '300');
    
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    ctx?.scale(scale, scale);
    
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      console.error('Failed to load SVG image');
      resolve('');
    };
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    img.src = url;
  });
};

export async function exportCanvasToPDF(
  data: CanvasData,
  metrics: FinancialMetrics,
  projections: YearlyProjection[],
  currency: string = "XAF"
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Create a currency-aware format function
  const fmt = (value: number) => formatNumberForPDF(value, currency);

  // Helper function to add section title
  const addSectionTitle = (title: string) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246);
    doc.text(title, 14, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
  };

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(59, 130, 246);
  doc.text("Business Profitability Canvas", pageWidth / 2, yPos, { align: "center" });
  yPos += 10;

  // Project name
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text(data.projectInfo.name || "Untitled Project", pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  // Currency indicator
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Currency: ${currencySymbols[currency] || currency}`, pageWidth / 2, yPos, { align: "center" });
  yPos += 12;

  // Project Info Section
  addSectionTitle("Project Information");
  doc.setFontSize(10);
  const projectInfo = [
    ["Promoter", data.projectInfo.promoter || "N/A"],
    ["Location", data.projectInfo.location || "N/A"],
    ["Sector", data.projectInfo.sector || "N/A"],
    ["Date", data.projectInfo.date || "N/A"],
  ];
  autoTable(doc, {
    startY: yPos,
    head: [],
    body: projectInfo,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 40 } },
  });
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Equipment Section
  if (data.equipment.length > 0) {
    addSectionTitle("Equipment & Materials");
    autoTable(doc, {
      startY: yPos,
      head: [["Item", "Quantity", "Unit Value", "Lifespan (months)", "Total"]],
      body: data.equipment.map((eq) => [
        eq.name,
        eq.quantity.toString(),
        fmt(eq.unitValue),
        eq.lifespan.toString(),
        fmt(eq.unitValue * eq.quantity),
      ]),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Personnel Section
  if (data.personnel.length > 0) {
    addSectionTitle("Personnel & Salaries");
    autoTable(doc, {
      startY: yPos,
      head: [["Role", "Count", "Monthly Salary", "Total Monthly"]],
      body: data.personnel.map((p) => [
        p.role,
        p.count.toString(),
        fmt(p.monthlySalary),
        fmt(p.monthlySalary * p.count),
      ]),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Products Section
  if (data.products.length > 0) {
    addSectionTitle("Products & Services");
    autoTable(doc, {
      startY: yPos,
      head: [["Product/Service", "Price", "Monthly Qty", "Monthly Revenue"]],
      body: data.products.map((p) => [
        p.name,
        fmt(p.price),
        p.monthlyQuantity.toString(),
        fmt(p.price * p.monthlyQuantity),
      ]),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Activities Section
  if (data.activities.length > 0) {
    addSectionTitle("Operational Activities");
    autoTable(doc, {
      startY: yPos,
      head: [["Activity", "Monthly Count", "Unit Cost", "Monthly Total"]],
      body: data.activities.map((a) => [
        a.name,
        a.monthlyCount.toString(),
        fmt(a.unitValue),
        fmt(a.unitValue * a.monthlyCount),
      ]),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Customers Section
  if (data.customers.length > 0) {
    addSectionTitle("Target Customer Segments");
    autoTable(doc, {
      startY: yPos,
      head: [["Segment", "Monthly Target"]],
      body: data.customers.map((c) => [c.name, fmt(c.monthlyTarget)]),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Other Charges Section
  if (data.otherCharges.length > 0) {
    addSectionTitle("Other Operating Charges");
    autoTable(doc, {
      startY: yPos,
      head: [["Charge", "Monthly Value"]],
      body: data.otherCharges.map((c) => [c.name, fmt(c.monthlyValue)]),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // Raw Materials Section
  if (data.rawMaterials.length > 0) {
    addSectionTitle("Raw Materials");
    autoTable(doc, {
      startY: yPos,
      head: [["Material", "Monthly Value"]],
      body: data.rawMaterials.map((r) => [r.name, fmt(r.monthlyValue)]),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
    });
    yPos = (doc as any).lastAutoTable.finalY + 10;
  }

  // New page for Financial Summary
  doc.addPage();
  yPos = 20;

  // Financial Summary Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(59, 130, 246);
  doc.text("Financial Summary", pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  // Key Metrics
  addSectionTitle("Key Financial Metrics");
  const keyMetrics = [
    ["Total Investment", fmt(metrics.totalInvestment)],
    ["Monthly Revenue", fmt(metrics.monthlyRevenue)],
    ["Monthly Expenses", fmt(metrics.monthlyExpenses)],
    ["Monthly Cash Flow", fmt(metrics.monthlyCashFlow)],
    ["Monthly Depreciation", fmt(metrics.monthlyDepreciation)],
    ["Break-even Period", metrics.breakEvenMonths < 999 ? `${metrics.breakEvenMonths} months` : "Not achievable"],
  ];
  autoTable(doc, {
    startY: yPos,
    head: [],
    body: keyMetrics,
    theme: "plain",
    styles: { fontSize: 11, cellPadding: 3 },
    columnStyles: { 
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { halign: "right" }
    },
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Period Summary
  addSectionTitle("Period Summary");
  autoTable(doc, {
    startY: yPos,
    head: [["Period", "Revenue", "Expenses", "Cash Flow"]],
    body: [
      ["Monthly", fmt(metrics.monthlyRevenue), fmt(metrics.monthlyExpenses), fmt(metrics.monthlyCashFlow)],
      ["Semi-Annual", fmt(metrics.semiAnnualRevenue), fmt(metrics.semiAnnualExpenses), fmt(metrics.semiAnnualCashFlow)],
      ["Annual", fmt(metrics.annualRevenue), fmt(metrics.annualExpenses), fmt(metrics.annualCashFlow)],
    ],
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 10 },
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // 3-Year Projections
  addSectionTitle(`3-Year Financial Projections (Growth Rate: ${data.growthRate}%)`);
  autoTable(doc, {
    startY: yPos,
    head: [["Year", "Revenue", "Expenses", "Profit", "Cumulative Profit", "ROI"]],
    body: projections.map((p) => [
      `Year ${p.year}`,
      fmt(p.revenue),
      fmt(p.expenses),
      fmt(p.profit),
      fmt(p.cumulativeProfit),
      formatPercentage(p.roi),
    ]),
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 10 },
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Add Charts Page
  doc.addPage();
  yPos = 20;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(59, 130, 246);
  doc.text("Financial Charts", pageWidth / 2, yPos, { align: "center" });
  yPos += 15;

  // Chart 1: Revenue vs Expenses Bar Chart
  try {
    const years = projections.map((p) => `Year ${p.year}`);
    const revenues = projections.map((p) => p.revenue);
    const expenses = projections.map((p) => p.expenses);
    
    const barChartSVG = generateBarChartSVG(years, revenues, expenses, "3-Year Revenue vs Expenses", "Revenue", "Expenses", currency);
    const barChartImageData = await svgToPNG(barChartSVG);
    if (barChartImageData) {
      doc.addImage(barChartImageData, "PNG", 5, yPos, 200, 75);
      yPos += 82;
    }
  } catch (error) {
    console.error("Error adding bar chart:", error);
  }

  // Chart 2: Profit Trend Line Chart
  try {
    const years = projections.map((p) => `Year ${p.year}`);
    const profits = projections.map((p) => p.profit);
    
    const lineChartSVG = generateLineChartSVG(years, profits, "Profit Trend Over 3 Years", currency);
    const lineChartImageData = await svgToPNG(lineChartSVG);
    if (lineChartImageData) {
      doc.addImage(lineChartImageData, "PNG", 5, yPos, 200, 68);
      yPos += 75;
    }
  } catch (error) {
    console.error("Error adding line chart:", error);
  }

  // Chart 3: Cost Breakdown Pie Chart
  try {
    const costLabels: string[] = [];
    const costValues: number[] = [];

    if (data.personnel.length > 0) {
      const totalPersonnelCost = data.personnel.reduce((sum, p) => sum + p.monthlySalary * p.count, 0);
      costLabels.push("Personnel");
      costValues.push(totalPersonnelCost);
    }

    if (data.rawMaterials.length > 0) {
      const totalRawMaterials = data.rawMaterials.reduce((sum, r) => sum + r.monthlyValue, 0);
      costLabels.push("Raw Materials");
      costValues.push(totalRawMaterials);
    }

    if (data.activities.length > 0) {
      const totalActivities = data.activities.reduce((sum, a) => sum + a.unitValue * a.monthlyCount, 0);
      costLabels.push("Operations");
      costValues.push(totalActivities);
    }

    if (data.otherCharges.length > 0) {
      const totalOtherCharges = data.otherCharges.reduce((sum, c) => sum + c.monthlyValue, 0);
      costLabels.push("Other Charges");
      costValues.push(totalOtherCharges);
    }

    // Add depreciation
    if (metrics.monthlyDepreciation > 0) {
      costLabels.push("Depreciation");
      costValues.push(metrics.monthlyDepreciation);
    }

    if (costLabels.length > 0) {
      // Check if we need a new page
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      const pieChartSVG = generatePieChartSVG(costLabels, costValues, "Monthly Cost Distribution");
      const pieChartImageData = await svgToPNG(pieChartSVG);
      if (pieChartImageData) {
        doc.addImage(pieChartImageData, "PNG", 5, yPos, 200, 75);
      }
    }
  } catch (error) {
    console.error("Error adding pie chart:", error);
  }

  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} | Musongi Business Profitability Canvas | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `${data.projectInfo.name || "profitability-canvas"}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
