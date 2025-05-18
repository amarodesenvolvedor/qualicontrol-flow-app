
export type ExportFormat = "pdf" | "excel";

export interface ReportData {
  [key: string]: any;
}

export interface ReportMetadata {
  title: string;
  description: string;
  type: string;
  updatedAt: string;
}
