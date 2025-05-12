
import { NonConformance } from "@/types/nonConformance";
import { AuditReport } from "@/types/audit";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

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
 * Exports non-conformance data to Excel format
 * 
 * @param nonConformance The non-conformance object to export
 * @param options Optional export options like included fields
 * @returns A promise that resolves when the Excel file has been generated
 */
export const exportNonConformanceToExcel = async (
  nonConformance: NonConformance,
  options?: {
    includeFields?: (keyof NonConformance)[]
  }
): Promise<void> => {
  try {
    // Determine which fields to include
    const fields = options?.includeFields || [
      'code', 'title', 'description', 'status', 'category',
      'department_id', 'responsible_name', 'auditor_name', 
      'occurrence_date', 'deadline_date', 'created_at'
    ];
    
    // Create worksheet data
    const wsData = [fields]; // Header row
    
    // Format data row
    const dataRow: any[] = [];
    
    fields.forEach(field => {
      const key = field as keyof NonConformance;
      let value = nonConformance[key];
      
      // Format dates for readability
      if (typeof value === 'string' && field.toString().includes('date') && value) {
        value = format(new Date(value), 'dd/MM/yyyy');
      }
      
      // Handle department special case
      if (field === 'department_id' && nonConformance.department) {
        value = nonConformance.department.name;
      }
      
      dataRow.push(value);
    });
    
    wsData.push(dataRow);
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "NonConformance");
    
    // Generate Excel file
    XLSX.writeFile(wb, `${nonConformance.code}_data.xlsx`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating Excel:", error);
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

/**
 * Exports audit report data to Excel format
 * 
 * @param audit The audit report to export
 * @returns A promise that resolves when the Excel file has been generated
 */
export const exportAuditToExcel = async (audit: AuditReport): Promise<void> => {
  try {
    // Create worksheet data
    const fields = ['id', 'title', 'status', 'description', 'audit_date', 'created_at', 'department_id'];
    const wsData = [fields]; // Header row
    
    // Format data row
    const dataRow: any[] = [];
    
    fields.forEach(field => {
      let value = audit[field as keyof typeof audit];
      
      // Format dates for readability
      if (typeof value === 'string' && field.includes('date') && value) {
        value = format(new Date(value), 'dd/MM/yyyy');
      }
      
      dataRow.push(value);
    });
    
    wsData.push(dataRow);
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Audit");
    
    // Generate Excel file
    XLSX.writeFile(wb, `Audit_${audit.id}_data.xlsx`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating audit Excel:", error);
    throw error;
  }
};
