import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CanvasData, FinancialMetrics, YearlyProjection } from "@/types/canvas";
import { formatCurrency, formatNumber, formatPercentage } from "./calculations";

export function exportCanvasToPDF(
  data: CanvasData,
  metrics: FinancialMetrics,
  projections: YearlyProjection[]
): void {
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
    doc.setTextColor(59, 130, 246); // Primary blue color
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
        formatCurrency(eq.unitValue),
        eq.lifespan.toString(),
        formatCurrency(eq.unitValue * eq.quantity),
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
        formatCurrency(p.monthlySalary),
        formatCurrency(p.monthlySalary * p.count),
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
        formatCurrency(p.price),
        p.monthlyQuantity.toString(),
        formatCurrency(p.price * p.monthlyQuantity),
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
        formatCurrency(a.unitValue),
        formatCurrency(a.unitValue * a.monthlyCount),
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
      body: data.otherCharges.map((c) => [c.name, formatCurrency(c.monthlyValue)]),
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
      body: data.rawMaterials.map((r) => [r.name, formatCurrency(r.monthlyValue)]),
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
    ["Total Investment", formatCurrency(metrics.totalInvestment)],
    ["Monthly Revenue", formatCurrency(metrics.monthlyRevenue)],
    ["Monthly Expenses", formatCurrency(metrics.monthlyExpenses)],
    ["Monthly Cash Flow", formatCurrency(metrics.monthlyCashFlow)],
    ["Monthly Depreciation", formatCurrency(metrics.monthlyDepreciation)],
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
      ["Monthly", formatCurrency(metrics.monthlyRevenue), formatCurrency(metrics.monthlyExpenses), formatCurrency(metrics.monthlyCashFlow)],
      ["Semi-Annual", formatCurrency(metrics.semiAnnualRevenue), formatCurrency(metrics.semiAnnualExpenses), formatCurrency(metrics.semiAnnualCashFlow)],
      ["Annual", formatCurrency(metrics.annualRevenue), formatCurrency(metrics.annualExpenses), formatCurrency(metrics.annualCashFlow)],
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
      formatCurrency(p.revenue),
      formatCurrency(p.expenses),
      formatCurrency(p.profit),
      formatCurrency(p.cumulativeProfit),
      formatPercentage(p.roi),
    ]),
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 10 },
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

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
