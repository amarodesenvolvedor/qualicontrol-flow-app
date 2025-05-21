
import { jsPDF } from "jspdf";

/**
 * Estimate the height needed for an item's content
 */
export function estimateContentHeight(doc: jsPDF, item: Record<string, any>): number {
  let estimatedHeight = 0;
  const lineHeight = 8; // Reduzido para um espaçamento mais compacto
  const defaultFontSize = doc.getFontSize();
  const defaultFont = doc.getFont();
  
  doc.setFontSize(10); // Usar fonte menor para o cálculo
  
  Object.entries(item).forEach(([key, value]) => {
    const valueStr = String(value);
    
    // Use the PDF document's text width calculation for more accurate results
    const textWidth = doc.getTextWidth(`${key}: ${valueStr}`);
    const availableWidth = doc.internal.pageSize.getWidth() - 100; // Mais espaço para margens
    
    if (textWidth > availableWidth) {
      // Calculate how many lines this text will need
      const lines = Math.ceil(textWidth / availableWidth);
      estimatedHeight += lines * lineHeight;
    } else {
      estimatedHeight += lineHeight;
    }
  });
  
  // Reset to previous font settings
  doc.setFontSize(defaultFontSize);
  doc.setFont(defaultFont.fontName);
  
  return estimatedHeight;
}

/**
 * Split text to fit within available width and return the resulting lines
 */
export function wrapTextToFit(doc: jsPDF, text: string, maxWidth: number): string[] {
  if (!text) return [''];
  
  // For very short text, no need to process
  if (doc.getTextWidth(text) <= maxWidth) return [text];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    // Check if adding this word would exceed the max width
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (doc.getTextWidth(testLine) <= maxWidth) {
      currentLine = testLine;
    } else {
      // Line would be too long, push current line and start a new one
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  // Add the last line
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
