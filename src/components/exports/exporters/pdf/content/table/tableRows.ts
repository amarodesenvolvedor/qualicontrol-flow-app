
import { jsPDF } from "jspdf";
import { wrapTextToFit } from "../../utils/contentUtils";

/**
 * Render a single table row with proper styling and text wrapping
 * Enhanced version with better text handling
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
  let maxRowHeight = lineHeight * 1.5; // Minimum increased for better spacing
  
  headers.forEach((header, j) => {
    const text = String(item[header] || '');
    // Reduce internal margin to give more space to text
    const colWidth = colWidths[j] - 6;
    
    // Calculate height for texts that need line breaks
    if (text.length > 0) { // Process all texts, even short ones
      const wrapped = wrapTextToFit(doc, text, colWidth);
      const contentHeight = wrapped.length * (lineHeight * 0.9);
      rowContentHeights.push(contentHeight);
      maxRowHeight = Math.max(maxRowHeight, contentHeight + 4); // Added extra padding
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
    // Adjust to ensure sufficient space for text
    const colWidth = colWidths[j] - 6;
    
    // Always use line wrapping to ensure text doesn't exceed column
    const wrapped = wrapTextToFit(doc, text, colWidth);
    
    // Improved vertical positioning
    const cellYPos = y;
    
    // Add each line of text with proper spacing
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
    
    // Calculate height for texts that need line breaks
    if (text.length > 10) { // Reduced to detect more texts that need breaks
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
    
    // Always use line wrapping to ensure text doesn't exceed column
    const wrapped = wrapTextToFit(doc, text, colWidth);
    
    // Leave additional vertical space between text and cell boundaries
    const cellYPos = y + 2;
    doc.text(wrapped, xPos, cellYPos);
    
    xPos += colWidths[j];
  });
  
  return maxRowHeight + 2; // Add extra margin between rows
}
