
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, AlertCircle, Clock, CheckCircle, AlertTriangle } from "lucide-react";
interface KPICardsProps {
  totalCount: number;
  openCount: number;
  completedCount: number;
  dueCount: number;
  overdueCount: number;
  animateValues: boolean;
}
const DashboardKPICards = ({
  totalCount,
  openCount,
  completedCount,
  dueCount,
  overdueCount,
  animateValues
}: KPICardsProps) => {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className="card-glow transition-all hover:shadow-md hover:-translate-y-1 duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${animateValues ? 'animate-fade-in' : ''}`}>
            {totalCount}
          </div>
          <p className="text-xs text-muted-foreground">Não conformidades no período</p>
          <div className="mt-2 h-1 w-full bg-muted">
            <div className="h-1 bg-primary" style={{
            width: `100%`
          }}></div>
          </div>
        </CardContent>
      </Card>
      <Card className="card-glow transition-all hover:shadow-md hover:-translate-y-1 duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Em Aberto</CardTitle>
          <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${animateValues ? 'animate-fade-in' : ''}`}>
            {openCount}
          </div>
          <p className="text-xs text-muted-foreground">ACAC's em andamento</p>
          <div className="mt-2 h-1 w-full bg-muted">
            <div className="h-1 bg-amber-500" style={{
            width: `${totalCount ? openCount / totalCount * 100 : 0}%`
          }}></div>
          </div>
        </CardContent>
      </Card>
      <Card className="card-glow transition-all hover:shadow-md hover:-translate-y-1 duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${animateValues ? 'animate-fade-in' : ''}`}>
            {completedCount}
          </div>
          <p className="text-xs text-muted-foreground">ACAC's encerradas</p>
          <div className="mt-2 h-1 w-full bg-muted">
            <div className="h-1 bg-green-500" style={{
            width: `${totalCount ? completedCount / totalCount * 100 : 0}%`
          }}></div>
          </div>
        </CardContent>
      </Card>
      <Card className="card-glow transition-all hover:shadow-md hover:-translate-y-1 duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">A Vencer</CardTitle>
          <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${animateValues ? 'animate-fade-in' : ''}`}>
            {dueCount}
          </div>
          <p className="text-xs text-muted-foreground">Pendentes com prazo em até 4 dias</p>
          <div className="mt-2 h-1 w-full bg-muted">
            <div className="h-1 bg-blue-500" style={{
            width: `${totalCount ? dueCount / totalCount * 100 : 0}%`
          }}></div>
          </div>
        </CardContent>
      </Card>
      <Card className="card-glow transition-all hover:shadow-md hover:-translate-y-1 duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${animateValues ? 'animate-fade-in' : ''}`}>
            {overdueCount}
          </div>
          <p className="text-xs text-muted-foreground">Pendentes com prazo expirado</p>
          <div className="mt-2 h-1 w-full bg-muted">
            <div className="h-1 bg-red-500" style={{
            width: `${totalCount ? overdueCount / totalCount * 100 : 0}%`
          }}></div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default DashboardKPICards;
