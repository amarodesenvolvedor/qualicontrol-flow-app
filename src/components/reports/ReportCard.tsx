
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadIcon, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ReportCardProps {
  title: string;
  description: string;
  type: string;
  updatedAt: string;
}

export const ReportCard = ({ title, description, type, updatedAt }: ReportCardProps) => {
  const handleDownload = (format: "pdf" | "excel") => {
    toast.success(`Iniciando download: ${title} em formato ${format.toUpperCase()}`);
    
    // Criar um arquivo fictício para download
    setTimeout(() => {
      // Criar um conteúdo de exemplo
      const content = `Relatório: ${title}\nDescrição: ${description}\nTipo: ${type}\nData: ${updatedAt}`;
      // Criar um blob com o conteúdo
      const blob = new Blob(
        [content], 
        { type: format === "pdf" ? "application/pdf" : "application/vnd.ms-excel" }
      );
      // Criar URL para o blob
      const url = URL.createObjectURL(blob);
      // Criar um elemento de âncora para download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${format}`;
      // Anexar, clicar e remover o elemento
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Limpar a URL criada
      URL.revokeObjectURL(url);
      
      toast.success(`${title} baixado com sucesso!`);
    }, 1500);
  };

  return (
    <Card className="transition-all hover:shadow-md duration-300 hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant="outline">{type}</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Atualizado em: {updatedAt}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Baixar
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleDownload("pdf")}>
                Formato PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload("excel")}>
                Formato Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
