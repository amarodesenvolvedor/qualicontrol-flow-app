
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { styleWorksheetHeader, styleWorksheetData, styleMetadataHeader } from "../utils/excelHelpers";
import { ExcelExportOptions } from "../utils/types";

/**
 * Generate an Excel report from the provided data
 */
export const generateExcelReport = async (reportType: string, data: any[], options?: ExcelExportOptions): Promise<void> => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Get headers from first data item
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  
  // Convert data to array format for excel
  const wsData = [
    headers.map(h => h.charAt(0).toUpperCase() + h.slice(1).replace(/_/g, ' ')), // Format header text
    ...data.map(item => headers.map(header => item[header] || ""))
  ];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Apply enhanced styling
  if (wsData.length > 0) {
    // Define header range
    const headerRange = { 
      s: { c: 0, r: 0 }, 
      e: { c: headers.length - 1, r: 0 } 
    };
    
    // Style header row
    styleWorksheetHeader(ws, headerRange);
    
    // Define data range
    const dataRange = { 
      s: { c: 0, r: 1 }, 
      e: { c: headers.length - 1, r: wsData.length - 1 } 
    };
    
    // Style data rows
    styleWorksheetData(ws, dataRange);
  }
  
  // Format column widths
  const colWidths = headers.map(() => ({ wch: 20 })); // Wider default width
  ws['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, (options?.sheetName || reportType).slice(0, 30));
  
  // Add metadata sheet if requested
  if (options?.includeMetadata !== false) {
    const metadataWs = XLSX.utils.aoa_to_sheet([
      ['Informações do Relatório'],
      ['Tipo de Relatório', reportType],
      ['Data de Geração', format(new Date(), 'dd/MM/yyyy HH:mm')],
      ['Número de Registros', data.length.toString()],
      ['Empresa', options?.companyName || 'Sistema de Gestão de Não Conformidades']
    ]);
    
    // Style metadata sheet header
    styleMetadataHeader(metadataWs, 'A1');
    
    XLSX.utils.book_append_sheet(wb, metadataWs, "Info");
  }
  
  // Generate Excel file
  XLSX.writeFile(wb, `${reportType.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.xlsx`);
};
