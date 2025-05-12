
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
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

interface ReportCardProps {
  title: string;
  description: string;
  type: string;
  updatedAt: string;
}

export const ReportCard = ({ title, description, type, updatedAt }: ReportCardProps) => {
  const handleDownload = async (format: "pdf" | "excel") => {
    toast.success(`Iniciando download: ${title} em formato ${format.toUpperCase()}`);
    
    try {
      if (format === "pdf") {
        // Create a PDF document
        const doc = new jsPDF();
        
        // Add title and content
        doc.setFontSize(18);
        doc.text(title, 20, 20);
        
        doc.setFontSize(12);
        doc.text(`Tipo: ${type}`, 20, 35);
        doc.text(`Atualizado em: ${updatedAt}`, 20, 45);
        
        doc.setFontSize(14);
        doc.text("Descrição:", 20, 60);
        
        doc.setFontSize(12);
        const descriptionLines = doc.splitTextToSize(description, 170);
        doc.text(descriptionLines, 20, 70);
        
        // Save the PDF
        doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      } else {
        // Create Excel workbook
        const wb = XLSX.utils.book_new();
        
        // Create worksheet data
        const wsData = [
          ["Título", "Descrição", "Tipo", "Atualizado em"],
          [title, description, type, updatedAt]
        ];
        
        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Relatório");
        
        // Generate Excel file
        XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
      }
      
      toast.success(`${title} baixado com sucesso!`);
    } catch (error) {
      console.error("Error generating file:", error);
      toast.error("Erro ao gerar arquivo", {
        description: `Não foi possível gerar o arquivo ${format.toUpperCase()}.`
      });
    }
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
