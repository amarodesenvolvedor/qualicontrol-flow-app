
import { useDepartments } from "@/hooks/useDepartments";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";

interface DepartmentSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const DepartmentSelect = ({
  value,
  onValueChange,
  placeholder = "Selecione um departamento",
  disabled = false
}: DepartmentSelectProps) => {
  const { departments, isLoading } = useDepartments();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled || isLoading}>
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {departments.map((department) => (
          <SelectItem key={department.id} value={department.id}>
            {department.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DepartmentSelect;
