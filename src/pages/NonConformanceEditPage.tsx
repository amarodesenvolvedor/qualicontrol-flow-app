
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/app/Layout";
import EditForm from "@/components/app/nonconformance/edit/EditForm";
import { useNonConformanceEdit } from "@/hooks/useNonConformanceEdit";

const NonConformanceEditPage = () => {
  const { isLoading, error, ncData, id } = useNonConformanceEdit();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-8">
          <p>Carregando dados da não conformidade...</p>
        </div>
      </Layout>
    );
  }

  if (error || !ncData) {
    return (
      <Layout>
        <div className="flex flex-col items-center py-8">
          <p className="text-red-500 mb-4">Erro ao carregar dados ou não conformidade não encontrada</p>
          <Button onClick={() => navigate('/nao-conformidades')}>Voltar para lista</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Editar Não Conformidade</h1>
          <Button variant="outline" onClick={() => navigate(`/nao-conformidades/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <EditForm />
      </div>
    </Layout>
  );
};

export default NonConformanceEditPage;
