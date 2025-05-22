
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
  
  // Adicionar margem de segurança
  return estimatedHeight * 1.2;
}

/**
 * Split text to fit within available width and return the resulting lines
 * with improved line breaking
 */
export function wrapTextToFit(doc: jsPDF, text: string, maxWidth: number): string[] {
  if (!text) return [''];
  
  // For very short text, no need to process
  if (doc.getTextWidth(text) <= maxWidth) return [text];
  
  // Melhorar a quebra de texto para caracteres especiais
  const processSpecialChars = (text: string): string => {
    // Substituir caracteres que podem causar problemas na quebra
    return text.replace(/([\/\-])/g, '$1\u200B');
  };
  
  // Processar texto com caracteres especiais
  const processedText = processSpecialChars(text);
  const words = processedText.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    // Para palavras muito longas, quebrar em partes menores
    if (doc.getTextWidth(word) > maxWidth * 0.8) {
      // Se a palavra atual é muito longa, quebrar em caracteres
      let partialWord = '';
      for (let i = 0; i < word.length; i++) {
        const testChar = partialWord + word[i];
        if (doc.getTextWidth(testChar) <= maxWidth * 0.8) {
          partialWord = testChar;
        } else {
          // Adicionar parte da palavra e iniciar nova linha
          lines.push(partialWord);
          partialWord = word[i];
        }
      }
      // Adicionar último pedaço da palavra longa
      if (partialWord) {
        currentLine = partialWord;
      }
    } else {
      // Check if adding this word would exceed the max width
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (doc.getTextWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else {
        // Line would be too long, push current line and start a new one
        lines.push(currentLine);
        currentLine = word;
      }
    }
  });
  
  // Add the last line
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Remover caracteres invisíveis de quebra do resultado final
  return lines.map(line => line.replace(/\u200B/g, ''));
}
