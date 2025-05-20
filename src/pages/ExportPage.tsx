
import Layout from "@/components/app/Layout";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useNonConformances } from "@/hooks/useNonConformances";
import { useAuditReports } from "@/hooks/useAuditReports";
import { useScheduledAudits } from "@/hooks/useScheduledAudits";
import { Toaster } from "@/components/ui/toaster";
import { ExportOptions } from "@/components/exports/ExportOptions";
import { AvailableReports } from "@/components/exports/AvailableReports";
import { getReportData } from "@/components/exports/utils/reportDataTransformers";
import { generateExcelReport, generatePDFReport } from "@/components/exports/exportUtils";
import { FileIcon } from "lucide-react";

const ExportPage = () => {
  const [exportFormat, setExportFormat] = useState<string>("excel");
  const [dateRange, setDateRange] = useState<string>("month");
  const [year, setYear] = useState<string>("2025");
  const [date, setDate] = useState<Date>();
  const [includeFields, setIncludeFields] = useState({
    status: true,
    description: true,
    responsible: true,
    deadline: true,
    category: true
  });
  
  // Get data from hooks
  const { nonConformances } = useNonConformances();
  const { auditReports } = useAuditReports();
  const { scheduledAudits } = useScheduledAudits();
  
  const handleExport = async (reportType: string) => {
    toast({
      title: "Exportação iniciada",
      description: `${reportType} em formato ${exportFormat === 'excel' ? 'Excel' : 'PDF'}.`
    });
    
    try {
      // Create export options object with filters
      const exportOptions = {
        dateRange,
        year: parseInt(year),
        specificDate: date,
        includeFields,
      };
      
      // Get report data based on type and filters
      const reportData = getReportData(
        reportType, 
        nonConformances, 
        auditReports,
        scheduledAudits,
        exportOptions
      );
      
      if (exportFormat === 'excel') {
        // Generate Excel file
        await generateExcelReport(reportType, reportData);
      } else {
        // Generate PDF file with improved formatting
        await generatePDFReport(reportType, reportData, { 
          improveLineBreaks: true,
          adjustLineSpacing: true 
        });
      }
      
      toast({
        title: "Exportação concluída",
        description: `${reportType} exportado com sucesso!`
      });
    } catch (error) {
      console.error("Error exporting report:", error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Não foi possível gerar o relatório solicitado."
      });
    }
  };
  
  const handleFieldToggle = (field: keyof typeof includeFields) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  return <Layout>
      <Toaster />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
              <FileIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-slate-950">
              Exportar Dados
            </h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-1">
            <div className="bg-card rounded-lg border shadow-sm p-5">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Opções de Exportação</h2>
              <ExportOptions 
                exportFormat={exportFormat} 
                setExportFormat={setExportFormat} 
                dateRange={dateRange} 
                setDateRange={setDateRange} 
                year={year} 
                setYear={setYear} 
                date={date} 
                setDate={setDate} 
                includeFields={includeFields} 
                handleFieldToggle={handleFieldToggle} 
              />
            </div>
          </div>

          <div className="space-y-6 md:col-span-2">
            <div className="bg-card rounded-lg border shadow-sm p-5">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Relatórios Disponíveis</h2>
              <AvailableReports 
                nonConformancesCount={nonConformances.length} 
                auditReportsCount={auditReports.length}
                scheduledAuditsCount={scheduledAudits.length}
                handleExport={handleExport} 
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>;
};

export default ExportPage;
