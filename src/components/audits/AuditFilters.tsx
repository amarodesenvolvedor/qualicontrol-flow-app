
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import type { Department } from '@/hooks/useDepartments';
import type { AuditFilter } from '@/types/audit';

interface AuditFiltersProps {
  departments: Department[];
  years: string[];
  filters: AuditFilter;
  onFilterChange: (filters: AuditFilter) => void;
}

export function AuditFilters({ 
  departments, 
  years, 
  filters, 
  onFilterChange 
}: AuditFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleDepartmentChange = (departmentId: string) => {
    onFilterChange({ ...filters, departmentId });
  };

  const handleYearChange = (year: string) => {
    onFilterChange({ ...filters, year });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const isFiltersActive = filters.year || filters.departmentId || filters.searchTerm;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1">
          <Label htmlFor="search">Buscar Relatório</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar por título..."
              className="pl-8"
              value={filters.searchTerm || ''}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className="w-full md:w-[180px]">
          <Label htmlFor="year">Ano</Label>
          <Select
            value={filters.year || ''}
            onValueChange={handleYearChange}
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Todos os Anos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Anos</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-[220px]">
          <Label htmlFor="department">Departamento</Label>
          <Select
            value={filters.departmentId || ''}
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Todos os Departamentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os Departamentos</SelectItem>
              {departments.map(department => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isFiltersActive && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="flex items-center gap-1 h-10"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}
