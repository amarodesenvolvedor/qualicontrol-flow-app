
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import { format } from "date-fns";

export interface ExportedData {
  [key: string]: any;
}

export const getReportData = (reportType: string, nonConformances: any[], auditReports: any[]) => {
  // Status map para traduzir o status para português
  const statusMap: Record<string, string> = {
    'pending': 'Pendente',
    'in-progress': 'Em Andamento',
    'resolved': 'Resolvido',
    'closed': 'Encerrado',
    'critical': 'Crítico',
    'completed': 'Concluído'
  };

  switch (reportType) {
    case "Não Conformidades Completo":
      return nonConformances.map(nc => ({
        codigo: nc.code,
        titulo: nc.title,
        status: statusMap[nc.status] || nc.status,
        departamento: nc.department?.name,
        categoria: nc.category || "N/A",
        responsavel: nc.responsible_name,
        data_ocorrencia: nc.occurrence_date ? format(new Date(nc.occurrence_date), "dd/MM/yyyy") : "N/A",
        prazo: nc.response_date ? format(new Date(nc.response_date), "dd/MM/yyyy") : "N/A"
      }));
    case "Ações Corretivas":
      return nonConformances
        .filter(nc => nc.immediate_actions)
        .map(nc => ({
          codigo: nc.code, 
          titulo: nc.title,
          acoes_imediatas: nc.immediate_actions,
          status: statusMap[nc.status] || nc.status,
          responsavel: nc.responsible_name
        }));
    case "Indicadores de Desempenho":
      // Sample KPI data
      const pendingCount = nonConformances.filter(nc => nc.status === 'pending').length;
      const inProgressCount = nonConformances.filter(nc => nc.status === 'in-progress').length;
      const resolvedCount = nonConformances.filter(nc => nc.status === 'resolved').length;
      const totalCount = nonConformances.length;
      
      return [
        { indicador: "Não Conformidades em Aberto", valor: pendingCount, percentual: totalCount ? (pendingCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicador: "Não Conformidades em Progresso", valor: inProgressCount, percentual: totalCount ? (inProgressCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicador: "Não Conformidades Resolvidas", valor: resolvedCount, percentual: totalCount ? (resolvedCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicador: "Total de Não Conformidades", valor: totalCount, percentual: "100%" },
      ];
    case "Cronograma de Auditorias":
      return auditReports.map(audit => ({
        titulo: audit.title,
        status: statusMap[audit.status] || audit.status,
        departamento: audit.department_id ? "Departamento" : "N/A", // Substituir por nome real do departamento se disponível
        data_auditoria: audit.audit_date ? format(new Date(audit.audit_date), "dd/MM/yyyy") : "N/A",
        nome_arquivo: audit.file_name
      }));
    default:
      return [];
  }
};

export const generateExcelReport = async (reportType: string, data: any[]): Promise<void> => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Get headers from first data item
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  
  // Convert data to array format for excel
  const wsData = [
    headers,
    ...data.map(item => headers.map(header => item[header] || ""))
  ];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, reportType.slice(0, 30));
  
  // Generate Excel file
  XLSX.writeFile(wb, `${reportType.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.xlsx`);
};

export const generatePDFReport = async (reportType: string, data: any[]): Promise<void> => {
  // Create PDF document
  const doc = new jsPDF();
  const lineHeight = 10;
  let y = 20;
  
  // Add title
  doc.setFontSize(18);
  doc.text(reportType, 20, y);
  y += lineHeight * 2;
  
  // Add date info
  doc.setFontSize(12);
  doc.text(`Data de geração: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 20, y);
  y += lineHeight * 1.5;
  
  // If data exists
  if (data.length > 0) {
    // Get headers
    const headers = Object.keys(data[0]);
    
    // Determine if we need to create a table or just list the items
    if (headers.length <= 2 || data.length <= 5) {
      // Simple listing format for small datasets
      data.forEach((item, index) => {
        doc.setFontSize(14);
        doc.text(`Item ${index + 1}`, 20, y);
        y += lineHeight;
        
        doc.setFontSize(12);
        Object.entries(item).forEach(([key, value]) => {
          const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
          doc.text(`${formattedKey}: ${value}`, 30, y);
          y += lineHeight;
        });
        
        y += lineHeight / 2;
        
        // Add new page if needed
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });
    } else {
      // Create summary for larger datasets
      doc.setFontSize(14);
      doc.text(`Resumo (${data.length} registros)`, 20, y);
      y += lineHeight * 1.5;
      
      // List first few items as samples
      const sampleSize = Math.min(5, data.length);
      for (let i = 0; i < sampleSize; i++) {
        const item = data[i];
        doc.setFontSize(12);
        
        // Get the first 3-4 key properties to display
        const keysToShow = headers.slice(0, 4);
        const itemText = keysToShow.map(key => `${key}: ${item[key]}`).join(', ');
        doc.text(`- ${itemText}`, 30, y);
        y += lineHeight;
        
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      }
      
      if (data.length > sampleSize) {
        y += lineHeight / 2;
        doc.text(`... e mais ${data.length - sampleSize} registros`, 30, y);
      }
    }
  } else {
    doc.setFontSize(12);
    doc.text("Nenhum dado disponível para este relatório", 20, y);
  }
  
  // Save the PDF
  doc.save(`${reportType.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.pdf`);
};
