
import { jsPDF } from "jspdf";
import { wrapTextToFit } from "../../utils/contentUtils";

/**
 * Render a single table row with proper styling and text wrapping
 */
export function renderTableRow(
  doc: jsPDF,
  item: any,
  headers: string[],
  colWidths: number[],
  margin: number,
  y: number,
  lineHeight: number,
  isAlternateRow: boolean
): number {
  // Pre-process row to determine height
  const rowContentHeights = [];
  let maxRowHeight = lineHeight * 1.5; // Mínimo aumentado para melhor espaçamento
  
  headers.forEach((header, j) => {
    const text = String(item[header] || '');
    // Reduzir a margem interna para dar mais espaço ao texto
    const colWidth = colWidths[j] - 6;
    
    // Calcular altura para textos que precisam de quebra de linha
    if (text.length > 0) { // Processar todos os textos, mesmo curtos
      const wrapped = wrapTextToFit(doc, text, colWidth);
      const contentHeight = wrapped.length * (lineHeight * 0.9);
      rowContentHeights.push(contentHeight);
      maxRowHeight = Math.max(maxRowHeight, contentHeight + 4); // Adicionado padding extra
    } else {
      rowContentHeights.push(lineHeight);
    }
  });
  
  // Add alternating row background for readability
  if (isAlternateRow) {
    doc.setFillColor(245, 245, 250);
    doc.rect(margin, y - 4, colWidths.reduce((sum, width) => sum + width, 0), maxRowHeight + 6, 'F');
  }
  
  // Add cell content with proper wrapping
  let xPos = margin;
  headers.forEach((header, j) => {
    const text = String(item[header] || '');
    // Ajustar para garantir espaço suficiente para o texto
    const colWidth = colWidths[j] - 6;
    
    // Sempre usar quebra de linha para garantir que o texto não ultrapasse a coluna
    const wrapped = wrapTextToFit(doc, text, colWidth);
    
    // Posicionamento vertical melhorado
    const cellYPos = y;
    
    // Adicionar cada linha de texto com espaçamento adequado
    wrapped.forEach((line, lineIndex) => {
      const lineY = cellYPos + (lineIndex * lineHeight * 0.9);
      doc.text(line, xPos + 3, lineY);
    });
    
    xPos += colWidths[j];
  });
  
  return maxRowHeight + 2;
}

/**
 * Render simplified table row with basic styling
 */
export function renderSimpleTableRow(
  doc: jsPDF,
  item: any,
  headers: string[],
  colWidths: number[],
  margin: number,
  y: number,
  lineHeight: number,
  isAlternateRow: boolean
): number {
  // Pre-process row to determine height
  const rowContentHeights = [];
  let maxRowHeight = lineHeight;
  
  headers.forEach((header, j) => {
    const text = String(item[header] || '');
    const colWidth = colWidths[j] - 12; // Increased padding
    
    // Calcular altura para textos que precisam de quebra de linha
    if (text.length > 10) { // Reduzido para detectar mais textos que precisam de quebra
      const wrapped = wrapTextToFit(doc, text, colWidth);
      const contentHeight = wrapped.length * (lineHeight * 0.8); // Increased line spacing
      rowContentHeights.push(contentHeight);
      maxRowHeight = Math.max(maxRowHeight, contentHeight + 3); // Added more padding
    } else {
      rowContentHeights.push(lineHeight);
    }
  });
  
  // Re-draw background for taller row if needed
  if (isAlternateRow) {
    doc.setFillColor(245, 245, 250);
    doc.rect(margin, y - 4, colWidths.reduce((sum, width) => sum + width, 0), maxRowHeight + 4, 'F');
  }
  
  // Add cell content with proper wrapping
  let xPos = margin + 3;
  headers.forEach((header, j) => {
    const text = String(item[header] || '');
    const colWidth = colWidths[j] - 12; // Increased padding for safety
    
    // Sempre usar quebra de linha para garantir que o texto não ultrapasse a coluna
    const wrapped = wrapTextToFit(doc, text, colWidth);
    
    // Deixar um espaço vertical adicional entre o texto e os limites da célula
    const cellYPos = y + 2;
    doc.text(wrapped, xPos, cellYPos);
    
    xPos += colWidths[j];
  });
  
  return maxRowHeight + 2; // Adicionar margem extra entre linhas
}
