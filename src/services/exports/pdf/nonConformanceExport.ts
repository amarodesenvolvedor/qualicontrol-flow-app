
import { NonConformance } from "@/types/nonConformance";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

/**
 * Exports non-conformance data to PDF with an enhanced professional layout
 * 
 * @param nonConformance The non-conformance object to export
 * @returns A promise that resolves when the PDF has been generated
 */
export const exportNonConformanceToPDF = async (nonConformance: NonConformance): Promise<void> => {
  try {
    // Create a new PDF document in portrait format
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
      title: `Relatório de Não Conformidade: ${nonConformance.code || 'N/A'}`,
      subject: nonConformance.title,
      creator: 'Sistema de Não Conformidades',
      author: 'Sistema ACAC',
      keywords: 'não conformidade, qualidade, relatório'
    });

    // Styling variables
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const maxContentHeight = pageHeight - 30; // Account for header/footer
    
    // Initialize y position
    let y = 20;
    
    // Helper function to check if we need a page break
    const checkForPageBreak = (contentHeight: number) => {
      if (y + contentHeight > maxContentHeight) {
        addFooterToCurrentPage();
        doc.addPage();
        y = 20;
        addHeaderToNewPage();
      }
    };
    
    // Helper function to add header to new page
    const addHeaderToNewPage = () => {
      doc.setFillColor(30, 100, 200); // Blue header
      doc.rect(0, 0, pageWidth, 15, 'F');
      
      doc.setTextColor(255, 255, 255); // White text
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("RELATÓRIO DE NÃO CONFORMIDADE", pageWidth / 2, 10, { align: 'center' });
    };
    
    // Helper function to add footer to current page
    const addFooterToCurrentPage = () => {
      // Footer line
      const footerY = pageHeight - 15;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      
      // Footer text
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      
      // Page number
      const currentPage = doc.getNumberOfPages();
      doc.text(
        `Página ${currentPage} de ${currentPage}`, // Will be updated later with total pages
        pageWidth / 2, 
        footerY + 5, 
        { align: 'center' }
      );
      
      // Generation date on the right
      const currentDate = format(new Date(), "dd/MM/yyyy HH:mm");
      doc.text(
        `Gerado em: ${currentDate}`, 
        pageWidth - margin, 
        footerY + 5, 
        { align: 'right' }
      );
      
      // System info on the left
      doc.text(
        'Sistema ACAC', 
        margin, 
        footerY + 5
      );
    };
    
    // Helper function to add a section title with improved page break handling
    const addSectionTitle = (title: string, yPos: number): number => {
      // Check if adding title would overflow page
      checkForPageBreak(15);
      
      doc.setFillColor(240, 240, 240); // Light gray background
      doc.rect(margin, yPos - 5, contentWidth, 10, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60); // Dark gray text
      doc.setFontSize(12);
      doc.text(title, margin, yPos);
      return yPos + 8; // Return new y position after title
    };
    
    // Helper function to add a field with label and value
    const addField = (label: string, value: string | null | undefined, yPos: number): number => {
      // Check if adding field would overflow page
      checkForPageBreak(6);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);
      doc.text(`${label}:`, margin, yPos);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const displayValue = value || 'N/A';
      doc.text(displayValue, margin + 35, yPos);
      
      return yPos + 6; // Return new y position
    };
    
    // Helper function to calculate text height
    const calculateTextHeight = (text: string, fontSize: number, maxWidth: number): number => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      return lines.length * (fontSize / 2);
    };
    
    // Add header with logo placeholder and title
    doc.setFillColor(30, 100, 200); // Blue header
    doc.rect(0, 0, pageWidth, 15, 'F');
    
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("RELATÓRIO DE NÃO CONFORMIDADE", pageWidth / 2, 10, { align: 'center' });
    
    // Add code and status
    y = 25;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Código: ${nonConformance.code || 'N/A'}`, margin, y);
    
    // Add status on the right
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'in-progress': 'Em Andamento',
      'resolved': 'Resolvido',
      'closed': 'Encerrado',
    };
    const statusText = statusMap[nonConformance.status] || nonConformance.status;
    
    // Create a color-coded status badge
    const statusColor = nonConformance.status === 'resolved' || nonConformance.status === 'closed' 
      ? [0, 150, 50] // Green for completed statuses
      : nonConformance.status === 'in-progress'
        ? [230, 140, 0] // Orange for in progress
        : [220, 50, 50]; // Red for pending
    
    const statusWidth = doc.getTextWidth(statusText) + 10;
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(pageWidth - margin - statusWidth, y - 5, statusWidth, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(statusText, pageWidth - margin - (statusWidth / 2), y - 1, { align: 'center' });
    
    // Title
    y += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    
    // Check if title is too long and might need special handling
    const titleLines = doc.splitTextToSize(nonConformance.title, contentWidth);
    doc.text(titleLines, margin, y);
    y += (titleLines.length * 7);
    
    // Add divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    
    // Basic Information Section
    y = addSectionTitle("INFORMAÇÕES GERAIS", y);
    
    // Two columns for basic info
    const colWidth = contentWidth / 2;
    let leftY = y;
    let rightY = y;
    
    // Left column
    leftY = addField("Departamento", nonConformance.department?.name, leftY);
    leftY = addField("Local", nonConformance.location, leftY);
    leftY = addField("Responsável", nonConformance.responsible_name, leftY);
    
    // Right column (starts at the middle of the page)
    const rightColX = margin + colWidth + 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text(`Auditor:`, rightColX, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(nonConformance.auditor_name || 'N/A', rightColX + 35, y);
    rightY += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`Data Ocorrência:`, rightColX, rightY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      nonConformance.occurrence_date ? format(new Date(nonConformance.occurrence_date), "dd/MM/yyyy") : 'N/A', 
      rightColX + 35, 
      rightY
    );
    rightY += 6;
    
    // Use the lowest y value to continue
    y = Math.max(leftY, rightY) + 5;
    
    // Check for page break before continuing to next section
    checkForPageBreak(20);
    
    // Date Information Section
    y = addSectionTitle("CRONOGRAMA", y);
    
    // Two columns for dates
    leftY = y;
    rightY = y;
    
    leftY = addField("Data Resposta", 
      nonConformance.response_date ? format(new Date(nonConformance.response_date), "dd/MM/yyyy") : 'Não definida', 
      leftY
    );
    
    leftY = addField("Verificação Ação", 
      nonConformance.action_verification_date ? format(new Date(nonConformance.action_verification_date), "dd/MM/yyyy") : 'Não definida', 
      leftY
    );
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`Verificação Eficácia:`, rightColX, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      nonConformance.effectiveness_verification_date ? 
        format(new Date(nonConformance.effectiveness_verification_date), "dd/MM/yyyy") : 
        'Não definida',
      rightColX + 35, 
      y
    );
    rightY += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`Data Conclusão:`, rightColX, rightY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      nonConformance.completion_date ? 
        format(new Date(nonConformance.completion_date), "dd/MM/yyyy") : 
        'Não definida',
      rightColX + 35, 
      rightY
    );
    rightY += 6;
    
    y = Math.max(leftY, rightY) + 5;
    
    // Description Section - with improved page break handling
    // Get description text and calculate its height
    const descriptionText = nonConformance.description || "Sem descrição disponível";
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descriptionLines = doc.splitTextToSize(descriptionText, contentWidth);
    const descriptionHeight = descriptionLines.length * 5 + 10; // Add some margin
    
    // Check if description would need a page break
    checkForPageBreak(descriptionHeight + 10); // +10 for section title
    
    // Now add the section title and description
    y = addSectionTitle("DESCRIÇÃO", y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Render the description text
    doc.text(descriptionLines, margin, y);
    y += descriptionHeight;
    
    // Immediate Actions Section - with improved page break handling
    // Get actions text and calculate its height
    const actionsText = nonConformance.immediate_actions || "Nenhuma ação registrada";
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const actionsLines = doc.splitTextToSize(actionsText, contentWidth);
    const actionsHeight = actionsLines.length * 5 + 10; // Add some margin
    
    // Check if actions would need a page break
    checkForPageBreak(actionsHeight + 10); // +10 for section title
    
    // Now add the section title and actions
    y = addSectionTitle("AÇÕES IMEDIATAS", y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Render the actions text
    doc.text(actionsLines, margin, y);
    y += actionsHeight;
    
    // Check if we have root cause information
    if (nonConformance.root_cause_analysis) {
      // Calculate root cause text height
      const rootCauseText = nonConformance.root_cause_analysis;
      const rootCauseLines = doc.splitTextToSize(rootCauseText, contentWidth);
      const rootCauseHeight = rootCauseLines.length * 5 + 10;
      
      // Check if root cause would need a page break
      checkForPageBreak(rootCauseHeight + 10); // +10 for section title
      
      // Now add the section title and root cause
      y = addSectionTitle("ANÁLISE DE CAUSA RAIZ", y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      // Render the root cause text
      doc.text(rootCauseLines, margin, y);
      y += rootCauseHeight;
    }
    
    // Check if we have corrective action information
    if (nonConformance.corrective_action) {
      // Calculate corrective action text height
      const correctiveActionText = nonConformance.corrective_action;
      const correctiveActionLines = doc.splitTextToSize(correctiveActionText, contentWidth);
      const correctiveActionHeight = correctiveActionLines.length * 5 + 10;
      
      // Check if corrective action would need a page break
      checkForPageBreak(correctiveActionHeight + 10); // +10 for section title
      
      // Now add the section title and corrective action
      y = addSectionTitle("AÇÃO CORRETIVA", y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      // Render the corrective action text
      doc.text(correctiveActionLines, margin, y);
      y += correctiveActionHeight;
    }
    
    // Add footer with page number and generation date to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer line
      const footerY = doc.internal.pageSize.getHeight() - 15;
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, footerY, pageWidth - margin, footerY);
      
      // Footer text
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      
      // Page number
      doc.text(
        `Página ${i} de ${pageCount}`, 
        pageWidth / 2, 
        footerY + 5, 
        { align: 'center' }
      );
      
      // Generation date on the right
      const currentDate = format(new Date(), "dd/MM/yyyy HH:mm");
      doc.text(
        `Gerado em: ${currentDate}`, 
        pageWidth - margin, 
        footerY + 5, 
        { align: 'right' }
      );
      
      // System info on the left
      doc.text(
        'Sistema ACAC', 
        margin, 
        footerY + 5
      );
    }
    
    // Save the PDF with code as filename, or fallback to NC + timestamp
    const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
    const filename = nonConformance.code ? 
      `NC_${nonConformance.code.replace(/\//g, '-')}.pdf` : 
      `NC_${timestamp}.pdf`;
    
    doc.save(filename);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
};
