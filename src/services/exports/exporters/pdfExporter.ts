
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { addHeaderToPDF, addFooterToPDF } from "../utils/pdfHelpers";
import { ReportMetadata } from "../utils/exportTypes";

/**
 * Export report data to PDF format with enhanced visual layout
 */
export const exportToPDF = (
  { title, description, type, updatedAt }: ReportMetadata,
  reportData: Record<string, any>
): void => {
  // Create a PDF document
  const doc = new jsPDF();
  
  // Define corporate colors as arrays with explicit types
  const primaryColor: [number, number, number] = [41, 65, 148]; // Corporate blue RGB
  const secondaryColor: [number, number, number] = [100, 100, 100]; // Gray for text
  const lightBackground: [number, number, number] = [245, 245, 250]; // Light background for sections
  
  // Add stylized header
  addHeaderToPDF(doc, "Sistema de Gestão de Não Conformidades");
  
  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let y = 30; // Start position after header
  
  // Title section with color background
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  
  // Draw title background
  doc.rect(margin - 10, y - 5, pageWidth - (margin - 10) * 2, 12, 'F');
  doc.text(title, pageWidth / 2, y, { align: 'center' });
  y += 20;
  
  // Report metadata section
  doc.setFillColor(lightBackground[0], lightBackground[1], lightBackground[2]);
  doc.rect(margin - 10, y - 5, pageWidth - (margin - 10) * 2, 40, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin - 10, y - 5, pageWidth - (margin - 10) * 2, 40, 'S');
  
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Tipo: ${type}`, margin, y);
  y += 10;
  
  doc.text(`Atualizado em: ${updatedAt}`, margin, y);
  y += 10;
  
  doc.text("Descrição:", margin, y);
  y += 8;
  
  // Description text
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const descriptionLines = doc.splitTextToSize(description, pageWidth - (margin * 2));
  doc.text(descriptionLines, margin, y);
  y += descriptionLines.length * 6 + 10;
  
  // Report data section header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.rect(margin - 10, y - 5, pageWidth - (margin - 10) * 2, 10, 'F');
  doc.text("Dados do Relatório", pageWidth / 2, y, { align: 'center' });
  y += 15;
  
  // Report data content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  // Different display formats based on data type
  if (typeof Object.values(reportData)[0] === 'number') {
    // Simple key-value pairs
    let alternateRow = false;
    Object.entries(reportData).forEach(([key, value], index) => {
      // Alternating row colors
      if (alternateRow) {
        doc.setFillColor(lightBackground[0], lightBackground[1], lightBackground[2]);
        doc.rect(margin - 5, y - 4, pageWidth - (margin - 5) * 2, 8, 'F');
      }
      alternateRow = !alternateRow;
      
      doc.text(key, margin, y);
      doc.text(value.toString(), pageWidth - margin - 20, y, { align: 'right' });
      y += 8;
      
      if (y > pageHeight - 40) {
        doc.addPage();
        addHeaderToPDF(doc, "Sistema de Gestão de Não Conformidades");
        y = 40;
      }
    });
  } else if (Array.isArray(Object.values(reportData)[0])) {
    // Handle array data with categories
    Object.entries(reportData).forEach(([category, items]) => {
      // Category header
      doc.setFont("helvetica", "bold");
      doc.text(category, margin, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      
      // Display item count
      if (Array.isArray(items)) {
        doc.text(`Total: ${items.length} item(s)`, margin + 10, y);
        y += 5;
        
        // Show first 5 items as sample
        if (items.length > 0) {
          doc.setFillColor(lightBackground[0], lightBackground[1], lightBackground[2]);
          doc.rect(margin - 5, y - 4, pageWidth - (margin - 5) * 2, items.length * 8 + 10, 'F');
          doc.setDrawColor(200, 200, 200);
          doc.rect(margin - 5, y - 4, pageWidth - (margin - 5) * 2, items.length * 8 + 10, 'S');
          y += 5;
          
          // Display table headers if items have properties
          if (typeof items[0] === 'object') {
            const keys = Object.keys(items[0]).slice(0, 3); // Limit to 3 columns
            
            doc.setFont("helvetica", "bold");
            keys.forEach((key, index) => {
              doc.text(key.charAt(0).toUpperCase() + key.slice(1), margin + (index * 60), y);
            });
            y += 8;
            doc.setFont("helvetica", "normal");
            
            // Display rows (max 5)
            const maxItems = Math.min(5, items.length);
            for (let i = 0; i < maxItems; i++) {
              keys.forEach((key, index) => {
                const value = items[i][key]?.toString() || 'N/A';
                doc.text(value.substring(0, 25), margin + (index * 60), y);
              });
              y += 8;
              
              if (y > pageHeight - 40) {
                doc.addPage();
                addHeaderToPDF(doc, "Sistema de Gestão de Não Conformidades");
                y = 40;
              }
            }
            
            // Indicate if there are more items
            if (items.length > maxItems) {
              doc.text(`... e mais ${items.length - maxItems} item(s)`, margin, y);
              y += 10;
            }
          }
        }
      }
      
      y += 10;
      
      if (y > pageHeight - 40) {
        doc.addPage();
        addHeaderToPDF(doc, "Sistema de Gestão de Não Conformidades");
        y = 40;
      }
    });
  } else {
    // Complex data structure
    doc.text("Dados completos disponíveis no formato Excel", margin, y);
    y += 10;
  }
  
  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    addFooterToPDF(doc, title, i, pageCount);
  }
  
  // Save the PDF
  const filename = `${title.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}`;
  doc.save(`${filename}.pdf`);
};
