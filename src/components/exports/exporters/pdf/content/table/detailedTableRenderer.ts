
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../../utils/types";
import { calculateColumnWidths } from "../../utils/columnUtils";
import { renderTableHeaders } from "./tableHeaders";
import { renderTableRow } from "./tableRows";
import { handleTablePagination } from "./paginationUtils";

/**
 * Render a detailed table for full reports
 * Improved version with better column width calculation
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
  // Increased initial Y position for better page usage
  if (y < 45) y = 45;
  
  // Specific fields to show in the main table - exclude unnecessary fields
  const priorityHeaders = [
    'codigo', 'titulo', 'departamento', 'requisito_iso', 'status', 
    'responsavel', 'data_ocorrencia'
  ];

  // Extract headers from data
  const headers = Object.keys(data[0]);
  
  // Filter to show only columns defined in priority and exclude 'id' field
  let visibleHeaders = headers.filter(header => 
    priorityHeaders.includes(header) && header !== 'id'
  );
  
  // Sort headers in the defined sequence
  visibleHeaders = priorityHeaders.filter(header => visibleHeaders.includes(header));
  
  // Calculate column widths based on content - improved algorithm
  const tableWidth = pageWidth - (margin * 2);
  const colWidths = calculateColumnWidths(visibleHeaders, tableWidth, doc, data);
  
  // Increase header height for better visualization
  const headerHeight = lineHeight + 5;
  renderTableHeaders(doc, visibleHeaders, colWidths, margin, y, headerHeight);
  
  y += headerHeight + 2;
  
  // Setup text style for data rows
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Calculate page height for easier reference
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Show ALL rows with pagination
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // Check if we need a new page
    y = handleTablePagination(
      doc, 
      y, 
      pageHeight, 
      visibleHeaders, 
      colWidths, 
      margin, 
      lineHeight, 
      options, 
      true
    );
    
    // Render the row and get its height
    const rowHeight = renderTableRow(
      doc,
      item,
      visibleHeaders,
      colWidths,
      margin,
      y,
      lineHeight,
      i % 2 === 0
    );
    
    y += rowHeight;
  }
  
  return y;
}
