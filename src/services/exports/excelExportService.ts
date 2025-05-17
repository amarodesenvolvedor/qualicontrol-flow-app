
import { NonConformance } from "@/types/nonConformance";
import { AuditReport } from "@/types/audit";
import { format } from "date-fns";
import * as XLSX from 'xlsx';

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
    includeFields?: (keyof NonConformance)[];
    companyName?: string;
  }
): Promise<void> => {
  try {
    const companyName = options?.companyName || 'Sistema de Gestão';
    
    // Determine which fields to include
    const fields = options?.includeFields || [
      'code', 'title', 'description', 'status', 
      'department_id', 'responsible_name', 'auditor_name', 
      'occurrence_date', 'response_date', 'completion_date', 'created_at'
    ];
    
    // Traduzir os nomes dos campos para português
    const fieldTranslations: Record<string, string> = {
      'code': 'Código',
      'title': 'Título',
      'description': 'Descrição',
      'status': 'Status',
      'department_id': 'Departamento',
      'responsible_name': 'Responsável',
      'auditor_name': 'Auditor',
      'occurrence_date': 'Data de Ocorrência',
      'response_date': 'Data de Resposta',
      'completion_date': 'Data de Conclusão',
      'created_at': 'Data de Criação',
      'location': 'Local',
      'immediate_actions': 'Ações Imediatas'
    };
    
    // Traduzir status
    const statusTranslations: Record<string, string> = {
      'pending': 'Pendente',
      'in-progress': 'Em Andamento',
      'resolved': 'Resolvido',
      'closed': 'Concluído',
      'critical': 'Crítico'
    };
    
    // Criar cabeçalho traduzido
    const translatedHeaders = fields.map(field => fieldTranslations[field as string] || field);
    
    // Create worksheet data
    const wsData = [translatedHeaders]; // Header row
    
    // Format data row
    const dataRow: any[] = [];
    
    fields.forEach(field => {
      const key = field as keyof NonConformance;
      let value = nonConformance[key];
      
      // Format dates for readability
      if (typeof value === 'string' && field.toString().includes('date') && value) {
        value = format(new Date(value), 'dd/MM/yyyy');
      }
      
      // Traduzir status
      if (field === 'status' && typeof value === 'string') {
        value = statusTranslations[value] || value;
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
    
    // Estilizar o cabeçalho (negrito)
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } }
    };
    
    // Aplicar estilo às células do cabeçalho (isso é apenas indicativo, o XLSX-js tem limitações com estilos)
    const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cell]) continue;
      ws[cell].s = headerStyle;
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Não Conformidade");
    
    // Adicionar uma planilha de metadados
    const metadataWs = XLSX.utils.aoa_to_sheet([
      ['Informações do Relatório'],
      ['Empresa', companyName],
      ['Data de Geração', format(new Date(), 'dd/MM/yyyy HH:mm')],
      ['Tipo de Documento', 'Relatório de Não Conformidade'],
      ['Código', nonConformance.code || 'N/A'],
      ['Status', statusTranslations[nonConformance.status] || nonConformance.status]
    ]);
    
    XLSX.utils.book_append_sheet(wb, metadataWs, "Informações");
    
    // Generate Excel file
    XLSX.writeFile(wb, `${nonConformance.code}_${format(new Date(), "yyyyMMdd")}.xlsx`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating Excel:", error);
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
    // Mapear campos do relatório de auditoria
    const fieldTranslations: Record<string, string> = {
      'id': 'ID',
      'title': 'Título',
      'status': 'Status',
      'description': 'Descrição',
      'audit_date': 'Data da Auditoria',
      'created_at': 'Data de Criação',
      'department_id': 'Departamento'
    };
    
    // Traduzir status
    const statusTranslations: Record<string, string> = {
      'pending': 'Pendente',
      'in-progress': 'Em Andamento',
      'completed': 'Concluído',
      'closed': 'Concluído'
    };
    
    // Create worksheet data
    const fields = ['id', 'title', 'status', 'description', 'audit_date', 'created_at', 'department_id'];
    const translatedHeaders = fields.map(field => fieldTranslations[field] || field);
    const wsData = [translatedHeaders]; // Header row
    
    // Format data row
    const dataRow: any[] = [];
    
    fields.forEach(field => {
      let value = audit[field as keyof typeof audit];
      
      // Format dates for readability
      if (typeof value === 'string' && field.includes('date') && value) {
        value = format(new Date(value), 'dd/MM/yyyy');
      }
      
      // Traduzir status
      if (field === 'status' && typeof value === 'string') {
        value = statusTranslations[value] || value;
      }
      
      dataRow.push(value);
    });
    
    wsData.push(dataRow);
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Estilo para cabeçalho
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F81BD" } }
    };
    
    // Aplicar estilo às células do cabeçalho
    const headerRange = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cell]) continue;
      ws[cell].s = headerStyle;
    }
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Auditoria");
    
    // Adicionar planilha de metadados
    const metadataWs = XLSX.utils.aoa_to_sheet([
      ['Informações do Relatório de Auditoria'],
      ['Empresa', 'Sistema de Gestão'],
      ['Data de Geração', format(new Date(), 'dd/MM/yyyy HH:mm')],
      ['Tipo de Documento', 'Relatório de Auditoria'],
      ['ID da Auditoria', audit.id],
      ['Status', statusTranslations[audit.status] || audit.status]
    ]);
    
    XLSX.utils.book_append_sheet(wb, metadataWs, "Informações");
    
    // Generate Excel file
    XLSX.writeFile(wb, `Audit_${audit.id}_${format(new Date(), "yyyyMMdd")}.xlsx`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating audit Excel:", error);
    throw error;
  }
};
