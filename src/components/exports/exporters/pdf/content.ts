import { jsPDF } from "jspdf";
import { PDFExportOptions } from "../../utils/types";
import { addHeaderToPDF, addFooterToPDF } from "../../utils/pdfHelpers";
import { calculateColumnWidths } from "./utils/columnUtils";
import { estimateContentHeight } from "./utils/contentUtils";

/**
 * Add content for simple list format (small datasets)
 */
export function addSimpleListContent(
  doc: jsPDF, 
  data: any[], 
  y: number, 
  pageWidth: number, 
  lineHeight: number, 
  options?: PDFExportOptions
): number {
  const margin = options?.margin || 20;
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - (margin * 2);

  data.forEach((item, index) => {
    // Verificar se precisamos de uma nova página antes de adicionar o item
    const itemContentSize = estimateContentHeight(doc, item);
    const boxHeight = Math.max(lineHeight * 4, itemContentSize + lineHeight * 2);
    
    // Se o conteúdo não couber na página atual, criar nova página
    if (y + boxHeight > pageHeight - 40) {
      if (options?.showFooter !== false) {
        addFooterToPDF(doc, "Relatório de Não Conformidades", doc.getNumberOfPages(), doc.getNumberOfPages());
      }
      doc.addPage();
      if (options?.showHeader !== false) {
        addHeaderToPDF(doc, "Relatório de Não Conformidades");
      }
      y = 40; // Reset Y position
    }
    
    // Add item box with light background
    doc.setFillColor(245, 245, 250);
    
    doc.rect(margin, y - 5, contentWidth, boxHeight, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y - 5, contentWidth, boxHeight, 'S');
    
    // Item title with brand color
    doc.setFontSize(12);
    doc.setTextColor(41, 65, 148);
    doc.setFont("helvetica", "bold"); // Usar negrito apenas para o título do item
    doc.text(`Item ${index + 1}`, margin + 5, y);
    y += lineHeight;
    
    // Item details with proper line breaks
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal"); // Volta para fonte normal para os detalhes
    doc.setTextColor(0, 0, 0);
    
    // Iterate through item properties with improved text handling
    Object.entries(item).forEach(([key, value]) => {
      const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
      
      // Handle value display with potential line breaks
      const valueStr = String(value);
      const labelOffset = margin + 15;
      const valueOffset = margin + 45;
      const maxValueWidth = contentWidth - (valueOffset - margin) - 10; // 10px margin de segurança
      
      // Sempre exibir o rótulo na posição correta
      doc.setFont("helvetica", "bold"); // Negrito apenas para o rótulo
      doc.text(`${formattedKey}:`, labelOffset, y);
      doc.setFont("helvetica", "normal"); // Normal para o valor
      
      // Para textos longos, fazer a quebra de linha apropriada
      const lines = doc.splitTextToSize(valueStr, maxValueWidth);
      doc.text(lines, valueOffset, y);
      y += (lines.length > 1 ? lines.length * lineHeight : lineHeight); // Ajustar posição Y com base no número de linhas
    });
    
    y += lineHeight / 2;
  });
  
  return y;
}

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
  const isLandscape = options?.forceLandscape || 
                      reportType === "Não Conformidades Completo" ||
                      (data.length > 5 || headers.length > 5);
  
  if (isLandscape && doc.internal.pageSize.getWidth() < doc.internal.pageSize.getHeight()) {
    // Switch to landscape if not already
    if (options?.showFooter !== false) {
      addFooterToPDF(doc, "Relatório de Não Conformidades", doc.getNumberOfPages(), doc.getNumberOfPages());
    }
    doc.addPage('landscape');
    if (options?.showHeader !== false) {
      addHeaderToPDF(doc, "Relatório de Não Conformidades");
    }
    y = 40;
    pageWidth = doc.internal.pageSize.getWidth();
  }
  
  // Calculate page height for easier reference
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Configure table column settings
  const margin = options?.margin || 15;
  const tableWidth = pageWidth - (margin * 2);
  
  // Campos prioritários para mostrar na tabela
  const priorityHeaders = [
    'codigo', 'id', 'titulo', 'departamento', 'responsavel', 'status', 
    'data_ocorrencia', 'data_encerramento'
  ];
  
  // Para relatórios completos, tentamos incluir mais campos
  if (options?.reportType === "Não Conformidades Completo" || 
      options?.reportType === "Ações Corretivas") {
    priorityHeaders.push('requisito_iso', 'descricao', 'acoes_imediatas', 'acao_corretiva');
  }
  
  // Primeiro priorizamos os campos mais importantes
  let visibleHeaders = headers.filter(header => priorityHeaders.includes(header));
  
  // Se há poucos headers prioritários, incluímos outros disponíveis
  if (visibleHeaders.length < 4) {
    visibleHeaders = headers;
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
  
  // Draw header cells
  let xPos = margin + 3;
  visibleHeaders.forEach((header, i) => {
    const formattedHeader = header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    // Limitar o texto do cabeçalho
    const truncatedHeader = formattedHeader.length > 15 ? 
                          formattedHeader.substring(0, 15) + '...' : 
                          formattedHeader;
    doc.text(truncatedHeader, xPos, y + 7);
    xPos += colWidths[i];
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
        doc.text(truncatedHeader, xPos, y + 7);
        xPos += colWidths[j];
      });
      
      y += lineHeight + 4;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    }
    
    // Alternate row background for readability
    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 250);
      doc.rect(margin, y - 4, tableWidth, lineHeight + 5, 'F');
    }
    
    // Pre-process row to determine height
    const rowContentHeights = [];
    let maxRowHeight = lineHeight;
    
    visibleHeaders.forEach((header, j) => {
      const text = String(item[header] || '');
      const colWidth = colWidths[j] - 10; // Padding
      
      // Calcular altura para textos que precisam de quebra de linha
      if (text.length > 12) { // Reduzido para detectar mais textos que precisam de quebra
        const wrapped = doc.splitTextToSize(text, colWidth - 4); // Margem extra para evitar sobreposição
        const contentHeight = wrapped.length * (lineHeight * 0.7);
        rowContentHeights.push(contentHeight);
        maxRowHeight = Math.max(maxRowHeight, contentHeight + 2);
      } else {
        rowContentHeights.push(lineHeight);
      }
    });
    
    // Re-draw background for taller row if needed
    if (maxRowHeight > lineHeight && i % 2 === 0) {
      doc.setFillColor(245, 245, 250);
      doc.rect(margin, y - 4, tableWidth, maxRowHeight + 2, 'F');
    }
    
    // Add cell content with proper wrapping
    xPos = margin + 3;
    visibleHeaders.forEach((header, j) => {
      const text = String(item[header] || '');
      const colWidth = colWidths[j] - 6; // Margem reduzida para evitar sobreposição
      
      // Sempre usar quebra de linha para garantir que o texto não ultrapasse a coluna
      const wrapped = doc.splitTextToSize(text, colWidth);
      doc.text(wrapped, xPos, y + 2);
      
      xPos += colWidths[j];
    });
    
    y += maxRowHeight + 1; // Adicionar margem extra entre linhas
  }
  
  return y;
}
