
import { jsPDF } from "jspdf";

/**
 * Calculate proportional column widths based on header content and data
 * Enhanced version with better space allocation and strict margin compliance
 */
export function calculateColumnWidths(
  headers: string[], 
  totalWidth: number,
  doc?: jsPDF,
  data?: any[]
): number[] {
  // Default to equal distribution
  if (headers.length === 0) return [];
  
  // Minimum column width - ensuring readability
  const minColWidth = 35;
  
  // Define weights for specific columns - optimized for better content fit
  const columnWeights: Record<string, number> = {
    'codigo': 0.7,       // Code can be more compact
    'titulo': 4.0,       // Title needs significantly more space (increased)
    'departamento': 2.2, // Department names can be long
    'responsavel': 2.0,  // Responsible person names
    'status': 0.9,       // Status is usually short
    'data_ocorrencia': 1.2, // Date formatting
  };
  
  // If we have the PDF document and data, use them for better column width estimation
  if (doc && data && data.length > 0) {
    // Get text widths for headers
    const headerWidths = headers.map(header => {
      const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
      return doc.getTextWidth(formattedHeader) + 20; // Padding for header
    });
    
    // Calculate content widths for each column with improved sampling
    const contentWidths = headers.map((header, index) => {
      // Sample up to 10 rows for performance while maintaining accuracy
      const sampleSize = Math.min(10, data.length);
      let maxWidth = 0;
      let totalWidth = 0;
      
      for (let i = 0; i < sampleSize; i++) {
        const text = String(data[i][header] || '');
        
        // For long texts, estimate width considering word wrapping
        let textWidth = 0;
        
        if (text.length > 25) {
          // For very long texts, calculate based on average word length
          const words = text.split(' ');
          const avgWordLength = text.length / words.length;
          const estimatedLines = Math.ceil(words.length / Math.floor(80 / avgWordLength));
          
          // Use a more conservative width calculation for long texts
          textWidth = Math.min(
            doc.getTextWidth(text.substring(0, 40)) + 15,
            avgWordLength * 8 + 20
          );
        } else {
          textWidth = doc.getTextWidth(text) + 15; // Standard padding
        }
        
        totalWidth += textWidth;
        maxWidth = Math.max(maxWidth, textWidth);
      }
      
      // Use weighted average of max and average widths
      const avgWidth = totalWidth / sampleSize;
      const estimatedWidth = (maxWidth * 0.3 + avgWidth * 0.7);
      const weight = columnWeights[header] || 1;
      
      return Math.max(headerWidths[index], estimatedWidth * weight);
    });
    
    // Ensure each column meets the minimum width
    const adjustedWidths = contentWidths.map(width => Math.max(minColWidth, width));
    
    // Calculate scale factor to fit within available width
    const totalCalculatedWidth = adjustedWidths.reduce((sum, width) => sum + width, 0);
    
    // Apply scaling with strict margin compliance (use 98% to ensure we stay within bounds)
    const scaleFactor = totalCalculatedWidth > totalWidth ? (totalWidth * 0.98) / totalCalculatedWidth : 0.98;
    
    // Return scaled column widths ensuring minimum width compliance
    const finalWidths = adjustedWidths.map(width => Math.max(minColWidth, width * scaleFactor));
    
    // Final check to ensure total width doesn't exceed available space
    const finalTotal = finalWidths.reduce((sum, width) => sum + width, 0);
    if (finalTotal > totalWidth) {
      const finalScale = (totalWidth * 0.95) / finalTotal;
      return finalWidths.map(width => Math.max(minColWidth, width * finalScale));
    }
    
    return finalWidths;
  }
  
  // Fall back to weighted distribution based on column importance
  const totalWeights = headers.reduce((sum, header) => sum + (columnWeights[header] || 1), 0);
  
  return headers.map(header => {
    const weight = columnWeights[header] || 1;
    const proportion = weight / totalWeights;
    return Math.max(minColWidth, Math.floor(proportion * totalWidth * 0.95)); // 5% safety margin
  });
}
