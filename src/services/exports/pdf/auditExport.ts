
import { AuditReport } from "@/types/audit";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import { 
  initializePdfStyling, 
  addSectionTitle,
  addTextContent,
  updatePageNumbers,
  generateFilename,
  addFooterToPdf
} from "./utils/pdfGenerationUtils";

/**
 * Exports audit report data to PDF format
 * 
 * @param audit The audit report to export
 * @returns A promise that resolves when the PDF has been generated
 */
export const exportAuditToPDF = async (audit: AuditReport): Promise<void> => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Initialize styling variables
    const styling = initializePdfStyling(doc);
    
    // Set document properties
    doc.setProperties({
      title: `Relatório de Auditoria: ${audit.title || 'N/A'}`,
      subject: audit.title,
      creator: 'Sistema de Não Conformidades',
      author: 'Sistema ACAC',
      keywords: 'auditoria, relatório, qualidade'
    });
    
    // Helper function to handle page breaks
    const addHeaderToNewPage = () => {
      addFooterToPdf(doc, styling);
      // Add audit title to new page
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`Relatório de Auditoria`, styling.pageWidth / 2, 10, { align: 'center' });
    };
    
    // Initial y position
    let y = 20;
    
    // Add title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Relatório de Auditoria: ${audit.title || 'N/A'}`, styling.margin, y);
    y += 15;
    
    // Add basic information
    y = addSectionTitle(doc, "INFORMAÇÕES GERAIS", y, styling, true, addHeaderToNewPage);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Map status to display text
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'in-progress': 'Em Andamento',
      'completed': 'Concluído',
      'closed': 'Encerrado',
    };
    
    // Add audit details
    doc.setFont('helvetica', 'bold');
    doc.text(`Título:`, styling.margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(audit.title || 'N/A', styling.margin + 20, y);
    y += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Status:`, styling.margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(statusMap[audit.status] || audit.status, styling.margin + 20, y);
    y += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text(`Data da Auditoria:`, styling.margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(
      audit.audit_date ? format(new Date(audit.audit_date), "dd/MM/yyyy") : 'N/A', 
      styling.margin + 40, 
      y
    );
    y += 15;
    
    // Add description if available
    if (audit.description) {
      y = addSectionTitle(doc, "DESCRIÇÃO", y, styling, true, addHeaderToNewPage);
      y = addTextContent(doc, audit.description, y, styling, addHeaderToNewPage);
    }
    
    // Add findings section if available
    if (audit.findings) {
      y = addSectionTitle(doc, "RESULTADOS DA AUDITORIA", y, styling, true, addHeaderToNewPage);
      y = addTextContent(doc, audit.findings, y, styling, addHeaderToNewPage);
    }
    
    // Add recommendations section if available
    if (audit.recommendations) {
      y = addSectionTitle(doc, "RECOMENDAÇÕES", y, styling, true, addHeaderToNewPage);
      y = addTextContent(doc, audit.recommendations, y, styling, addHeaderToNewPage);
    }
    
    // Add file information
    y = addSectionTitle(doc, "INFORMAÇÕES DO ARQUIVO", y, styling, true, addHeaderToNewPage);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Nome do arquivo:`, styling.margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(audit.file_name || 'N/A', styling.margin + 35, y);
    y += 6;
    
    if (audit.file_url) {
      doc.setFont('helvetica', 'bold');
      doc.text(`URL do arquivo:`, styling.margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text('Disponível no sistema', styling.margin + 35, y);
      y += 6;
    }
    
    // Add footer to all pages
    updatePageNumbers(doc, styling);
    
    // Save the PDF with an appropriate name
    const filename = generateFilename('Auditoria', audit.id?.toString());
    doc.save(filename);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao gerar PDF de auditoria:", error);
    throw error;
  }
};
