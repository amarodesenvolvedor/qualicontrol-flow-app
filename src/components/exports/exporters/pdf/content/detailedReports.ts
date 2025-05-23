
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../utils/types";
import { addHeaderToPDF, addFooterToPDF } from "../../../utils/pdfHelpers";
import { wrapTextToFit } from "../utils/contentUtils";

/**
 * Add detailed reports for each non-conformance, each on a separate page
 */
export function addDetailedReports(
  doc: jsPDF,
  data: any[],
  options?: PDFExportOptions
): void {
  if (!data || data.length === 0) return;
  
  const currentReportType = options?.reportType || "Relatório";
  
  // Only add detailed reports for non-conformance reports
  if (currentReportType !== "Não Conformidades Completo" && 
      currentReportType !== "Ações Corretivas") {
    return;
  }

  // Iterate through each non-conformance
  data.forEach((item, index) => {
    // Add a new page for each detailed report
    doc.addPage();
    
    // Add header to the new page
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, `${currentReportType} - Detalhe #${index + 1}`);
    }
    
    // Start position for content
    let y = 35;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const contentWidth = pageWidth - (2 * margin);
    
    // Prepare title and code with proper text wrapping
    const code = item.codigo || item.code || '';
    const title = item.titulo || item.title || 'Não Conformidade';
    
    // Create header text with proper wrapping
    const headerText = `#${code} - ${title}`;
    
    // Add title background
    doc.setFillColor(41, 65, 148);
    
    // Calculate header height based on wrapped text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const wrappedHeaderLines = doc.splitTextToSize(headerText, contentWidth - 10);
    const headerHeight = Math.max(12, (wrappedHeaderLines.length * 6) + 6);
    
    // Draw header background with calculated height
    doc.rect(margin, y, contentWidth, headerHeight, 'F');
    
    // Render wrapped header text
    doc.setTextColor(255, 255, 255);
    const startY = y + 6;
    wrappedHeaderLines.forEach((line: string, lineIndex: number) => {
      const lineY = startY + (lineIndex * 6);
      doc.text(line, pageWidth / 2, lineY, { align: 'center' });
    });
    
    y += headerHeight + 10;
    
    // Function to add a section with title - enhanced to ensure complete text rendering
    const addSection = (sectionTitle: string, content: string | null | undefined, currentY: number): number => {
      // Debug log for content extraction
      console.log(`Adding section "${sectionTitle}" with content:`, {
        hasContent: !!content,
        contentLength: content?.length || 0,
        contentPreview: content?.substring(0, 100) || 'No content'
      });
      
      if (!content || content.trim() === '') {
        console.log(`Skipping empty section: ${sectionTitle}`);
        return currentY;
      }
      
      // Check if we need a new page for the section title
      if (currentY + 25 > pageHeight - 40) {
        if (options?.showFooter !== false) {
          addFooterToPDF(doc, currentReportType, doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
        }
        doc.addPage();
        if (options?.showHeader !== false) {
          addHeaderToPDF(doc, `${currentReportType} - Detalhe #${index + 1}`);
        }
        currentY = 35;
      }
      
      // Add section title with gray background
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, currentY, contentWidth, 8, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.text(sectionTitle, margin + 5, currentY + 5.5);
      
      currentY += 12;
      
      // Add section content with enhanced text wrapping
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      // Enhanced text wrapping with better line breaks
      const wrappedText = doc.splitTextToSize(content.trim(), contentWidth - 10);
      const lineHeight = 6;
      
      console.log(`Section "${sectionTitle}" wrapped into ${wrappedText.length} lines`);
      
      // Process all lines ensuring no truncation
      let linesProcessed = 0;
      
      for (let i = 0; i < wrappedText.length; i++) {
        // Check if we need a new page
        if (currentY + ((i - linesProcessed) * lineHeight) + 15 > pageHeight - 30) {
          if (options?.showFooter !== false) {
            addFooterToPDF(doc, currentReportType, doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
          }
          doc.addPage();
          if (options?.showHeader !== false) {
            addHeaderToPDF(doc, `${currentReportType} - Detalhe #${index + 1}`);
          }
          currentY = 35;
          linesProcessed = i;
        }
        
        // Render the current line
        const lineText = wrappedText[i];
        if (lineText && lineText.trim()) {
          doc.text(lineText, margin + 5, currentY + ((i - linesProcessed) * lineHeight));
        }
      }
      
      return currentY + ((wrappedText.length - linesProcessed) * lineHeight) + 10;
    };
    
    // Add basic information section with improved margins
    doc.setFillColor(245, 245, 250);
    doc.rect(margin, y, contentWidth, 60, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 60, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 65, 148);
    doc.setFontSize(10);
    doc.text("INFORMAÇÕES BÁSICAS", margin + 5, y + 7);
    
    // Add field labels and values
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    
    // First column
    let fieldY = y + 20;
    doc.text("Departamento:", margin + 5, fieldY);
    doc.text("Responsável:", margin + 5, fieldY + 12);
    doc.text("Status:", margin + 5, fieldY + 24);
    
    // Second column values
    doc.setFont("helvetica", "normal");
    
    // Enhanced department extraction
    let departmentName = 'N/A';
    if (item.department && typeof item.department === 'object' && item.department.name) {
      departmentName = item.department.name;
    } else if (item.departamento && typeof item.departamento === 'object' && item.departamento.name) {
      departmentName = item.departamento.name;
    } else if (typeof item.departamento === 'string' && item.departamento) {
      departmentName = item.departamento;
    } else if (typeof item.department === 'string' && item.department) {
      departmentName = item.department;
    }
    
    doc.text(departmentName, margin + 85, fieldY);
    doc.text(item.responsavel || item.responsible_name || 'N/A', margin + 85, fieldY + 12);
    doc.text(item.status || 'N/A', margin + 85, fieldY + 24);
    
    // Third column
    const rightColX = margin + (contentWidth / 2) + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Data ocorrência:", rightColX, fieldY);
    doc.text("Data encerramento:", rightColX, fieldY + 12);
    
    // Fourth column values
    doc.setFont("helvetica", "normal");
    doc.text(item.data_ocorrencia || item.occurrence_date || 'N/A', rightColX + 85, fieldY);
    doc.text(item.data_encerramento || item.completion_date || 'N/A', rightColX + 85, fieldY + 12);
    
    y += 70;
    
    // Extract and validate description content
    const descriptionContent = item.descricao || item.description || '';
    console.log(`Processing item ${code} - Description content:`, {
      descricao: item.descricao,
      description: item.description,
      finalContent: descriptionContent,
      hasContent: !!descriptionContent && descriptionContent.trim() !== ''
    });
    
    // Add content sections with enhanced content extraction
    y = addSection("DESCRIÇÃO", descriptionContent, y);
    y = addSection("AÇÕES IMEDIATAS", item.acoes_imediatas || item.immediate_actions, y);
    y = addSection("ANÁLISE DE CAUSA", item.analise_causa || item.root_cause_analysis, y);
    y = addSection("AÇÃO CORRETIVA", item.acao_corretiva || item.corrective_action, y);
    
    // Add footer
    if (options?.showFooter !== false) {
      addFooterToPDF(doc, currentReportType, doc.getNumberOfPages(), doc.getNumberOfPages() + data.length - index - 1);
    }
  });
}
