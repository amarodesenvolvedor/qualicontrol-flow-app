
import { jsPDF } from "jspdf";
import { wrapTextToFit } from "../../utils/contentUtils";

/**
 * Render a single table row with proper text wrapping to prevent overflow
 * Enhanced version with better cell content handling and margin respect
 */
export function renderTableRow(
  doc: jsPDF,
  item: any,
  headers: string[],
  colWidths: number[],
  margin: number,
  y: number,
  lineHeight: number,
  isEvenRow: boolean = false
): number {
  // Ensure minimum line height for readability
  const minLineHeight = Math.max(lineHeight, 6);
  
  // Calculate the maximum number of lines needed for any cell in this row
  let maxLines = 1;
  const cellContents: string[][] = [];
  
  // Pre-process all cell contents and determine max lines needed
  headers.forEach((header, colIndex) => {
    const cellValue = String(item[header] || '').trim();
    const availableWidth = colWidths[colIndex] - 10; // 5px padding on each side
    
    // Wrap text to fit within column width
    const wrappedLines = wrapTextToFit(doc, cellValue, availableWidth);
    cellContents.push(wrappedLines);
    maxLines = Math.max(maxLines, wrappedLines.length);
  });
  
  // Calculate actual row height based on content
  const rowHeight = Math.max(minLineHeight + 4, (maxLines * minLineHeight) + 8); // Extra padding for readability
  
  // Draw row background (alternating colors)
  if (isEvenRow) {
    doc.setFillColor(248, 250, 252); // Very light gray
    doc.rect(margin, y, colWidths.reduce((sum, width) => sum + width, 0), rowHeight, 'F');
  }
  
  // Draw cell borders
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.1);
  
  let xPos = margin;
  headers.forEach((header, colIndex) => {
    // Draw cell border
    doc.rect(xPos, y, colWidths[colIndex], rowHeight, 'S');
    xPos += colWidths[colIndex];
  });
  
  // Set text properties
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Render cell contents
  xPos = margin;
  headers.forEach((header, colIndex) => {
    const lines = cellContents[colIndex];
    const cellWidth = colWidths[colIndex];
    
    // Render each line of text in the cell
    lines.forEach((line, lineIndex) => {
      if (line.trim()) { // Only render non-empty lines
        const textY = y + 6 + (lineIndex * minLineHeight); // Start with top padding
        
        // Handle special formatting for certain columns
        if (header === 'status') {
          // Center status text
          const textWidth = doc.getTextWidth(line);
          const centeredX = xPos + (cellWidth / 2) - (textWidth / 2);
          doc.text(line, centeredX, textY);
        } else if (header === 'codigo' || header === 'code') {
          // Center code text
          const textWidth = doc.getTextWidth(line);
          const centeredX = xPos + (cellWidth / 2) - (textWidth / 2);
          doc.text(line, centeredX, textY);
        } else {
          // Left-align other text with proper padding
          doc.text(line, xPos + 5, textY);
        }
      }
    });
    
    xPos += cellWidth;
  });
  
  return rowHeight;
}
