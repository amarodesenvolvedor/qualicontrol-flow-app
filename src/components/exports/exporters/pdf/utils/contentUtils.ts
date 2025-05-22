
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
  
  // Adicionar margem de segurança maior
  return estimatedHeight * 1.3;
}

/**
 * Split text to fit within available width and return the resulting lines
 * with improved line breaking that preserves complete content
 */
export function wrapTextToFit(doc: jsPDF, text: string, maxWidth: number): string[] {
  if (!text) return [''];
  
  // For very short text, no need to process
  if (doc.getTextWidth(text) <= maxWidth) return [text];
  
  // Melhorar a quebra de texto para caracteres especiais
  const processSpecialChars = (text: string): string => {
    // Substituir caracteres que podem causar problemas na quebra
    return text.replace(/([\/\-\–\—\(\)])/g, '$1\u200B');
  };
  
  // Processar texto com caracteres especiais
  const processedText = processSpecialChars(text);
  
  // Dividir texto em palavras, preservando espaços
  const words = processedText.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  // Função para verificar se uma palavra muito longa precisa ser quebrada
  const breakLongWord = (word: string): string[] => {
    // Se a palavra não é tão longa, retorná-la diretamente
    if (doc.getTextWidth(word) <= maxWidth * 0.85) return [word];
    
    // Para palavras muito longas, quebrar em partes
    const parts: string[] = [];
    let currentPart = '';
    
    // Tentar quebrar em caracteres naturais de separação primeiro
    const naturalBreakPoints = word.split(/(?=[\/\-\–\—\(\)])/);
    
    if (naturalBreakPoints.length > 1) {
      // A palavra tem separadores naturais
      for (const part of naturalBreakPoints) {
        if (doc.getTextWidth(currentPart + part) <= maxWidth * 0.85) {
          currentPart += part;
        } else {
          if (currentPart) parts.push(currentPart);
          currentPart = part;
        }
      }
      if (currentPart) parts.push(currentPart);
      return parts;
    } else {
      // Quebrar por caracteres
      for (let i = 0; i < word.length; i++) {
        const nextChar = word[i];
        if (doc.getTextWidth(currentPart + nextChar) <= maxWidth * 0.85) {
          currentPart += nextChar;
        } else {
          parts.push(currentPart);
          currentPart = nextChar;
        }
      }
      if (currentPart) parts.push(currentPart);
      return parts;
    }
  };
  
  // Processar cada palavra
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Verificar se adicionar essa palavra excederia a largura máxima
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (doc.getTextWidth(testLine) <= maxWidth) {
      // A palavra cabe na linha atual
      currentLine = testLine;
    } else {
      // A palavra não cabe, precisamos verificar se é uma palavra muito longa
      if (doc.getTextWidth(word) > maxWidth * 0.85) {
        // Palavra muito longa, precisa ser quebrada
        if (currentLine) lines.push(currentLine);
        
        const wordParts = breakLongWord(word);
        // Adicionar todas as partes menos a última
        for (let j = 0; j < wordParts.length - 1; j++) {
          lines.push(wordParts[j]);
        }
        // Manter a última parte como início da nova linha
        currentLine = wordParts[wordParts.length - 1];
      } else {
        // Palavra normal, apenas iniciar uma nova linha
        lines.push(currentLine);
        currentLine = word;
      }
    }
  }
  
  // Adicionar a última linha
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Remover caracteres invisíveis de quebra do resultado final
  return lines.map(line => line.replace(/\u200B/g, ''));
}
