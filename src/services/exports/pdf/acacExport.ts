
import { NonConformance } from "@/types/nonConformance";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

/**
 * Exports ACAC (Action Corrective Action Containment) data to PDF with proper page break handling
 * 
 * @param acacData The ACAC data to export
 * @returns A promise that resolves when the PDF has been generated
 */
export const exportAcacToPDF = async (acacData: NonConformance): Promise<void> => {
  try {
    // Create a new PDF document in portrait format
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
      title: `ACAC: ${acacData.code || 'N/A'}`,
      subject: acacData.title,
      creator: 'Sistema de Não Conformidades',
      author: 'Sistema ACAC',
      keywords: 'ACAC, ação corretiva, não conformidade'
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
      doc.text("ACAC - AÇÃO CORRETIVA", pageWidth / 2, 10, { align: 'center' });
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
    
    // Add header with logo placeholder and title
    doc.setFillColor(30, 100, 200); // Blue header
    doc.rect(0, 0, pageWidth, 15, 'F');
    
    doc.setTextColor(255, 255, 255); // White text
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("ACAC - AÇÃO CORRETIVA", pageWidth / 2, 10, { align: 'center' });
    
    // Add code and status
    y = 25;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(`Código: ${acacData.code || 'N/A'}`, margin, y);
    
    // Add status on the right
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'in-progress': 'Em Andamento',
      'resolved': 'Resolvido',
      'closed': 'Encerrado',
    };
    const statusText = statusMap[acacData.status] || acacData.status;
    
    // Create a color-coded status badge
    const statusColor = acacData.status === 'resolved' || acacData.status === 'closed' 
      ? [0, 150, 50] // Green for completed statuses
      : acacData.status === 'in-progress'
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
    const titleLines = doc.splitTextToSize(acacData.title, contentWidth);
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
    leftY = addField("Departamento", acacData.department?.name, leftY);
    leftY = addField("Local", acacData.location, leftY);
    leftY = addField("Responsável", acacData.responsible_name, leftY);
    
    // Right column (starts at the middle of the page)
    const rightColX = margin + colWidth + 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text(`Auditor:`, rightColX, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(acacData.auditor_name || 'N/A', rightColX + 35, y);
    rightY += 6;
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`Data Ocorrência:`, rightColX, rightY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      acacData.occurrence_date ? format(new Date(acacData.occurrence_date), "dd/MM/yyyy") : 'N/A', 
      rightColX + 35, 
      rightY
    );
    rightY += 6;
    
    // Use the lowest y value to continue
    y = Math.max(leftY, rightY) + 5;
    
    // Description Section - with improved page break handling
    // Get description text and calculate its height
    const descriptionText = acacData.description || "Sem descrição disponível";
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descriptionLines = doc.splitTextToSize(descriptionText, contentWidth);
    const descriptionHeight = descriptionLines.length * 5 + 10; // Add some margin
    
    // Check if description would need a page break
    checkForPageBreak(descriptionHeight + 10); // +10 for section title
    
    // Now add the section title and description
    y = addSectionTitle("DESCRIÇÃO DA NÃO CONFORMIDADE", y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Render the description text
    doc.text(descriptionLines, margin, y);
    y += descriptionHeight;
    
    // Root Cause Section - with improved page break handling
    if (acacData.root_cause_analysis) {
      const rootCauseText = acacData.root_cause_analysis || "Análise de causa raiz não informada";
      const rootCauseLines = doc.splitTextToSize(rootCauseText, contentWidth);
      const rootCauseHeight = rootCauseLines.length * 5 + 10;
      
      // Check if root cause would need a page break
      checkForPageBreak(rootCauseHeight + 10);
      
      y = addSectionTitle("ANÁLISE DE CAUSA RAIZ", y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(rootCauseLines, margin, y);
      y += rootCauseHeight;
    }
    
    // Corrective Action Section
    if (acacData.corrective_action) {
      const correctiveActionText = acacData.corrective_action || "Ação corretiva não informada";
      const correctiveActionLines = doc.splitTextToSize(correctiveActionText, contentWidth);
      const correctiveActionHeight = correctiveActionLines.length * 5 + 10;
      
      // Check if corrective action would need a page break
      checkForPageBreak(correctiveActionHeight + 10);
      
      y = addSectionTitle("AÇÃO CORRETIVA", y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(correctiveActionLines, margin, y);
      y += correctiveActionHeight;
    }
    
    // Immediate Actions Section - with improved page break handling
    if (acacData.immediate_actions) {
      const immediateActionsText = acacData.immediate_actions || "Nenhuma ação imediata registrada";
      const immediateActionsLines = doc.splitTextToSize(immediateActionsText, contentWidth);
      const immediateActionsHeight = immediateActionsLines.length * 5 + 10;
      
      // Check if immediate actions would need a page break
      checkForPageBreak(immediateActionsHeight + 10);
      
      y = addSectionTitle("AÇÕES IMEDIATAS", y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(immediateActionsLines, margin, y);
      y += immediateActionsHeight;
    }
    
    // Verification and Approvals section
    y = addSectionTitle("VERIFICAÇÕES E APROVAÇÕES", y);
    
    // Two columns layout
    leftY = y;
    rightY = y;
    
    // Left column
    leftY = addField("Verificação da Ação", 
      acacData.action_verification_date ? format(new Date(acacData.action_verification_date), "dd/MM/yyyy") : 'Pendente', 
      leftY
    );
    
    // Right column
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`Verificação de Eficácia:`, rightColX, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      acacData.effectiveness_verification_date ? 
        format(new Date(acacData.effectiveness_verification_date), "dd/MM/yyyy") : 
        'Pendente',
      rightColX + 45, 
      y
    );
    rightY += 6;
    
    y = Math.max(leftY, rightY) + 15;
    
    // Add signature fields
    checkForPageBreak(50); // Make sure we have space for signatures
    
    // Draw signature lines
    doc.setDrawColor(100, 100, 100);
    
    // Responsible signature
    doc.line(margin + 10, y, margin + contentWidth/2 - 10, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(acacData.responsible_name || "Responsável", margin + (contentWidth/4), y + 5, { align: 'center' });
    doc.text("Responsável", margin + (contentWidth/4), y + 10, { align: 'center' });
    
    // Auditor signature
    doc.line(margin + contentWidth/2 + 10, y, margin + contentWidth - 10, y);
    doc.text(acacData.auditor_name || "Auditor", margin + contentWidth/2 + (contentWidth/4), y + 5, { align: 'center' });
    doc.text("Auditor", margin + contentWidth/2 + (contentWidth/4), y + 10, { align: 'center' });
    
    // Add footer with page number and generation date
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
    
    // Save the PDF with code as filename, or fallback to ACAC + timestamp
    const timestamp = format(new Date(), "yyyyMMdd_HHmmss");
    const filename = acacData.code ? 
      `ACAC_${acacData.code.replace(/\//g, '-')}.pdf` : 
      `ACAC_${timestamp}.pdf`;
    
    doc.save(filename);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao gerar PDF ACAC:", error);
    throw error;
  }
};
