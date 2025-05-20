
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PDFExportOptions } from "../../utils/types";
import { addHeaderToPDF, addFooterToPDF } from "../../utils/pdfHelpers";
import { calculateColumnWidths } from "./utils/columnUtils";
import { estimateContentHeight } from "./utils/contentUtils";
import { addSimpleListContent, addTableContent } from "./content";
import { addSummarySection } from "./sections/summary";
import { addNoDataMessage } from "./sections/noData";

/**
 * Generate a PDF report from the provided data with improved formatting
 */
export const generatePDFReport = async (
  reportType: string, 
  data: any[], 
  options?: PDFExportOptions
): Promise<void> => {
  try {
    console.log(`Generating PDF report for ${reportType} with ${data?.length || 0} records`);
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error("Data provided to generatePDFReport is not an array", data);
      data = [];
    }
    
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
        y = addSimpleListContent(doc, data, y, pageWidth, lineHeight, options);
      } else {
        // Create enhanced table format for larger datasets
        y = addTableContent(doc, data, y, pageWidth, lineHeight, options);
      }
    } else {
      // No data message
      y = addNoDataMessage(doc, y, pageWidth, lineHeight);
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
    
    // Add summary section
    y = addSummarySection(doc, data, y, pageWidth, lineHeight);
    
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
    console.log(`PDF report generated successfully for ${reportType}`);
    
  } catch (error) {
    console.error(`Error generating PDF report for ${reportType}:`, error);
    throw new Error(`Falha ao gerar relatório PDF: ${error.message}`);
  }
};
