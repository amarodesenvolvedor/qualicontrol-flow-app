
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../../utils/types";
import { calculateColumnWidths } from "../../utils/columnUtils";
import { renderTableRow } from "./tableRows";
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
  // Ensure strict margin compliance - use 20mm margins for A4 portrait
  const safeMargin = 20; // 20mm margins for proper A4 formatting
  
  // Start immediately after the title section without unnecessary spacing
  if (y < 50) y = 50;
  
  // Extract headers from data
  const headers = Object.keys(data[0]);
  
  // Priority headers for better display
  const priorityHeaders = [
    'codigo', 'titulo', 'departamento', 'status', 
    'responsavel', 'data_ocorrencia'
  ];
  
  // Map field names to ensure proper data extraction
  const fieldMapping: Record<string, string[]> = {
    'codigo': ['codigo', 'code'],
    'titulo': ['titulo', 'title'],
    'departamento': ['departamento', 'department'],
    'status': ['status'],
    'responsavel': ['responsavel', 'responsible_name'],
    'data_ocorrencia': ['data_ocorrencia', 'occurrence_date']
  };
  
  // Find the best matching headers from available data
  let visibleHeaders: string[] = [];
  priorityHeaders.forEach(priorityField => {
    const possibleFields = fieldMapping[priorityField] || [priorityField];
    const matchingField = possibleFields.find(field => headers.includes(field));
    if (matchingField) {
      visibleHeaders.push(matchingField);
    }
  });
  
  // If no priority headers found, use all available headers except 'id'
  if (visibleHeaders.length < 3) {
    visibleHeaders = headers.filter(header => header !== 'id');
  }
  
  // Calculate available table width with strict margin compliance
  const tableWidth = pageWidth - (safeMargin * 2); // Total usable width
  console.log(`Table width calculation: pageWidth=${pageWidth}, margins=${safeMargin}, tableWidth=${tableWidth}`);
  
  // Calculate column widths with improved distribution
  const colWidths = calculateColumnWidths(visibleHeaders, tableWidth, doc, data);
  
  // Verify and adjust column widths to ensure they fit perfectly
  const totalColWidth = colWidths.reduce((sum, width) => sum + width, 0);
  if (totalColWidth > tableWidth) {
    console.warn(`Adjusting column widths: ${totalColWidth} > ${tableWidth}`);
    const scaleFactor = (tableWidth * 0.98) / totalColWidth; // 98% to ensure safety
    colWidths.forEach((width, index) => {
      colWidths[index] = width * scaleFactor;
    });
  }
  
  // Log final column configuration
  console.log('Final column configuration:', {
    headers: visibleHeaders,
    widths: colWidths,
    totalWidth: colWidths.reduce((sum, width) => sum + width, 0),
    availableWidth: tableWidth
  });
  
  // Draw table header with proper alignment and sizing
  const headerHeight = 12; // Slightly larger header for better readability
  
  // Ensure header background is properly sized and positioned
  doc.setFillColor(41, 65, 148); // Corporate blue
  doc.rect(safeMargin, y, tableWidth, headerHeight, 'F');
  
  // Header text styling
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9); // Reduced font size to fit better
  doc.setFont("helvetica", "bold");
  
  // Draw header cells with proper text positioning
  let xPos = safeMargin;
  visibleHeaders.forEach((header, i) => {
    const headerDisplayNames: Record<string, string> = {
      'codigo': 'Código',
      'code': 'Código',
      'titulo': 'Título',
      'title': 'Título',
      'departamento': 'Departamento',
      'department': 'Departamento',
      'status': 'Status',
      'responsavel': 'Responsável',
      'responsible_name': 'Responsável',
      'data_ocorrencia': 'Data Ocorrência',
      'occurrence_date': 'Data Ocorrência'
    };
    
    const formattedHeader = headerDisplayNames[header] || 
                           header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    
    // Calculate column width and text positioning
    const columnWidth = colWidths[i];
    const maxHeaderWidth = columnWidth - 4; // 2px padding on each side
    
    // Wrap header text if necessary
    const headerLines = doc.splitTextToSize(formattedHeader, maxHeaderWidth);
    const headerText = headerLines[0]; // Use first line only for headers
    
    // Center the header text horizontally
    const textWidth = doc.getTextWidth(headerText);
    const centeredX = xPos + (columnWidth / 2) - (textWidth / 2);
    
    // Position text vertically centered
    const verticalCenter = y + (headerHeight / 2) + 1;
    
    doc.text(headerText, centeredX, verticalCenter);
    xPos += columnWidth;
  });
  
  y += headerHeight + 2;
  
  // Setup data row styling
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8); // Smaller font size for data to fit better
  
  // Calculate page height for pagination
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Render all data rows with improved formatting
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // Log item data for debugging
    console.log(`Processing row ${i}:`, {
      codigo: item.codigo || item.code,
      titulo: item.titulo || item.title,
      departamento: item.departamento?.name || item.department?.name || item.departamento || item.department
    });
    
    // Check if we need a new page
    y = handleSimpleTablePagination(
      doc, 
      y, 
      pageHeight, 
      visibleHeaders, 
      colWidths, 
      safeMargin, 
      lineHeight, 
      options, 
      false // Always use portrait for this report
    );
    
    // Render the row with improved text handling
    const rowHeight = renderTableRow(
      doc,
      item,
      visibleHeaders,
      colWidths,
      safeMargin,
      y,
      lineHeight,
      i % 2 === 0 // Alternating row colors
    );
    
    y += rowHeight;
  }
  
  return y;
}
