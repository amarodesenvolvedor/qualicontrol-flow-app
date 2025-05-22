
import { jsPDF } from "jspdf";
import { PdfStylingOptions, checkForPageBreak } from "../core/stylingUtils";

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
