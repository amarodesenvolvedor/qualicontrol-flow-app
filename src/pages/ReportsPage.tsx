
import Layout from "@/components/app/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ReportsPage = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="nonconformities">
          <TabsList className="mb-4">
            <TabsTrigger value="nonconformities">Não Conformidades</TabsTrigger>
            <TabsTrigger value="actions">Ações Corretivas</TabsTrigger>
            <TabsTrigger value="audits">Auditorias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="nonconformities">
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
          </TabsContent>
          
          <TabsContent value="actions">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ReportCard 
                title="Ações Corretivas Pendentes" 
                description="Listagem de ações sem conclusão"
                type="Diário"
                updatedAt="10/05/2025"
              />
              
              <ReportCard 
                title="Eficácia das Ações" 
                description="Análise de resultados pós-implementação"
                type="Mensal"
                updatedAt="01/05/2025"
              />
              
              <ReportCard 
                title="Tempo Médio de Implementação" 
                description="Estatísticas de tempo por departamento"
                type="Trimestral"
                updatedAt="10/04/2025"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="audits">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ReportCard 
                title="Sumário de Auditorias" 
                description="Visão geral das últimas auditorias"
                type="Trimestral"
                updatedAt="05/05/2025"
              />
              
              <ReportCard 
                title="Auditores por Departamento" 
                description="Distribuição de auditores e responsáveis"
                type="Semestral"
                updatedAt="01/01/2025"
              />
              
              <ReportCard 
                title="Cronograma de Auditorias" 
                description="Planejamento para os próximos 6 meses"
                type="Mensal"
                updatedAt="01/05/2025"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface ReportCardProps {
  title: string;
  description: string;
  type: string;
  updatedAt: string;
}

const ReportCard = ({ title, description, type, updatedAt }: ReportCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="outline">{type}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Atualizado em: {updatedAt}
          </span>
          <Button size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Baixar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsPage;
