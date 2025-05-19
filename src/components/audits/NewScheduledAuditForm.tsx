
import { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import { Calendar as CalendarIcon, Check, ClipboardList } from 'lucide-react';
import { ScheduledAuditInput } from '@/types/audit';
import { getISOWeeksInYear } from 'date-fns';

interface NewScheduledAuditFormProps {
  departments: any[];
  onSubmit: (data: ScheduledAuditInput) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  currentWeek: number;
  currentYear: number;
}

export const NewScheduledAuditForm = ({ 
  departments, 
  onSubmit, 
  onCancel, 
  isSubmitting,
  currentWeek,
  currentYear
}: NewScheduledAuditFormProps) => {
  const [formData, setFormData] = useState<ScheduledAuditInput>({
    department_id: '',
    responsible_auditor: '',
    week_number: currentWeek,
    year: currentYear,
    status: 'programada',
    notes: ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Generate weeks for the select
  const generateWeekOptions = () => {
    const weeksInYear = getISOWeeksInYear(new Date(formData.year, 0, 1));
    return Array.from({ length: weeksInYear }, (_, i) => i + 1);
  };

  // Generate year options (current year and next 2 years)
  const yearOptions = [currentYear, currentYear + 1, currentYear + 2];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Select 
            value={formData.department_id || "placeholder"} 
            onValueChange={(value) => handleChange('department_id', value)}
            required
          >
            <SelectTrigger id="department">
              <SelectValue placeholder="Selecione o departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder" disabled>Selecione o departamento</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsible_auditor">Auditor Responsável</Label>
          <Input 
            id="responsible_auditor" 
            value={formData.responsible_auditor}
            onChange={(e) => handleChange('responsible_auditor', e.target.value)}
            placeholder="Nome do auditor responsável"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Ano</Label>
          <Select 
            value={formData.year.toString()} 
            onValueChange={(value) => handleChange('year', parseInt(value))}
            required
          >
            <SelectTrigger id="year">
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="week">Semana</Label>
          <Select 
            value={formData.week_number.toString()} 
            onValueChange={(value) => handleChange('week_number', parseInt(value))}
            required
          >
            <SelectTrigger id="week" className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Selecione a semana" />
            </SelectTrigger>
            <SelectContent>
              {generateWeekOptions().map((week) => (
                <SelectItem key={week} value={week.toString()}>
                  Semana {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value) => handleChange('status', value as "programada" | "agendada" | "concluida" | "atrasada")}
            required
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="programada">Programada</SelectItem>
              <SelectItem value="agendada">Agendada</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Observações</Label>
        <Textarea 
          id="notes" 
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Observações adicionais sobre a auditoria programada"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : (
            <><Check className="mr-2 h-4 w-4" /> Salvar</>
          )}
        </Button>
      </div>
    </form>
  );
}
