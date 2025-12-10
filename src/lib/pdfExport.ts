import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CanvasData, FinancialMetrics, YearlyProjection } from "@/types/canvas";
import { formatCurrency, formatNumber, formatPercentage } from "./calculations";

// Helper function to clean and preserve currency formatting for PDF
const formatCurrencyForPDF = (value: string): string => {
  // Replace "/" with space for better readability (1/250/000 FCFA -> 1 250 000 FCFA)
  return value.replace(/\//g, ' ');
};

// Convert SVG string to PNG image data using canvas
const svgToPNG = async (svgString: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
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

// Generate SVG Bar Chart
const generateBarChartSVG = (labels: string[], dataset1: number[], dataset2: number[], title: string, label1: string, label2: string): string => {
  const width = 500;
  const height = 300;
  const padding = 50;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxValue = Math.max(...dataset1, ...dataset2);
  const barGroupWidth = chartWidth / labels.length;
  const barWidth = barGroupWidth / 2.5;
  
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="white"/>
    <text x="${width / 2}" y="30" font-size="16" font-weight="bold" text-anchor="middle">${title}</text>`;
  
  // Y-axis
  svg += `<line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" stroke="black" stroke-width="2"/>`;
  
  // X-axis
  svg += `<line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="black" stroke-width="2"/>`;
  
  // Bars
  labels.forEach((label, i) => {
    const x = padding + (i * barGroupWidth);
    const y1 = height - padding - (dataset1[i] / maxValue) * chartHeight;
    const y2 = height - padding - (dataset2[i] / maxValue) * chartHeight;
    
    svg += `<rect x="${x}" y="${y1}" width="${barWidth}" height="${height - padding - y1}" fill="#3B82F6"/>`;
    svg += `<rect x="${x + barWidth + 5}" y="${y2}" width="${barWidth}" height="${height - padding - y2}" fill="#EF4444"/>`;
    svg += `<text x="${x + barGroupWidth / 2}" y="${height - padding + 20}" font-size="10" text-anchor="middle">${label}</text>`;
  });
  
  // Legend
  svg += `<rect x="${width - 150}" y="50" width="140" height="60" fill="white" stroke="black" stroke-width="1"/>`;
  svg += `<rect x="${width - 140}" y="60" width="15" height="15" fill="#3B82F6"/>`;
  svg += `<text x="${width - 120}" y="72" font-size="10">${label1}</text>`;
  svg += `<rect x="${width - 140}" y="85" width="15" height="15" fill="#EF4444"/>`;
  svg += `<text x="${width - 120}" y="97" font-size="10">${label2}</text>`;
  
  svg += `</svg>`;
  return svg;
};

// Generate SVG Pie Chart
const generatePieChartSVG = (labels: string[], values: number[], title: string): string => {
  const width = 500;
  const height = 300;
  const centerX = width / 3;
  const centerY = height / 2;
  const radius = 80;
  const colors = ["#EF4444", "#F59E0B", "#EC4899", "#8B5CF6", "#3B82F6", "#10B981"];
  
  const total = values.reduce((a, b) => a + b, 0);
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="white"/>
    <text x="${width / 2}" y="30" font-size="16" font-weight="bold" text-anchor="middle">${title}</text>`;
  
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
    
    // Legend
    svg += `<rect x="${centerX + 120}" y="${50 + i * 20}" width="15" height="15" fill="${colors[i % colors.length]}"/>`;
    svg += `<text x="${centerX + 140}" y="${62 + i * 20}" font-size="9">${label}</text>`;
    
    currentAngle = endAngle;
  });
  
  svg += `</svg>`;
  return svg;
};

export async function exportCanvasToPDF(
  data: CanvasData,
  metrics: FinancialMetrics,
  projections: YearlyProjection[]
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

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
  yPos += 15;

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
        formatCurrencyForPDF(formatCurrency(eq.unitValue)),
        eq.lifespan.toString(),
        formatCurrencyForPDF(formatCurrency(eq.unitValue * eq.quantity)),
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
        formatCurrencyForPDF(formatCurrency(p.monthlySalary)),
        formatCurrencyForPDF(formatCurrency(p.monthlySalary * p.count)),
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
        formatCurrencyForPDF(formatCurrency(p.price)),
        p.monthlyQuantity.toString(),
        formatCurrencyForPDF(formatCurrency(p.price * p.monthlyQuantity)),
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
        formatCurrencyForPDF(formatCurrency(a.unitValue)),
        formatCurrencyForPDF(formatCurrency(a.unitValue * a.monthlyCount)),
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
      body: data.customers.map((c) => [c.name, formatNumber(c.monthlyTarget)]),
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
      body: data.otherCharges.map((c) => [c.name, formatCurrencyForPDF(formatCurrency(c.monthlyValue))]),
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
      body: data.rawMaterials.map((r) => [r.name, formatCurrencyForPDF(formatCurrency(r.monthlyValue))]),
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
    ["Total Investment", formatCurrencyForPDF(formatCurrency(metrics.totalInvestment))],
    ["Monthly Revenue", formatCurrencyForPDF(formatCurrency(metrics.monthlyRevenue))],
    ["Monthly Expenses", formatCurrencyForPDF(formatCurrency(metrics.monthlyExpenses))],
    ["Monthly Cash Flow", formatCurrencyForPDF(formatCurrency(metrics.monthlyCashFlow))],
    ["Monthly Depreciation", formatCurrencyForPDF(formatCurrency(metrics.monthlyDepreciation))],
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
      ["Monthly", formatCurrencyForPDF(formatCurrency(metrics.monthlyRevenue)), formatCurrencyForPDF(formatCurrency(metrics.monthlyExpenses)), formatCurrencyForPDF(formatCurrency(metrics.monthlyCashFlow))],
      ["Semi-Annual", formatCurrencyForPDF(formatCurrency(metrics.semiAnnualRevenue)), formatCurrencyForPDF(formatCurrency(metrics.semiAnnualExpenses)), formatCurrencyForPDF(formatCurrency(metrics.semiAnnualCashFlow))],
      ["Annual", formatCurrencyForPDF(formatCurrency(metrics.annualRevenue)), formatCurrencyForPDF(formatCurrency(metrics.annualExpenses)), formatCurrencyForPDF(formatCurrency(metrics.annualCashFlow))],
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
      formatCurrencyForPDF(formatCurrency(p.revenue)),
      formatCurrencyForPDF(formatCurrency(p.expenses)),
      formatCurrencyForPDF(formatCurrency(p.profit)),
      formatCurrencyForPDF(formatCurrency(p.cumulativeProfit)),
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
  yPos += 20;

  // Chart 1: Revenue vs Expenses
  try {
    const years = projections.map((p) => `Y${p.year}`);
    const revenues = projections.map((p) => p.revenue);
    const expenses = projections.map((p) => p.expenses);
    
    const barChartSVG = generateBarChartSVG(years, revenues, expenses, "3-Year Revenue vs Expenses", "Revenue", "Expenses");
    const barChartImageData = await svgToPNG(barChartSVG);
    if (barChartImageData) {
      doc.addImage(barChartImageData, "PNG", 10, yPos, 190, 80);
      yPos += 90;
    }
  } catch (error) {
    console.error("Error adding bar chart:", error);
  }

  // Chart 2: Cost Breakdown
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }

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
      costLabels.push("Other");
      costValues.push(totalOtherCharges);
    }

    if (costLabels.length > 0) {
      const pieChartSVG = generatePieChartSVG(costLabels, costValues, "Monthly Cost Distribution");
      const pieChartImageData = await svgToPNG(pieChartSVG);
      if (pieChartImageData) {
        doc.addImage(pieChartImageData, "PNG", 10, yPos, 190, 100);
      }
    }
  } catch (error) {
    console.error("Error adding pie chart:", error);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} | Profitability Canvas`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  // Save the PDF
  const fileName = `${data.projectInfo.name || "profitability-canvas"}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
