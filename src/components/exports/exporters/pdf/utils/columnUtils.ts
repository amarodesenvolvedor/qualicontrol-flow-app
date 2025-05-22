
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
  const minColWidth = 35; // Aumentado de 30 para 35
  
  // Definir pesos para colunas específicas
  const columnWeights: Record<string, number> = {
    'id': 0.5,
    'codigo': 0.8,
    'titulo': 2.2,      // Aumentado de 2.0 para 2.2
    'departamento': 1.4, // Aumentado de 1.2 para 1.4
    'responsavel': 1.4,  // Aumentado de 1.2 para 1.4
    'status': 0.8,
    'data_ocorrencia': 0.9, // Aumentado de 0.8 para 0.9
    'data_encerramento': 0.9, // Aumentado de 0.8 para 0.9
    'descricao': 3.0,    // Aumentado de 2.5 para 3.0
    'acoes_imediatas': 2.5, // Aumentado de 2.0 para 2.5
    'acao_corretiva': 2.5,  // Aumentado de 2.0 para 2.5
    'requisito_iso': 1.0   // Aumentado de 0.9 para 1.0
  };
  
  // If we have the PDF document and data, use them for better column width estimation
  if (doc && data && data.length > 0) {
    // Get text widths for headers
    const headerWidths = headers.map(header => {
      const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
      return doc.getTextWidth(formattedHeader) + 25; // Adicionar padding maior (era 20)
    });
    
    // Calculate average content width for each column with consideration for column weights
    const contentWidths = headers.map((header, index) => {
      // Sample up to 15 rows for better accuracy (era 10)
      const sampleSize = Math.min(15, data.length);
      let totalWidth = 0;
      let maxWidth = 0;
      
      for (let i = 0; i < sampleSize; i++) {
        const text = String(data[i][header] || '');
        // Para textos longos, estimar largura considerando quebras de linha
        let textWidth = 0;
        
        if (text.length > 30) {
          // Para textos muito longos, aplicar fator de ajuste baseado no comprimento
          textWidth = Math.min(
            doc.getTextWidth(text.substring(0, 30)) * 1.5, // Não deixar ficar muito largo
            doc.getTextWidth(text) * 0.8  // Reduzir um pouco, considerando quebras
          ) + 25; // Padding maior
        } else {
          textWidth = doc.getTextWidth(text) + 25; // Padding maior
        }
        
        totalWidth += textWidth;
        maxWidth = Math.max(maxWidth, textWidth);
      }
      
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
