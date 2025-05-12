
import Layout from "@/components/app/Layout";
import { useState } from "react";
import { toast } from "sonner";
import { useNonConformances } from "@/hooks/useNonConformances";
import { useAuditReports } from "@/hooks/useAuditReports";
import { Toaster } from "sonner";
import { ExportOptions } from "@/components/exports/ExportOptions";
import { AvailableReports } from "@/components/exports/AvailableReports";
import { getReportData, generateExcelReport, generatePDFReport } from "@/components/exports/exportUtils";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

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

  const { nonConformances } = useNonConformances();
  const { auditReports } = useAuditReports();

  const handleExport = async (reportType: string) => {
    toast.success(`Exportação iniciada: ${reportType}`, {
      description: `Gerando relatório em formato ${exportFormat === 'excel' ? 'Excel' : 'PDF'}.`
    });

    try {
      // Get report data based on type
      const reportData = getReportData(reportType, nonConformances, auditReports);
      
      if (exportFormat === 'excel') {
        // Generate Excel file
        await generateExcelReport(reportType, reportData);
      } else {
        // Generate PDF file
        await generatePDFReport(reportType, reportData);
      }
      
      toast.success(`${reportType} exportado com sucesso!`);
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Erro na exportação", {
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

  return (
    <Layout>
      <Toaster position="top-right" />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Exportar Dados</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-1">
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

          <div className="space-y-6 md:col-span-2">
            <AvailableReports
              nonConformancesCount={nonConformances.length}
              auditReportsCount={auditReports.length}
              handleExport={handleExport}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExportPage;
