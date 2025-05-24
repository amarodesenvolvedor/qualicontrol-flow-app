
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../../utils/types";
import { calculateColumnWidths } from "../../utils/columnUtils";
import { renderTableRow } from "./tableRows";
import { handleSimpleTablePagination } from "./paginationUtils";

/**
 * Render a simplified table for basic reports with strict margin compliance
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
  // Ensure strict margin compliance - use exactly 20mm margins for A4 portrait
  const safeMargin = 20;
  
  console.log(`Starting table render at y=${y}, pageWidth=${pageWidth}, margin=${safeMargin}`);
  
  // Extract headers from data and apply field mapping
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
  const tableWidth = pageWidth - (safeMargin * 2); // Total usable width: 170mm for A4
  console.log(`Table width calculation: pageWidth=${pageWidth}, margins=${safeMargin}, tableWidth=${tableWidth}`);
  
  // Calculate column widths with improved distribution and font size consideration
  doc.setFontSize(8); // Set font size before calculating widths
  const colWidths = calculateColumnWidths(visibleHeaders, tableWidth, doc, data);
  
  // Verify and adjust column widths to ensure they fit perfectly
  const totalColWidth = colWidths.reduce((sum, width) => sum + width, 0);
  if (totalColWidth > tableWidth) {
    console.warn(`Adjusting column widths: ${totalColWidth} > ${tableWidth}`);
    const scaleFactor = (tableWidth * 0.98) / totalColWidth; // 98% to ensure safety
    colWidths.forEach((width, index) => {
      colWidths[index] = Math.max(18, width * scaleFactor); // Minimum 18mm per column
    });
  }
  
  // Final verification and ensure table is centered within margins
  const finalTotalWidth = colWidths.reduce((sum, width) => sum + width, 0);
  console.log('Final column configuration:', {
    headers: visibleHeaders,
    widths: colWidths.map(w => Math.round(w * 100) / 100),
    totalWidth: Math.round(finalTotalWidth * 100) / 100,
    availableWidth: tableWidth,
    tableStartX: safeMargin,
    tableEndX: safeMargin + finalTotalWidth
  });
  
  // Draw table header with proper alignment and sizing
  const headerHeight = 14; // Increased header height for better readability and multi-line text
  
  // Ensure header background is properly sized and positioned within margins
  doc.setFillColor(41, 65, 148); // Corporate blue
  doc.rect(safeMargin, y, finalTotalWidth, headerHeight, 'F'); // Use exact table width
  
  // Add border for visual clarity
  doc.setDrawColor(41, 65, 148);
  doc.setLineWidth(0.5);
  doc.rect(safeMargin, y, finalTotalWidth, headerHeight, 'S');
  
  // Header text styling
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8); // Font size for headers
  doc.setFont("helvetica", "bold");
  
  // Draw header cells with proper text positioning and line breaks
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
      'data_ocorrencia': 'Data\nOcorrência', // Line break for better formatting
      'occurrence_date': 'Data\nOcorrência'
    };
    
    const formattedHeader = headerDisplayNames[header] || 
                           header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    
    // Calculate column width and text positioning
    const columnWidth = colWidths[i];
    
    // Handle multi-line headers (like "Data\nOcorrência")
    const headerLines = formattedHeader.split('\n');
    
    headerLines.forEach((line, lineIndex) => {
      // Calculate text width for centering
      const textWidth = doc.getTextWidth(line);
      const centeredX = xPos + (columnWidth / 2) - (textWidth / 2);
      
      // Position text vertically centered, accounting for multiple lines
      const totalLinesHeight = headerLines.length * 4; // 4mm per line
      const startY = y + (headerHeight / 2) - (totalLinesHeight / 2) + 3;
      const lineY = startY + (lineIndex * 4);
      
      doc.text(line, centeredX, lineY);
    });
    
    // Draw vertical lines between columns for better separation
    if (i < visibleHeaders.length - 1) {
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.2);
      doc.line(xPos + columnWidth, y, xPos + columnWidth, y + headerHeight);
    }
    
    xPos += columnWidth;
  });
  
  y += headerHeight;
  
  // Setup data row styling
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7); // Smaller font size for data to fit better
  
  // Calculate page height for pagination
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Render all data rows with improved formatting
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
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
