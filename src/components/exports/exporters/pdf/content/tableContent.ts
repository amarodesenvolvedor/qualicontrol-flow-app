
import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../../utils/types";
import { addHeaderToPDF, addFooterToPDF } from "../../../utils/pdfHelpers";
import { calculateColumnWidths } from "../utils/columnUtils";
import { wrapTextToFit } from "../utils/contentUtils";

/**
 * Add content for table format (larger datasets)
 */
export function addTableContent(
  doc: jsPDF, 
  data: any[], 
  y: number, 
  pageWidth: number, 
  lineHeight: number,
  options?: PDFExportOptions
): number {
  // Get headers
  const headers = Object.keys(data[0]);
  
  // Determine optimal table orientation - always use landscape for non-conformance full reports
  const currentReportType = options?.reportType || "Relatório";
  const isLandscape = options?.forceLandscape || 
                      currentReportType === "Não Conformidades Completo" ||
                      (data.length > 5 || headers.length > 5);
  
  if (isLandscape && doc.internal.pageSize.getWidth() < doc.internal.pageSize.getHeight()) {
    // Switch to landscape if not already
    if (options?.showFooter !== false) {
      addFooterToPDF(doc, currentReportType, doc.getNumberOfPages(), doc.getNumberOfPages());
    }
    doc.addPage('landscape');
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, currentReportType);
    }
    y = 40;
    pageWidth = doc.internal.pageSize.getWidth();
  }
  
  // Calculate page height for easier reference
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Configure table column settings
  const margin = options?.margin || 15;
  const tableWidth = pageWidth - (margin * 2);
  
  // Campos prioritários para mostrar na tabela - removendo 'id'
  const priorityHeaders = [
    'codigo', 'titulo', 'departamento', 'responsavel', 'status', 
    'data_ocorrencia', 'data_encerramento', 'requisito_iso'
  ];
  
  // Para relatórios completos, tentamos incluir mais campos, exceto 'id'
  if (currentReportType === "Não Conformidades Completo" || 
      currentReportType === "Ações Corretivas") {
    priorityHeaders.push('descricao', 'acoes_imediatas', 'acao_corretiva');
  }
  
  // Primeiro priorizamos os campos mais importantes, excluindo explicitamente 'id'
  let visibleHeaders = headers.filter(header => 
    priorityHeaders.includes(header) && header !== 'id'
  );
  
  // Se há poucos headers prioritários, incluímos outros disponíveis exceto 'id'
  if (visibleHeaders.length < 4) {
    visibleHeaders = headers.filter(header => header !== 'id');
  }
  
  // Calculate column widths based on content - improved algorithm
  const colWidths = calculateColumnWidths(visibleHeaders, tableWidth, doc, data);
  
  // Draw table header with brand color background
  doc.setFillColor(41, 65, 148);
  doc.rect(margin, y, tableWidth, lineHeight + 2, 'F');
  
  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10); // Reduzido para melhor ajuste
  doc.setFont("helvetica", "bold");
  
  // Draw header cells with centered text
  let xPos = margin + 3;
  visibleHeaders.forEach((header, i) => {
    const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    // Limitar o texto do cabeçalho
    const truncatedHeader = formattedHeader.length > 15 ? 
                          formattedHeader.substring(0, 15) + '...' : 
                          formattedHeader;
    
    // Centralizar o texto do cabeçalho
    const headerWidth = colWidths[i];
    const textWidth = doc.getTextWidth(truncatedHeader);
    const centeredX = xPos + (headerWidth - textWidth) / 2;
    
    doc.text(truncatedHeader, centeredX, y + 7);
    xPos += headerWidth;
  });
  
  y += lineHeight + 4;
  
  // Draw data rows with improved styling
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Show ALL rows with pagination
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    // Verificar necessidade de nova página
    if (y > pageHeight - 40) {
      if (options?.showFooter !== false) {
        addFooterToPDF(doc, options?.reportType || "Relatório", doc.getNumberOfPages(), doc.getNumberOfPages());
      }
      doc.addPage(isLandscape ? 'landscape' : 'portrait');
      if (options?.showHeader !== false) {
        addHeaderToPDF(doc, options?.reportType || "Relatório");
      }
      y = 40;
      
      // Redesenhar cabeçalho na nova página
      doc.setFillColor(41, 65, 148);
      doc.rect(margin, y, tableWidth, lineHeight + 2, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      
      xPos = margin + 3;
      visibleHeaders.forEach((header, j) => {
        const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
        const truncatedHeader = formattedHeader.length > 15 ? 
                              formattedHeader.substring(0, 15) + '...' : 
                              formattedHeader;
        
        // Centralizar o texto do cabeçalho em cada página nova
        const headerWidth = colWidths[j];
        const textWidth = doc.getTextWidth(truncatedHeader);
        const centeredX = xPos + (headerWidth - textWidth) / 2;
        
        doc.text(truncatedHeader, centeredX, y + 7);
        xPos += headerWidth;
      });
      
      y += lineHeight + 4;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    }
    
    // Alternate row background for readability
    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 250);
      doc.rect(margin, y - 4, tableWidth, lineHeight + 8, 'F'); // Increased height for text
    }
    
    // Pre-process row to determine height
    const rowContentHeights = [];
    let maxRowHeight = lineHeight;
    
    visibleHeaders.forEach((header, j) => {
      const text = String(item[header] || '');
      const colWidth = colWidths[j] - 12; // Increased padding
      
      // Calcular altura para textos que precisam de quebra de linha
      if (text.length > 10) { // Reduzido para detectar mais textos que precisam de quebra
        const wrapped = wrapTextToFit(doc, text, colWidth);
        const contentHeight = wrapped.length * (lineHeight * 0.8); // Increased line spacing
        rowContentHeights.push(contentHeight);
        maxRowHeight = Math.max(maxRowHeight, contentHeight + 3); // Added more padding
      } else {
        rowContentHeights.push(lineHeight);
      }
    });
    
    // Re-draw background for taller row if needed
    if (maxRowHeight > lineHeight && i % 2 === 0) {
      doc.setFillColor(245, 245, 250);
      doc.rect(margin, y - 4, tableWidth, maxRowHeight + 4, 'F'); // Increased height
    }
    
    // Add cell content with proper wrapping
    xPos = margin + 3;
    visibleHeaders.forEach((header, j) => {
      const text = String(item[header] || '');
      const colWidth = colWidths[j] - 12; // Increased padding for safety
      
      // Sempre usar quebra de linha para garantir que o texto não ultrapasse a coluna
      const wrapped = wrapTextToFit(doc, text, colWidth);
      
      // Deixar um espaço vertical adicional entre o texto e os limites da célula
      const cellYPos = y + 2;
      doc.text(wrapped, xPos, cellYPos);
      
      xPos += colWidths[j];
    });
    
    y += maxRowHeight + 2; // Adicionar margem extra entre linhas
  }
  
  return y;
}
