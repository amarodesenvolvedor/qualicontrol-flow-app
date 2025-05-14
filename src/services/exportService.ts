
// Re-export all export services from their dedicated files
export * from './exports/pdfExportService';
export * from './exports/excelExportService';

// Generate report data based on non-conformances
export const generateReportData = (nonConformances: any[], type: string) => {
  switch (type) {
    case 'department':
      return nonConformances.reduce((acc, nc) => {
        const deptName = nc.department?.name || 'Não especificado';
        acc[deptName] = (acc[deptName] || 0) + 1;
        return acc;
      }, {});
      
    case 'status':
      return nonConformances.reduce((acc, nc) => {
        const statusMap: Record<string, string> = {
          'pending': 'Pendente',
          'in-progress': 'Em Andamento',
          'completed': 'Concluído',
          'closed': 'Fechado',
          'critical': 'Crítico'
        };
        const status = statusMap[nc.status] || nc.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});
      
    case 'category':
      return nonConformances.reduce((acc, nc) => {
        const category = nc.category || 'Não categorizado';
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});
      
    case 'severity':
      // Implementação de exemplo para gravidade (assumindo que seja um campo)
      // Ajuste conforme necessário baseado na estrutura real dos dados
      return nonConformances.reduce((acc, nc) => {
        const severity = nc.severity || 'Normal';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      }, {});
      
    case 'resolution_time':
      const resolutionTimes = nonConformances
        .filter(nc => nc.completion_date && nc.occurrence_date)
        .map(nc => {
          const start = new Date(nc.occurrence_date);
          const end = new Date(nc.completion_date);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return { id: nc.id, days: diffDays };
        });
        
      return resolutionTimes.reduce((acc: Record<string, number[]>, item) => {
        const rangeKey = item.days <= 7 ? '0-7 dias' :
                       item.days <= 14 ? '8-14 dias' :
                       item.days <= 30 ? '15-30 dias' : 'Mais de 30 dias';
        
        if (!acc[rangeKey]) acc[rangeKey] = [];
        acc[rangeKey].push(item.days);
        return acc;
      }, {});
      
    default:
      return {};
  }
};
