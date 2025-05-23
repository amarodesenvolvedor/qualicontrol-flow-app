
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
    const availableWidth = doc.internal.pageSize.getWidth() - 50; // Ensure 25px margins on each side
    
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
 * Enhanced version with improved word breaking and strict width compliance
 */
export function wrapTextToFit(doc: jsPDF, text: string, maxWidth: number): string[] {
  if (!text || !text.trim()) return [''];
  
  // Ensure maxWidth is positive and reasonable
  if (maxWidth <= 10) return [text.substring(0, 10) + '...'];
  
  // For very short text, check if it fits as-is
  if (doc.getTextWidth(text) <= maxWidth) return [text];
  
  // Split text into words, preserving spaces
  const words = text.split(/\s+/).filter(word => word.length > 0);
  if (words.length === 0) return [''];
  
  const lines: string[] = [];
  let currentLine = '';
  
  // Function to break very long words that don't fit in available width
  const breakLongWord = (word: string): string[] => {
    if (doc.getTextWidth(word) <= maxWidth) return [word];
    
    const parts: string[] = [];
    let currentPart = '';
    
    // Try to break at natural points first (hyphens, slashes, etc.)
    const naturalBreaks = word.split(/([\/\-\–\—\(\)\.])/);
    
    for (const segment of naturalBreaks) {
      if (!segment) continue;
      
      if (doc.getTextWidth(currentPart + segment) <= maxWidth) {
        currentPart += segment;
      } else {
        if (currentPart) {
          parts.push(currentPart);
          currentPart = segment;
        } else {
          // Even the segment alone is too long, break it character by character
          for (let i = 0; i < segment.length; i++) {
            const char = segment[i];
            if (doc.getTextWidth(currentPart + char) <= maxWidth) {
              currentPart += char;
            } else {
              if (currentPart) parts.push(currentPart);
              currentPart = char;
            }
          }
        }
      }
    }
    
    if (currentPart) parts.push(currentPart);
    return parts.length > 0 ? parts : [word.substring(0, 1)]; // Fallback
  };
  
  // Process each word
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (doc.getTextWidth(testLine) <= maxWidth) {
      // Word fits on current line
      currentLine = testLine;
    } else {
      // Word doesn't fit
      if (doc.getTextWidth(word) > maxWidth * 0.8) {
        // Word is too long, needs to be broken
        if (currentLine) {
          lines.push(currentLine);
          currentLine = '';
        }
        
        const wordParts = breakLongWord(word);
        // Add all parts except the last one as complete lines
        for (let i = 0; i < wordParts.length - 1; i++) {
          lines.push(wordParts[i]);
        }
        // Use the last part as the start of the new line
        currentLine = wordParts[wordParts.length - 1] || '';
      } else {
        // Normal case: start a new line with this word
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }
  }
  
  // Add the last line if it has content
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Ensure we always return at least one line
  return lines.length > 0 ? lines : [''];
}
