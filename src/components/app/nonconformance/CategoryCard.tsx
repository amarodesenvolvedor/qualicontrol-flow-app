
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
        <div>
          <Label htmlFor="department">Departamento</Label>
          <Select value={department} onValueChange={onDepartmentChange}>
            <SelectTrigger id="department" className="mt-1.5">
              <SelectValue placeholder="Selecione um departamento" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger id="category" className="mt-1.5">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
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
