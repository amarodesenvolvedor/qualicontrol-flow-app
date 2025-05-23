
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
    const margin = 20; // Use consistent 20mm margin
    const contentWidth = pageWidth - (2 * margin); // 170mm for A4
    
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
    
    // Draw header background with calculated height - ensure it fits within margins
    doc.rect(margin, y, contentWidth, headerHeight, 'F');
    
    // Render wrapped header text
    doc.setTextColor(255, 255, 255);
    const startY = y + 6;
    wrappedHeaderLines.forEach((line: string, lineIndex: number) => {
      const lineY = startY + (lineIndex * 6);
      doc.text(line, margin + 5, lineY);
    });
    
    y += headerHeight + 10;
    
    // Add basic information section with proper alignment and spacing
    doc.setFillColor(245, 245, 250);
    const infoBoxHeight = 65; // Fixed height for info box
    doc.rect(margin, y, contentWidth, infoBoxHeight, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, infoBoxHeight, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 65, 148);
    doc.setFontSize(10);
    doc.text("INFORMAÇÕES BÁSICAS", margin + 5, y + 8);
    
    // Organize fields in a proper grid layout with adequate spacing
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    
    // Column 1 - Labels (left side)
    let fieldY = y + 20;
    const labelX = margin + 5;
    const valueX = margin + 55; // 50mm space for labels
    const col2LabelX = margin + (contentWidth / 2) + 5; // Start of second column
    const col2ValueX = margin + (contentWidth / 2) + 55; // Values for second column
    
    // First column labels and values
    doc.setFont("helvetica", "bold");
    doc.text("Departamento:", labelX, fieldY);
    doc.text("Responsável:", labelX, fieldY + 12);
    doc.text("Status:", labelX, fieldY + 24);
    
    // First column values
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
    
    // Wrap long department names
    const maxFieldWidth = (contentWidth / 2) - 60; // Available width for values
    const wrappedDept = doc.splitTextToSize(departmentName, maxFieldWidth);
    doc.text(wrappedDept[0] || 'N/A', valueX, fieldY);
    
    const wrappedResp = doc.splitTextToSize(item.responsavel || item.responsible_name || 'N/A', maxFieldWidth);
    doc.text(wrappedResp[0] || 'N/A', valueX, fieldY + 12);
    
    doc.text(item.status || 'N/A', valueX, fieldY + 24);
    
    // Second column labels and values
    doc.setFont("helvetica", "bold");
    doc.text("Data ocorrência:", col2LabelX, fieldY);
    doc.text("Data encerramento:", col2LabelX, fieldY + 12);
    
    // Second column values
    doc.setFont("helvetica", "normal");
    doc.text(item.data_ocorrencia || item.occurrence_date || 'N/A', col2ValueX, fieldY);
    doc.text(item.data_encerramento || item.completion_date || 'N/A', col2ValueX, fieldY + 12);
    
    y += infoBoxHeight + 10;
    
    // Function to add a section with title - enhanced to ensure complete text rendering
    const addSection = (sectionTitle: string, content: string | null | undefined, currentY: number): number => {
      if (!content || content.trim() === '') {
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
      
      // Add section title with gray background - ensure it fits within margins
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
      
      // Enhanced text wrapping with better line breaks - use proper content width
      const wrappedText = doc.splitTextToSize(content.trim(), contentWidth - 10);
      const lineHeight = 6;
      
      // Process all lines ensuring no truncation
      let linesProcessed = 0;
      
      for (let i = 0; i < wrappedText.length; i++) {
        // Check if we need a new page
        if (currentY + ((i - linesProcessed) * lineHeight) + 10 > pageHeight - 40) {
          if (options?.showFooter !== false) {
            addFooterToPDF(doc, currentReportType, doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
          }
          doc.addPage();
          if (options?.showHeader !== false) {
            addHeaderToPDF(doc, `${currentReportType} - Detalhe #${index + 1}`);
          }
          
          // Reset position on new page
          currentY = 40;
          linesProcessed = i;
          
          // Add continuation note if we're breaking mid-content
          if (i > 0) {
            doc.setFont("helvetica", "italic");
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text("(continuação)", margin + 5, currentY - 5);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
          }
        }
        
        // Render the current line within margins
        const lineText = wrappedText[i];
        if (lineText && lineText.trim()) {
          doc.text(lineText, margin + 5, currentY + ((i - linesProcessed) * lineHeight));
        }
      }
      
      return currentY + ((wrappedText.length - linesProcessed) * lineHeight) + 15;
    };
    
    // Extract and validate description content
    const descriptionContent = item.descricao || item.description || '';
    
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
