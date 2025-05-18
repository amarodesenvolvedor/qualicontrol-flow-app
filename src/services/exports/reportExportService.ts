import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

type ExportFormat = "pdf" | "excel";

/**
 * Process non-conformance data based on report type
 */
export const processReportData = (title: string, nonConformances: any[]) => {
  let reportData: Record<string, any> = {};
  
  if (title.includes("por Departamento")) {
    reportData = nonConformances.reduce((acc: Record<string, number>, nc) => {
      const deptName = nc.department?.name || 'Não especificado';
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {});
  } 
  else if (title.includes("por Tipo")) {
    reportData = nonConformances.reduce((acc: Record<string, number>, nc) => {
      // Supondo que o tipo está na descrição, ajuste conforme necessário
      const type = nc.description?.includes("Processo") ? "Processo" : 
                  nc.description?.includes("Produto") ? "Produto" : "Outros";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }
  else if (title.includes("Status")) {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'in-progress': 'Em Andamento',
      'resolved': 'Resolvido',
      'closed': 'Encerrado',
    };
    
    reportData = nonConformances.reduce((acc: Record<string, number>, nc) => {
      const status = statusMap[nc.status] || nc.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }
  else if (title.includes("Tempo de Resolução")) {
    const resolutionTimes = nonConformances
      .filter(nc => nc.completion_date && nc.occurrence_date)
      .map(nc => {
        const start = new Date(nc.occurrence_date);
        const end = new Date(nc.completion_date);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { id: nc.id, code: nc.code, days: diffDays };
      });
      
    reportData = resolutionTimes.reduce((acc: Record<string, any[]>, item) => {
      const rangeKey = item.days <= 7 ? '0-7 dias' :
                     item.days <= 14 ? '8-14 dias' :
                     item.days <= 30 ? '15-30 dias' : 'Mais de 30 dias';
      
      if (!acc[rangeKey]) acc[rangeKey] = [];
      acc[rangeKey].push({ code: item.code, days: item.days });
      return acc;
    }, {});
  }
  else if (title.includes("por Gravidade")) {
    reportData = nonConformances.reduce((acc: Record<string, number>, nc) => {
      // Aqui estamos simulando a gravidade com base no título
      const hasUrgentKeywords = (nc.title || "").toLowerCase().includes("urgente") || 
                              (nc.title || "").toLowerCase().includes("crítico");
      const severity = hasUrgentKeywords ? "Crítico" : 
                      nc.status === "resolved" ? "Normal" : "Moderado";
      
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});
  }

  return reportData;
};

/**
 * Export report data to PDF format with enhanced visual layout
 */
export const exportToPDF = (
  title: string,
  description: string,
  type: string, 
  updatedAt: string,
  reportData: Record<string, any>
): void => {
  // Create a PDF document
  const doc = new jsPDF();
  
  // Define corporate colors
  const primaryColor = [41, 65, 148]; // Corporate blue RGB
  const secondaryColor = [100, 100, 100]; // Gray for text
  const lightBackground = [245, 245, 250]; // Light background for sections
  
  // Add stylized header
  addHeaderToPDF(doc, "Sistema de Gestão de Não Conformidades");
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 30; // Start position after header
  
  // Title section with color background
  doc.setFillColor(...primaryColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  
  // Draw title background
  doc.rect(margin - 10, y - 5, pageWidth - (margin - 10) * 2, 12, 'F');
  doc.text(title, pageWidth / 2, y, { align: 'center' });
  y += 20;
  
  // Report metadata section
  doc.setFillColor(...lightBackground);
  doc.rect(margin - 10, y - 5, pageWidth - (margin - 10) * 2, 40, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin - 10, y - 5, pageWidth - (margin - 10) * 2, 40, 'S');
  
  doc.setTextColor(...secondaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Tipo: ${type}`, margin, y);
  y += 10;
  
  doc.text(`Atualizado em: ${updatedAt}`, margin, y);
  y += 10;
  
  doc.text("Descrição:", margin, y);
  y += 8;
  
  // Description text
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const descriptionLines = doc.splitTextToSize(description, pageWidth - (margin * 2));
  doc.text(descriptionLines, margin, y);
  y += descriptionLines.length * 6 + 10;
  
  // Report data section header
  doc.setFillColor(...primaryColor);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.rect(margin - 10, y - 5, pageWidth - (margin - 10) * 2, 10, 'F');
  doc.text("Dados do Relatório", pageWidth / 2, y, { align: 'center' });
  y += 15;
  
  // Report data content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Different display formats based on data type
  if (typeof Object.values(reportData)[0] === 'number') {
    // Simple key-value pairs
    let alternateRow = false;
    Object.entries(reportData).forEach(([key, value], index) => {
      // Alternating row colors
      if (alternateRow) {
        doc.setFillColor(...lightBackground);
        doc.rect(margin - 5, y - 4, pageWidth - (margin - 5) * 2, 8, 'F');
      }
      alternateRow = !alternateRow;
      
      doc.text(key, margin, y);
      doc.text(value.toString(), pageWidth - margin - 20, y, { align: 'right' });
      y += 8;
      
      if (y > pageHeight - 40) {
        doc.addPage();
        addHeaderToPDF(doc, "Sistema de Gestão de Não Conformidades");
        y = 40;
      }
    });
  } else if (Array.isArray(Object.values(reportData)[0])) {
    // Handle array data with categories
    Object.entries(reportData).forEach(([category, items]) => {
      // Category header
      doc.setFont("helvetica", "bold");
      doc.text(category, margin, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      
      // Display item count
      if (Array.isArray(items)) {
        doc.text(`Total: ${items.length} item(s)`, margin + 10, y);
        y += 5;
        
        // Show first 5 items as sample
        if (items.length > 0) {
          doc.setFillColor(...lightBackground);
          doc.rect(margin - 5, y - 4, pageWidth - (margin - 5) * 2, items.length * 8 + 10, 'F');
          doc.setDrawColor(200, 200, 200);
          doc.rect(margin - 5, y - 4, pageWidth - (margin - 5) * 2, items.length * 8 + 10, 'S');
          y += 5;
          
          // Display table headers if items have properties
          if (typeof items[0] === 'object') {
            const keys = Object.keys(items[0]).slice(0, 3); // Limit to 3 columns
            
            doc.setFont("helvetica", "bold");
            keys.forEach((key, index) => {
              doc.text(key.charAt(0).toUpperCase() + key.slice(1), margin + (index * 60), y);
            });
            y += 8;
            doc.setFont("helvetica", "normal");
            
            // Display rows (max 5)
            const maxItems = Math.min(5, items.length);
            for (let i = 0; i < maxItems; i++) {
              keys.forEach((key, index) => {
                const value = items[i][key]?.toString() || 'N/A';
                doc.text(value.substring(0, 25), margin + (index * 60), y);
              });
              y += 8;
              
              if (y > pageHeight - 40) {
                doc.addPage();
                addHeaderToPDF(doc, "Sistema de Gestão de Não Conformidades");
                y = 40;
              }
            }
            
            // Indicate if there are more items
            if (items.length > maxItems) {
              doc.text(`... e mais ${items.length - maxItems} item(s)`, margin, y);
              y += 10;
            }
          }
        }
      }
      
      y += 10;
      
      if (y > pageHeight - 40) {
        doc.addPage();
        addHeaderToPDF(doc, "Sistema de Gestão de Não Conformidades");
        y = 40;
      }
    });
  } else {
    // Complex data structure
    doc.text("Dados completos disponíveis no formato Excel", margin, y);
    y += 10;
  }
  
  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooterToPDF(doc, title, i, pageCount);
  }
  
  // Save the PDF
  const filename = `${title.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}`;
  doc.save(`${filename}.pdf`);
};

/**
 * Export report data to Excel format with enhanced styling
 */
export const exportToExcel = (
  title: string,
  reportData: Record<string, any>
): void => {
  // Create Excel workbook
  const wb = XLSX.utils.book_new();
  
  // Prepare data for Excel based on data type
  let wsData: any[] = [];
  let detailSheets: Record<string, any[][]> = {};
  
  if (typeof Object.values(reportData)[0] === 'number') {
    // Simple key-value pairs
    wsData = [
      ["Categoria", "Quantidade"],
      ...Object.entries(reportData).map(([key, value]) => [key, value])
    ];
  } 
  else if (Array.isArray(Object.values(reportData)[0])) {
    // Data with arrays
    wsData = [["Categoria", "Quantidade de Itens"]];
    
    // Add entries for each category
    Object.entries(reportData).forEach(([key, items]) => {
      if (Array.isArray(items)) {
        wsData.push([key, items.length]);
        
        // Prepare detail sheets for each category
        if (items.length > 0 && typeof items[0] === 'object') {
          const keys = Object.keys(items[0]);
          detailSheets[key] = [
            keys.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
            ...items.map(item => keys.map(k => item[k]?.toString() || 'N/A'))
          ];
        }
      }
    });
  }
  else {
    // Other types of data, create a generic version
    wsData = [
      ["Dados do Relatório"],
      ["Título", title],
      ["Detalhes:"]
    ];
    
    // Add entries for all data, even if complex
    Object.entries(reportData).forEach(([key, value]) => {
      wsData.push([key, JSON.stringify(value)]);
    });
  }
  
  // Create main worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Apply header styling
  if (wsData.length > 0) {
    // Style header row (blue background, white text)
    const headerRange = { s: { c: 0, r: 0 }, e: { c: wsData[0].length - 1, r: 0 } };
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cell]) continue;
      if (!ws[cell].s) ws[cell].s = {};
      ws[cell].s.font = { bold: true, color: { rgb: "FFFFFF" } };
      ws[cell].s.fill = { fgColor: { rgb: "293594" } }; // Corporate blue
      ws[cell].s.alignment = { horizontal: "center" };
    }
    
    // Add borders to all cells
    for (let R = 0; R < wsData.length; ++R) {
      for (let C = 0; C < wsData[R].length; ++C) {
        const cell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell]) continue;
        if (!ws[cell].s) ws[cell].s = {};
        ws[cell].s.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        };
        
        // Alternate row coloring
        if (R > 0 && R % 2 === 1) {
          ws[cell].s.fill = { fgColor: { rgb: "F5F5FA" } }; // Light background
        }
      }
    }
  }
  
  // Set column widths
  const colWidths = wsData[0]?.map(() => ({ wch: 20 })) || []; // Default width
  ws['!cols'] = colWidths;
  
  // Add main worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Visão Geral");
  
  // Add detail sheets
  Object.entries(detailSheets).forEach(([sheetName, sheetData]) => {
    if (sheetData.length > 1) { // Only add if there's data (header + at least one row)
      const detailWs = XLSX.utils.aoa_to_sheet(sheetData);
      
      // Style header row
      const headerRange = { s: { c: 0, r: 0 }, e: { c: sheetData[0].length - 1, r: 0 } };
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cell = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!detailWs[cell]) continue;
        if (!detailWs[cell].s) detailWs[cell].s = {};
        detailWs[cell].s.font = { bold: true, color: { rgb: "FFFFFF" } };
        detailWs[cell].s.fill = { fgColor: { rgb: "293594" } }; // Corporate blue
      }
      
      // Add borders and alternate row coloring
      for (let R = 0; R < sheetData.length; ++R) {
        for (let C = 0; C < sheetData[R].length; ++C) {
          const cell = XLSX.utils.encode_cell({ r: R, c: C });
          if (!detailWs[cell]) continue;
          if (!detailWs[cell].s) detailWs[cell].s = {};
          detailWs[cell].s.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          };
          
          if (R > 0 && R % 2 === 1) {
            detailWs[cell].s.fill = { fgColor: { rgb: "F5F5FA" } }; // Light background
          }
        }
      }
      
      // Set column widths for detail sheet
      const detailColWidths = sheetData[0]?.map(() => ({ wch: 18 })) || []; // Default width
      detailWs['!cols'] = detailColWidths;
      
      // Add to workbook
      XLSX.utils.book_append_sheet(wb, detailWs, sheetName.substring(0, 30));
    }
  });
  
  // Create metadata sheet with company information
  const metadataWs = XLSX.utils.aoa_to_sheet([
    ["Informações do Relatório"],
    ["Título", title],
    ["Data de Geração", format(new Date(), "dd/MM/yyyy HH:mm")],
    ["Empresa", "Sistema de Gestão de Não Conformidades"],
    ["Tipo", "Relatório Analítico"],
    ["Registros", Object.values(reportData).flat().length.toString()]
  ]);
  
  // Apply styling to metadata sheet
  const metadataHeaderCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
  if (metadataWs[metadataHeaderCell]) {
    if (!metadataWs[metadataHeaderCell].s) metadataWs[metadataHeaderCell].s = {};
    metadataWs[metadataHeaderCell].s.font = { bold: true, color: { rgb: "FFFFFF" } };
    metadataWs[metadataHeaderCell].s.fill = { fgColor: { rgb: "293594" } }; // Corporate blue
  }
  
  // Add metadata sheet to workbook
  XLSX.utils.book_append_sheet(wb, metadataWs, "Info");
  
  // Generate Excel file
  const filename = `${title.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}`;
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Function to add header to PDF
 */
function addHeaderToPDF(doc: jsPDF, companyName: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Draw a header bar
  doc.setFillColor(41, 65, 148); // Corporate blue
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  // Add title in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(companyName, 10, 13);
  
  // Add date in header
  const today = format(new Date(), "dd/MM/yyyy");
  doc.setFontSize(10);
  doc.text(`Emitido em: ${today}`, pageWidth - 15, 13, { align: "right" });
  
  // Add separator line below header
  doc.setDrawColor(200, 200, 200);
  doc.line(10, 22, pageWidth - 10, 22);
}

/**
 * Function to add footer to PDF
 */
function addFooterToPDF(doc: jsPDF, reportTitle: string, currentPage: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add separator line above footer
  doc.setDrawColor(200, 200, 200);
  doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
  
  // Add footer text
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Relatório: ${reportTitle}`, 10, pageHeight - 10);
  
  // Add page number
  doc.text(`Página ${currentPage} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" });
}

/**
 * Handle the report export process
 */
export const handleReportExport = async (
  format: ExportFormat, 
  title: string, 
  description: string,
  type: string,
  updatedAt: string,
  nonConformances: any[]
): Promise<void> => {
  try {
    // Replacing toast.success with standard toast call
    toast({
      title: "Iniciando download",
      description: `${title} em formato ${format.toUpperCase()}`
    });
    
    // Process data based on report type
    const reportData = processReportData(title, nonConformances);
    
    // Export to the requested format
    if (format === "pdf") {
      exportToPDF(title, description, type, updatedAt, reportData);
    } else {
      exportToExcel(title, reportData);
    }
    
    // Replacing toast.success with standard toast call
    toast({
      title: "Download concluído",
      description: `${title} baixado com sucesso!`
    });
  } catch (error) {
    console.error("Error generating file:", error);
    // Replacing toast.error with standard toast call with variant
    toast({
      variant: "destructive",
      title: "Erro ao gerar arquivo",
      description: `Não foi possível gerar o arquivo ${format.toUpperCase()}.`
    });
  }
};
