
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface GroupBySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const GroupBySelector = ({ value, onChange }: GroupBySelectorProps) => {
  return (
    <div>
      <Label>Agrupar por</Label>
      <Select 
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Selecione um campo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="department">Departamento</SelectItem>
          <SelectItem value="status">Status</SelectItem>
          <SelectItem value="category">Categoria</SelectItem>
          <SelectItem value="month">Mês</SelectItem>
          <SelectItem value="responsible">Responsável</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
