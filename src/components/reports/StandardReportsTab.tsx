
import { useEffect, useState } from "react";
import { ReportCard } from "@/components/reports/ReportCard";
import { useNonConformances } from "@/hooks/useNonConformances";

export const StandardReportsTab = () => {
  const { nonConformances } = useNonConformances();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Atualiza a data quando o componente é montado ou os dados de não conformidades mudam
    setLastUpdated(new Date());
  }, [nonConformances]);

  // Formatar data para exibição
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ReportCard 
        title="Não Conformidades por Departamento" 
        description="Relatório detalhado por departamento"
        type="Mensal"
        updatedAt={formatDate(lastUpdated)}
      />
      
      <ReportCard 
        title="Não Conformidades por Tipo" 
        description="Análise por categorias de não conformidade"
        type="Trimestral"
        updatedAt={formatDate(lastUpdated)}
      />
      
      <ReportCard 
        title="Status de Não Conformidades" 
        description="Visão geral do status atual"
        type="Semanal"
        updatedAt={formatDate(lastUpdated)}
      />
      
      <ReportCard 
        title="Tempo de Resolução" 
        description="Análise de tempo de resposta e resolução"
        type="Mensal"
        updatedAt={formatDate(lastUpdated)}
      />
      
      <ReportCard 
        title="Não Conformidades por Gravidade" 
        description="Classificação por níveis de criticidade"
        type="Trimestral"
        updatedAt={formatDate(lastUpdated)}
      />
    </div>
  );
};
