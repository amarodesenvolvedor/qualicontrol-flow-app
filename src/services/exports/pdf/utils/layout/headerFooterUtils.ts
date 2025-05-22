
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PdfStylingOptions } from "../core/stylingUtils";

/**
 * Add a standard header to a PDF page
 */
export const addHeaderToPdf = (
  doc: jsPDF, 
  title: string, 
  styling: PdfStylingOptions
): void => {
  doc.setFillColor(30, 100, 200); // Blue header
  doc.rect(0, 0, styling.pageWidth, 15, 'F');
  
  doc.setTextColor(255, 255, 255); // White text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, styling.pageWidth / 2, 10, { align: 'center' });
};

/**
 * Add a standard footer to a PDF page
 */
export const addFooterToPdf = (
  doc: jsPDF, 
  styling: PdfStylingOptions,
  systemName: string = 'Sistema ACAC'
): void => {
  // Footer line
  const footerY = styling.pageHeight - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(styling.margin, footerY, styling.pageWidth - styling.margin, footerY);
  
  // Footer text
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  
  // Page number
  const currentPage = doc.getNumberOfPages();
  doc.text(
    `Página ${currentPage} de ${currentPage}`, // Will be updated later with total pages
    styling.pageWidth / 2, 
    footerY + 5, 
    { align: 'center' }
  );
  
  // Generation date on the right
  const currentDate = format(new Date(), "dd/MM/yyyy HH:mm");
  doc.text(
    `Gerado em: ${currentDate}`, 
    styling.pageWidth - styling.margin, 
    footerY + 5, 
    { align: 'right' }
  );
  
  // System info on the left
  doc.text(
    systemName, 
    styling.margin, 
    footerY + 5
  );
};

/**
 * Update page numbers in all page footers
 */
export const updatePageNumbers = (doc: jsPDF, styling: PdfStylingOptions): void => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    const footerY = styling.pageHeight - 15;
    
    // Update page number
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Página ${i} de ${pageCount}`, 
      styling.pageWidth / 2, 
      footerY + 5, 
      { align: 'center' }
    );
  }
};
