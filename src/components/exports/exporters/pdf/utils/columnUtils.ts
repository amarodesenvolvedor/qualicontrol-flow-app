
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
  const minColWidth = 20; // Reduced minimum for better fit
  
  // Define weights for specific columns - optimized for content importance
  const columnWeights: Record<string, number> = {
    'codigo': 1.0,         // Code needs adequate space
    'code': 1.0,
    'titulo': 3.5,         // Title needs more space
    'title': 3.5,
    'descricao': 4.0,      // Description needs the most space
    'description': 4.0,
    'departamento': 2.0,   // Department names - reduced
    'department': 2.0,
    'responsavel': 2.0,    // Responsible person names - adequate space
    'responsible_name': 2.0,
    'status': 1.0,         // Status is usually short
    'data_ocorrencia': 1.2, // Date formatting - reduced
    'occurrence_date': 1.2,
  };
  
  // If we have the PDF document and data, use them for better column width estimation
  if (doc && data && data.length > 0) {
    // Get current font size for accurate text width calculations
    const currentFontSize = doc.getFontSize();
    
    // Get text widths for headers
    const headerWidths = headers.map(header => {
      const headerDisplayNames: Record<string, string> = {
        'codigo': 'Código',
        'code': 'Código',
        'titulo': 'Título',
        'title': 'Título',
        'descricao': 'Descrição',
        'description': 'Descrição',
        'departamento': 'Departamento',
        'department': 'Departamento',
        'status': 'Status',
        'responsavel': 'Responsável',
        'responsible_name': 'Responsável',
        'data_ocorrencia': 'Data Ocorrência',
        'occurrence_date': 'Data Ocorrência'
      };
      
      const formattedHeader = headerDisplayNames[header] || 
                             header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
      return doc.getTextWidth(formattedHeader) + 6; // Padding for header
    });
    
    // Calculate content widths for each column with improved sampling
    const contentWidths = headers.map((header, index) => {
      // Sample up to 3 rows for performance while maintaining accuracy
      const sampleSize = Math.min(3, data.length);
      let maxWidth = 0;
      let totalWidth = 0;
      
      for (let i = 0; i < sampleSize; i++) {
        // Get the actual field value with proper mapping
        let fieldValue = '';
        if (header === 'descricao' || header === 'description') {
          fieldValue = data[i].descricao || data[i].description || '';
        } else if (header === 'codigo' || header === 'code') {
          fieldValue = data[i].codigo || data[i].code || '';
        } else if (header === 'titulo' || header === 'title') {
          fieldValue = data[i].titulo || data[i].title || '';
        } else if (header === 'departamento' || header === 'department') {
          if (typeof data[i].departamento === 'object' && data[i].departamento?.name) {
            fieldValue = data[i].departamento.name;
          } else if (typeof data[i].department === 'object' && data[i].department?.name) {
            fieldValue = data[i].department.name;
          } else {
            fieldValue = data[i].departamento || data[i].department || '';
          }
        } else if (header === 'responsavel' || header === 'responsible_name') {
          // Handle responsible names properly
          let responsibleName = data[i].responsavel || data[i].responsible_name || '';
          if (responsibleName) {
            responsibleName = responsibleName.replace(/\s+/g, ' ').trim();
            // Estimate width for typical names
            fieldValue = responsibleName.length > 15 ? responsibleName.substring(0, 15) : responsibleName;
          }
        } else {
          fieldValue = data[i][header] || '';
        }
        
        const text = String(fieldValue);
        
        // For long texts, estimate width considering word wrapping
        let textWidth = 0;
        
        if (text.length > 15) {
          // For longer texts, calculate based on average character width
          const avgCharWidth = doc.getTextWidth('M'); // Use 'M' as reference
          textWidth = Math.min(
            doc.getTextWidth(text.substring(0, 20)) + 4,
            avgCharWidth * 15 + 6 // Conservative estimate
          );
        } else {
          textWidth = doc.getTextWidth(text) + 4; // Standard padding
        }
        
        totalWidth += textWidth;
        maxWidth = Math.max(maxWidth, textWidth);
      }
      
      // Use weighted average of max and average widths
      const avgWidth = sampleSize > 0 ? totalWidth / sampleSize : 0;
      const estimatedWidth = (maxWidth * 0.4 + avgWidth * 0.6); // Favor average over max
      const weight = columnWeights[header] || 1;
      
      return Math.max(headerWidths[index], estimatedWidth * weight);
    });
    
    // Ensure each column meets the minimum width
    const adjustedWidths = contentWidths.map(width => Math.max(minColWidth, width));
    
    // Calculate scale factor to fit within available width
    const totalCalculatedWidth = adjustedWidths.reduce((sum, width) => sum + width, 0);
    
    // Apply scaling with strict margin compliance (use 96% to ensure we stay within bounds)
    const scaleFactor = totalCalculatedWidth > totalWidth ? (totalWidth * 0.96) / totalCalculatedWidth : 0.96;
    
    // Return scaled column widths ensuring minimum width compliance
    const finalWidths = adjustedWidths.map(width => Math.max(minColWidth, width * scaleFactor));
    
    // Final check to ensure total width doesn't exceed available space
    const finalTotal = finalWidths.reduce((sum, width) => sum + width, 0);
    if (finalTotal > totalWidth) {
      const finalScale = (totalWidth * 0.94) / finalTotal; // Even more conservative
      return finalWidths.map(width => Math.max(minColWidth, width * finalScale));
    }
    
    return finalWidths;
  }
  
  // Fall back to weighted distribution based on column importance
  const totalWeights = headers.reduce((sum, header) => sum + (columnWeights[header] || 1), 0);
  
  return headers.map(header => {
    const weight = columnWeights[header] || 1;
    const proportion = weight / totalWeights;
    return Math.max(minColWidth, Math.floor(proportion * totalWidth * 0.94)); // 6% safety margin
  });
}
