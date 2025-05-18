import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { ReportMetadata } from "../utils/exportTypes";

/**
 * Export report data to Excel format with enhanced styling
 */
export const exportToExcel = (
  { title }: ReportMetadata,
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
