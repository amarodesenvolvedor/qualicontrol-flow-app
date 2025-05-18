
import { toast } from "@/components/ui/use-toast";
import { processReportData } from "./processors/dataProcessor";
import { exportToPDF } from "./exporters/pdfExporter";
import { exportToExcel } from "./exporters/excelExporter";
import { ExportFormat, ReportMetadata } from "./utils/exportTypes";

/**
 * Handle the report export process
 */
export const handleReportExport = async (
  format: ExportFormat, 
  title: string, 
  description: string,
  type: string,
  updatedAt: string,
  nonConformances: any[]
): Promise<void> => {
  try {
    // Replacing toast.success with standard toast call
    toast({
      title: "Iniciando download",
      description: `${title} em formato ${format.toUpperCase()}`
    });
    
    // Process data based on report type
    const reportData = processReportData(title, nonConformances);
    
    // Create report metadata object
    const reportMetadata: ReportMetadata = {
      title,
      description,
      type,
      updatedAt
    };
    
    // Export to the requested format
    if (format === "pdf") {
      exportToPDF(reportMetadata, reportData);
    } else {
      exportToExcel(reportMetadata, reportData);
    }
    
    // Replacing toast.success with standard toast call
    toast({
      title: "Download concluído",
      description: `${title} baixado com sucesso!`
    });
  } catch (error) {
    console.error("Error generating file:", error);
    // Replacing toast.error with standard toast call with variant
    toast({
      variant: "destructive",
      title: "Erro ao gerar arquivo",
      description: `Não foi possível gerar o arquivo ${format.toUpperCase()}.`
    });
  }
};

// Re-export everything for backward compatibility
export { processReportData } from "./processors/dataProcessor";
export { exportToPDF } from "./exporters/pdfExporter";
export { exportToExcel } from "./exporters/excelExporter";
export type { ExportFormat, ReportMetadata } from "./utils/exportTypes";
