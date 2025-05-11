
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import type { Department } from '@/hooks/useDepartments';
import type { AuditFilter } from '@/types/audit';

interface AuditFiltersProps {
  departments: Department[];
  filters: AuditFilter;
  onFilterChange: (filters: AuditFilter) => void;
}

export const AuditFilters = ({ 
  departments, 
  filters, 
  onFilterChange 
}: AuditFiltersProps) => {
  // Generate years for the select dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  const handleYearChange = (value: string) => {
    onFilterChange({
      ...filters,
      year: value === "all" ? undefined : value,
    });
  };

  const handleDepartmentChange = (value: string) => {
    onFilterChange({
      ...filters,
      departmentId: value === "all" ? undefined : value,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <div className="w-full sm:w-48">
        <label className="text-sm font-medium mb-1 block">
          Ano
        </label>
        <Select 
          value={filters.year || "all"} 
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todos os anos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os anos</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-64">
        <label className="text-sm font-medium mb-1 block">
          Departamento
        </label>
        <Select 
          value={filters.departmentId || "all"} 
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todos os departamentos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept.id} value={dept.id || "placeholder-id"}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:flex-1">
        <label className="text-sm font-medium mb-1 block">
          Pesquisar
        </label>
        <Input
          placeholder="Pesquisar por título..."
          value={filters.searchTerm || ''}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};
