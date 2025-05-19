
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { AuditReportInput } from '@/types/audit';

interface DateStatusFieldsProps {
  formData: AuditReportInput;
  onAuditDateChange: (value: string) => void;
  onStatusChange: (value: "pending" | "in_progress" | "completed") => void;
}

export function DateStatusFields({
  formData,
  onAuditDateChange,
  onStatusChange
}: DateStatusFieldsProps) {
  // Convert string date to Date object for the calendar
  const dateValue = formData.audit_date ? new Date(formData.audit_date) : new Date();
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      onAuditDateChange(formattedDate);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="audit_date">Data da Auditoria</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              id="audit_date"
              className={cn(
                "w-full pl-3 text-left font-normal mt-2",
                !formData.audit_date && "text-muted-foreground"
              )}
            >
              {formData.audit_date ? (
                format(dateValue, "PPP", { locale: ptBR })
              ) : (
                <span>Selecione uma data</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleDateChange}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
              locale={ptBR}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: "pending" | "in_progress" | "completed") => onStatusChange(value)}
        >
          <SelectTrigger id="status" className="mt-2">
            <SelectValue placeholder="Selecione o status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="completed">Concluída</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
