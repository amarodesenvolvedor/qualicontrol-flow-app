
import { jsPDF } from "jspdf";
import { wrapTextToFit } from "../../utils/contentUtils";

/**
 * Render a single table row with proper text wrapping to prevent overflow
 * Enhanced version with better cell content handling and margin respect
 */
export function renderTableRow(
  doc: jsPDF,
  item: any,
  headers: string[],
  colWidths: number[],
  margin: number,
  y: number,
  lineHeight: number,
  isEvenRow: boolean = false
): number {
  // Ensure minimum line height for readability
  const minLineHeight = Math.max(lineHeight, 6);
  
  // Calculate the maximum number of lines needed for any cell in this row
  let maxLines = 1;
  const cellContents: string[][] = [];
  
  // Pre-process all cell contents and determine max lines needed
  headers.forEach((header, colIndex) => {
    // Get cell value with proper field mapping
    let cellValue = '';
    
    // Handle different field name variations
    if (header === 'descricao' || header === 'description') {
      cellValue = item.descricao || item.description || '';
    } else if (header === 'codigo' || header === 'code') {
      cellValue = item.codigo || item.code || '';
    } else if (header === 'titulo' || header === 'title') {
      cellValue = item.titulo || item.title || '';
    } else if (header === 'departamento' || header === 'department') {
      // Handle department object or string
      if (typeof item.departamento === 'object' && item.departamento?.name) {
        cellValue = item.departamento.name;
      } else if (typeof item.department === 'object' && item.department?.name) {
        cellValue = item.department.name;
      } else {
        cellValue = item.departamento || item.department || '';
      }
    } else if (header === 'responsavel' || header === 'responsible_name') {
      cellValue = item.responsavel || item.responsible_name || '';
    } else if (header === 'data_ocorrencia' || header === 'occurrence_date') {
      cellValue = item.data_ocorrencia || item.occurrence_date || '';
    } else {
      cellValue = item[header] || '';
    }
    
    // Convert to string and trim
    cellValue = String(cellValue).trim();
    
    // Debug log for description field specifically
    if (header === 'descricao' || header === 'description') {
      console.log(`Description for item ${item.codigo || item.code}:`, {
        header,
        originalDescricao: item.descricao,
        originalDescription: item.description,
        finalValue: cellValue,
        valueLength: cellValue.length
      });
    }
    
    // If cell is empty, show a placeholder
    if (!cellValue) {
      cellValue = '-';
    }
    
    const availableWidth = colWidths[colIndex] - 10; // 5px padding on each side
    
    // Wrap text to fit within column width with enhanced handling
    let wrappedLines: string[];
    
    // For descriptions, ensure proper text wrapping and display more content
    if (header === 'descricao' || header === 'description') {
      wrappedLines = doc.splitTextToSize(cellValue, availableWidth);
      
      // Limit to a reasonable number of lines in the table view
      // (detailed view will show the full content)
      const maxDisplayLines = 7;
      if (wrappedLines.length > maxDisplayLines) {
        const truncatedLines = wrappedLines.slice(0, maxDisplayLines - 1);
        truncatedLines.push('...');
        wrappedLines = truncatedLines;
      }
    } else {
      wrappedLines = wrapTextToFit(doc, cellValue, availableWidth);
    }
    
    cellContents.push(wrappedLines);
    maxLines = Math.max(maxLines, wrappedLines.length);
  });
  
  // Calculate actual row height based on content with minimum height for readability
  const minRowHeight = minLineHeight + 8;
  const contentBasedHeight = (maxLines * minLineHeight) + 12; // Extra padding for readability
  const rowHeight = Math.max(minRowHeight, contentBasedHeight);
  
  // Draw row background (alternating colors)
  if (isEvenRow) {
    doc.setFillColor(248, 250, 252); // Very light gray
    doc.rect(margin, y, colWidths.reduce((sum, width) => sum + width, 0), rowHeight, 'F');
  }
  
  // Draw cell borders
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.1);
  
  let xPos = margin;
  headers.forEach((header, colIndex) => {
    // Draw cell border
    doc.rect(xPos, y, colWidths[colIndex], rowHeight, 'S');
    xPos += colWidths[colIndex];
  });
  
  // Set text properties
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  
  // Render cell contents
  xPos = margin;
  headers.forEach((header, colIndex) => {
    const lines = cellContents[colIndex];
    const cellWidth = colWidths[colIndex];
    
    // Render each line of text in the cell
    lines.forEach((line, lineIndex) => {
      if (line && line.trim()) { // Only render non-empty lines
        const textY = y + 8 + (lineIndex * minLineHeight); // Start with top padding
        
        // Handle special formatting for certain columns
        if (header === 'status') {
          // Center status text
          const textWidth = doc.getTextWidth(line);
          const centeredX = xPos + (cellWidth / 2) - (textWidth / 2);
          doc.text(line, centeredX, textY);
        } else if (header === 'codigo' || header === 'code') {
          // Center code text
          const textWidth = doc.getTextWidth(line);
          const centeredX = xPos + (cellWidth / 2) - (textWidth / 2);
          doc.text(line, centeredX, textY);
        } else {
          // Left-align other text with proper padding
          doc.text(line, xPos + 5, textY);
        }
      }
    });
    
    xPos += cellWidth;
  });
  
  return rowHeight;
}
