
import { jsPDF } from "jspdf";
import { format } from "date-fns";

/**
 * Function to add header to PDF
 */
export function addHeaderToPDF(doc: jsPDF, companyName: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Draw a header bar
  doc.setFillColor(41, 65, 148); // Corporate blue
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  // Add title in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(companyName, 10, 13);
  
  // Add date in header
  const today = format(new Date(), "dd/MM/yyyy");
  doc.setFontSize(10);
  doc.text(`Emitido em: ${today}`, pageWidth - 15, 13, { align: "right" });
  
  // Add separator line below header
  doc.setDrawColor(200, 200, 200);
  doc.line(10, 22, pageWidth - 10, 22);
}

/**
 * Function to add footer to PDF
 */
export function addFooterToPDF(doc: jsPDF, reportTitle: string, currentPage: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Add separator line above footer
  doc.setDrawColor(200, 200, 200);
  doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
  
  // Add footer text
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  
  // Truncate report title if too long for the footer
  const maxTitleWidth = pageWidth - 80; // Reserve space for page numbers
  const titleText = doc.getTextWidth(reportTitle) > maxTitleWidth
    ? reportTitle.substring(0, 40) + '...'
    : reportTitle;
    
  doc.text(`Relatório: ${titleText}`, 10, pageHeight - 10);
  
  // Add page number
  doc.text(`Página ${currentPage} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" });
}
