
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { addHeaderToPDF, addFooterToPDF } from "../utils/pdfHelpers";
import { PDFExportOptions } from "../utils/types";

/**
 * Generate a PDF report from the provided data with improved formatting
 */
export const generatePDFReport = async (
  reportType: string, 
  data: any[], 
  options?: PDFExportOptions
): Promise<void> => {
  // Create PDF document
  const doc = new jsPDF();
  
  if (options?.showHeader !== false) {
    addHeaderToPDF(doc, reportType);
  }
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const lineHeight = options?.adjustLineSpacing ? 12 : 10; // Increased line height for better readability
  let y = 40; // Start below header
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(41, 65, 148); // Corporate blue
  doc.text(reportType, pageWidth / 2, y, { align: 'center' });
  y += lineHeight * 2;
  
  // Add date info with styled box
  doc.setFillColor(245, 245, 250); // Light background
  doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'S');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Data de geração: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 25, y + 5);
  y += lineHeight * 2.5;
  
  // If data exists
  if (data.length > 0) {
    // Determine if we need to create a table or just list the items
    if (data.length <= 5) {
      // Simple listing format for small datasets
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
            addFooterToPDF(doc, reportType, doc.getNumberOfPages(), doc.getNumberOfPages());
          }
          doc.addPage();
          if (options?.showHeader !== false) {
            addHeaderToPDF(doc, reportType);
          }
          y = 40; // Reset Y position
        }
      });
    } else {
      // Create enhanced table format for larger datasets
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
            addFooterToPDF(doc, reportType, doc.getNumberOfPages(), doc.getNumberOfPages());
          }
          doc.addPage();
          if (options?.showHeader !== false) {
            addHeaderToPDF(doc, reportType);
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
    }
  } else {
    // No data message
    doc.setFillColor(245, 245, 250);
    doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'S');
    
    doc.setFontSize(12);
    doc.text("Nenhum dado disponível para este relatório", 25, y + 5);
  }
  
  // Add summary section
  y += lineHeight * 2;
  
  // Check if we need a new page for the summary
  if (y > 250) {
    if (options?.showFooter !== false) {
      addFooterToPDF(doc, reportType, doc.getNumberOfPages(), doc.getNumberOfPages());
    }
    doc.addPage();
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, reportType);
    }
    y = 40;
  }
  
  doc.setFillColor(41, 65, 148);
  doc.rect(15, y, pageWidth - 30, lineHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo", pageWidth / 2, y + 7, { align: 'center' });
  y += lineHeight + 5;
  
  doc.setFillColor(245, 245, 250);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight * 2, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight * 2, 'S');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de registros: ${data.length}`, 25, y + 5);
  
  // Add footer to all pages
  if (options?.showFooter !== false) {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addFooterToPDF(doc, reportType, i, pageCount);
    }
  }
  
  // Save the PDF - Fixed the unterminated string literal here
  doc.save(`${reportType.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.pdf`);
};

/**
 * Calculate proportional column widths based on header content
 */
function calculateColumnWidths(headers: string[], totalWidth: number): number[] {
  // Default to equal distribution
  if (headers.length === 0) return [];
  
  // Calculate proportional widths
  const minColWidth = 50; // Minimum column width
  const totalChars = headers.reduce((sum, header) => sum + header.length, 0);
  
  return headers.map(header => {
    const proportion = header.length / totalChars;
    // Ensure minimum width and adjust proportionally
    return Math.max(minColWidth, Math.floor(proportion * totalWidth));
  });
}

/**
 * Estimate the height needed for an item's content
 */
function estimateContentHeight(doc: jsPDF, item: Record<string, any>): number {
  let estimatedHeight = 0;
  const lineHeight = 12;
  
  Object.entries(item).forEach(([_, value]) => {
    const valueStr = String(value);
    if (valueStr.length > 40) {
      // For longer values, estimate multiple lines
      const lines = Math.ceil(valueStr.length / 40);
      estimatedHeight += lines * lineHeight;
    } else {
      estimatedHeight += lineHeight;
    }
  });
  
  return estimatedHeight;
}
