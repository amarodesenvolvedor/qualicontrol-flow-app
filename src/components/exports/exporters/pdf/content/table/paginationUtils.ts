
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
    doc.addPage(isLandscape ? 'landscape' : 'portrait');
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, options?.reportType || "Relatório");
    }
    y = 40;
    
    // Redesenhar cabeçalho na nova página
    const headerHeight = lineHeight + 5;
    renderTableHeaders(doc, headers, colWidths, margin, y, headerHeight);
    
    y += headerHeight + 2;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
  }
  
  return y;
}

/**
 * Handle pagination for simplified tables
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
    doc.addPage(isLandscape ? 'landscape' : 'portrait');
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, options?.reportType || "Relatório");
    }
    y = 40;
    
    // Redesenhar cabeçalho na nova página
    const headerHeight = lineHeight + 2;
    doc.setFillColor(41, 65, 148);
    doc.rect(margin, y, colWidths.reduce((sum, width) => sum + width, 0), headerHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    
    let xPos = margin + 3;
    headers.forEach((header, j) => {
      const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
      const truncatedHeader = formattedHeader.length > 15 ? 
                            formattedHeader.substring(0, 15) + '...' : 
                            formattedHeader;
      
      // Centralizar o texto do cabeçalho em cada página nova
      const headerWidth = colWidths[j];
      const textWidth = doc.getTextWidth(truncatedHeader);
      const centeredX = xPos + (headerWidth - textWidth) / 2;
      
      doc.text(truncatedHeader, centeredX, y + 7);
      xPos += headerWidth;
    });
    
    y += lineHeight + 4;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
  }
  
  return y;
}
