
import { format } from "date-fns";

/**
 * Transforms non-conformance data into a format suitable for reports based on report type
 */
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
