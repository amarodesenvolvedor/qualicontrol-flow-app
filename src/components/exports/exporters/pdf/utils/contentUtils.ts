
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
  
  // Add extra safety margin for description fields
  if (item.descricao || item.description) {
    const descText = item.descricao || item.description || '';
    const descriptionEstimate = Math.max(100, descText.length / 5); // Conservative estimate for description
    estimatedHeight += descriptionEstimate;
  }
  
  // Add safety margin
  return estimatedHeight * 1.5;
}

/**
 * Enhanced text wrapping function with better word breaking and width compliance
 */
export function wrapTextToFit(doc: jsPDF, text: string, maxWidth: number): string[] {
  if (!text || !text.trim()) return [''];
  
  // Ensure maxWidth is positive and reasonable
  if (maxWidth <= 10) return [text.substring(0, 10) + '...'];
  
  // For very short text, check if it fits as-is
  if (doc.getTextWidth(text) <= maxWidth) return [text];
  
  // Use jsPDF's built-in splitTextToSize for better accuracy
  try {
    const lines = doc.splitTextToSize(text, maxWidth);
    return Array.isArray(lines) ? lines : [text];
  } catch (error) {
    console.warn('Error in splitTextToSize, falling back to manual wrapping:', error);
    
    // Fallback to manual word breaking
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return [''];
    
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (doc.getTextWidth(testLine) <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Single word is too long, break it
          if (doc.getTextWidth(word) > maxWidth) {
            let remainingWord = word;
            while (remainingWord.length > 0) {
              let breakPoint = remainingWord.length;
              
              // Find the longest substring that fits
              for (let i = 1; i <= remainingWord.length; i++) {
                if (doc.getTextWidth(remainingWord.substring(0, i)) > maxWidth) {
                  breakPoint = Math.max(1, i - 1);
                  break;
                }
              }
              
              lines.push(remainingWord.substring(0, breakPoint));
              remainingWord = remainingWord.substring(breakPoint);
            }
          } else {
            currentLine = word;
          }
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines.length > 0 ? lines : [''];
  }
}
