
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NonConformance } from "@/hooks/useNonConformances";
import Layout from "@/components/app/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { format } from "date-fns";

const NonConformanceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nonConformance, setNonConformance] = useState<NonConformance | null>(null);

  const { data: ncData, isLoading, error } = useQuery({
    queryKey: ['nonConformance', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('non_conformances')
        .select(`
          *,
          department:department_id (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as NonConformance;
    },
  });

  useEffect(() => {
    if (ncData) {
      setNonConformance(ncData);
    }
  }, [ncData]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <p>Carregando detalhes da não conformidade...</p>
        </div>
      </Layout>
    );
  }

  if (error || !nonConformance) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-8">
          <p className="text-red-500 mb-4">Erro ao carregar detalhes ou não conformidade não encontrada</p>
          <Button onClick={() => navigate('/nao-conformidades')}>Voltar para lista</Button>
        </div>
      </Layout>
    );
  }

  const getStatusBadgeColor = (status: NonConformance['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'in-progress': return 'bg-blue-500 hover:bg-blue-600';
      case 'resolved': return 'bg-green-500 hover:bg-green-600';
      case 'closed': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Detalhes da Não Conformidade</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate('/nao-conformidades')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => navigate(`/nao-conformidades/${id}/editar`)}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{nonConformance.code} - {nonConformance.title}</span>
              <Badge className={getStatusBadgeColor(nonConformance.status)}>
                {nonConformance.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Departamento</h3>
                  <p>{nonConformance.department?.name || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Categoria</h3>
                  <p>{nonConformance.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data de Ocorrência</h3>
                  <p>{format(new Date(nonConformance.occurrence_date), 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Data Limite</h3>
                  <p>{nonConformance.deadline_date ? format(new Date(nonConformance.deadline_date), 'dd/MM/yyyy') : 'Não definida'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Auditor</h3>
                  <p>{nonConformance.auditor_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Responsável</h3>
                  <p>{nonConformance.responsible_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Local</h3>
                  <p>{nonConformance.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Criado em</h3>
                  <p>{format(new Date(nonConformance.created_at), 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Descrição</h3>
                <p className="mt-1">{nonConformance.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Ações Imediatas Tomadas</h3>
                <p className="mt-1">{nonConformance.immediate_actions || 'Nenhuma ação registrada'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NonConformanceDetailsPage;
