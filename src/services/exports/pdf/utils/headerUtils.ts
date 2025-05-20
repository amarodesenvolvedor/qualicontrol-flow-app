
import { jsPDF } from "jspdf";
import { NonConformance } from "@/types/nonConformance";
import { PdfStylingOptions, addHeaderToPdf } from "./pdfGenerationUtils";
import { getStatusColor, statusMap } from "./statusUtils";

/**
 * Add document header with title and code
 */
export const addNonConformanceHeader = (
  doc: jsPDF,
  nonConformance: NonConformance,
  styling: PdfStylingOptions,
  title: string
): number => {
  // Add header with title
  addHeaderToPdf(doc, title, styling);
  
  // Add code and status
  let y = 25;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.text(`Código: ${nonConformance.code || 'N/A'}`, styling.margin, y);
  
  // Add status badge on the right
  addStatusBadge(
    doc, 
    nonConformance.status, 
    styling.pageWidth - styling.margin, 
    y
  );
  
  // Add document title
  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  
  // Handle long titles with proper wrapping
  const titleLines = doc.splitTextToSize(nonConformance.title, styling.contentWidth);
  doc.text(titleLines, styling.margin, y);
  y += (titleLines.length * 7);
  
  // Add divider line
  doc.setDrawColor(200, 200, 200);
  doc.line(styling.margin, y, styling.pageWidth - styling.margin, y);
  y += 10;
  
  return y;
};

/**
 * Add a status badge to the PDF
 */
export const addStatusBadge = (
  doc: jsPDF, 
  status: string, 
  x: number, 
  y: number
): void => {
  const statusText = statusMap[status] || status;
  
  // Create a color-coded status badge
  const statusColor = getStatusColor(status);
  
  const statusWidth = doc.getTextWidth(statusText) + 10;
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(x - statusWidth, y - 5, statusWidth, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(statusText, x - (statusWidth / 2), y - 1, { align: 'center' });
};
