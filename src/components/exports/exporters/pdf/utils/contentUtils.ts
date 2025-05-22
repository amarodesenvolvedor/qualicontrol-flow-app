
import { jsPDF } from "jspdf";

/**
 * Estimate the height needed for an item's content
 */
export function estimateContentHeight(doc: jsPDF, item: Record<string, any>): number {
  let estimatedHeight = 0;
  const lineHeight = 8; // Reduced for more compact spacing
  const defaultFontSize = doc.getFontSize();
  const defaultFont = doc.getFont();
  
  doc.setFontSize(10); // Use smaller font for calculation
  
  Object.entries(item).forEach(([key, value]) => {
    const valueStr = String(value);
    
    // Use the PDF document's text width calculation for more accurate results
    const textWidth = doc.getTextWidth(`${key}: ${valueStr}`);
    const availableWidth = doc.internal.pageSize.getWidth() - 100; // More space for margins
    
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
  
  // Add larger safety margin
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
  
  // Improve text wrapping for special characters
  const processSpecialChars = (text: string): string => {
    // Replace characters that might cause problems with line breaking
    return text.replace(/([\/\-\–\—\(\)])/g, '$1\u200B');
  };
  
  // Process text with special characters
  const processedText = processSpecialChars(text);
  
  // Split text into words, preserving spaces
  const words = processedText.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  // Function to check if a very long word needs to be broken
  const breakLongWord = (word: string): string[] => {
    // If the word isn't that long, return it directly
    if (doc.getTextWidth(word) <= maxWidth * 0.85) return [word];
    
    // For very long words, break into parts
    const parts: string[] = [];
    let currentPart = '';
    
    // Try to break at natural separation characters first
    const naturalBreakPoints = word.split(/(?=[\/\-\–\—\(\)])/);
    
    if (naturalBreakPoints.length > 1) {
      // The word has natural separators
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
      // Break by characters
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
  
  // Process each word
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Check if adding this word would exceed the maximum width
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (doc.getTextWidth(testLine) <= maxWidth) {
      // The word fits on the current line
      currentLine = testLine;
    } else {
      // The word doesn't fit, we need to check if it's a very long word
      if (doc.getTextWidth(word) > maxWidth * 0.85) {
        // Very long word, needs to be broken
        if (currentLine) lines.push(currentLine);
        
        const wordParts = breakLongWord(word);
        // Add all parts except the last one
        for (let j = 0; j < wordParts.length - 1; j++) {
          lines.push(wordParts[j]);
        }
        // Manter a última parte como início da nova linha
        currentLine = wordParts[wordParts.length - 1];
      } else {
        // Normal word, just start a new line
        lines.push(currentLine);
        currentLine = word;
      }
    }
  }
  
  // Add the last line
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Remove invisible break characters from the final result
  return lines.map(line => line.replace(/\u200B/g, ''));
}
