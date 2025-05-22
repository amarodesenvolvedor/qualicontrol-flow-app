
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../../utils/types";
import { calculateColumnWidths } from "../../utils/columnUtils";
import { renderSimpleTableRow } from "./tableRows";
import { handleSimpleTablePagination } from "./paginationUtils";

/**
 * Render a simplified table for basic reports
 */
export function renderSimpleTable(
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
  
  // Extract headers from data
  const headers = Object.keys(data[0]);
  
  // Primeiro priorizamos os campos mais importantes, excluindo explicitamente 'id'
  const priorityHeaders = [
    'codigo', 'titulo', 'departamento', 'requisito_iso', 'status', 
    'responsavel', 'data_ocorrencia'
  ];
  
  let visibleHeaders = headers.filter(header => 
    priorityHeaders.includes(header) && header !== 'id'
  );
  
  // Se há poucos headers prioritários, incluímos outros disponíveis exceto 'id'
  if (visibleHeaders.length < 4) {
    visibleHeaders = headers.filter(header => header !== 'id');
  }
  
  // Calculate column widths based on content - improved algorithm
  const tableWidth = pageWidth - (margin * 2);
  const colWidths = calculateColumnWidths(visibleHeaders, tableWidth, doc, data);
  
  // Draw table header with brand color background
  doc.setFillColor(41, 65, 148);
  doc.rect(margin, y, tableWidth, lineHeight + 2, 'F');
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10); // Reduzido para melhor ajuste
  doc.setFont("helvetica", "bold");
  
  // Draw header cells with centered text
  let xPos = margin + 3;
  visibleHeaders.forEach((header, i) => {
    const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    // Limitar o texto do cabeçalho
    const truncatedHeader = formattedHeader.length > 15 ? 
                          formattedHeader.substring(0, 15) + '...' : 
                          formattedHeader;
    
    // Centralizar o texto do cabeçalho
    const headerWidth = colWidths[i];
    const textWidth = doc.getTextWidth(truncatedHeader);
    const centeredX = xPos + (headerWidth - textWidth) / 2;
    
    doc.text(truncatedHeader, centeredX, y + 7);
    xPos += headerWidth;
  });
  
  y += lineHeight + 4;
  
  // Draw data rows with improved styling
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Calculate page height for easier reference
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Show ALL rows with pagination
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // Check if we need a new page
    y = handleSimpleTablePagination(
      doc, 
      y, 
      pageHeight, 
      visibleHeaders, 
      colWidths, 
      margin, 
      lineHeight, 
      options, 
      options?.forceLandscape || false
    );
    
    // Render the row and get its height
    const rowHeight = renderSimpleTableRow(
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
