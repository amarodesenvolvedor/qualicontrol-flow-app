
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
    const margin = 25; // Increased margin to ensure consistent spacing
    const contentWidth = pageWidth - (2 * margin);
    
    // Adicionar título no topo da página
    doc.setFillColor(41, 65, 148);
    doc.rect(margin, y, contentWidth, 12, 'F');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    const title = item.titulo || item.title || 'Não Conformidade';
    const code = item.codigo || item.code || '';
    doc.text(`#${code} - ${title}`, pageWidth / 2, y + 8, { align: 'center' });
    
    y += 20;
    
    // Function to add a section with title - removido truncamento de texto
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
      
      // Wrap text to fit and handle multiple lines - sem truncamento
      const wrappedText = wrapTextToFit(doc, content, contentWidth - 10);
      const lineHeight = 6; // Aumentado para melhor legibilidade
      
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
      
      // Garantir que todo o texto seja exibido, sem truncamento
      let linesProcessed = 0;
      
      // Paginação aprimorada para lidar com textos muito longos
      for (let i = 0; i < wrappedText.length; i++) {
        // Se estiver chegando ao final da página, adicione uma nova
        if (currentY + ((i - linesProcessed) * lineHeight) > pageHeight - 30) {
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
        
        // Renderizar a linha atual com margem adequada
        doc.text(wrappedText[i], margin + 5, currentY + ((i - linesProcessed) * lineHeight));
      }
      
      return currentY + ((wrappedText.length - linesProcessed) * lineHeight) + 10;
    };
    
    // Add basic information section with improved margins
    doc.setFillColor(245, 245, 250);
    doc.rect(margin, y, contentWidth, 60, 'F'); // Aumentado para dar mais espaço
    doc.setDrawColor(220, 220, 220);
    doc.rect(margin, y, contentWidth, 60, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(41, 65, 148);
    doc.setFontSize(10);
    doc.text("INFORMAÇÕES BÁSICAS", margin + 5, y + 7);
    
    // Add field labels and values with careful positioning
    doc.setFont("helvetica", "bold");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    
    // First column
    let fieldY = y + 20;
    doc.text("Departamento:", margin + 5, fieldY);
    doc.text("Responsável:", margin + 5, fieldY + 12);
    doc.text("Status:", margin + 5, fieldY + 24);
    
    // Second column values - improved margin and alignment
    doc.setFont("helvetica", "normal");
    
    // Lógica aprimorada para exibir o departamento corretamente
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
    
    // Garantir que os valores tenham margem adequada
    doc.text(departmentName, margin + 85, fieldY);
    doc.text(item.responsavel || item.responsible_name || 'N/A', margin + 85, fieldY + 12);
    doc.text(item.status || 'N/A', margin + 85, fieldY + 24);
    
    // Third column with proper margin
    const rightColX = margin + (contentWidth / 2) + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Data ocorrência:", rightColX, fieldY);
    doc.text("Data encerramento:", rightColX, fieldY + 12);
    doc.text("Requisito ISO:", rightColX, fieldY + 24);
    
    // Fourth column values with proper alignment
    doc.setFont("helvetica", "normal");
    doc.text(item.data_ocorrencia || item.occurrence_date || 'N/A', rightColX + 85, fieldY);
    doc.text(item.data_encerramento || item.completion_date || 'N/A', rightColX + 85, fieldY + 12);
    doc.text(item.requisito_iso || item.iso_requirement || 'N/A', rightColX + 85, fieldY + 24);
    
    y += 70; // Aumentado para dar mais espaço entre as seções
    
    // Add content sections - exibindo o texto completo sem truncamento
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
