
import { Card, CardContent } from "@/components/ui/card";

const DashboardLoadingState = () => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-8">
        <div className="animate-pulse w-16 h-16 rounded-full bg-muted"></div>
        <p className="mt-4 text-muted-foreground">Carregando dados...</p>
      </CardContent>
    </Card>
  );
};

export default DashboardLoadingState;
