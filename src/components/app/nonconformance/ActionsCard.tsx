
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ActionsCardProps {
  immediateActions: string;
  responsibleName: string;
  deadlineDate: Date | undefined;
  effectivenessVerificationDate: Date | undefined;
  completionDate: Date | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDeadlineChange: (date: Date | undefined) => void;
  onEffectivenessVerificationDateChange: (date: Date | undefined) => void;
  onCompletionDateChange: (date: Date | undefined) => void;
  isReadOnly?: boolean;
}

const ActionsCard = ({
  immediateActions,
  responsibleName,
  deadlineDate,
  effectivenessVerificationDate,
  completionDate,
  onInputChange,
  onDeadlineChange,
  onEffectivenessVerificationDateChange,
  onCompletionDateChange,
  isReadOnly = false
}: ActionsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações e Responsabilidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="immediate_actions">Ações Imediatas Tomadas</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Este campo será preenchido pelo responsável do departamento após receber uma notificação.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id="immediate_actions"
              name="immediate_actions"
              placeholder={isReadOnly ? 
                "Este campo será preenchido pelo responsável do departamento após a criação do registro" : 
                "Descreva as ações tomadas para minimizar o impacto"}
              rows={3}
              value={immediateActions}
              onChange={onInputChange}
              disabled={isReadOnly}
              className={isReadOnly ? "bg-muted text-muted-foreground" : ""}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="responsible_name">Responsável pela Ação <span className="text-red-500">*</span></Label>
            <Input
              id="responsible_name"
              name="responsible_name"
              placeholder="Nome do responsável pela ação"
              value={responsibleName}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Prazo para Ação Corretiva</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadlineDate ? (
                    format(deadlineDate, "dd/MM/yyyy")
                  ) : (
                    <span>Selecione o prazo (opcional)</span>
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
          
          <div className="grid gap-2">
            <Label>Data de Verificação da Eficácia</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {effectivenessVerificationDate ? (
                    format(effectivenessVerificationDate, "dd/MM/yyyy")
                  ) : (
                    <span>Selecione a data (opcional)</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={effectivenessVerificationDate}
                  onSelect={onEffectivenessVerificationDateChange}
                  locale={ptBR}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label>Finalizada</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {completionDate ? (
                    format(completionDate, "dd/MM/yyyy")
                  ) : (
                    <span>Selecione a data (opcional)</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={completionDate}
                  onSelect={onCompletionDateChange}
                  locale={ptBR}
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
