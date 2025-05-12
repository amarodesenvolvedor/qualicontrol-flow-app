
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import { format } from "date-fns";

export interface ExportedData {
  [key: string]: any;
}

export const getReportData = (reportType: string, nonConformances: any[], auditReports: any[]) => {
  switch (reportType) {
    case "Não Conformidades Completo":
      return nonConformances.map(nc => ({
        code: nc.code,
        title: nc.title,
        status: nc.status,
        department: nc.department?.name,
        category: nc.category,
        responsible: nc.responsible_name,
        occurrence_date: format(new Date(nc.occurrence_date), "dd/MM/yyyy"),
        deadline_date: nc.deadline_date ? format(new Date(nc.deadline_date), "dd/MM/yyyy") : "N/A"
      }));
    case "Ações Corretivas":
      return nonConformances
        .filter(nc => nc.immediate_actions)
        .map(nc => ({
          code: nc.code, 
          title: nc.title,
          actions: nc.immediate_actions,
          status: nc.status,
          responsible: nc.responsible_name
        }));
    case "Indicadores de Desempenho":
      // Sample KPI data
      const pendingCount = nonConformances.filter(nc => nc.status === 'pending').length;
      const inProgressCount = nonConformances.filter(nc => nc.status === 'in-progress').length;
      const resolvedCount = nonConformances.filter(nc => nc.status === 'resolved').length;
      const totalCount = nonConformances.length;
      
      return [
        { indicator: "Não Conformidades em Aberto", value: pendingCount, percentage: totalCount ? (pendingCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicator: "Não Conformidades em Progresso", value: inProgressCount, percentage: totalCount ? (inProgressCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicator: "Não Conformidades Resolvidas", value: resolvedCount, percentage: totalCount ? (resolvedCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicator: "Total de Não Conformidades", value: totalCount, percentage: "100%" },
      ];
    case "Cronograma de Auditorias":
      return auditReports.map(audit => ({
        title: audit.title,
        status: audit.status,
        department: "Departamento", // Replace with actual department name if available
        audit_date: format(new Date(audit.audit_date), "dd/MM/yyyy"),
        file_name: audit.file_name
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
  XLSX.writeFile(wb, `${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
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
      const sampleSize = Math.min(3, data.length);
      for (let i = 0; i < sampleSize; i++) {
        const item = data[i];
        doc.setFontSize(12);
        
        // Get the first 2-3 key properties to display
        const keysToShow = headers.slice(0, 3);
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
  doc.save(`${reportType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
