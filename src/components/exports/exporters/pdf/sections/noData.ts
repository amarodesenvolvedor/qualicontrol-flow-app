
import { jsPDF } from "jspdf";

/**
 * Add no data message to the PDF
 */
export function addNoDataMessage(
  doc: jsPDF, 
  y: number, 
  pageWidth: number, 
  lineHeight: number
): number {
  doc.setFillColor(245, 245, 250);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'S');
  
  doc.setFontSize(12);
  doc.text("Nenhum dado disponível para este relatório", 25, y + 5);
  
  return y + lineHeight + 10;
}
