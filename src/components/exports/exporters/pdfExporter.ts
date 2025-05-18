import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { addHeaderToPDF, addFooterToPDF } from "../utils/pdfHelpers";
import { PDFExportOptions } from "../utils/types";

/**
 * Generate a PDF report from the provided data
 */
export const generatePDFReport = async (reportType: string, data: any[], options?: PDFExportOptions): Promise<void> => {
  // Create PDF document
  const doc = new jsPDF();
  
  if (options?.showHeader !== false) {
    addHeaderToPDF(doc, reportType);
  }
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const lineHeight = 10;
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
        doc.rect(15, y - 5, pageWidth - 30, lineHeight * 4, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(15, y - 5, pageWidth - 30, lineHeight * 4, 'S');
        
        // Item title with brand color
        doc.setFontSize(14);
        doc.setTextColor(41, 65, 148);
        doc.text(`Item ${index + 1}`, 20, y);
        y += lineHeight;
        
        // Item details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        Object.entries(item).forEach(([key, value]) => {
          const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
          doc.text(`${formattedKey}: ${value}`, 30, y);
          y += lineHeight;
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
      const colWidth = (pageWidth - 30) / Math.min(headers.length, 4);
      
      // Draw header cells
      headers.slice(0, 4).forEach((header, i) => {
        const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
        doc.text(formattedHeader, 20 + (i * colWidth), y + 7);
      });
      
      y += lineHeight + 2;
      
      // Draw data rows with improved styling
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
      // Show only first 10 rows to keep report manageable
      const maxToShow = Math.min(10, data.length);
      for (let i = 0; i < maxToShow; i++) {
        const item = data[i];
        
        // Alternate row background for readability
        if (i % 2 === 0) {
          doc.setFillColor(245, 245, 250);
          doc.rect(15, y - 5, pageWidth - 30, lineHeight, 'F');
        }
        
        // Row data
        headers.slice(0, 4).forEach((header, j) => {
          const text = String(item[header]).slice(0, 20) + (String(item[header]).length > 20 ? '...' : '');
          doc.text(text, 20 + (j * colWidth), y);
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
          headers.slice(0, 4).forEach((header, i) => {
            const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
            doc.text(formattedHeader, 20 + (i * colWidth), y + 7);
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
  
  // Save the PDF
  doc.save(`${reportType.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.pdf`);
};
