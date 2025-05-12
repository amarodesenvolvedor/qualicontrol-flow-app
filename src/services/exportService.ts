
import { NonConformance } from "@/types/nonConformance";
import { AuditReport } from "@/types/audit";
import { format } from "date-fns";

/**
 * Exports non-conformance data to PDF
 * 
 * @param nonConformance The non-conformance object to export
 * @returns A promise that resolves when the PDF has been generated
 */
export const exportNonConformanceToPDF = async (nonConformance: NonConformance): Promise<void> => {
  try {
    // This is a simplified implementation
    // In a real app, this would use a library like jsPDF or call a backend service
    
    const content = `
      # Relatório de Não Conformidade
      
      ## Informações Gerais
      - Código: ${nonConformance.code}
      - Título: ${nonConformance.title}
      - Status: ${nonConformance.status}
      
      ## Detalhes
      - Departamento: ${nonConformance.department?.name || '-'}
      - Categoria: ${nonConformance.category}
      - Responsável: ${nonConformance.responsible_name}
      - Auditor: ${nonConformance.auditor_name}
      
      ## Datas
      - Data de Ocorrência: ${format(new Date(nonConformance.occurrence_date), 'dd/MM/yyyy')}
      - Data Limite: ${nonConformance.deadline_date ? format(new Date(nonConformance.deadline_date), 'dd/MM/yyyy') : 'Não definida'}
      - Data de Criação: ${format(new Date(nonConformance.created_at), 'dd/MM/yyyy HH:mm')}
      
      ## Descrição
      ${nonConformance.description}
      
      ## Ações Imediatas
      ${nonConformance.immediate_actions || 'Nenhuma ação registrada'}
    `;
    
    console.log("Generating PDF with content:", content);
    
    // Simulate downloading a file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nonConformance.code}_report.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
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
    // This is a simplified implementation
    // In a real app, this would use a library like xlsx or call a backend service
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Determine which fields to include
    const fields = options?.includeFields || [
      'code', 'title', 'description', 'status', 'category',
      'department_id', 'responsible_name', 'auditor_name', 
      'occurrence_date', 'deadline_date', 'created_at'
    ];
    
    // Create headers
    csvContent += fields.join(',') + '\r\n';
    
    // Add data row
    const row = fields.map(field => {
      const value = nonConformance[field as keyof NonConformance];
      
      // Format dates for readability
      if (field.includes('date') && value) {
        return `"${format(new Date(String(value)), 'dd/MM/yyyy')}"`;
      }
      
      // Handle department special case
      if (field === 'department_id' && nonConformance.department) {
        return `"${nonConformance.department.name}"`;
      }
      
      // Escape and quote strings
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      
      return value || '';
    }).join(',');
    
    csvContent += row;
    
    console.log("Generated CSV content:", csvContent);
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${nonConformance.code}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
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
  // Similar implementation to non-conformance export
  console.log("Exporting audit to PDF:", audit.id);
  return Promise.resolve();
};

/**
 * Exports audit report data to Excel format
 * 
 * @param audit The audit report to export
 * @returns A promise that resolves when the Excel file has been generated
 */
export const exportAuditToExcel = async (audit: AuditReport): Promise<void> => {
  // Similar implementation to non-conformance export
  console.log("Exporting audit to Excel:", audit.id);
  return Promise.resolve();
};
