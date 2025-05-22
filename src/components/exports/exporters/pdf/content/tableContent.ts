
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
  
  // Determine optimal table orientation - always use landscape for non-conformance full reports
  const currentReportType = options?.reportType || "Relatório";
  const isLandscape = options?.forceLandscape || 
                      currentReportType === "Não Conformidades Completo" ||
                      (data.length > 5 || Object.keys(data[0]).length > 5);
  
  if (isLandscape && doc.internal.pageSize.getWidth() < doc.internal.pageSize.getHeight()) {
    // Switch to landscape if not already
    if (options?.showFooter !== false) {
      addFooterToPDF(doc, currentReportType, doc.getNumberOfPages(), doc.getNumberOfPages());
    }
    doc.addPage('landscape');
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, currentReportType);
    }
    y = 40;
    pageWidth = doc.internal.pageSize.getWidth();
  }
  
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
