
import { NonConformance } from "@/types/nonConformance";
import { AuditReport } from "@/types/audit";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

/**
 * Exports non-conformance data to PDF
 * 
 * @param nonConformance The non-conformance object to export
 * @returns A promise that resolves when the PDF has been generated
 */
export const exportNonConformanceToPDF = async (nonConformance: NonConformance): Promise<void> => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    const lineHeight = 10;
    let y = 20;

    // Add title
    doc.setFontSize(18);
    doc.text(`Relatório de Não Conformidade: ${nonConformance.code}`, 20, y);
    y += lineHeight * 2;

    // Add section: Informações Gerais
    doc.setFontSize(16);
    doc.text("Informações Gerais", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.text(`Código: ${nonConformance.code}`, 20, y);
    y += lineHeight;
    
    doc.text(`Título: ${nonConformance.title}`, 20, y);
    y += lineHeight;
    
    doc.text(`Status: ${nonConformance.status}`, 20, y);
    y += lineHeight * 1.5;

    // Add section: Detalhes
    doc.setFontSize(16);
    doc.text("Detalhes", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.text(`Departamento: ${nonConformance.department?.name || '-'}`, 20, y);
    y += lineHeight;
    
    doc.text(`Categoria: ${nonConformance.category}`, 20, y);
    y += lineHeight;
    
    doc.text(`Responsável: ${nonConformance.responsible_name}`, 20, y);
    y += lineHeight;
    
    doc.text(`Auditor: ${nonConformance.auditor_name}`, 20, y);
    y += lineHeight * 1.5;
    
    // Add section: Datas
    doc.setFontSize(16);
    doc.text("Datas", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.text(`Ocorrência: ${format(new Date(nonConformance.occurrence_date), "dd/MM/yyyy")}`, 20, y);
    y += lineHeight;
    
    doc.text(`Limite: ${nonConformance.deadline_date ? format(new Date(nonConformance.deadline_date), "dd/MM/yyyy") : "Não definida"}`, 20, y);
    y += lineHeight;
    
    doc.text(`Criação: ${format(new Date(nonConformance.created_at), "dd/MM/yyyy HH:mm")}`, 20, y);
    y += lineHeight * 1.5;
    
    // Add section: Descrição
    doc.setFontSize(16);
    doc.text("Descrição", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    const descriptionLines = doc.splitTextToSize(nonConformance.description, 170);
    doc.text(descriptionLines, 20, y);
    y += lineHeight * (descriptionLines.length + 1);
    
    // Add page if needed
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    // Add section: Ações Imediatas
    doc.setFontSize(16);
    doc.text("Ações Imediatas", 20, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    const actionsLines = doc.splitTextToSize(nonConformance.immediate_actions || "Nenhuma ação registrada", 170);
    doc.text(actionsLines, 20, y);
    
    // Save the PDF
    doc.save(`${nonConformance.code}_report.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

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
