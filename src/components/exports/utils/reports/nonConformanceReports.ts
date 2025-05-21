
import { format } from "date-fns";
import { STATUS_MAP } from "./types";

/**
 * Transform data for nonconformance reports
 */
export function transformNonConformanceData(filteredNonConformances: any[], reportType: string) {
  switch (reportType) {
    case "Não Conformidades Completo":
      return filteredNonConformances.map(nc => ({
        codigo: nc.code,
        titulo: nc.title,
        status: STATUS_MAP[nc.status] || nc.status,
        departamento: nc.department?.name,
        categoria: nc.category || "N/A",
        responsavel: nc.responsible_name,
        data_ocorrencia: nc.occurrence_date ? format(new Date(nc.occurrence_date), "dd/MM/yyyy") : "N/A",
        prazo: nc.response_date ? format(new Date(nc.response_date), "dd/MM/yyyy") : "N/A"
      }));
      
    case "Ações Corretivas":
      return filteredNonConformances
        .filter(nc => nc.immediate_actions)
        .map(nc => ({
          codigo: nc.code, 
          titulo: nc.title,
          acoes_imediatas: nc.immediate_actions,
          status: STATUS_MAP[nc.status] || nc.status,
          responsavel: nc.responsible_name
        }));
        
    case "Indicadores de Desempenho":
      // Sample KPI data
      const pendingCount = filteredNonConformances.filter(nc => nc.status === 'pending').length;
      const inProgressCount = filteredNonConformances.filter(nc => nc.status === 'in-progress').length;
      const resolvedCount = filteredNonConformances.filter(nc => nc.status === 'resolved').length;
      const totalCount = filteredNonConformances.length;
      
      return [
        { indicador: "Não Conformidades em Aberto", valor: pendingCount, percentual: totalCount ? (pendingCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicador: "Não Conformidades em Progresso", valor: inProgressCount, percentual: totalCount ? (inProgressCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicador: "Não Conformidades Resolvidas", valor: resolvedCount, percentual: totalCount ? (resolvedCount / totalCount * 100).toFixed(1) + "%" : "0%" },
        { indicador: "Total de Não Conformidades", valor: totalCount, percentual: "100%" },
      ];
        
    default:
      return [];
  }
}
