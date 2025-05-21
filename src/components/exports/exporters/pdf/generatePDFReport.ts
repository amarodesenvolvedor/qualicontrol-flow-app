
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
    console.log('PDF data sample:', data?.slice(0, 2));
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error("Data provided to generatePDFReport is not an array", data);
      data = [];
    }

    if (data.length === 0) {
      console.warn(`Nenhum dado disponível para gerar o relatório ${reportType}`);
    }
    
    // Determine if we should use landscape orientation
    const useLandscape = 
      reportType.includes("Cronograma de Auditorias") || 
      (data.length > 15 && Object.keys(data[0] || {}).length > 4) ||
      options?.forceLandscape;
    
    console.log(`Using ${useLandscape ? 'landscape' : 'portrait'} orientation for PDF`);
    
    // Create PDF document with appropriate orientation
    const doc = new jsPDF({
      orientation: useLandscape ? 'landscape' : 'portrait',
      unit: 'mm'
    });
    
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
    
    // If this is an audit schedule report, add a note about the record count
    if (reportType.includes("Cronograma de Auditorias") && data.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor(41, 65, 148);
      doc.text(`Total de auditorias: ${data.length}`, pageWidth / 2, y, { align: 'center' });
      y += lineHeight * 1.5;
    }
    
    // If data exists
    if (data.length > 0) {
      console.log(`Rendering ${data.length} records to PDF`);
      
      // Log column keys for debugging table structure
      console.log('PDF report columns:', Object.keys(data[0]));
      
      // Determine if we need to create a table or just list the items
      if (data.length <= 5) {
        // Simple listing format for small datasets
        console.log('Using simple list format for PDF content');
        y = addSimpleListContent(doc, data, y, pageWidth, lineHeight, options);
      } else {
        // Create enhanced table format for larger datasets
        // Pass options to allow landscape mode if needed
        console.log('Using table format for PDF content');
        y = addTableContent(doc, data, y, pageWidth, lineHeight, {
          ...options,
          allowLandscape: true
        });
      }
    } else {
      // No data message
      console.warn('No data available for PDF report, showing empty state');
      y = addNoDataMessage(doc, y, pageWidth, lineHeight);
    }
    
    // Add summary section
    y += lineHeight * 2;
    
    // Check if we need a new page for the summary
    if (y > doc.internal.pageSize.getHeight() - 50) {
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
    console.log(`PDF generation completed successfully with ${doc.getNumberOfPages()} pages`);
    doc.save(`${reportType.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.pdf`);
    
  } catch (error) {
    console.error(`Error generating PDF report for ${reportType}:`, error);
    throw new Error(`Falha ao gerar relatório PDF: ${error.message}`);
  }
};
