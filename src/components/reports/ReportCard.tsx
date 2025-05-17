
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

  // Determinar a cor do badge com base no tipo
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

  return (
    <Card className="transition-all hover:shadow-md duration-300 hover:-translate-y-1 border-t-4 rounded-md overflow-hidden"
         style={{ borderTopColor: type === "Semanal" ? "#8B5CF6" : type === "Mensal" ? "#0EA5E9" : "#F97316" }}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant={getBadgeVariant(type)} className="ml-2 font-medium">
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
