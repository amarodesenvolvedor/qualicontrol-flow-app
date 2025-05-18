
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNonConformances } from "@/hooks/useNonConformances";
import { ReportDownloadDropdown } from "@/components/reports/ReportDownloadDropdown";
import { handleReportExport } from "@/services/exports/reportExportService";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  title: string;
  description: string;
  type: string;
  updatedAt: string;
}

export const ReportCard = ({ title, description, type, updatedAt }: ReportCardProps) => {
  const { nonConformances } = useNonConformances();

  const handleDownload = async (format: "pdf" | "excel") => {
    handleReportExport(format, title, description, type, updatedAt, nonConformances);
  };

  // Determinar a cor do badge e do indicador superior com base no tipo
  const getBadgeVariant = (reportType: string) => {
    switch (reportType) {
      case "Semanal":
        return "default";
      case "Mensal":
        return "secondary";
      case "Trimestral":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Determinar a cor do indicador superior com base no tipo
  const getBorderColor = (reportType: string) => {
    switch (reportType) {
      case "Semanal":
        return "#8B5CF6"; // Purple
      case "Mensal":
        return "#0EA5E9"; // Blue
      case "Trimestral":
        return "#F97316"; // Orange
      default:
        return "#8B5CF6";
    }
  };

  return (
    <Card 
      className="transition-all hover:shadow-md duration-300 hover:-translate-y-1 border-t-4 rounded-md overflow-hidden group"
      style={{ borderTopColor: getBorderColor(type) }}
    >
      <CardHeader className="pb-2 bg-gradient-to-b from-slate-50 to-white">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
          <Badge 
            variant={getBadgeVariant(type)} 
            className="ml-2 font-medium bg-opacity-90 shadow-sm"
          >
            {type}
          </Badge>
        </div>
        <CardDescription className="mt-1.5 text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <CalendarIcon className="h-4 w-4 mr-1.5 text-muted-foreground/70" />
          <span>Atualizado em: {updatedAt}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/20 pt-3 flex justify-between items-center">
        <div className="flex items-center text-sm">
          <InfoIcon className="h-4 w-4 mr-1.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {nonConformances.length} registros disponíveis
          </span>
        </div>
        <ReportDownloadDropdown onDownload={handleDownload} />
      </CardFooter>
    </Card>
  );
};
