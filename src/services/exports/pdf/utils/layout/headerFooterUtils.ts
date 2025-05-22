
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PdfStylingOptions } from "../core/stylingUtils";

/**
 * Add header with title to PDF document
 * Improved version with proper title centering
 */
export const addHeaderToPdf = (
  doc: jsPDF, 
  title: string,
  styling: PdfStylingOptions
): void => {
  // Create a header with a blue background
  doc.setFillColor(41, 65, 148); // Corporate blue
  
  // Draw header background
  doc.rect(0, 0, styling.pageWidth, 15, 'F');
  
  // Add title text with white color
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  // Ensure the title is exactly centered
  const titleWidth = doc.getTextWidth(title);
  const centerX = styling.pageWidth / 2;
  
  // Position text centered in the blue bar
  doc.text(title, centerX, 10, { align: 'center' });
};

/**
 * Add footer with page numbers to all pages
 */
export const addFooterToPdf = (
  doc: jsPDF,
  styling: PdfStylingOptions
): void => {
  // Draw footer line
  doc.setDrawColor(200, 200, 200);
  doc.line(
    styling.margin, 
    styling.pageHeight - 20, 
    styling.pageWidth - styling.margin, 
    styling.pageHeight - 20
  );
  
  // Add generation date
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 
    styling.margin, 
    styling.pageHeight - 15
  );
};

/**
 * Update page numbers in footer of all pages
 */
export const updatePageNumbers = (
  doc: jsPDF,
  styling: PdfStylingOptions
): void => {
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add page number
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(
      `Página ${i} de ${pageCount}`, 
      styling.pageWidth - styling.margin, 
      styling.pageHeight - 15, 
      { align: 'right' }
    );
  }
};
