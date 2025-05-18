
export interface ExportedData {
  [key: string]: any;
}

export interface ExcelExportOptions {
  includeMetadata?: boolean;
  companyName?: string;
  sheetName?: string;
}

export interface PDFExportOptions {
  showHeader?: boolean;
  showFooter?: boolean;
  companyName?: string;
}
