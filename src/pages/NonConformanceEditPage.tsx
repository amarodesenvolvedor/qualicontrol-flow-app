
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/app/Layout";
import EditForm from "@/components/app/nonconformance/edit/EditForm";
import { useNonConformanceEdit } from "@/hooks/useNonConformanceEdit";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
          <Alert variant="destructive" className="w-full max-w-2xl mb-4">
            <AlertTitle>Erro ao carregar dados</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os dados da não conformidade. Verifique se o registro ainda existe.
            </AlertDescription>
          </Alert>
          <pre className="bg-gray-100 p-2 rounded text-xs mb-4 w-full max-w-2xl overflow-auto">
            {error ? String(error) : 'Não conformidade não encontrada'}
          </pre>
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
      <Toaster />
    </Layout>
  );
};

export default NonConformanceEditPage;
