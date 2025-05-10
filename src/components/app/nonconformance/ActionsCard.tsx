
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActionsCardProps {
  immediateActions: string;
  responsibleName: string;
  deadlineDate: Date | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDeadlineChange: (date: Date | undefined) => void;
}

const ActionsCard = ({
  immediateActions,
  responsibleName,
  deadlineDate,
  onInputChange,
  onDeadlineChange
}: ActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações e Responsabilidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="immediateActions">Ações Imediatas Tomadas</Label>
            <Textarea
              id="immediateActions"
              name="immediateActions"
              placeholder="Descreva as ações tomadas para minimizar o impacto"
              rows={3}
              value={immediateActions}
              onChange={onInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="responsibleName">Responsável pelo Registro <span className="text-red-500">*</span></Label>
            <Input
              id="responsibleName"
              name="responsibleName"
              placeholder="Nome do responsável pelo registro"
              value={responsibleName}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Prazo para Ação Corretiva <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadlineDate ? (
                    format(deadlineDate, "dd/MM/yyyy")
                  ) : (
                    <span>Selecione o prazo</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadlineDate}
                  onSelect={onDeadlineChange}
                  locale={ptBR}
                  disabled={(date) => date < new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionsCard;
