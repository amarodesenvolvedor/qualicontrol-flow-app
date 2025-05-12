
import { NonConformance } from "@/types/nonConformance";
import { AuditReport } from "@/types/audit";
import { format } from "date-fns";
import * as XLSX from 'xlsx';

/**
 * Exports non-conformance data to Excel format
 * 
 * @param nonConformance The non-conformance object to export
 * @param options Optional export options like included fields
 * @returns A promise that resolves when the Excel file has been generated
 */
export const exportNonConformanceToExcel = async (
  nonConformance: NonConformance,
  options?: {
    includeFields?: (keyof NonConformance)[]
  }
): Promise<void> => {
  try {
    // Determine which fields to include
    const fields = options?.includeFields || [
      'code', 'title', 'description', 'status', 'category',
      'department_id', 'responsible_name', 'auditor_name', 
      'occurrence_date', 'deadline_date', 'created_at'
    ];
    
    // Create worksheet data
    const wsData = [fields]; // Header row
    
    // Format data row
    const dataRow: any[] = [];
    
    fields.forEach(field => {
      const key = field as keyof NonConformance;
      let value = nonConformance[key];
      
      // Format dates for readability
      if (typeof value === 'string' && field.toString().includes('date') && value) {
        value = format(new Date(value), 'dd/MM/yyyy');
      }
      
      // Handle department special case
      if (field === 'department_id' && nonConformance.department) {
        value = nonConformance.department.name;
      }
      
      dataRow.push(value);
    });
    
    wsData.push(dataRow);
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "NonConformance");
    
    // Generate Excel file
    XLSX.writeFile(wb, `${nonConformance.code}_data.xlsx`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating Excel:", error);
    throw error;
  }
};

/**
 * Exports audit report data to Excel format
 * 
 * @param audit The audit report to export
 * @returns A promise that resolves when the Excel file has been generated
 */
export const exportAuditToExcel = async (audit: AuditReport): Promise<void> => {
  try {
    // Create worksheet data
    const fields = ['id', 'title', 'status', 'description', 'audit_date', 'created_at', 'department_id'];
    const wsData = [fields]; // Header row
    
    // Format data row
    const dataRow: any[] = [];
    
    fields.forEach(field => {
      let value = audit[field as keyof typeof audit];
      
      // Format dates for readability
      if (typeof value === 'string' && field.includes('date') && value) {
        value = format(new Date(value), 'dd/MM/yyyy');
      }
      
      dataRow.push(value);
    });
    
    wsData.push(dataRow);
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Audit");
    
    // Generate Excel file
    XLSX.writeFile(wb, `Audit_${audit.id}_data.xlsx`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating audit Excel:", error);
    throw error;
  }
};
