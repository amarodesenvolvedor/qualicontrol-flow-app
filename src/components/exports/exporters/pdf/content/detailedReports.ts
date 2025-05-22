
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
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    
    // Adicionar título no topo da página
    doc.setFillColor(41, 65, 148);
    doc.rect(margin, y, contentWidth, 12, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    const title = item.titulo || item.title || 'Não Conformidade';
    doc.text(`#${item.codigo || item.code || ''} - ${title}`, pageWidth / 2, y + 8, { align: 'center' });
    
    y += 20;
    
    // Function to add a section with title
    const addSection = (sectionTitle: string, content: string | null | undefined, currentY: number): number => {
      if (!content) return currentY;
      
      // Add section title with gray background
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, currentY, contentWidth, 8, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.text(sectionTitle, margin + 5, currentY + 5.5);
      
      currentY += 12;
      
      // Add section content
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      // Wrap text to fit and handle multiple lines, without truncation
      const wrappedText = wrapTextToFit(doc, content, contentWidth - 10);
      const lineHeight = 5;
      
      // Check if content would go beyond page, if so add a new page
      if (currentY + (wrappedText.length * lineHeight) + 10 > pageHeight - 30) {
        if (options?.showFooter !== false) {
          addFooterToPDF(doc, currentReportType, doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
        }
        doc.addPage();
        if (options?.showHeader !== false) {
          addHeaderToPDF(doc, `${currentReportType} - Detalhe #${index + 1}`);
        }
        currentY = 35;
      }
      
      wrappedText.forEach((line, i) => {
        doc.text(line, margin + 5, currentY + (i * lineHeight));
      });
      
      return currentY + (wrappedText.length * lineHeight) + 10;
    };
    
    // Add basic information section
    doc.setFillColor(245, 245, 250);
    doc.rect(margin, y, contentWidth, 50, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 50, 'S');
    
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
    doc.text("Responsável:", margin + 5, fieldY + 10);
    doc.text("Status:", margin + 5, fieldY + 20);
    
    // Second column values
    doc.setFont("helvetica", "normal");
    
    // Corrigir exibição do departamento - usar o nome do departamento ou o campo departamento diretamente
    const departmentName = 
      (item.department && item.department.name) ? item.department.name : 
      (item.departamento && item.departamento.name) ? item.departamento.name : 
      item.departamento || 'N/A';
    
    doc.text(departmentName, margin + 80, fieldY);
    doc.text(item.responsavel || item.responsible_name || 'N/A', margin + 80, fieldY + 10);
    doc.text(item.status || 'N/A', margin + 80, fieldY + 20);
    
    // Third column
    doc.setFont("helvetica", "bold");
    doc.text("Data ocorrência:", margin + contentWidth/2 + 5, fieldY);
    doc.text("Data encerramento:", margin + contentWidth/2 + 5, fieldY + 10);
    doc.text("Requisito ISO:", margin + contentWidth/2 + 5, fieldY + 20);
    
    // Fourth column values
    doc.setFont("helvetica", "normal");
    doc.text(item.data_ocorrencia || item.occurrence_date || 'N/A', margin + contentWidth/2 + 80, fieldY);
    doc.text(item.data_encerramento || item.completion_date || 'N/A', margin + contentWidth/2 + 80, fieldY + 10);
    doc.text(item.requisito_iso || item.iso_requirement || 'N/A', margin + contentWidth/2 + 80, fieldY + 20);
    
    y += 60;
    
    // Add content sections - sem truncamento de texto longo
    y = addSection("DESCRIÇÃO", item.descricao || item.description, y);
    y = addSection("AÇÕES IMEDIATAS", item.acoes_imediatas || item.immediate_actions, y);
    y = addSection("ANÁLISE DE CAUSA", item.analise_causa || item.root_cause_analysis, y);
    y = addSection("AÇÃO CORRETIVA", item.acao_corretiva || item.corrective_action, y);
    
    // Add footer
    if (options?.showFooter !== false) {
      addFooterToPDF(doc, currentReportType, doc.getNumberOfPages(), doc.getNumberOfPages() + data.length - index - 1);
    }
  });
}
