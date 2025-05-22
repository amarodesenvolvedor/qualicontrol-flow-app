
import { jsPDF } from "jspdf";

/**
 * Render table headers with brand color background
 */
export function renderTableHeaders(
  doc: jsPDF,
  headers: string[],
  colWidths: number[],
  margin: number,
  y: number,
  headerHeight: number
): void {
  // Draw table header with brand color background
  doc.setFillColor(41, 65, 148);
  doc.rect(margin, y, colWidths.reduce((sum, width) => sum + width, 0), headerHeight, 'F');
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  
  // Draw header cells with centered text
  let xPos = margin;
  headers.forEach((header, i) => {
    // Formatar cabeçalho de forma mais legível
    const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    const headerWidth = colWidths[i];
    
    // Centralizar o texto do cabeçalho na coluna - ajustado para centralização precisa
    const textWidth = doc.getTextWidth(formattedHeader);
    // Posição centralizada, considerando o espaço exato
    const centeredX = xPos + (headerWidth / 2) - (textWidth / 2);
    
    // Posicionar texto verticalmente centralizado
    const verticalCenter = y + (headerHeight / 2) + 2.5;
    
    doc.text(formattedHeader, centeredX, verticalCenter);
    xPos += headerWidth;
  });
}
