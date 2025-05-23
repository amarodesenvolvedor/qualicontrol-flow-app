
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../../utils/types";
import { addHeaderToPDF, addFooterToPDF } from "../../../../utils/pdfHelpers";
import { renderTableHeaders } from "./tableHeaders";

/**
 * Handle pagination for tables, adding new pages as needed
 */
export function handleTablePagination(
  doc: jsPDF,
  y: number, 
  pageHeight: number,
  headers: string[],
  colWidths: number[],
  margin: number,
  lineHeight: number,
  options?: PDFExportOptions,
  isLandscape?: boolean
): number {
  if (y > pageHeight - 40) {
    if (options?.showFooter !== false) {
      addFooterToPDF(doc, options?.reportType || "Relatório", doc.getNumberOfPages(), doc.getNumberOfPages());
    }
    doc.addPage('portrait'); // Always use portrait
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, options?.reportType || "Relatório");
    }
    y = 30;
    
    // Redraw header on new page
    const headerHeight = lineHeight + 5;
    renderTableHeaders(doc, headers, colWidths, margin, y, headerHeight);
    
    y += headerHeight + 2;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7); // Consistent font size
  }
  
  return y;
}

/**
 * Handle pagination for simplified tables with proper header recreation
 */
export function handleSimpleTablePagination(
  doc: jsPDF,
  y: number, 
  pageHeight: number,
  headers: string[],
  colWidths: number[],
  margin: number,
  lineHeight: number,
  options?: PDFExportOptions,
  isLandscape?: boolean
): number {
  if (y > pageHeight - 40) {
    if (options?.showFooter !== false) {
      addFooterToPDF(doc, options?.reportType || "Relatório", doc.getNumberOfPages(), doc.getNumberOfPages());
    }
    doc.addPage('portrait'); // Always use portrait
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, options?.reportType || "Relatório");
    }
    y = 30;
    
    // Recreate header on new page with proper styling
    const headerHeight = 10; // Consistent with main renderer
    const tableWidth = colWidths.reduce((sum, width) => sum + width, 0);
    
    // Draw header background
    doc.setFillColor(41, 65, 148);
    doc.rect(margin, y, tableWidth, headerHeight, 'F');
    
    // Header text styling
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8); // Consistent with main renderer
    doc.setFont("helvetica", "bold");
    
    // Draw header texts
    let xPos = margin;
    headers.forEach((header, j) => {
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
      
      // Center the header text
      const columnWidth = colWidths[j];
      const textWidth = doc.getTextWidth(formattedHeader);
      const centeredX = xPos + (columnWidth / 2) - (textWidth / 2);
      const verticalCenter = y + (headerHeight / 2) + 1;
      
      doc.text(formattedHeader, centeredX, verticalCenter);
      xPos += columnWidth;
    });
    
    y += headerHeight;
    
    // Reset text styling for data rows
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7); // Consistent with main renderer
  }
  
  return y;
}
