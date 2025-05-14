
import { useNavigate } from "react-router-dom";
import Layout from "@/components/app/Layout";
import { Button } from "@/components/ui/button";

const ErrorState = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="flex flex-col items-center py-8">
        <p className="text-red-500 mb-4">Erro ao carregar detalhes ou não conformidade não encontrada</p>
        <Button onClick={() => navigate('/nao-conformidades')}>Voltar para lista</Button>
      </div>
    </Layout>
  );
};

export default ErrorState;
