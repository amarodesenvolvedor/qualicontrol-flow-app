
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Control } from "react-hook-form";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { useDepartments } from "@/hooks/useDepartments";
import SelectField from "../edit/SelectField";

interface CategoryFormProps {
  control: Control<NonConformanceFormValues>;
}

const CategoryForm = ({ control }: CategoryFormProps) => {
  const { departments } = useDepartments();
  
  // Transform departments to options
  const departmentOptions = departments.map(dept => ({
    value: dept.id,
    label: dept.name
  }));
  
  // Categories
  const categories = [
    { value: "quality", label: "Qualidade" },
    { value: "safety", label: "Segurança" },
    { value: "environment", label: "Meio Ambiente" },
    { value: "maintenance", label: "Manutenção" },
    { value: "operation", label: "Operação" }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pendente' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'resolved', label: 'Resolvido' },
    { value: 'closed', label: 'Encerrado' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorização</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <SelectField 
          control={control} 
          name="department_id" 
          label="Departamento" 
          options={departmentOptions}
          required
        />
        
        <SelectField 
          control={control} 
          name="category" 
          label="Categoria" 
          options={categories}
          required
        />

        <SelectField 
          control={control} 
          name="status" 
          label="Status" 
          options={statusOptions}
          required
        />
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
