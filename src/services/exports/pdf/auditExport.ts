
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
    doc.text(`Relatório de Auditoria: ${audit.title}`, 20, y);
    y += lineHeight * 2;
    
    // Add basic information
    doc.setFontSize(16);
    doc.text("Informações Gerais", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.text(`Título: ${audit.title}`, 20, y);
    y += lineHeight;
    
    doc.text(`Status: ${audit.status}`, 20, y);
    y += lineHeight;
    
    doc.text(`Data da Auditoria: ${format(new Date(audit.audit_date), "dd/MM/yyyy")}`, 20, y);
    y += lineHeight;
    
    // Add description
    if (audit.description) {
      y += lineHeight * 0.5;
      doc.setFontSize(16);
      doc.text("Descrição", 20, y);
      y += lineHeight;
      
      doc.setFontSize(12);
      const descriptionLines = doc.splitTextToSize(audit.description, 170);
      doc.text(descriptionLines, 20, y);
    }
    
    // Save the PDF
    doc.save(`Audit_${audit.id}_report.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating audit PDF:", error);
    throw error;
  }
};
