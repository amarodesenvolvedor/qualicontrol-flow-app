
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
  const minLineHeight = Math.max(lineHeight, 4);
  
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
      // Improved handling for responsible names - avoid breaking names incorrectly
      let responsibleName = item.responsavel || item.responsible_name || '';
      
      // Clean up the responsible name and ensure proper formatting
      if (responsibleName) {
        // Remove extra spaces and line breaks
        responsibleName = responsibleName.replace(/\s+/g, ' ').trim();
        
        // Handle cases where names might be broken - try to reconstruct common patterns
        if (responsibleName.includes('Marcos') && responsibleName.includes('Aquil')) {
          responsibleName = responsibleName.replace(/Marcos\s*Aquil.*/, 'Marcos Aquila');
        }
        if (responsibleName.includes('Francisco') && responsibleName.includes('Cesár')) {
          responsibleName = responsibleName.replace(/Francisco\s*Cesár.*/, 'Francisco Cesário');
        }
        
        cellValue = responsibleName;
      }
    } else if (header === 'data_ocorrencia' || header === 'occurrence_date') {
      let dateValue = item.data_ocorrencia || item.occurrence_date || '';
      
      // Format date if it's a valid date string
      if (dateValue) {
        try {
          const date = new Date(dateValue);
          if (!isNaN(date.getTime())) {
            cellValue = date.toLocaleDateString('pt-BR');
          } else {
            cellValue = dateValue;
          }
        } catch {
          cellValue = dateValue;
        }
      }
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
    const availableWidth = colWidths[colIndex] - 4; // 2px padding on each side
    
    // Wrap text to fit within column width with special handling for names
    let wrappedLines: string[];
    
    try {
      // For responsible names, try to avoid breaking on names
      if ((header === 'responsavel' || header === 'responsible_name') && cellValue.length > 0) {
        // If the name is too long, try smart wrapping at word boundaries
        if (doc.getTextWidth(cellValue) > availableWidth) {
          const words = cellValue.split(' ');
          if (words.length > 1) {
            // Try to break between first and last name
            const midPoint = Math.ceil(words.length / 2);
            const firstPart = words.slice(0, midPoint).join(' ');
            const secondPart = words.slice(midPoint).join(' ');
            
            if (doc.getTextWidth(firstPart) <= availableWidth && doc.getTextWidth(secondPart) <= availableWidth) {
              wrappedLines = [firstPart, secondPart];
            } else {
              // Fall back to jsPDF wrapping
              wrappedLines = doc.splitTextToSize(cellValue, availableWidth);
            }
          } else {
            wrappedLines = doc.splitTextToSize(cellValue, availableWidth);
          }
        } else {
          wrappedLines = [cellValue];
        }
      } else {
        // Use jsPDF's built-in text wrapping for other fields
        wrappedLines = doc.splitTextToSize(cellValue, availableWidth);
      }
      
      // Ensure we have an array
      if (!Array.isArray(wrappedLines)) {
        wrappedLines = [String(wrappedLines)];
      }
      
      // Limit lines to prevent excessive row height
      const maxLinesPerCell = 3; // Allow up to 3 lines
      if (wrappedLines.length > maxLinesPerCell) {
        wrappedLines = wrappedLines.slice(0, maxLinesPerCell - 1);
        wrappedLines.push('...');
      }
    } catch (error) {
      console.warn(`Error wrapping text for ${header}:`, error);
      wrappedLines = [cellValue.substring(0, 20) + (cellValue.length > 20 ? '...' : '')];
    }
    
    cellContents.push(wrappedLines);
    maxLines = Math.max(maxLines, wrappedLines.length);
  });
  
  // Calculate row height based on content
  const minRowHeight = 10; // Minimum row height for readability
  const contentBasedHeight = (maxLines * minLineHeight) + 4; // 2px top + 2px bottom padding
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
        const textY = y + 3 + (lineIndex * minLineHeight); // Top padding + line spacing
        
        // Apply different alignment based on content type
        if (header === 'status') {
          // Center status text
          const textWidth = doc.getTextWidth(line);
          const centeredX = xPos + (cellWidth / 2) - (textWidth / 2);
          doc.text(line, Math.max(xPos + 2, centeredX), textY);
        } else if (header === 'codigo' || header === 'code') {
          // Center code text
          const textWidth = doc.getTextWidth(line);
          const centeredX = xPos + (cellWidth / 2) - (textWidth / 2);
          doc.text(line, Math.max(xPos + 2, centeredX), textY);
        } else if (header === 'data_ocorrencia' || header === 'occurrence_date') {
          // Center date text
          const textWidth = doc.getTextWidth(line);
          const centeredX = xPos + (cellWidth / 2) - (textWidth / 2);
          doc.text(line, Math.max(xPos + 2, centeredX), textY);
        } else {
          // Left-align other text with proper padding
          doc.text(line, xPos + 2, textY);
        }
      }
    });
    
    xPos += cellWidth;
  });
  
  return rowHeight;
}
