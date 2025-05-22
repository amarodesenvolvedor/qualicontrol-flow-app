
import { jsPDF } from "jspdf";

/**
 * Calculate proportional column widths based on header content and data
 * Enhanced version with better space allocation
 */
export function calculateColumnWidths(
  headers: string[], 
  totalWidth: number,
  doc?: jsPDF,
  data?: any[]
): number[] {
  // Default to equal distribution
  if (headers.length === 0) return [];
  
  // Minimum column width - increased to ensure sufficient space
  const minColWidth = 40;
  
  // Define weights for specific columns - adjusted for better distribution
  const columnWeights: Record<string, number> = {
    'codigo': 0.8,       // Code can be more compact
    'titulo': 3.5,       // Title needs significantly more space (increased from 2.8)
    'departamento': 1.8, // Increased to accommodate long department names
    'responsavel': 1.9,  // Increased to avoid name truncation
    'status': 1.0,       // Status needs space for longer status like "Em Andamento"
    'data_ocorrencia': 1.4, // Date needs more space for full formatting
  };
  
  // If we have the PDF document and data, use them for better column width estimation
  if (doc && data && data.length > 0) {
    // Get text widths for headers
    const headerWidths = headers.map(header => {
      const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
      return doc.getTextWidth(formattedHeader) + 30; // Larger padding to ensure fit
    });
    
    // Calculate average content width for each column with consideration for column weights
    const contentWidths = headers.map((header, index) => {
      // Sample up to 20 rows for better accuracy (increased from 15 to 20)
      const sampleSize = Math.min(20, data.length);
      let totalWidth = 0;
      let maxWidth = 0;
      
      for (let i = 0; i < sampleSize; i++) {
        const text = String(data[i][header] || '');
        // For long texts, estimate width considering line breaks
        let textWidth = 0;
        
        if (text.length > 20) { // Reduced threshold to capture more potentially long texts
          // For very long texts, apply adjustment factor based on length
          const estimatedLines = Math.ceil(text.length / 20);
          textWidth = Math.min(
            doc.getTextWidth(text.substring(0, 50)) * 1.3, // Consider more characters
            doc.getTextWidth(text) * 0.7  // Smaller reduction to preserve more space
          ) + 40; // Larger padding to ensure space
          
          // Apply additional adjustment based on estimated number of lines
          textWidth = Math.max(textWidth, (50 * Math.sqrt(estimatedLines)));
        } else {
          textWidth = doc.getTextWidth(text) + 30; // Larger padding
        }
        
        totalWidth += textWidth;
        maxWidth = Math.max(maxWidth, textWidth);
      }
      
      // Use average with additional weight for maximum found value
      const avgWidth = (totalWidth / sampleSize + maxWidth) / 1.8; // Modified to give more weight to max width
      const weight = columnWeights[header] || 1;
      return Math.max(headerWidths[index], avgWidth) * weight;
    });
    
    // Ensure each column meets the minimum width
    const adjustedWidths = contentWidths.map(width => Math.max(minColWidth, width));
    
    // Calculate scale factor if total exceeds available width
    const totalCalculatedWidth = adjustedWidths.reduce((sum, width) => sum + width, 0);
    const scaleFactor = totalCalculatedWidth > totalWidth ? totalWidth / totalCalculatedWidth : 1;
    
    // Return scaled column widths with minimum width guarantee
    // Add a small buffer (0.95) to ensure we don't use the entire available width
    return adjustedWidths.map(width => Math.max(minColWidth, width * scaleFactor * 0.95));
  }
  
  // Fall back to weighted distribution based on column importance
  const totalWeights = headers.reduce((sum, header) => sum + (columnWeights[header] || 1), 0);
  
  return headers.map(header => {
    const weight = columnWeights[header] || 1;
    const proportion = weight / totalWeights;
    return Math.max(minColWidth, Math.floor(proportion * totalWidth * 0.95)); // 5% safety margin
  });
}
