
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

type ExportFormat = "pdf" | "excel";

/**
 * Process non-conformance data based on report type
 */
export const processReportData = (title: string, nonConformances: any[]) => {
  let reportData: Record<string, any> = {};
  
  if (title.includes("por Departamento")) {
    reportData = nonConformances.reduce((acc: Record<string, number>, nc) => {
      const deptName = nc.department?.name || 'Não especificado';
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {});
  } 
  else if (title.includes("por Tipo")) {
    reportData = nonConformances.reduce((acc: Record<string, number>, nc) => {
      // Supondo que o tipo está na descrição, ajuste conforme necessário
      const type = nc.description?.includes("Processo") ? "Processo" : 
                  nc.description?.includes("Produto") ? "Produto" : "Outros";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }
  else if (title.includes("Status")) {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'in-progress': 'Em Andamento',
      'resolved': 'Resolvido',
      'closed': 'Encerrado',
    };
    
    reportData = nonConformances.reduce((acc: Record<string, number>, nc) => {
      const status = statusMap[nc.status] || nc.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }
  else if (title.includes("Tempo de Resolução")) {
    const resolutionTimes = nonConformances
      .filter(nc => nc.completion_date && nc.occurrence_date)
      .map(nc => {
        const start = new Date(nc.occurrence_date);
        const end = new Date(nc.completion_date);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return { id: nc.id, code: nc.code, days: diffDays };
      });
      
    reportData = resolutionTimes.reduce((acc: Record<string, any[]>, item) => {
      const rangeKey = item.days <= 7 ? '0-7 dias' :
                     item.days <= 14 ? '8-14 dias' :
                     item.days <= 30 ? '15-30 dias' : 'Mais de 30 dias';
      
      if (!acc[rangeKey]) acc[rangeKey] = [];
      acc[rangeKey].push({ code: item.code, days: item.days });
      return acc;
    }, {});
  }
  else if (title.includes("por Gravidade")) {
    reportData = nonConformances.reduce((acc: Record<string, number>, nc) => {
      // Aqui estamos simulando a gravidade com base no título
      const hasUrgentKeywords = (nc.title || "").toLowerCase().includes("urgente") || 
                              (nc.title || "").toLowerCase().includes("crítico");
      const severity = hasUrgentKeywords ? "Crítico" : 
                      nc.status === "resolved" ? "Normal" : "Moderado";
      
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {});
  }

  return reportData;
};

/**
 * Export report data to PDF format
 */
export const exportToPDF = (
  title: string,
  description: string,
  type: string, 
  updatedAt: string,
  reportData: Record<string, any>
): void => {
  // Create a PDF document
  const doc = new jsPDF();
  
  // Add title and content
  doc.setFontSize(18);
  doc.text(title, 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Tipo: ${type}`, 20, 35);
  doc.text(`Atualizado em: ${updatedAt}`, 20, 45);
  
  doc.setFontSize(14);
  doc.text("Descrição:", 20, 60);
  
  doc.setFontSize(12);
  const descriptionLines = doc.splitTextToSize(description, 170);
  doc.text(descriptionLines, 20, 70);
  
  // Adicionar dados reais do relatório
  let y = 90;
  doc.setFontSize(14);
  doc.text("Dados do Relatório:", 20, y);
  y += 10;
  
  doc.setFontSize(12);
  Object.entries(reportData).forEach(([key, value], index) => {
    const valueDisplay = typeof value === 'number' ? value.toString() : 
                        Array.isArray(value) ? `${value.length} registros` : 
                        JSON.stringify(value).substring(0, 30) + (JSON.stringify(value).length > 30 ? "..." : "");
    
    doc.text(`${key}: ${valueDisplay}`, 30, y);
    y += 8;
    
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });
  
  // Save the PDF
  const filename = `${title.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}`;
  doc.save(`${filename}.pdf`);
};

/**
 * Export report data to Excel format
 */
export const exportToExcel = (
  title: string,
  reportData: Record<string, any>
): void => {
  // Create Excel workbook
  const wb = XLSX.utils.book_new();
  
  // Preparar dados para o Excel
  let wsData: any[] = [];
  
  if (typeof Object.values(reportData)[0] === 'number') {
    // Dados simples (chave-valor)
    wsData = [
      ["Categoria", "Quantidade"],
      ...Object.entries(reportData).map(([key, value]) => [key, value])
    ];
  } 
  else if (Array.isArray(Object.values(reportData)[0])) {
    // Dados com arrays
    // Primeiro, criar um cabeçalho adequado
    wsData = [["Categoria", "Quantidade de Itens"]];
    
    // Adicionar entradas para cada categoria
    Object.entries(reportData).forEach(([key, items]) => {
      if (Array.isArray(items)) {
        wsData.push([key, items.length]);
      }
    });
    
    // Adicionar uma planilha detalhada para cada categoria
    Object.entries(reportData).forEach(([key, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        const detailSheet = [
          ["Código", "Dias para Resolução"],
          ...items.map((item: any) => [item.code || "N/A", item.days || "N/A"])
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(detailSheet);
        XLSX.utils.book_append_sheet(wb, ws, key.substring(0, 30));
      }
    });
  }
  else {
    // Outros tipos de dados, criar uma versão genérica
    wsData = [
      ["Dados do Relatório"],
      ["Título", title],
      ["Detalhes:"]
    ];
    
    // Adicionar entradas para os dados, mesmo que complexos
    Object.entries(reportData).forEach(([key, value]) => {
      wsData.push([key, JSON.stringify(value)]);
    });
  }
  
  // Create worksheet para a visão geral
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");
  
  // Generate Excel file
  const filename = `${title.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}`;
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

/**
 * Handle the report export process
 */
export const handleReportExport = async (
  format: ExportFormat, 
  title: string, 
  description: string,
  type: string,
  updatedAt: string,
  nonConformances: any[]
): Promise<void> => {
  try {
    // Replacing toast.success with standard toast call
    toast({
      title: "Iniciando download",
      description: `${title} em formato ${format.toUpperCase()}`
    });
    
    // Process data based on report type
    const reportData = processReportData(title, nonConformances);
    
    // Export to the requested format
    if (format === "pdf") {
      exportToPDF(title, description, type, updatedAt, reportData);
    } else {
      exportToExcel(title, reportData);
    }
    
    // Replacing toast.success with standard toast call
    toast({
      title: "Download concluído",
      description: `${title} baixado com sucesso!`
    });
  } catch (error) {
    console.error("Error generating file:", error);
    // Replacing toast.error with standard toast call with variant
    toast({
      variant: "destructive",
      title: "Erro ao gerar arquivo",
      description: `Não foi possível gerar o arquivo ${format.toUpperCase()}.`
    });
  }
};
