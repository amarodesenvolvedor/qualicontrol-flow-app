
import { jsPDF } from "jspdf";
import { wrapTextToFit } from "../../utils/contentUtils";

/**
 * Render a single table row with proper text wrapping and strict margin compliance
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
  // Minimum line height for readability
  const minLineHeight = Math.max(lineHeight, 5);
  
  // Pre-process all cell contents and determine max lines needed
  let maxLines = 1;
  const cellContents: string[][] = [];
  
  headers.forEach((header, colIndex) => {
    // Get cell value with comprehensive field mapping
    let cellValue = '';
    
    if (header === 'codigo' || header === 'code') {
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
    } else if (header === 'status') {
      cellValue = item.status || '';
    } else {
      cellValue = item[header] || '';
    }
    
    // Convert to string and clean up
    cellValue = String(cellValue).trim();
    
    // Handle empty values
    if (!cellValue) {
      cellValue = '-';
    }
    
    // Calculate available width for text (with proper padding)
    const availableWidth = colWidths[colIndex] - 6; // 3px padding on each side
    
    // Wrap text to fit within column width
    let wrappedLines: string[];
    
    try {
      // Use jsPDF's built-in text wrapping for better accuracy
      wrappedLines = doc.splitTextToSize(cellValue, availableWidth);
      
      // Ensure we have an array
      if (!Array.isArray(wrappedLines)) {
        wrappedLines = [String(wrappedLines)];
      }
      
      // Limit lines to prevent excessive row height
      const maxLinesPerCell = 4;
      if (wrappedLines.length > maxLinesPerCell) {
        wrappedLines = wrappedLines.slice(0, maxLinesPerCell - 1);
        wrappedLines.push('...');
      }
    } catch (error) {
      console.warn(`Error wrapping text for ${header}:`, error);
      wrappedLines = [cellValue.substring(0, 30) + (cellValue.length > 30 ? '...' : '')];
    }
    
    cellContents.push(wrappedLines);
    maxLines = Math.max(maxLines, wrappedLines.length);
  });
  
  // Calculate row height based on content
  const minRowHeight = 15; // Minimum row height for readability
  const contentBasedHeight = (maxLines * minLineHeight) + 8; // 4px top + 4px bottom padding
  const rowHeight = Math.max(minRowHeight, contentBasedHeight);
  
  // Draw row background for alternating colors
  if (isEvenRow) {
    doc.setFillColor(248, 250, 252); // Very light gray
    doc.rect(margin, y, colWidths.reduce((sum, width) => sum + width, 0), rowHeight, 'F');
  }
  
  // Draw cell borders
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.1);
  
  let xPos = margin;
  headers.forEach((_, colIndex) => {
    // Draw cell border
    doc.rect(xPos, y, colWidths[colIndex], rowHeight, 'S');
    xPos += colWidths[colIndex];
  });
  
  // Render cell contents with proper text positioning
  xPos = margin;
  headers.forEach((header, colIndex) => {
    const lines = cellContents[colIndex];
    const cellWidth = colWidths[colIndex];
    
    // Render each line of text in the cell
    lines.forEach((line, lineIndex) => {
      if (line && line.trim()) {
        const textY = y + 6 + (lineIndex * minLineHeight); // Top padding + line spacing
        
        // Apply different alignment based on content type
        if (header === 'status') {
          // Center status text
          const textWidth = doc.getTextWidth(line);
          const centeredX = xPos + (cellWidth / 2) - (textWidth / 2);
          doc.text(line, Math.max(xPos + 3, centeredX), textY);
        } else if (header === 'codigo' || header === 'code') {
          // Center code text
          const textWidth = doc.getTextWidth(line);
          const centeredX = xPos + (cellWidth / 2) - (textWidth / 2);
          doc.text(line, Math.max(xPos + 3, centeredX), textY);
        } else {
          // Left-align other text with proper padding
          doc.text(line, xPos + 3, textY);
        }
      }
    });
    
    xPos += cellWidth;
  });
  
  return rowHeight;
}
