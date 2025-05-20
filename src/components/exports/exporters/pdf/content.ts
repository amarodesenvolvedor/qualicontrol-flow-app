import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../utils/types";
import { addHeaderToPDF, addFooterToPDF } from "../../utils/pdfHelpers";
import { calculateColumnWidths } from "./utils/columnUtils";
import { estimateContentHeight } from "./utils/contentUtils";

/**
 * Add content for simple list format (small datasets)
 */
export function addSimpleListContent(
  doc: jsPDF, 
  data: any[], 
  y: number, 
  pageWidth: number, 
  lineHeight: number, 
  options?: PDFExportOptions
): number {
  data.forEach((item, index) => {
    // Add item box with light background
    doc.setFillColor(245, 245, 250);
    // Estimate needed height based on content
    const itemContentSize = estimateContentHeight(doc, item);
    const boxHeight = Math.max(lineHeight * 4, itemContentSize + lineHeight * 2);
    
    doc.rect(15, y - 5, pageWidth - 30, boxHeight, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, y - 5, pageWidth - 30, boxHeight, 'S');
    
    // Item title with brand color
    doc.setFontSize(14);
    doc.setTextColor(41, 65, 148);
    doc.text(`Item ${index + 1}`, 20, y);
    y += lineHeight;
    
    // Item details with proper line breaks
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    // Iterate through item properties with improved text handling
    Object.entries(item).forEach(([key, value]) => {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
      
      // Handle value display with potential line breaks
      const valueStr = String(value);
      if (valueStr.length > 40 && options?.improveLineBreaks) {
        // For longer text values, use text splitting
        doc.text(`${formattedKey}:`, 30, y);
        y += lineHeight/2;
        
        const maxWidth = pageWidth - 70;
        const lines = doc.splitTextToSize(valueStr, maxWidth);
        doc.text(lines, 40, y);
        y += lines.length * (lineHeight * 0.8); // Adjust based on number of lines
      } else {
        doc.text(`${formattedKey}: ${valueStr}`, 30, y);
        y += lineHeight;
      }
    });
    
    y += lineHeight / 2;
    
    // Add new page if needed
    if (y > 250) {
      if (options?.showFooter !== false) {
        addFooterToPDF(doc, "Report", doc.getNumberOfPages(), doc.getNumberOfPages());
      }
      doc.addPage();
      if (options?.showHeader !== false) {
        addHeaderToPDF(doc, "Report");
      }
      y = 40; // Reset Y position
    }
  });
  
  return y;
}

/**
 * Add content for table format (larger datasets)
 */
export function addTableContent(
  doc: jsPDF, 
  data: any[], 
  y: number, 
  pageWidth: number, 
  lineHeight: number,
  options?: PDFExportOptions
): number {
  // Get headers
  const headers = Object.keys(data[0]);
  
  // Table header with brand color background
  doc.setFillColor(41, 65, 148);
  doc.rect(15, y, pageWidth - 30, lineHeight, 'F');
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  
  // Calculate column widths (limited to max 4 columns for readability)
  const visibleHeaders = headers.slice(0, 4);
  const colWidths = calculateColumnWidths(visibleHeaders, pageWidth - 30);
  
  // Draw header cells
  let xPos = 20;
  visibleHeaders.forEach((header, i) => {
    const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    doc.text(formattedHeader, xPos, y + 7);
    xPos += colWidths[i];
  });
  
  y += lineHeight + 2;
  
  // Draw data rows with improved styling
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  // Show only first 15 rows to keep report manageable but allow for more than default 10
  const maxToShow = Math.min(15, data.length);
  for (let i = 0; i < maxToShow; i++) {
    const item = data[i];
    
    // Alternate row background for readability
    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 250);
      doc.rect(15, y - 5, pageWidth - 30, lineHeight, 'F');
    }
    
    // Row data with proper cell positioning
    xPos = 20;
    visibleHeaders.forEach((header, j) => {
      let text = String(item[header] || '');
      
      // Improved text truncation with ellipsis
      if (text.length > 25) {
        text = text.slice(0, 23) + '...';
      }
      
      doc.text(text, xPos, y);
      xPos += colWidths[j];
    });
    
    y += lineHeight;
    
    // Add new page if needed
    if (y > 250 && i < maxToShow - 1) {
      if (options?.showFooter !== false) {
        addFooterToPDF(doc, "Report", doc.getNumberOfPages(), doc.getNumberOfPages());
      }
      doc.addPage();
      if (options?.showHeader !== false) {
        addHeaderToPDF(doc, "Report");
      }
      y = 40;
      
      // Redraw header on new page
      doc.setFillColor(41, 65, 148);
      doc.rect(15, y, pageWidth - 30, lineHeight, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      
      xPos = 20;
      visibleHeaders.forEach((header, j) => {
        const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
        doc.text(formattedHeader, xPos, y + 7);
        xPos += colWidths[j];
      });
      
      y += lineHeight + 2;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
    }
  }
  
  // Indicate if there are more records
  if (data.length > maxToShow) {
    y += lineHeight / 2;
    doc.text(`... e mais ${data.length - maxToShow} registros`, 20, y);
  }
  
  return y;
}
