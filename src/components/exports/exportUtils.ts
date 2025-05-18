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
    headers.map(h => h.charAt(0).toUpperCase() + h.slice(1).replace(/_/g, ' ')), // Format header text
    ...data.map(item => headers.map(header => item[header] || ""))
  ];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Apply enhanced styling
  if (wsData.length > 0) {
    // Style header row (corporate blue background, white text)
    const headerRange = { s: { c: 0, r: 0 }, e: { c: headers.length - 1, r: 0 } };
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cell]) continue;
      if (!ws[cell].s) ws[cell].s = {};
      ws[cell].s.font = { bold: true, color: { rgb: "FFFFFF" } };
      ws[cell].s.fill = { fgColor: { rgb: "293594" } }; // Corporate blue
      ws[cell].s.alignment = { horizontal: "center" };
    }
    
    // Add styling to data rows (alternating colors and borders)
    for (let R = 1; R < wsData.length; ++R) {
      for (let C = 0; C < wsData[R].length; ++C) {
        const cell = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cell]) continue;
        if (!ws[cell].s) ws[cell].s = {};
        
        // Add borders to all cells
        ws[cell].s.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        };
        
        // Alternate row coloring
        if (R % 2 === 1) {
          ws[cell].s.fill = { fgColor: { rgb: "F5F5FA" } }; // Light background
        }
      }
    }
  }
  
  // Format column widths
  const colWidths = headers.map(() => ({ wch: 20 })); // Wider default width
  ws['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, reportType.slice(0, 30));
  
  // Add metadata sheet with corporate branding
  const metadataWs = XLSX.utils.aoa_to_sheet([
    ['Informações do Relatório'],
    ['Tipo de Relatório', reportType],
    ['Data de Geração', format(new Date(), 'dd/MM/yyyy HH:mm')],
    ['Número de Registros', data.length.toString()],
    ['Empresa', 'Sistema de Gestão de Não Conformidades']
  ]);
  
  // Style metadata sheet header
  const metadataHeaderCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
  if (metadataWs[metadataHeaderCell]) {
    if (!metadataWs[metadataHeaderCell].s) metadataWs[metadataHeaderCell].s = {};
    metadataWs[metadataHeaderCell].s.font = { bold: true, color: { rgb: "FFFFFF" } };
    metadataWs[metadataHeaderCell].s.fill = { fgColor: { rgb: "293594" } };
  }
  
  XLSX.utils.book_append_sheet(wb, metadataWs, "Info");
  
  // Generate Excel file
  XLSX.writeFile(wb, `${reportType.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.xlsx`);
};

export const generatePDFReport = async (reportType: string, data: any[]): Promise<void> => {
  // Create PDF document
  const doc = new jsPDF();
  addHeaderToPDF(doc, reportType);
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const lineHeight = 10;
  let y = 40; // Start below header
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(41, 65, 148); // Corporate blue
  doc.text(reportType, pageWidth / 2, y, { align: 'center' });
  y += lineHeight * 2;
  
  // Add date info with styled box
  doc.setFillColor(245, 245, 250); // Light background
  doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'S');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Data de geração: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 25, y + 5);
  y += lineHeight * 2.5;
  
  // If data exists
  if (data.length > 0) {
    // Determine if we need to create a table or just list the items
    if (data.length <= 5) {
      // Simple listing format for small datasets
      data.forEach((item, index) => {
        // Add item box with light background
        doc.setFillColor(245, 245, 250);
        doc.rect(15, y - 5, pageWidth - 30, lineHeight * 4, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.rect(15, y - 5, pageWidth - 30, lineHeight * 4, 'S');
        
        // Item title with brand color
        doc.setFontSize(14);
        doc.setTextColor(41, 65, 148);
        doc.text(`Item ${index + 1}`, 20, y);
        y += lineHeight;
        
        // Item details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        Object.entries(item).forEach(([key, value]) => {
          const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
          doc.text(`${formattedKey}: ${value}`, 30, y);
          y += lineHeight;
        });
        
        y += lineHeight / 2;
        
        // Add new page if needed
        if (y > 250) {
          addFooterToPDF(doc, reportType, 1, 1); // Add footer before new page
          doc.addPage();
          addHeaderToPDF(doc, reportType); // Add header to new page
          y = 40; // Reset Y position
        }
      });
    } else {
      // Create enhanced table format for larger datasets
      // Get headers
      const headers = Object.keys(data[0]);
      
      // Table header with brand color background
      doc.setFillColor(41, 65, 148);
      doc.rect(15, y, pageWidth - 30, lineHeight, 'F');
      
      // Header text
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      
      // Calculate column widths (limited to max 4 columns for readability)
      const colWidth = (pageWidth - 30) / Math.min(headers.length, 4);
      
      // Draw header cells
      headers.slice(0, 4).forEach((header, i) => {
        const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
        doc.text(formattedHeader, 20 + (i * colWidth), y + 7);
      });
      
      y += lineHeight + 2;
      
      // Draw data rows with improved styling
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      
      // Show only first 10 rows to keep report manageable
      const maxToShow = Math.min(10, data.length);
      for (let i = 0; i < maxToShow; i++) {
        const item = data[i];
        
        // Alternate row background for readability
        if (i % 2 === 0) {
          doc.setFillColor(245, 245, 250);
          doc.rect(15, y - 5, pageWidth - 30, lineHeight, 'F');
        }
        
        // Row data
        headers.slice(0, 4).forEach((header, j) => {
          const text = String(item[header]).slice(0, 20) + (String(item[header]).length > 20 ? '...' : '');
          doc.text(text, 20 + (j * colWidth), y);
        });
        
        y += lineHeight;
        
        // Add new page if needed
        if (y > 250 && i < maxToShow - 1) {
          addFooterToPDF(doc, reportType, 1, 1);
          doc.addPage();
          addHeaderToPDF(doc, reportType);
          y = 40;
          
          // Redraw header on new page
          doc.setFillColor(41, 65, 148);
          doc.rect(15, y, pageWidth - 30, lineHeight, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFont("helvetica", "bold");
          headers.slice(0, 4).forEach((header, i) => {
            const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
            doc.text(formattedHeader, 20 + (i * colWidth), y + 7);
          });
          
          y += lineHeight + 2;
          doc.setTextColor(0, 0, 0);
          doc.setFont("helvetica", "normal");
        }
      }
      
      // Indicate if there are more records
      if (data.length > maxToShow) {
        y += lineHeight / 2;
        doc.text(`... e mais ${data.length - maxToShow} registros`, 20, y);
      }
    }
  } else {
    // No data message
    doc.setFillColor(245, 245, 250);
    doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, y - 5, pageWidth - 40, lineHeight + 10, 'S');
    
    doc.setFontSize(12);
    doc.text("Nenhum dado disponível para este relatório", 25, y + 5);
  }
  
  // Add summary section
  y += lineHeight * 2;
  doc.setFillColor(41, 65, 148);
  doc.rect(15, y, pageWidth - 30, lineHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumo", pageWidth / 2, y + 7, { align: 'center' });
  y += lineHeight + 5;
  
  doc.setFillColor(245, 245, 250);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight * 2, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, y - 5, pageWidth - 40, lineHeight * 2, 'S');
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Total de registros: ${data.length}`, 25, y + 5);
  
  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooterToPDF(doc, reportType, i, pageCount);
  }
  
  // Save the PDF
  doc.save(`${reportType.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.pdf`);
};

// Helper function for adding header to PDF
function addHeaderToPDF(doc: jsPDF, title: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Draw header background
  doc.setFillColor(41, 65, 148); // Corporate blue
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  // Company name in header
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Sistema de Gestão de Não Conformidades", 10, 13);
  
  // Date in header
  const today = format(new Date(), "dd/MM/yyyy");
  doc.setFontSize(10);
  doc.text(`Emitido em: ${today}`, pageWidth - 15, 13, { align: "right" });
  
  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(10, 22, pageWidth - 10, 22);
}

// Helper function for adding footer to PDF
function addFooterToPDF(doc: jsPDF, reportType: string, currentPage: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
  
  // Footer text
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Relatório: ${reportType}`, 10, pageHeight - 10);
  
  // Page number
  doc.text(`Página ${currentPage} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" });
}
