
import { jsPDF } from "jspdf";

/**
 * Add summary section to the PDF
 */
export function addSummarySection(
  doc: jsPDF, 
  data: any[], 
  y: number, 
  pageWidth: number, 
  lineHeight: number
): number {
  doc.setFillColor(41, 65, 148);
  doc.rect(15, y, pageWidth - 30, lineHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo", pageWidth / 2, y + 7, { align: 'center' });
  y += lineHeight + 5;
  
  doc.setFillColor(245, 245, 250);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight * 2, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight * 2, 'S');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de registros: ${data.length}`, 25, y + 5);
  
  return y + lineHeight * 2;
}
