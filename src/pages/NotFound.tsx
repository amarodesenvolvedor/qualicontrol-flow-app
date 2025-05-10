
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-medium">Página não encontrada</h2>
        <p className="text-muted-foreground mb-6">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button asChild>
          <Link to="/">Voltar ao Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
