
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
  
  // Largura mínima de coluna - aumentada para dar mais espaço
  const minColWidth = 30;
  
  // Definir pesos para colunas específicas
  const columnWeights: Record<string, number> = {
    'id': 0.5,
    'codigo': 0.8,
    'titulo': 2.0,
    'departamento': 1.2,
    'responsavel': 1.2,
    'status': 0.8,
    'data_ocorrencia': 0.8,
    'data_encerramento': 0.8,
    'descricao': 2.5,
    'acoes_imediatas': 2.0,
    'acao_corretiva': 2.0,
    'requisito_iso': 0.9
  };
  
  // If we have the PDF document and data, use them for better column width estimation
  if (doc && data && data.length > 0) {
    // Get text widths for headers
    const headerWidths = headers.map(header => {
      const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
      return doc.getTextWidth(formattedHeader) + 20; // Add padding
    });
    
    // Calculate average content width for each column with consideration for column weights
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
      const weight = columnWeights[header] || 1;
      return Math.max(headerWidths[index], avgWidth) * weight;
    });
    
    // Ensure each column meets the minimum width
    const adjustedWidths = contentWidths.map(width => Math.max(minColWidth, width));
    
    // Calculate scale factor if total exceeds available width
    const totalCalculatedWidth = adjustedWidths.reduce((sum, width) => sum + width, 0);
    const scaleFactor = totalCalculatedWidth > totalWidth ? totalWidth / totalCalculatedWidth : 1;
    
    // Return scaled column widths
    return adjustedWidths.map(width => width * scaleFactor);
  }
  
  // Fall back to weighted distribution based on column importance
  const totalWeights = headers.reduce((sum, header) => sum + (columnWeights[header] || 1), 0);
  
  return headers.map(header => {
    const weight = columnWeights[header] || 1;
    const proportion = weight / totalWeights;
    return Math.max(minColWidth, Math.floor(proportion * totalWidth));
  });
}
