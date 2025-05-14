
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

interface PageHeaderProps {
  id: string | undefined;
}

const PageHeader = ({ id }: PageHeaderProps) => {
  const navigate = useNavigate();
  
  return (
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
  );
};

export default PageHeader;
