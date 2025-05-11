
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartments } from "@/hooks/useDepartments";

interface CategoryCardProps {
  department: string;
  category: string;
  status: string;
  onDepartmentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const CategoryCard = ({ 
  department, 
  category, 
  status,
  onDepartmentChange, 
  onCategoryChange,
  onStatusChange
}: CategoryCardProps) => {
  const { departments } = useDepartments();
  
  const categories = [
    "quality",
    "safety",
    "environment",
    "maintenance",
    "operation"
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
      <CardContent className="space-y-4">
        <FormItem>
          <FormLabel>Departamento</FormLabel>
          <Select value={department} onValueChange={onDepartmentChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um departamento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
        
        <FormItem>
          <FormLabel>Categoria</FormLabel>
          <Select value={category} onValueChange={onCategoryChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem>
          <FormLabel>Status</FormLabel>
          <Select value={status} onValueChange={onStatusChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
