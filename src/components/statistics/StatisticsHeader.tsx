
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatisticsHeaderProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  onRefresh: () => void;
}

export const StatisticsHeader = ({ 
  selectedYear, 
  onYearChange, 
  onRefresh 
}: StatisticsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">Gráficos e Estatísticas</h1>
      <div className="flex items-center gap-2">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-9" onClick={onRefresh}>
          Atualizar
        </Button>
      </div>
    </div>
  );
};
