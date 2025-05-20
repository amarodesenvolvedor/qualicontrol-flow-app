/**
 * Options for PDF export configuration
 */
export interface PDFExportOptions {
  /**
   * Whether to show header on PDF pages
   */
  showHeader?: boolean;
  
  /**
   * Whether to show footer on PDF pages
   */
  showFooter?: boolean;
  
  /**
   * Whether to improve line breaks for text content
   */
  improveLineBreaks?: boolean;
  
  /**
   * Whether to adjust line spacing for better readability
   */
  adjustLineSpacing?: boolean;
  
  /**
   * Whether to use landscape orientation
   */
  forceLandscape?: boolean;
  
  /**
   * Whether to allow switching to landscape orientation as needed
   */
  allowLandscape?: boolean;
  
  /**
   * Custom styles to apply to the PDF
   */
  styles?: Record<string, any>;
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
