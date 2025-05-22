
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
    console.log('PDF data sample:', data?.slice(0, 2));
    
    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error("Data provided to generatePDFReport is not an array", data);
      data = [];
    }

    if (data.length === 0) {
      console.warn(`Nenhum dado disponível para gerar o relatório ${reportType}`);
    }
    
    // Sempre usar orientação paisagem para relatórios completos
    const useLandscape = 
      reportType.includes("Cronograma de Auditorias") || 
      reportType === "Não Conformidades Completo" ||
      reportType === "Ações Corretivas" ||
      (data.length > 0 && Object.keys(data[0]).length > 4) ||
      options?.forceLandscape;
    
    console.log(`Using ${useLandscape ? 'landscape' : 'portrait'} orientation for PDF`);
    
    // Create PDF document with appropriate orientation
    const doc = new jsPDF({
      orientation: useLandscape ? 'landscape' : 'portrait',
      unit: 'mm'
    });
    
    // Passa o tipo de relatório como parte das opções
    const updatedOptions: PDFExportOptions = {
      ...options,
      reportType
    };
    
    if (updatedOptions?.showHeader !== false) {
      addHeaderToPDF(doc, reportType);
    }
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15; // Margens menores para maximizar espaço
    const contentWidth = pageWidth - (margin * 2); // Largura útil do conteúdo
    const lineHeight = 6; // Espaçamento menor entre linhas
    let y = 30; // Start closer to header
    
    // Add title
    doc.setFontSize(16);
    doc.setTextColor(41, 65, 148); // Corporate blue
    doc.text(reportType, pageWidth / 2, y, { align: 'center' });
    y += lineHeight * 1.5;
    
    // Add date info with styled box
    doc.setFillColor(245, 245, 250); // Light background
    doc.rect(margin, y - 3, contentWidth, lineHeight + 6, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y - 3, contentWidth, lineHeight + 6, 'S');
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Data de geração: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, margin + 5, y + 3);
    
    // Add record count to the right of the date
    if (data.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text(`Total de registros: ${data.length}`, pageWidth - margin - 5, y + 3, { align: 'right' });
    }
    y += lineHeight * 2;
    
    // If we're close to the page bottom before adding content
    if (y > pageHeight - 60) {
      if (updatedOptions?.showFooter !== false) {
        addFooterToPDF(doc, reportType, doc.getNumberOfPages(), doc.getNumberOfPages());
      }
      doc.addPage(useLandscape ? 'landscape' : 'portrait');
      if (updatedOptions?.showHeader !== false) {
        addHeaderToPDF(doc, reportType);
      }
      y = 30; // Reset Y position after page break
    }
    
    // If data exists
    if (data.length > 0) {
      console.log(`Rendering ${data.length} records to PDF`);
      
      // Para relatórios completos ou com muitos campos, sempre usar tabela
      if (reportType === "Não Conformidades Completo" || 
          reportType === "Ações Corretivas" ||
          Object.keys(data[0]).length > 3) {
        
        console.log('Using table format for PDF content');
        y = addTableContent(doc, data, y, pageWidth, lineHeight, updatedOptions);
      } else if (reportType === "Indicadores de Desempenho") {
        // Para indicadores, usar lista simples
        console.log('Using simple list format for indicators');
        y = addSimpleListContent(doc, data, y, pageWidth, lineHeight, updatedOptions);
      } else {
        // Determine se usamos tabela ou lista baseado na quantidade de registros
        if (data.length <= 5) {
          console.log('Using simple list format for PDF content (small dataset)');
          y = addSimpleListContent(doc, data, y, pageWidth, lineHeight, updatedOptions);
        } else {
          console.log('Using table format for PDF content (larger dataset)');
          y = addTableContent(doc, data, y, pageWidth, lineHeight, updatedOptions);
        }
      }
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
          addFooterToPDF(doc, reportType, doc.getNumberOfPages(), doc.getNumberOfPages());
        }
        doc.addPage(useLandscape ? 'landscape' : 'portrait');
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
