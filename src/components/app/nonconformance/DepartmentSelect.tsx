
import { useEffect, useMemo, useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useDepartments, Department } from "@/hooks/useDepartments";

interface DepartmentSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const DepartmentSelect = ({ value, onValueChange }: DepartmentSelectProps) => {
  const { data: departments, isLoading, error } = useDepartments();
  const [selectedDept, setSelectedDept] = useState<string>(value);

  useEffect(() => {
    setSelectedDept(value);
  }, [value]);

  // Agrupar departamentos por tipo
  const groupedDepartments = useMemo(() => {
    if (!departments) return { corporate: [], regional: [] };
    
    return departments.reduce((acc: Record<string, Department[]>, dept) => {
      if (!acc[dept.group_type]) {
        acc[dept.group_type] = [];
      }
      acc[dept.group_type].push(dept);
      return acc;
    }, { corporate: [], regional: [] });
  }, [departments]);

  const handleValueChange = (newValue: string) => {
    setSelectedDept(newValue);
    onValueChange(newValue);
  };

  if (error) {
    console.error("Erro ao carregar departamentos:", error);
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Erro ao carregar departamentos" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select 
      value={selectedDept} 
      onValueChange={handleValueChange}
      disabled={isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o departamento"} />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>Carregando departamentos...</SelectItem>
        ) : (
          <>
            {groupedDepartments.corporate && groupedDepartments.corporate.length > 0 && (
              <SelectGroup>
                <SelectLabel>Corporativo</SelectLabel>
                {groupedDepartments.corporate.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            
            {groupedDepartments.regional && groupedDepartments.regional.length > 0 && (
              <SelectGroup>
                <SelectLabel>Regional</SelectLabel>
                {groupedDepartments.regional.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </>
        )}
      </SelectContent>
    </Select>
  );
};

export default DepartmentSelect;
