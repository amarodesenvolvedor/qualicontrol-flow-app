
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../../utils/types";
import { calculateColumnWidths } from "../../utils/columnUtils";
import { renderTableHeaders } from "./tableHeaders";
import { renderTableRow } from "./tableRows";
import { handleTablePagination } from "./paginationUtils";

/**
 * Render a detailed table for full reports
 * Enhanced version with strict margin compliance and improved text handling
 */
export function renderDetailedTable(
  doc: jsPDF,
  data: any[],
  y: number,
  pageWidth: number,
  lineHeight: number,
  margin: number,
  options?: PDFExportOptions
): number {
  // Ensure minimum margin of 25px for strict compliance
  const safeMargin = Math.max(margin, 25);
  
  // Start position ensuring adequate space from top
  if (y < 45) y = 45;
  
  // Define priority headers excluding requisito_iso and id
  const priorityHeaders = [
    'codigo', 'titulo', 'departamento', 'status', 
    'responsavel', 'data_ocorrencia'
  ];

  // Extract headers from data
  const headers = Object.keys(data[0]);
  
  // Filter headers and explicitly exclude 'id' and 'requisito_iso'
  let visibleHeaders = headers.filter(header => 
    priorityHeaders.includes(header) && 
    header !== 'id' && 
    header !== 'requisito_iso'
  );
  
  // Sort headers in the defined sequence
  visibleHeaders = priorityHeaders.filter(header => visibleHeaders.includes(header));
  
  // Calculate available width with strict margin compliance
  const tableWidth = pageWidth - (safeMargin * 2);
  const colWidths = calculateColumnWidths(visibleHeaders, tableWidth, doc, data);
  
  // Verify total width doesn't exceed available space
  const totalColWidth = colWidths.reduce((sum, width) => sum + width, 0);
  if (totalColWidth > tableWidth) {
    console.warn(`Table width (${totalColWidth}) exceeds available space (${tableWidth})`);
    // Apply additional scaling to ensure compliance
    const emergencyScale = tableWidth / totalColWidth;
    colWidths.forEach((width, index) => {
      colWidths[index] = width * emergencyScale;
    });
  }
  
  // Render table headers with increased height for better readability
  const headerHeight = lineHeight + 8;
  renderTableHeaders(doc, visibleHeaders, colWidths, safeMargin, y, headerHeight);
  
  y += headerHeight + 2;
  
  // Setup text style for data rows
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Calculate page height for pagination reference
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Render all rows with proper pagination
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // Check if we need a new page before rendering the row
    // Estimate row height to determine if it fits
    const estimatedRowHeight = 20; // Conservative estimate
    if (y + estimatedRowHeight > pageHeight - 40) {
      y = handleTablePagination(
        doc, 
        y, 
        pageHeight, 
        visibleHeaders, 
        colWidths, 
        safeMargin, 
        lineHeight, 
        options, 
        true
      );
    }
    
    // Render the row and get its actual height
    const rowHeight = renderTableRow(
      doc,
      item,
      visibleHeaders,
      colWidths,
      safeMargin,
      y,
      lineHeight,
      i % 2 === 0
    );
    
    y += rowHeight;
  }
  
  return y;
}
