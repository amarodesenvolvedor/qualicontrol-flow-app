
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { PDFExportOptions } from "../../utils/types";
import { addHeaderToPDF, addFooterToPDF } from "../../utils/pdfHelpers";
import { calculateColumnWidths } from "./utils/columnUtils";
import { estimateContentHeight } from "./utils/contentUtils";
import { addSimpleListContent, addTableContent, addDetailedReports } from "./content";
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
    
    // Ensure data is an array and remove ID field from each item
    if (!Array.isArray(data)) {
      console.error("Data provided to generatePDFReport is not an array", data);
      data = [];
    } else if (data.length > 0) {
      // Remove ID field from each item to prevent it from appearing in reports
      data = data.map(item => {
        const { id, ...rest } = item;
        return rest;
      });
    }

    if (data.length === 0) {
      console.warn(`Nenhum dado disponível para gerar o relatório ${reportType}`);
    }
    
    // Always use portrait orientation - this is critical for proper layout
    console.log(`Using portrait orientation for PDF`);
    
    // Create PDF document in portrait orientation with precise A4 dimensions
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Pass the report type as part of the options
    const updatedOptions: PDFExportOptions = {
      ...options,
      reportType,
      forceLandscape: false // Always use portrait
    };
    
    // Get precise page dimensions
    const pageWidth = doc.internal.pageSize.getWidth(); // Should be 210mm for A4
    const pageHeight = doc.internal.pageSize.getHeight(); // Should be 297mm for A4
    const margin = 20; // Standard 20mm margins for A4
    const contentWidth = pageWidth - (margin * 2); // 170mm usable width
    const lineHeight = 6;
    
    console.log(`PDF Dimensions: ${pageWidth}x${pageHeight}mm, margins: ${margin}mm, content width: ${contentWidth}mm`);
    
    // Start content immediately on first page
    let y = 20; // Start at top margin
    
    // Add header only if enabled
    if (updatedOptions?.showHeader !== false) {
      addHeaderToPDF(doc, reportType);
      y = 30; // Start after header
    }
    
    // Add title section directly without extra spacing
    doc.setFontSize(14);
    doc.setTextColor(41, 65, 148); // Corporate blue
    doc.setFont("helvetica", "bold");
    doc.text(reportType, pageWidth / 2, y, { align: 'center' });
    y += 8; // Minimal spacing
    
    // Add date and record count info in a compact styled box
    doc.setFillColor(245, 245, 250); // Light background
    doc.rect(margin, y, contentWidth, 10, 'F'); // Compact height
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y, contentWidth, 10, 'S');
    
    doc.setFontSize(9); // Smaller font
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Data: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, margin + 3, y + 6);
    
    // Add record count to the right
    if (data.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text(`Total: ${data.length}`, pageWidth - margin - 3, y + 6, { align: 'right' });
    }
    y += 15; // Move to start of content area with minimal spacing
    
    // Render content based on data availability
    if (data.length > 0) {
      console.log(`Rendering ${data.length} records to PDF starting at y=${y}`);
      
      // Always use table format for this report type
      console.log('Using table format for PDF content');
      y = addTableContent(doc, data, y, pageWidth, lineHeight, margin, updatedOptions);
    } else {
      // No data message
      console.warn('No data available for PDF report, showing empty state');
      y = addNoDataMessage(doc, y, pageWidth, lineHeight);
    }
    
    // Add summary section for non-conformance reports
    if ((reportType === "Não Conformidades Completo" || reportType === "Ações Corretivas") && data.length > 0) {
      y += lineHeight * 2;
      
      // Check if we need a new page for the summary
      if (y > pageHeight - 50) {
        if (updatedOptions?.showFooter !== false) {
          addFooterToPDF(doc, reportType, doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
        }
        doc.addPage('portrait');
        if (updatedOptions?.showHeader !== false) {
          addHeaderToPDF(doc, reportType);
        }
        y = 30;
      }
      
      // Add summary section with statistics
      y = addSummarySection(doc, data, y, pageWidth, lineHeight);
      
      // Add detailed reports for each non-conformance (each on a separate page)
      if (reportType === "Não Conformidades Completo") {
        addDetailedReports(doc, data, updatedOptions);
      }
    }
    
    // Add footer to all pages
    if (updatedOptions?.showFooter !== false) {
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
