/**
 * Options for PDF export
 */
export interface PDFExportOptions {
  dateRange?: string;
  year?: number;
  specificDate?: Date;
  includeFields?: Record<string, boolean>;
  showHeader?: boolean;
  showFooter?: boolean;
  margin?: number;
  improveLineBreaks?: boolean;
  adjustLineSpacing?: boolean;
  forceLandscape?: boolean;
  allowLandscape?: boolean;
  reportType?: string;
}

/**
 * Options for export operations
 */
export interface ExportOptions {
  dateRange?: string;
  year?: number;
  specificDate?: Date;
  includeFields?: Record<string, boolean>;
}

/**
 * Standard report metadata
 */
export interface ReportMetadata {
  title: string;
  description: string;
  type: string;
  updatedAt: string;
}

/**
 * Configuration for column rendering
 */
export interface ColumnConfig {
  header: string;
  field: string;
  width?: number;
  formatter?: (value: any) => string;
}

/**
 * Fix for exportUtils.ts error
 */
export type ExportedData = any[];
