
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
    'descricao': ['descricao', 'description'], // Include both possible field names
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
      visibleHeaders.splice(2, 0, descField); // Insert after title
    }
  }
  
  // If no priority headers found, use all available headers except 'id'
  if (visibleHeaders.length < 3) {
    visibleHeaders = headers.filter(header => header !== 'id');
  }
  
  // Calculate column widths based on content with proper margins
  const tableWidth = pageWidth - (safeMargin * 2);
  const colWidths = calculateColumnWidths(visibleHeaders, tableWidth, doc, data);
  
  // Draw table header with brand color background
  doc.setFillColor(41, 65, 148);
  doc.rect(safeMargin, y, tableWidth, lineHeight + 2, 'F');
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  
  // Draw header cells with centered text
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
    
    // Center the header text
    const headerWidth = colWidths[i];
    const textWidth = doc.getTextWidth(formattedHeader);
    const centeredX = xPos + (headerWidth - textWidth) / 2;
    
    doc.text(formattedHeader, centeredX, y + 7);
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
    
    // Debug: Log the item to check description content
    console.log(`Row ${i} data:`, {
      codigo: item.codigo || item.code,
      titulo: item.titulo || item.title,
      descricao: item.descricao || item.description,
      hasDescription: !!(item.descricao || item.description)
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
    
    // Render the row and get its height using the correct function name
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
