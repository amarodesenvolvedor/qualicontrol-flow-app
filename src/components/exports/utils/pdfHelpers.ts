
import { jsPDF } from "jspdf";
import { format } from "date-fns";

export interface ExportedData {
  [key: string]: any;
}

/**
 * Helper function for adding header to PDF
 */
export function addHeaderToPDF(doc: jsPDF, title: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Draw header background
  doc.setFillColor(41, 65, 148); // Corporate blue
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  // Company name in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Sistema de Gestão de Não Conformidades", 10, 13);
  
  // Date in header
  const today = format(new Date(), "dd/MM/yyyy");
  doc.setFontSize(10);
  doc.text(`Emitido em: ${today}`, pageWidth - 15, 13, { align: "right" });
  
  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(10, 22, pageWidth - 10, 22);
}

/**
 * Helper function for adding footer to PDF
 */
export function addFooterToPDF(doc: jsPDF, reportType: string, currentPage: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
  
  // Footer text
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Relatório: ${reportType}`, 10, pageHeight - 10);
  
  // Page number
  doc.text(`Página ${currentPage} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" });
}
