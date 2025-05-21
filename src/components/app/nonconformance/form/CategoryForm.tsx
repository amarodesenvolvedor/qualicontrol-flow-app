
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Control } from "react-hook-form";
import { NonConformanceFormValues } from "@/utils/nonConformanceFormSchema";
import { useDepartments } from "@/hooks/useDepartments";
import SelectField from "../edit/SelectField";
import ISORequirementField from "./ISORequirementField";

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
        
        <ISORequirementField control={control} />
        
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
