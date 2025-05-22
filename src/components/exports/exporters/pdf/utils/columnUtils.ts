
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
  
  // Largura mínima de coluna
  const minColWidth = 38; // Aumentado para dar mais espaço
  
  // Definir pesos para colunas específicas - ajustados para melhor distribuição
  const columnWeights: Record<string, number> = {
    'codigo': 0.9,   // Código precisa ser menor
    'titulo': 2.5,   // Título precisa de mais espaço
    'departamento': 1.6, 
    'responsavel': 1.5,  
    'status': 0.9,   // Status é geralmente curto
    'data_ocorrencia': 1.1, // Data precisa de mais espaço
    'requisito_iso': 1.1   // Requisito ISO também precisa de mais espaço
  };
  
  // If we have the PDF document and data, use them for better column width estimation
  if (doc && data && data.length > 0) {
    // Get text widths for headers
    const headerWidths = headers.map(header => {
      const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
      return doc.getTextWidth(formattedHeader) + 25; // Adicionar padding maior
    });
    
    // Calculate average content width for each column with consideration for column weights
    const contentWidths = headers.map((header, index) => {
      // Sample up to 15 rows for better accuracy
      const sampleSize = Math.min(15, data.length);
      let totalWidth = 0;
      let maxWidth = 0;
      
      for (let i = 0; i < sampleSize; i++) {
        const text = String(data[i][header] || '');
        // Para textos longos, estimar largura considerando quebras de linha
        let textWidth = 0;
        
        if (text.length > 30) {
          // Para textos muito longos, aplicar fator de ajuste baseado no comprimento
          const estimatedLines = Math.ceil(text.length / 30);
          textWidth = Math.min(
            doc.getTextWidth(text.substring(0, 40)) * 1.2, // Considerar apenas os primeiros caracteres
            doc.getTextWidth(text) * 0.6  // Reduzir mais, considerando quebras
          ) + 30; // Padding maior
          
          // Aplicar um ajuste adicional baseado no número estimado de linhas
          textWidth = Math.max(textWidth, (40 * Math.sqrt(estimatedLines)));
        } else {
          textWidth = doc.getTextWidth(text) + 25; // Padding maior
        }
        
        totalWidth += textWidth;
        maxWidth = Math.max(maxWidth, textWidth);
      });
      
      // Usar média com peso adicional para o valor máximo encontrado
      const avgWidth = (totalWidth / sampleSize + maxWidth) / 2;
      const weight = columnWeights[header] || 1;
      return Math.max(headerWidths[index], avgWidth) * weight;
    });
    
    // Ensure each column meets the minimum width
    const adjustedWidths = contentWidths.map(width => Math.max(minColWidth, width));
    
    // Calculate scale factor if total exceeds available width
    const totalCalculatedWidth = adjustedWidths.reduce((sum, width) => sum + width, 0);
    const scaleFactor = totalCalculatedWidth > totalWidth ? totalWidth / totalCalculatedWidth : 1;
    
    // Return scaled column widths with minimum width guarantee
    return adjustedWidths.map(width => Math.max(minColWidth, width * scaleFactor));
  }
  
  // Fall back to weighted distribution based on column importance
  const totalWeights = headers.reduce((sum, header) => sum + (columnWeights[header] || 1), 0);
  
  return headers.map(header => {
    const weight = columnWeights[header] || 1;
    const proportion = weight / totalWeights;
    return Math.max(minColWidth, Math.floor(proportion * totalWidth));
  });
}
