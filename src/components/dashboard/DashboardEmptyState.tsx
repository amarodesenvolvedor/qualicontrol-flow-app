
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Plus } from "lucide-react";

const DashboardEmptyState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-8">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-medium">Nenhuma não conformidade registrada</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Registre uma nova não conformidade para visualizar os dados.
        </p>
        <Button className="mt-4" asChild>
          <Link to="/nao-conformidades/nova">
            <Plus className="mr-2 h-4 w-4" /> Nova Não Conformidade
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardEmptyState;
