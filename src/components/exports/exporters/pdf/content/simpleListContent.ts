
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../utils/types";
import { addHeaderToPDF, addFooterToPDF } from "../../../utils/pdfHelpers";
import { estimateContentHeight } from "../utils/contentUtils";

/**
 * Add content for simple list format (small datasets)
 */
export function addSimpleListContent(
  doc: jsPDF, 
  data: any[], 
  y: number, 
  pageWidth: number, 
  lineHeight: number, 
  options?: PDFExportOptions
): number {
  const margin = options?.margin || 20;
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (margin * 2);

  data.forEach((item, index) => {
    // Verificar se precisamos de uma nova página antes de adicionar o item
    const itemContentSize = estimateContentHeight(doc, item);
    const boxHeight = Math.max(lineHeight * 4, itemContentSize + lineHeight * 2);
    
    // Se o conteúdo não couber na página atual, criar nova página
    if (y + boxHeight > pageHeight - 40) {
      if (options?.showFooter !== false) {
        addFooterToPDF(doc, options?.reportType || "Relatório de Não Conformidades", doc.getNumberOfPages(), doc.getNumberOfPages());
      }
      doc.addPage();
      if (options?.showHeader !== false) {
        addHeaderToPDF(doc, options?.reportType || "Relatório de Não Conformidades");
      }
      y = 40; // Reset Y position
    }
    
    // Add item box with light background
    doc.setFillColor(245, 245, 250);
    
    doc.rect(margin, y - 5, contentWidth, boxHeight, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y - 5, contentWidth, boxHeight, 'S');
    
    // Item title with brand color
    doc.setFontSize(12);
    doc.setTextColor(41, 65, 148);
    doc.setFont("helvetica", "bold"); // Usar negrito apenas para o título do item
    doc.text(`Item ${index + 1}`, margin + 5, y);
    y += lineHeight;
    
    // Item details with proper line breaks
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal"); // Volta para fonte normal para os detalhes
    doc.setTextColor(0, 0, 0);
    
    // Iterate through item properties with improved text handling
    Object.entries(item).forEach(([key, value]) => {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
      
      // Handle value display with potential line breaks
      const valueStr = String(value);
      const labelOffset = margin + 15;
      const valueOffset = margin + 45;
      const maxValueWidth = contentWidth - (valueOffset - margin) - 10; // 10px margin de segurança
      
      // Sempre exibir o rótulo na posição correta
      doc.setFont("helvetica", "bold"); // Negrito apenas para o rótulo
      doc.text(`${formattedKey}:`, labelOffset, y);
      doc.setFont("helvetica", "normal"); // Normal para o valor
      
      // Para textos longos, fazer a quebra de linha apropriada
      const lines = doc.splitTextToSize(valueStr, maxValueWidth);
      doc.text(lines, valueOffset, y);
      y += (lines.length > 1 ? lines.length * lineHeight : lineHeight); // Ajustar posição Y com base no número de linhas
    });
    
    y += lineHeight / 2;
  });
  
  return y;
}
