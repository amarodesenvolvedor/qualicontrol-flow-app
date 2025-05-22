
import { jsPDF } from "jspdf";
import { PdfStylingOptions, checkForPageBreak } from "../core/stylingUtils";

/**
 * Add text content with proper page break handling
 * Improved version with better text wrapping and no truncation
 */
export const addTextContent = (
  doc: jsPDF, 
  text: string, 
  y: number, 
  styling: PdfStylingOptions,
  onPageBreak: () => void
): number => {
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  // Handle empty or null text
  if (!text || text.trim() === '') {
    return y + 5; // Return y position with a small margin
  }
  
  // Split text into lines that fit the page width, ensuring full content
  const textLines = doc.splitTextToSize(text, styling.contentWidth);
  
  // Calculate total height needed
  const lineHeight = 5;
  const totalTextHeight = textLines.length * lineHeight + 5; // Add some margin
  
  // Check if we need a page break
  y = checkForPageBreak(doc, y, totalTextHeight, styling, onPageBreak);
  
  // Render the text with improved line handling
  let currentY = y;
  const maxLinesPerPage = Math.floor((styling.maxContentHeight - currentY) / lineHeight);
  
  if (textLines.length <= maxLinesPerPage) {
    // All text fits on current page
    doc.text(textLines, styling.margin, currentY);
    currentY += totalTextHeight;
  } else {
    // Text needs to span multiple pages
    let remainingLines = [...textLines];
    
    while (remainingLines.length > 0) {
      // Calculate how many lines fit on current page
      const availableLines = Math.floor((styling.maxContentHeight - currentY) / lineHeight);
      const linesToRender = remainingLines.slice(0, availableLines);
      
      // Render lines that fit on current page
      doc.text(linesToRender, styling.margin, currentY);
      currentY += linesToRender.length * lineHeight;
      
      // Remove rendered lines
      remainingLines = remainingLines.slice(availableLines);
      
      // If we have more lines to render, add a page break
      if (remainingLines.length > 0) {
        onPageBreak();
        doc.addPage();
        currentY = 20; // Reset Y position after page break
      }
    }
  }
  
  return currentY + 5; // Add some margin after text block
};

/**
 * Calculate text height based on content
 */
export const calculateTextHeight = (
  doc: jsPDF, 
  text: string, 
  fontSize: number, 
  maxWidth: number,
  lineHeightMultiplier: number = 0.5
): number => {
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth);
  return lines.length * (fontSize * lineHeightMultiplier);
};
