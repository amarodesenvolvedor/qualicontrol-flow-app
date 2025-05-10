
import { ReportCard } from "@/components/reports/ReportCard";

export const StandardReportsTab = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ReportCard 
        title="Não Conformidades por Departamento" 
        description="Relatório detalhado por departamento"
        type="Mensal"
        updatedAt="10/05/2025"
      />
      
      <ReportCard 
        title="Não Conformidades por Tipo" 
        description="Análise por categorias de não conformidade"
        type="Trimestral"
        updatedAt="05/05/2025"
      />
      
      <ReportCard 
        title="Status de Não Conformidades" 
        description="Visão geral do status atual"
        type="Semanal"
        updatedAt="09/05/2025"
      />
      
      <ReportCard 
        title="Tempo de Resolução" 
        description="Análise de tempo de resposta e resolução"
        type="Mensal"
        updatedAt="01/05/2025"
      />
      
      <ReportCard 
        title="Não Conformidades por Gravidade" 
        description="Classificação por níveis de criticidade"
        type="Trimestral"
        updatedAt="15/04/2025"
      />
    </div>
  );
};
