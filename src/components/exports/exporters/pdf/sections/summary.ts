
import { jsPDF } from "jspdf";

/**
 * Add summary section to PDF report
 */
export function addSummarySection(
  doc: jsPDF,
  data: any[],
  y: number,
  pageWidth: number,
  lineHeight: number
): number {
  // Skip if no data
  if (!data || data.length === 0) {
    return y;
  }
  
  const margin = 20; // Margem padrão
  
  // Add section title
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold"); // Negrito apenas para o título da seção
  doc.setTextColor(41, 65, 148);
  doc.text("Resumo", margin, y);
  y += lineHeight * 1.5;
  
  // Reset to normal font
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  
  // Add total count
  doc.text(`Total de registros: ${data.length}`, margin, y);
  y += lineHeight;
  
  // If applicable, add category count or other aggregation
  if (data[0]?.status) {
    // Count by status
    const statusCount: Record<string, number> = {};
    data.forEach(item => {
      const status = item.status || 'N/A';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    
    // Display status summary
    y += lineHeight / 2;
    doc.text("Contagem por status:", margin, y);
    y += lineHeight;
    
    Object.entries(statusCount).forEach(([status, count]) => {
      doc.text(`• ${status}: ${count}`, margin + 10, y);
      y += lineHeight;
    });
  }
  
  // If applicable, add date range
  if (data[0]?.periodo || data[0]?.data_ocorrencia) {
    const dateField = data[0]?.periodo ? 'periodo' : 'data_ocorrencia';
    let minDate = data[0][dateField];
    let maxDate = data[0][dateField];
    
    data.forEach(item => {
      if (item[dateField] < minDate) minDate = item[dateField];
      if (item[dateField] > maxDate) maxDate = item[dateField];
    });
    
    y += lineHeight / 2;
    doc.text(`Período: ${minDate} até ${maxDate}`, margin, y);
  }
  
  return y;
}
