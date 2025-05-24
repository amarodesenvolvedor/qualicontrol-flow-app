
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../utils/types";
import { addHeaderToPDF, addFooterToPDF } from "../../../utils/pdfHelpers";
import { renderDetailedTable } from "./table/detailedTableRenderer";
import { renderSimpleTable } from "./table/simpleTableRenderer";

/**
 * Add content for table format (larger datasets)
 */
export function addTableContent(
  doc: jsPDF, 
  data: any[], 
  y: number, 
  pageWidth: number, 
  lineHeight: number,
  margin: number,
  options?: PDFExportOptions
): number {
  if (!data || data.length === 0) {
    return y;
  }
  
  // Don't add header on first page since we're starting immediately
  const currentReportType = options?.reportType || "Relatório";
  
  // Configure table column settings
  const safeMargin = Math.max(margin, 20);
  
  // Para relatórios completos, usar renderizador detalhado
  if (currentReportType === "Não Conformidades Completo" || 
      currentReportType === "Ações Corretivas") {
    return renderDetailedTable(doc, data, y, pageWidth, lineHeight, safeMargin, options);
  } else {
    return renderSimpleTable(doc, data, y, pageWidth, lineHeight, safeMargin, options);
  }
}
