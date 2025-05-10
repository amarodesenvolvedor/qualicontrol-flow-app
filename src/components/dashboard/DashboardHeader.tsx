
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  filterPeriod: string;
  setFilterPeriod: (value: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DashboardHeader = ({
  filterPeriod,
  setFilterPeriod,
  isDarkMode,
  toggleDarkMode
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das não conformidades e indicadores principais.
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Switch id="dark-mode" checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                <label htmlFor="dark-mode" className="text-sm">Modo escuro</label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Alternar entre modo claro e escuro</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mês</SelectItem>
            <SelectItem value="quarter">Último trimestre</SelectItem>
          </SelectContent>
        </Select>
        
        <Button asChild>
          <Link to="/nao-conformidades/nova">
            <Plus className="mr-2 h-4 w-4" /> Nova Não Conformidade
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
