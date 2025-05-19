
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AuditReportInput } from "@/types/audit";

interface BasicInfoFieldsProps {
  formData: AuditReportInput;
  departments: any[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDepartmentChange: (value: string) => void;
  onResponsibleAuditorChange: (value: string) => void;
}

export function BasicInfoFields({
  formData,
  departments,
  onTitleChange,
  onDescriptionChange,
  onDepartmentChange,
  onResponsibleAuditorChange
}: BasicInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input 
          id="title"
          value={formData.title} 
          onChange={(e) => onTitleChange(e.target.value)} 
          placeholder="Título do relatório de auditoria"
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description"
          value={formData.description || ""} 
          onChange={(e) => onDescriptionChange(e.target.value)} 
          placeholder="Descrição do relatório de auditoria"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="department">Departamento</Label>
          <Select
            value={formData.department_id}
            onValueChange={onDepartmentChange}
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Selecione o departamento" />
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
          <Label htmlFor="responsible_auditor">Auditor Responsável</Label>
          <Input 
            id="responsible_auditor" 
            value={formData.responsible_auditor} 
            onChange={(e) => onResponsibleAuditorChange(e.target.value)} 
            placeholder="Nome do auditor responsável"
          />
        </div>
      </div>
    </div>
  );
}
