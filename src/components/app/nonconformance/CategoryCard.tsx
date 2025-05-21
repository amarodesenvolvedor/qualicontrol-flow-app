
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useDepartments } from "@/hooks/useDepartments";
import { useEffect } from "react";
import { ISO_REQUIREMENTS, ISO_REQUIREMENT_GROUPS } from "@/utils/isoRequirements";

interface CategoryCardProps {
  department: string;
  status: string;
  isoRequirement?: string;
  onDepartmentChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onISORequirementChange?: (value: string) => void;
}

const CategoryCard = ({ 
  department, 
  status,
  isoRequirement = "",
  onDepartmentChange, 
  onStatusChange,
  onISORequirementChange
}: CategoryCardProps) => {
  const { departments = [], error: departmentsError } = useDepartments();
  
  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'resolved', label: 'Resolvido' },
    { value: 'closed', label: 'Encerrado' }
  ];

  // Ensure departments is an array before filtering
  // Separar departamentos por tipo
  const corporateDepartments = Array.isArray(departments) 
    ? departments.filter(dept => dept?.group_type === "corporate") 
    : [];
    
  const regionalDepartments = Array.isArray(departments) 
    ? departments.filter(dept => dept?.group_type === "regional") 
    : [];

  // Garante que um departamento válido seja selecionado se houverem dados disponíveis
  useEffect(() => {
    if (Array.isArray(departments) && departments.length > 0 && !department && !departmentsError) {
      onDepartmentChange(departments[0].id);
    }
  }, [departments, department, onDepartmentChange, departmentsError]);

  // Log para depuração
  console.log("Departments loaded:", Array.isArray(departments) ? departments.length : 0);
  console.log("Selected department:", department);
  if (departmentsError) {
    console.error("Error loading departments:", departmentsError);
  }

  const handleISORequirementChange = (value: string) => {
    if (onISORequirementChange) {
      onISORequirementChange(value);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorização</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="department">Departamento</Label>
          <Select value={department} onValueChange={onDepartmentChange}>
            <SelectTrigger id="department" className="mt-1.5">
              <SelectValue placeholder="Selecione um departamento" />
            </SelectTrigger>
            <SelectContent>
              {corporateDepartments.length > 0 && (
                <>
                  <SelectItem value="corporate-group" disabled className="font-medium">
                    Corporativo
                  </SelectItem>
                  {corporateDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </>
              )}
              
              {regionalDepartments.length > 0 && (
                <>
                  <SelectItem value="regional-group" disabled className="font-medium mt-2">
                    Regional
                  </SelectItem>
                  {regionalDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="iso-requirement">Requisito ISO 9001:2015</Label>
          <Select value={isoRequirement} onValueChange={handleISORequirementChange}>
            <SelectTrigger id="iso-requirement" className="mt-1.5">
              <SelectValue placeholder="Selecione um requisito" />
            </SelectTrigger>
            <SelectContent className="max-h-96">
              {ISO_REQUIREMENT_GROUPS.map((group, groupIndex) => (
                <SelectGroup key={groupIndex}>
                  <SelectLabel className="font-bold text-primary">{group.title}</SelectLabel>
                  {ISO_REQUIREMENTS.slice(group.start, group.end).map((requirement) => (
                    <SelectItem key={requirement.value} value={requirement.value}>
                      {requirement.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger id="status" className="mt-1.5">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
