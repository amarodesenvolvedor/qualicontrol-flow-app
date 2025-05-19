
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ScheduledAuditFiltersProps {
  departments: any[];
  onFilterChange: (filters: any) => void;
  currentFilter: any;
}

export const ScheduledAuditFilters = ({
  departments,
  onFilterChange,
  currentFilter
}: ScheduledAuditFiltersProps) => {
  const [departmentId, setDepartmentId] = useState<string>(currentFilter.departmentId || "");
  const [status, setStatus] = useState<string>(currentFilter.status || "");
  const [year, setYear] = useState<number>(currentFilter.year || new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  const applyFilters = () => {
    const filters: any = {};
    if (departmentId) filters.departmentId = departmentId;
    if (status) filters.status = status;
    if (year) filters.year = year;
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setDepartmentId("");
    setStatus("");
    setYear(currentYear);
    onFilterChange({});
  };

  const hasActiveFilters = departmentId || status || year !== currentYear;

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="department-filter">Departamento</Label>
            <Select 
              value={departmentId} 
              onValueChange={setDepartmentId}
            >
              <SelectTrigger id="department-filter">
                <SelectValue placeholder="Todos os departamentos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os departamentos</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <Select 
              value={status} 
              onValueChange={setStatus}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="scheduled">Agendada</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="year-filter">Ano</Label>
            <Select 
              value={year.toString()} 
              onValueChange={(value) => setYear(parseInt(value))}
            >
              <SelectTrigger id="year-filter">
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end space-x-2">
            <Button onClick={applyFilters} className="flex-1">
              Aplicar Filtros
            </Button>
            {hasActiveFilters && (
              <Button variant="outline" size="icon" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
