
import { jsPDF } from "jspdf";

/**
 * Calculate proportional column widths based on header content and data
 */
export function calculateColumnWidths(
  headers: string[], 
  totalWidth: number,
  doc?: jsPDF,
  data?: any[]
): number[] {
  // Default to equal distribution
  if (headers.length === 0) return [];
  
  // Minimum column width
  const minColWidth = 60;
  
  // If we have the PDF document and data, use them for better column width estimation
  if (doc && data && data.length > 0) {
    // Get text widths for headers
    const headerWidths = headers.map(header => {
      const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
      return doc.getTextWidth(formattedHeader) + 20; // Add padding
    });
    
    // Calculate average content width for each column
    const contentWidths = headers.map((header, index) => {
      // Sample up to 10 rows for performance
      const sampleSize = Math.min(10, data.length);
      let totalWidth = 0;
      
      for (let i = 0; i < sampleSize; i++) {
        const text = String(data[i][header] || '');
        const textWidth = doc.getTextWidth(text) + 20; // Add padding
        totalWidth += textWidth;
      }
      
      const avgWidth = totalWidth / sampleSize;
      return Math.max(headerWidths[index], avgWidth);
    });
    
    // Ensure each column meets the minimum width
    const adjustedWidths = contentWidths.map(width => Math.max(minColWidth, width));
    
    // Calculate scale factor if total exceeds available width
    const totalCalculatedWidth = adjustedWidths.reduce((sum, width) => sum + width, 0);
    const scaleFactor = totalCalculatedWidth > totalWidth ? totalWidth / totalCalculatedWidth : 1;
    
    // Return scaled column widths
    return adjustedWidths.map(width => width * scaleFactor);
  }
  
  // Fall back to simple distribution if we don't have the doc or data
  // Calculate proportional widths based on header names
  const totalChars = headers.reduce((sum, header) => sum + header.length, 0);
  
  return headers.map(header => {
    const proportion = Math.max(0.1, header.length / totalChars);
    // Ensure minimum width and adjust proportionally
    return Math.max(minColWidth, Math.floor(proportion * totalWidth));
  });
}
