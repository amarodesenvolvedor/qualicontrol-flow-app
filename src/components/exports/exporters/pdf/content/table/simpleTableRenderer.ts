
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
  // Ensure minimum margin of 20px
  const safeMargin = Math.max(margin, 20);
  
  // Increased initial Y position for better page usage
  if (y < 45) y = 45;
  
  // Extract headers from data
  const headers = Object.keys(data[0]);
  
  // Priority headers including description field with proper mapping
  const priorityHeaders = [
    'codigo', 'titulo', 'descricao', 'departamento', 'status', 
    'responsavel', 'data_ocorrencia'
  ];
  
  // Map field names to ensure we capture description correctly
  const fieldMapping: Record<string, string[]> = {
    'codigo': ['codigo', 'code'],
    'titulo': ['titulo', 'title'],
    'descricao': ['descricao', 'description'],
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
  
  // Ensure we always include description if it exists in any form
  if (!visibleHeaders.some(h => ['descricao', 'description'].includes(h))) {
    const descField = headers.find(h => ['descricao', 'description'].includes(h.toLowerCase()));
    if (descField) {
      // Always insert description after title for better readability
      const titleIndex = visibleHeaders.findIndex(h => ['titulo', 'title'].includes(h));
      if (titleIndex !== -1) {
        visibleHeaders.splice(titleIndex + 1, 0, descField);
      } else {
        visibleHeaders.splice(2, 0, descField);
      }
    }
  }
  
  // If no priority headers found, use all available headers except 'id'
  if (visibleHeaders.length < 3) {
    visibleHeaders = headers.filter(header => header !== 'id');
  }
  
  // Calculate column widths with enhanced allocation for description
  const tableWidth = pageWidth - (safeMargin * 2);
  const colWidths = calculateColumnWidths(visibleHeaders, tableWidth, doc, data);
  
  // Adjust column widths to ensure description gets enough space
  // Find description column index
  const descriptionIndex = visibleHeaders.findIndex(h => 
    ['descricao', 'description'].includes(h.toLowerCase())
  );
  
  if (descriptionIndex !== -1) {
    // Give description column at least 40% of the table width
    const minDescriptionWidth = tableWidth * 0.4;
    if (colWidths[descriptionIndex] < minDescriptionWidth) {
      // Calculate how much width we need to redistribute
      const additionalWidth = minDescriptionWidth - colWidths[descriptionIndex];
      colWidths[descriptionIndex] = minDescriptionWidth;
      
      // Redistribute width from other columns proportionally
      const otherColumns = colWidths.filter((_, i) => i !== descriptionIndex);
      const totalOtherWidth = otherColumns.reduce((sum, w) => sum + w, 0);
      
      colWidths.forEach((width, i) => {
        if (i !== descriptionIndex) {
          // Reduce width proportionally
          colWidths[i] = width - (additionalWidth * (width / totalOtherWidth));
        }
      });
    }
  }
  
  // Verify total width compliance and log for debugging
  const totalColWidth = colWidths.reduce((sum, width) => sum + width, 0);
  console.log(`Table width calculation:`, {
    availableWidth: tableWidth,
    totalColWidth,
    exceedsWidth: totalColWidth > tableWidth,
    columns: visibleHeaders.map((header, i) => ({ header, width: colWidths[i] }))
  });
  
  // Emergency width adjustment if needed
  if (totalColWidth > tableWidth) {
    const scaleFactor = (tableWidth * 0.95) / totalColWidth;
    colWidths.forEach((width, index) => {
      colWidths[index] = width * scaleFactor;
    });
    console.log(`Applied emergency scaling factor: ${scaleFactor}`);
  }
  
  // Draw table header with brand color background
  doc.setFillColor(41, 65, 148);
  doc.rect(safeMargin, y, tableWidth, lineHeight + 2, 'F');
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  
  // Draw header cells with wrapped text if necessary
  let xPos = safeMargin + 3;
  visibleHeaders.forEach((header, i) => {
    const headerDisplayNames: Record<string, string> = {
      'codigo': 'Código',
      'code': 'Código',
      'titulo': 'Título',
      'title': 'Título',
      'descricao': 'Descrição',
      'description': 'Descrição',
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
    
    // Check if header text fits, if not wrap it
    const headerWidth = colWidths[i] - 6; // Account for padding
    const headerLines = doc.splitTextToSize(formattedHeader, headerWidth);
    
    // Center the header text (use first line for centering calculation)
    const textWidth = doc.getTextWidth(headerLines[0]);
    const centeredX = xPos + (colWidths[i] - textWidth) / 2;
    
    // Render header text (use only first line if wrapped)
    doc.text(headerLines[0], centeredX, y + 7);
    
    xPos += colWidths[i];
  });
  
  y += lineHeight + 4;
  
  // Draw data rows with improved styling
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Calculate page height for easier reference
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Show ALL rows with pagination and enhanced content logging
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // Enhanced debug logging for content verification
    console.log(`Processing row ${i} (${item.codigo || item.code}):`, {
      codigo: item.codigo || item.code,
      titulo: item.titulo || item.title,
      descricao: item.descricao || item.description,
      descricaoLength: (item.descricao || item.description || '').length,
      hasDescription: !!(item.descricao || item.description),
      allFields: Object.keys(item)
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
      options?.forceLandscape || false
    );
    
    // Render the row and get its height
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
