
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

interface BasicInfoCardProps {
  title: string;
  description: string;
  location: string;
  auditorName: string;
  selectedDate: Date | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDateChange: (date: Date | undefined) => void;
}

const BasicInfoCard = ({
  title,
  description,
  location,
  auditorName,
  selectedDate,
  onInputChange,
  onDateChange
}: BasicInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              name="title"
              placeholder="Título resumido da não conformidade"
              value={title}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição Detalhada <span className="text-red-500">*</span></Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva detalhadamente o ocorrido"
              rows={4}
              value={description}
              onChange={onInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="location">Local da Ocorrência <span className="text-red-500">*</span></Label>
              <Input
                id="location"
                name="location"
                placeholder="Setor, linha ou local específico"
                value={location}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Data da Ocorrência <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onDateChange}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="auditor_name">Nome do Auditor <span className="text-red-500">*</span></Label>
            <Input
              id="auditor_name"
              name="auditor_name"
              placeholder="Nome completo do auditor"
              value={auditorName}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
