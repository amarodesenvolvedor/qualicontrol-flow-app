
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import DepartmentSelect from "./DepartmentSelect";

interface CategoryCardProps {
  department: string;
  category: string;
  onDepartmentChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const categoryOptions = [
  { value: "quality", label: "Qualidade" },
  { value: "safety", label: "Segurança" },
  { value: "process", label: "Processo" },
  { value: "documentation", label: "Documentação" },
  { value: "environmental", label: "Ambiental" },
  { value: "training", label: "Treinamento" }
];

const CategoryCard = ({
  department,
  category,
  onDepartmentChange,
  onCategoryChange
}: CategoryCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorização</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="department">Departamento <span className="text-red-500">*</span></Label>
            <DepartmentSelect 
              value={department} 
              onValueChange={onDepartmentChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria <span className="text-red-500">*</span></Label>
            <Select 
              value={category} 
              onValueChange={onCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
