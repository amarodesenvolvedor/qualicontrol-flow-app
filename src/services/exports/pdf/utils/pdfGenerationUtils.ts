
import { jsPDF } from "jspdf";
import { format } from "date-fns";

/**
 * Common styling variables for PDF documents
 */
export interface PdfStylingOptions {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  maxContentHeight: number;
}

/**
 * Initialize PDF styling variables
 */
export const initializePdfStyling = (doc: jsPDF): PdfStylingOptions => {
  return {
    pageWidth: doc.internal.pageSize.getWidth(),
    pageHeight: doc.internal.pageSize.getHeight(),
    margin: 20,
    contentWidth: doc.internal.pageSize.getWidth() - 40, // 2x margin
    maxContentHeight: doc.internal.pageSize.getHeight() - 30 // Account for header/footer
  };
};

/**
 * Check if a page break is needed based on content height
 */
export const checkForPageBreak = (
  doc: jsPDF, 
  y: number, 
  contentHeight: number, 
  styling: PdfStylingOptions,
  onPageBreak: () => void
): number => {
  if (y + contentHeight > styling.maxContentHeight) {
    onPageBreak();
    doc.addPage();
    return 20; // Reset y position after page break
  }
  return y;
};

/**
 * Add a standard header to a PDF page
 */
export const addHeaderToPdf = (
  doc: jsPDF, 
  title: string, 
  styling: PdfStylingOptions
): void => {
  doc.setFillColor(30, 100, 200); // Blue header
  doc.rect(0, 0, styling.pageWidth, 15, 'F');
  
  doc.setTextColor(255, 255, 255); // White text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, styling.pageWidth / 2, 10, { align: 'center' });
};

/**
 * Add a standard footer to a PDF page
 */
export const addFooterToPdf = (
  doc: jsPDF, 
  styling: PdfStylingOptions,
  systemName: string = 'Sistema ACAC'
): void => {
  // Footer line
  const footerY = styling.pageHeight - 15;
  doc.setDrawColor(200, 200, 200);
  doc.line(styling.margin, footerY, styling.pageWidth - styling.margin, footerY);
  
  // Footer text
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  
  // Page number
  const currentPage = doc.getNumberOfPages();
  doc.text(
    `Página ${currentPage} de ${currentPage}`, // Will be updated later with total pages
    styling.pageWidth / 2, 
    footerY + 5, 
    { align: 'center' }
  );
  
  // Generation date on the right
  const currentDate = format(new Date(), "dd/MM/yyyy HH:mm");
  doc.text(
    `Gerado em: ${currentDate}`, 
    styling.pageWidth - styling.margin, 
    footerY + 5, 
    { align: 'right' }
  );
  
  // System info on the left
  doc.text(
    systemName, 
    styling.margin, 
    footerY + 5
  );
};

/**
 * Update page numbers in all page footers
 */
export const updatePageNumbers = (doc: jsPDF, styling: PdfStylingOptions): void => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer line
    const footerY = styling.pageHeight - 15;
    
    // Update page number
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Página ${i} de ${pageCount}`, 
      styling.pageWidth / 2, 
      footerY + 5, 
      { align: 'center' }
    );
  }
};

/**
 * Add a section title with gray background
 */
export const addSectionTitle = (
  doc: jsPDF, 
  title: string, 
  y: number, 
  styling: PdfStylingOptions,
  checkBreak: boolean = true,
  onPageBreak?: () => void
): number => {
  // Check if adding title would overflow page
  if (checkBreak && onPageBreak) {
    y = checkForPageBreak(doc, y, 15, styling, onPageBreak);
  }
  
  doc.setFillColor(240, 240, 240); // Light gray background
  doc.rect(styling.margin, y - 5, styling.contentWidth, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60); // Dark gray text
  doc.setFontSize(12);
  doc.text(title, styling.margin, y);
  return y + 8; // Return new y position after title
};

/**
 * Add a field with label and value
 */
export const addField = (
  doc: jsPDF, 
  label: string, 
  value: string | null | undefined, 
  y: number, 
  styling: PdfStylingOptions,
  checkBreak: boolean = true,
  onPageBreak?: () => void,
  labelWidth: number = 35
): number => {
  // Check if adding field would overflow page
  if (checkBreak && onPageBreak) {
    y = checkForPageBreak(doc, y, 6, styling, onPageBreak);
  }
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.text(`${label}:`, styling.margin, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const displayValue = value || 'N/A';
  doc.text(displayValue, styling.margin + labelWidth, y);
  
  return y + 6; // Return new y position
};

/**
 * Add text content with proper page break handling
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
  
  // Split text into lines that fit the page width
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
 * Add a status badge to the PDF
 */
export const addStatusBadge = (
  doc: jsPDF, 
  status: string, 
  x: number, 
  y: number, 
  statusMap: Record<string, string>
): void => {
  const statusText = statusMap[status] || status;
  
  // Create a color-coded status badge
  const statusColor = status === 'resolved' || status === 'closed' 
    ? [0, 150, 50] // Green for completed statuses
    : status === 'in-progress'
      ? [230, 140, 0] // Orange for in progress
      : [220, 50, 50]; // Red for pending
  
  const statusWidth = doc.getTextWidth(statusText) + 10;
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(x - statusWidth, y - 5, statusWidth, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(statusText, x - (statusWidth / 2), y - 1, { align: 'center' });
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

/**
 * Generate a standardized filename
 */
export const generateFilename = (
  prefix: string, 
  code: string | null | undefined,
  fileType: string = 'pdf'
): string => {
  const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
  return code ? 
    `${prefix}_${code.replace(/\//g, '-')}.${fileType}` : 
    `${prefix}_${timestamp}.${fileType}`;
};
