
/**
 * Options for PDF export configuration
 */
export interface PDFExportOptions {
  showHeader?: boolean;
  showFooter?: boolean;
  improveLineBreaks?: boolean;
  adjustLineSpacing?: boolean;
  orientation?: 'portrait' | 'landscape';
}

/**
 * Options for Excel export configuration
 */
export interface ExcelExportOptions {
  includeMetadata?: boolean;
  worksheetName?: string;
  sheetName?: string;
  companyName?: string;
}

/**
 * Column definition for Excel exports
 */
export interface ExcelColumnDefinition {
  header: string;
  key: string;
  width?: number;
}

/**
 * Generic exported data interface
 */
export interface ExportedData {
  [key: string]: any;
}
