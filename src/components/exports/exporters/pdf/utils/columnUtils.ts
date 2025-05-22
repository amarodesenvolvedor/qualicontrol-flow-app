
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
  
  // Largura mínima de coluna - aumentada para garantir espaço suficiente
  const minColWidth = 40;
  
  // Definir pesos para colunas específicas - ajustados para melhor distribuição
  const columnWeights: Record<string, number> = {
    'codigo': 0.8,       // Código pode ser mais compacto
    'titulo': 2.8,       // Título precisa de bastante espaço
    'departamento': 1.8, // Aumentado para acomodar nomes de departamentos longos
    'responsavel': 1.9,  // Aumentado para evitar truncamento de nomes
    'status': 1.0,       // Status precisa de espaço para status longos como "Em Andamento"
    'data_ocorrencia': 1.4, // Data precisa de mais espaço para formatação completa
    'requisito_iso': 1.3   // Requisito ISO precisa de espaço adequado
  };
  
  // If we have the PDF document and data, use them for better column width estimation
  if (doc && data && data.length > 0) {
    // Get text widths for headers
    const headerWidths = headers.map(header => {
      const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
      return doc.getTextWidth(formattedHeader) + 30; // Padding maior para garantir que caiba
    });
    
    // Calculate average content width for each column with consideration for column weights
    const contentWidths = headers.map((header, index) => {
      // Sample up to 20 rows for better accuracy (aumentado de 15 para 20)
      const sampleSize = Math.min(20, data.length);
      let totalWidth = 0;
      let maxWidth = 0;
      
      for (let i = 0; i < sampleSize; i++) {
        const text = String(data[i][header] || '');
        // Para textos longos, estimar largura considerando quebras de linha
        let textWidth = 0;
        
        if (text.length > 25) { // Reduzido para capturar mais textos potencialmente longos
          // Para textos muito longos, aplicar fator de ajuste baseado no comprimento
          const estimatedLines = Math.ceil(text.length / 25);
          textWidth = Math.min(
            doc.getTextWidth(text.substring(0, 50)) * 1.3, // Considerar mais caracteres
            doc.getTextWidth(text) * 0.7  // Redução menor para preservar mais espaço
          ) + 35; // Padding maior para garantir espaço
          
          // Aplicar um ajuste adicional baseado no número estimado de linhas
          textWidth = Math.max(textWidth, (45 * Math.sqrt(estimatedLines)));
        } else {
          textWidth = doc.getTextWidth(text) + 30; // Padding maior
        }
        
        totalWidth += textWidth;
        maxWidth = Math.max(maxWidth, textWidth);
      }
      
      // Usar média com peso adicional para o valor máximo encontrado
      const avgWidth = (totalWidth / sampleSize + maxWidth) / 1.8; // Modificado para dar mais peso à largura máxima
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
    return Math.max(minColWidth, Math.floor(proportion * totalWidth * 0.95)); // 5% margin de segurança
  });
}
