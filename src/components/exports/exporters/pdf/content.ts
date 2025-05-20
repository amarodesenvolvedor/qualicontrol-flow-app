
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
    if (y > doc.internal.pageSize.getHeight() - 40) {
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
  
  // Determine optimal table orientation - use landscape for many records or wide tables
  const isLandscape = (data.length > 15 || headers.length > 5) && options?.allowLandscape !== false;
  
  if (isLandscape && doc.internal.pageSize.getWidth() < doc.internal.pageSize.getHeight()) {
    // Switch to landscape if not already
    if (options?.showFooter !== false) {
      addFooterToPDF(doc, "Report", doc.getNumberOfPages(), doc.getNumberOfPages());
    }
    doc.addPage('landscape');
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, "Report");
    }
    y = 40;
    pageWidth = doc.internal.pageSize.getWidth();
  }
  
  // Calculate page height for easier reference
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Configure table column settings
  const margin = 15;
  const tableWidth = pageWidth - (margin * 2);
  
  // Select columns to display - prioritize key information
  const priorityColumns = ['semana', 'periodo', 'departamento', 'auditor_responsavel', 'status', 'ano', 'observacoes'];
  const maxColumns = isLandscape ? 6 : 4;
  
  // First try to use priority columns if they exist
  let visibleHeaders = headers.filter(header => priorityColumns.includes(header));
  
  // If no priority columns match or too few, fall back to all headers
  if (visibleHeaders.length < 2) {
    visibleHeaders = headers.slice(0, maxColumns);
  } else if (visibleHeaders.length > maxColumns) {
    // Limit to max columns if we have too many
    visibleHeaders = visibleHeaders.slice(0, maxColumns);
  }
  
  // Calculate column widths based on content
  const colWidths = calculateColumnWidths(visibleHeaders, tableWidth, doc, data);
  
  // Draw table header with brand color background
  doc.setFillColor(41, 65, 148);
  doc.rect(margin, y, tableWidth, lineHeight, 'F');
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  
  // Draw header cells
  let xPos = margin + 5;
  visibleHeaders.forEach((header, i) => {
    const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    doc.text(formattedHeader, xPos, y + 7);
    xPos += colWidths[i];
  });
  
  y += lineHeight + 2;
  
  // Draw data rows with improved styling
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  
  // Show ALL rows with pagination
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // Check if we need a new page
    if (y > pageHeight - 40) {
      if (options?.showFooter !== false) {
        addFooterToPDF(doc, "Report", doc.getNumberOfPages(), doc.getNumberOfPages());
      }
      doc.addPage(isLandscape ? 'landscape' : 'portrait');
      if (options?.showHeader !== false) {
        addHeaderToPDF(doc, "Report");
      }
      y = 40;
      
      // Redraw header on new page
      doc.setFillColor(41, 65, 148);
      doc.rect(margin, y, tableWidth, lineHeight, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      
      xPos = margin + 5;
      visibleHeaders.forEach((header, j) => {
        const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
        doc.text(formattedHeader, xPos, y + 7);
        xPos += colWidths[j];
      });
      
      y += lineHeight + 2;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
    }
    
    // Alternate row background for readability
    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 250);
      doc.rect(margin, y - 5, tableWidth, lineHeight + 2, 'F');
    }
    
    // Row data with proper cell positioning and text wrapping
    xPos = margin + 5;
    let maxRowHeight = lineHeight;
    
    // First pass: calculate row height based on wrapped content
    const rowContentHeights = [];
    
    visibleHeaders.forEach((header, j) => {
      const text = String(item[header] || '');
      const colWidth = colWidths[j] - 10; // Padding
      const wrapped = doc.splitTextToSize(text, colWidth);
      const contentHeight = wrapped.length * (lineHeight * 0.7);
      rowContentHeights.push(contentHeight);
      maxRowHeight = Math.max(maxRowHeight, contentHeight);
    });
    
    // Adjust row height if needed
    if (maxRowHeight > lineHeight) {
      // Re-draw background for taller row
      if (i % 2 === 0) {
        doc.setFillColor(245, 245, 250);
        doc.rect(margin, y - 5, tableWidth, maxRowHeight + 4, 'F');
      }
    }
    
    // Second pass: render cell content
    xPos = margin + 5;
    visibleHeaders.forEach((header, j) => {
      const text = String(item[header] || '');
      const colWidth = colWidths[j] - 10;
      
      // Word wrap long text instead of truncating
      if (text.length > 20) {
        const wrapped = doc.splitTextToSize(text, colWidth);
        doc.text(wrapped, xPos, y);
      } else {
        doc.text(text, xPos, y);
      }
      
      xPos += colWidths[j];
    });
    
    y += maxRowHeight + 2;
  }
  
  return y;
}
