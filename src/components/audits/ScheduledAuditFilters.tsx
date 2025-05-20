
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X, Search } from "lucide-react";
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
  const [auditorSearch, setAuditorSearch] = useState<string>(currentFilter.auditorSearch || "");

  const currentYear = new Date().getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

  // Update local state when currentFilter changes
  useEffect(() => {
    setDepartmentId(currentFilter.departmentId || "");
    setStatus(currentFilter.status || "");
    setYear(currentFilter.year || new Date().getFullYear());
    setAuditorSearch(currentFilter.auditorSearch || "");
  }, [currentFilter]);

  const applyFilters = () => {
    const filters: any = {};
    if (departmentId) filters.departmentId = departmentId;
    if (status) filters.status = status;
    if (year) filters.year = year;
    if (auditorSearch.trim()) filters.auditorSearch = auditorSearch.trim();
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setDepartmentId("");
    setStatus("");
    setYear(currentYear);
    setAuditorSearch("");
    onFilterChange({});
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  const hasActiveFilters = departmentId || status || year !== currentYear || auditorSearch.trim();

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <SelectItem value="programada">Programada</SelectItem>
                <SelectItem value="agendada">Agendada</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="atrasada">Atrasada</SelectItem>
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

          <div>
            <Label htmlFor="auditor-search">Auditor Responsável</Label>
            <div className="relative">
              <Input
                id="auditor-search"
                type="text"
                placeholder="Buscar por auditor..."
                value={auditorSearch}
                onChange={(e) => setAuditorSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-8"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
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
