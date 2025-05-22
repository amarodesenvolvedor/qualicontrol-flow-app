
import { jsPDF } from "jspdf";

/**
 * Add no data message to PDF report
 */
export function addNoDataMessage(
  doc: jsPDF,
  y: number,
  pageWidth: number,
  lineHeight: number
): number {
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Add light background box
  doc.setFillColor(245, 245, 250);
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, y - 5, contentWidth, lineHeight * 3 + 10, 'F');
  doc.rect(margin, y - 5, contentWidth, lineHeight * 3 + 10, 'S');
  
  // Add icon placeholder (could be replaced with actual icon rendering if needed)
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.5);
  doc.circle(pageWidth / 2, y + lineHeight, 5, 'S');
  
  // Add text
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("Nenhum dado disponível para este relatório", pageWidth / 2, y + lineHeight * 3, { align: 'center' });
  
  return y + lineHeight * 5;
}
