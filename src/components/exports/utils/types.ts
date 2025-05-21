
/**
 * Options for PDF export
 */
export interface PDFExportOptions {
  showHeader?: boolean;
  showFooter?: boolean;
  forceLandscape?: boolean;
  allowLandscape?: boolean;
  improveLineBreaks?: boolean;
  adjustLineSpacing?: boolean;
  fontSize?: number;
  margin?: number;
  contentWidth?: number;
  pageHeight?: number;
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
