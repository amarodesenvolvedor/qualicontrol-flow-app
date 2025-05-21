
import { utils, writeFile } from "xlsx";
import { format } from "date-fns";
import { ExportOptions } from "@/components/exports/utils/types";

/**
 * Generate an Excel report from the provided data
 */
export const generateExcelReport = async (
  reportType: string, 
  data: any[], 
  options?: ExportOptions
): Promise<void> => {
  try {
    console.log(`Generating Excel report for ${reportType}`);
    
    if (!data || data.length === 0) {
      console.error(`No data available to generate Excel report for ${reportType}`);
      throw new Error("Nenhum dado disponível para gerar o relatório");
    }
    
    // Create workbook
    const wb = utils.book_new();
    
    // Convert data to worksheet
    const ws = utils.json_to_sheet(data);
    
    // Set column widths
    const colWidths = Object.keys(data[0]).map(key => ({
      wch: Math.max(
        key.length + 2,
        ...data.map(row => {
          const cellValue = String(row[key] || "");
          return Math.min(50, cellValue.length + 2); // Cap at 50 characters
        })
      )
    }));
    
    ws["!cols"] = colWidths;
    
    // Add the worksheet to the workbook
    utils.book_append_sheet(wb, ws, reportType.slice(0, 31)); // Excel sheet name limit
    
    // Generate current date for filename
    const currentDate = format(new Date(), "yyyyMMdd");
    
    // Write to file and trigger download
    writeFile(wb, `${reportType.replace(/\s+/g, "_")}_${currentDate}.xlsx`);
    
    console.log(`Excel report for ${reportType} generated successfully`);
    
  } catch (error) {
    console.error(`Error generating Excel report: ${error}`);
    throw new Error(`Falha ao gerar relatório Excel: ${error.message}`);
  }
};
