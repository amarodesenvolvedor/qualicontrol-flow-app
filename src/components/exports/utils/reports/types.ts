
import { ExportOptions } from "../types";

/**
 * Extended export options interface for reports
 */
export interface ReportExportOptions extends ExportOptions {
  dateRange?: string;
  year?: number;
  specificDate?: Date;
  includeFields?: Record<string, boolean>;
}

/**
 * Filtered data interface for different report types
 */
export interface FilteredReportData {
  filteredNonConformances: any[];
  filteredAuditReports: any[];
  filteredScheduledAudits: any[];
}

/**
 * Status translation map
 */
export const STATUS_MAP: Record<string, string> = {
  'pending': 'Pendente',
  'in-progress': 'Em Andamento',
  'resolved': 'Resolvido',
  'closed': 'Encerrado',
  'critical': 'Crítico',
  'completed': 'Concluído',
  'programada': 'Programada',
  'agendada': 'Agendada',
  'concluida': 'Concluída',
  'atrasada': 'Atrasada'
};
