
import { jsPDF } from "jspdf";

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
 * Generate a standardized filename
 */
export const generateFilename = (
  prefix: string, 
  code: string | null | undefined,
  fileType: string = 'pdf'
): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  return code ? 
    `${prefix}_${code.replace(/\//g, '-')}.${fileType}` : 
    `${prefix}_${timestamp}.${fileType}`;
};
