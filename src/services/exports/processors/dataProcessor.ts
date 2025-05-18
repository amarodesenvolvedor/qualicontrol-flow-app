
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
