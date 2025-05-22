
import { jsPDF } from "jspdf";

/**
 * Render table headers with brand color background
 * Improved version with better text centering
 */
export function renderTableHeaders(
  doc: jsPDF,
  headers: string[],
  colWidths: number[],
  margin: number,
  y: number,
  headerHeight: number
): void {
  // Draw table header with brand color background
  doc.setFillColor(41, 65, 148);
  doc.rect(margin, y, colWidths.reduce((sum, width) => sum + width, 0), headerHeight, 'F');
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  
  // Draw header cells with true centered text
  let xPos = margin;
  headers.forEach((header, i) => {
    // Format header for better readability
    const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    const headerWidth = colWidths[i];
    
    // Calculate exact center position for text
    const textWidth = doc.getTextWidth(formattedHeader);
    const centeredX = xPos + (headerWidth / 2) - (textWidth / 2);
    
    // Position text vertically centered - adjusted for better vertical alignment
    const verticalCenter = y + (headerHeight / 2) + 0.5;
    
    doc.text(formattedHeader, centeredX, verticalCenter);
    xPos += headerWidth;
  });
}
