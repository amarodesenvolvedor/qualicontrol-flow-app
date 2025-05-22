import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NonConformance } from "@/types/nonConformance";

/**
 * Transforma os dados de não conformidades para o formato de relatório
 */
export const transformNonConformanceData = (
  nonConformances: NonConformance[],
  reportType: string
) => {
  console.log(`Transforming ${nonConformances.length} non-conformances for report: ${reportType}`);
  
  // Para relatório completo, incluímos todos os campos relevantes
  if (reportType === "Não Conformidades Completo") {
    return nonConformances.map(nc => ({
      codigo: nc.code || 'N/A',
      id: nc.id,
      titulo: nc.title,
      departamento: nc.department?.name || 'Não especificado',
      requisito_iso: nc.iso_requirement || 'N/A',
      status: translateStatus(nc.status),
      responsavel: nc.responsible_name,
      auditor: nc.auditor_name,
      data_ocorrencia: formatDate(nc.occurrence_date),
      data_resposta: formatDate(nc.response_date),
      data_encerramento: formatDate(nc.completion_date),
      // Truncamos descrições muito longas para o relatório tabular
      descricao: truncateText(nc.description || '', 100),
      acoes_imediatas: truncateText(nc.immediate_actions || '', 80),
      analise_causa: truncateText(nc.root_cause_analysis || '', 80),
      acao_corretiva: truncateText(nc.corrective_action || '', 80)
    }));
  }
  
  // Para relatório de ações corretivas, focamos nas ações
  if (reportType === "Ações Corretivas") {
    return nonConformances.map(nc => ({
      codigo: nc.code || 'N/A',
      titulo: nc.title,
      departamento: nc.department?.name || 'Não especificado',
      status: translateStatus(nc.status),
      responsavel: nc.responsible_name,
      data_ocorrencia: formatDate(nc.occurrence_date),
      data_encerramento: formatDate(nc.completion_date),
      acoes_imediatas: truncateText(nc.immediate_actions || 'Não especificado', 80),
      acao_corretiva: truncateText(nc.corrective_action || 'Não especificado', 80)
    }));
  }
  
  // Para indicadores de desempenho, incluir métricas relevantes
  if (reportType === "Indicadores de Desempenho") {
    // Calcular tempo médio de resolução
    const resolutionTimes = nonConformances
      .filter(nc => nc.completion_date && nc.occurrence_date)
      .map(item => {
        const start = new Date(item.occurrence_date);
        const end = new Date(item.completion_date);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      });
    
    const avgResolutionTime = resolutionTimes.length > 0 
      ? Math.round(resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length) 
      : 0;
    
    // Contagem por status
    const statusCounts = {};
    nonConformances.forEach(nc => {
      const status = translateStatus(nc.status);
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    // Contagem por departamento
    const deptCounts = {};
    nonConformances.forEach(nc => {
      const dept = nc.department?.name || 'Não especificado';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    
    // Transforma as contagens em arrays para o relatório
    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      quantidade: count,
      porcentagem: `${Math.round((count as number / nonConformances.length) * 100)}%`
    }));
    
    const deptData = Object.entries(deptCounts).map(([dept, count]) => ({
      departamento: dept,
      quantidade: count,
      porcentagem: `${Math.round((count as number / nonConformances.length) * 100)}%`
    }));
    
    return [
      {
        total_registros: nonConformances.length,
        tempo_medio_resolucao: `${avgResolutionTime} dias`,
        status_pendente: statusCounts['Pendente'] || 0,
        status_em_andamento: statusCounts['Em Andamento'] || 0,
        status_resolvido: statusCounts['Resolvido'] || 0,
        status_fechado: statusCounts['Fechado'] || 0
      },
      ...statusData,
      ...deptData
    ];
  }
  
  // Retorno padrão (não deveria chegar aqui)
  return nonConformances;
};

/**
 * Traduz os status das não conformidades
 */
const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pendente',
    'in-progress': 'Em Andamento',
    'resolved': 'Resolvido',
    'closed': 'Fechado'
  };
  
  return statusMap[status] || status;
};

/**
 * Formata datas para o padrão brasileiro
 */
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    return dateString;
  }
};

/**
 * Trunca textos longos para melhor visualização em tabelas
 */
const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};
