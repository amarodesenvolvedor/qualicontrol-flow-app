
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNonConformances } from "@/hooks/useNonConformances";
import { ReportDownloadDropdown } from "@/components/reports/ReportDownloadDropdown";
import { handleReportExport } from "@/services/exports/reportExportService";

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
          <ReportDownloadDropdown onDownload={handleDownload} />
        </div>
      </CardContent>
    </Card>
  );
};
