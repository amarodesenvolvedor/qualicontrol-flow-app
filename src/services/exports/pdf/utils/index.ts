
// Selectively export from pdfGenerationUtils to avoid conflicts
export {
  initializePdfStyling,
  checkForPageBreak,
  addHeaderToPdf,
  addFooterToPdf,
  updatePageNumbers,
  addSectionTitle,
  addField,
  addTextContent,
  // Commenting out the duplicate export
  // addStatusBadge,
  calculateTextHeight,
  generateFilename,
  type PdfStylingOptions
} from "./pdfGenerationUtils";

// Export all from other utility files
export * from "./statusUtils";
export * from "./headerUtils";
export * from "./infoSectionUtils";
