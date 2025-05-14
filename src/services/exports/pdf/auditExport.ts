
import { AuditReport } from "@/types/audit";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

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
    const lineHeight = 10;
    let y = 20;
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Relatório de Auditoria: ${audit.title || 'N/A'}`, 20, y);
    y += lineHeight * 2;
    
    // Add basic information
    doc.setFontSize(16);
    doc.text("Informações Gerais", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.text(`Título: ${audit.title || 'N/A'}`, 20, y);
    y += lineHeight;
    
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'in-progress': 'Em Andamento',
      'completed': 'Concluído',
      'closed': 'Encerrado',
    };
    doc.text(`Status: ${statusMap[audit.status] || audit.status}`, 20, y);
    y += lineHeight;
    
    doc.text(`Data da Auditoria: ${audit.audit_date ? format(new Date(audit.audit_date), "dd/MM/yyyy") : 'N/A'}`, 20, y);
    y += lineHeight;
    
    // Add description
    if (audit.description) {
      y += lineHeight * 0.5;
      doc.setFontSize(16);
      doc.text("Descrição", 20, y);
      y += lineHeight;
      
      doc.setFontSize(12);
      const descriptionText = audit.description || "Sem descrição disponível";
      const descriptionLines = doc.splitTextToSize(descriptionText, 170);
      doc.text(descriptionLines, 20, y);
    }
    
    // Add footer with file information
    doc.setFontSize(10);
    doc.text(`Arquivo: ${audit.file_name || 'N/A'}`, 20, doc.internal.pageSize.getHeight() - 20);
    doc.text(`Exportado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, doc.internal.pageSize.getHeight() - 15);
    
    // Save the PDF
    doc.save(`Auditoria_${audit.id || 'relatório'}.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao gerar PDF de auditoria:", error);
    throw error;
  }
};
