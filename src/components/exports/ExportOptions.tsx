
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ExportOptionsProps {
  exportFormat: string;
  setExportFormat: (format: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  year: string;
  setYear: (year: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  includeFields: {
    status: boolean;
    description: boolean;
    responsible: boolean;
    deadline: boolean;
    category: boolean;
  };
  handleFieldToggle: (field: string) => void;
}

export const ExportOptions = ({
  exportFormat,
  setExportFormat,
  dateRange,
  setDateRange,
  year,
  setYear,
  date,
  setDate,
  includeFields,
  handleFieldToggle
}: ExportOptionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Opções de Exportação</CardTitle>
        <CardDescription>Configure as opções para exportar seus dados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Formato</h3>
          <Tabs value={exportFormat} onValueChange={setExportFormat}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="excel">Excel</TabsTrigger>
              <TabsTrigger value="pdf">PDF</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Período de Dados</h3>
          <Tabs value={dateRange} onValueChange={setDateRange}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="month">Mês</TabsTrigger>
              <TabsTrigger value="quarter">Trimestre</TabsTrigger>
              <TabsTrigger value="year">Ano</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Ano de Referência</h3>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator />
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Específica</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PP", { locale: ptBR }) : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {exportFormat === 'excel' && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Campos a incluir</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="status" 
                    checked={includeFields.status}
                    onCheckedChange={() => handleFieldToggle('status')}
                  />
                  <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Status</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="description" 
                    checked={includeFields.description}
                    onCheckedChange={() => handleFieldToggle('description')}
                  />
                  <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Descrição</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="responsible" 
                    checked={includeFields.responsible}
                    onCheckedChange={() => handleFieldToggle('responsible')}
                  />
                  <label htmlFor="responsible" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Responsável</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="deadline" 
                    checked={includeFields.deadline}
                    onCheckedChange={() => handleFieldToggle('deadline')}
                  />
                  <label htmlFor="deadline" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Prazo</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="category" 
                    checked={includeFields.category}
                    onCheckedChange={() => handleFieldToggle('category')}
                  />
                  <label htmlFor="category" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Categoria</label>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
