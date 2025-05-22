import { jsPDF } from "jspdf";

/**
 * Estimate the height needed for an item's content
 */
export function estimateContentHeight(doc: jsPDF, item: Record<string, any>): number {
  let estimatedHeight = 0;
  const lineHeight = 8;
  const defaultFontSize = doc.getFontSize();
  const defaultFont = doc.getFont();
  
  doc.setFontSize(10);
  
  Object.entries(item).forEach(([key, value]) => {
    const valueStr = String(value || '');
    
    // Use more accurate calculation for text width
    const textWidth = doc.getTextWidth(`${key}: ${valueStr}`);
    const availableWidth = doc.internal.pageSize.getWidth() - 40; // Ensure 20px margins on each side
    
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
  
  // Add safety margin
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
  
  // Process text with special characters to improve wrapping
  const processedText = text.replace(/([\/\-\–\—\(\)])/g, '$1\u200B');
  
  // Split text into words, preserving spaces
  const words = processedText.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  // Function to break very long words
  const breakLongWord = (word: string): string[] => {
    if (doc.getTextWidth(word) <= maxWidth) return [word];
    
    const parts: string[] = [];
    let currentPart = '';
    
    // Try natural break points first
    const naturalBreakPoints = word.split(/(?=[\/\-\–\—\(\)])/);
    
    if (naturalBreakPoints.length > 1) {
      for (const part of naturalBreakPoints) {
        if (doc.getTextWidth(currentPart + part) <= maxWidth) {
          currentPart += part;
        } else {
          if (currentPart) parts.push(currentPart);
          currentPart = part;
        }
      }
      if (currentPart) parts.push(currentPart);
      return parts;
    } else {
      // Break by characters if no natural break points
      for (let i = 0; i < word.length; i++) {
        const nextChar = word[i];
        if (doc.getTextWidth(currentPart + nextChar) <= maxWidth) {
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
    // Check if adding this word exceeds maximum width
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (doc.getTextWidth(testLine) <= maxWidth) {
      // Word fits on current line
      currentLine = testLine;
    } else {
      // Word doesn't fit, check if it's a very long word
      if (doc.getTextWidth(word) > maxWidth * 0.9) {
        // Very long word needs to be broken
        if (currentLine) lines.push(currentLine);
        
        const wordParts = breakLongWord(word);
        // Add all parts except the last one
        for (let j = 0; j < wordParts.length - 1; j++) {
          lines.push(wordParts[j]);
        }
        // Keep last part as start of new line
        currentLine = wordParts[wordParts.length - 1];
      } else {
        // Normal word, start a new line
        lines.push(currentLine);
        currentLine = word;
      }
    }
  }
  
  // Add the last line
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Remove invisible break characters from final result
  return lines.map(line => line.replace(/\u200B/g, ''));
}
