import { NonConformance } from "@/types/nonConformance";
import { jsPDF } from "jspdf";
import { 
  initializePdfStyling, 
  updatePageNumbers, 
  addSectionTitle, 
  addTextContent, 
  addFooterToPdf, 
  generateFilename 
} from "./utils/pdfGenerationUtils";
import { 
  addNonConformanceHeader, 
  addBasicInformationSection 
} from "./utils/nonConformanceUtils";

/**
 * Exports ACAC (Action Corrective Action Containment) data to PDF with proper page break handling
 * 
 * @param acacData The ACAC data to export
 * @returns A promise that resolves when the PDF has been generated
 */
export const exportAcacToPDF = async (acacData: NonConformance): Promise<void> => {
  try {
    // Create a new PDF document in portrait format
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
      title: `ACAC: ${acacData.code || 'N/A'}`,
      subject: acacData.title,
      creator: 'Sistema de Não Conformidades',
      author: 'Sistema ACAC',
      keywords: 'ACAC, ação corretiva, não conformidade'
    });

    // Initialize styling variables
    const styling = initializePdfStyling(doc);
    
    // Initialize y position
    let y = 20;
    
    // Helper function to handle adding header to new pages
    const addHeaderToNewPage = () => {
      addFooterToPdf(doc, styling);
      addNonConformanceHeader(doc, acacData, styling, "ACAC - AÇÃO CORRETIVA");
    };
    
    // Add initial header with title and document info
    y = addNonConformanceHeader(doc, acacData, styling, "ACAC - AÇÃO CORRETIVA");
    
    // Basic Information Section
    y = addSectionTitle(doc, "INFORMAÇÕES GERAIS", y, styling, true, addHeaderToNewPage);
    y = addBasicInformationSection(doc, acacData, y, styling, addHeaderToNewPage);
    
    // Description Section
    y = addSectionTitle(doc, "DESCRIÇÃO DA NÃO CONFORMIDADE", y, styling, true, addHeaderToNewPage);
    const descriptionText = acacData.description || "Sem descrição disponível";
    y = addTextContent(doc, descriptionText, y, styling, addHeaderToNewPage);
    
    // Root Cause Section
    if (acacData.root_cause_analysis) {
      y = addSectionTitle(doc, "ANÁLISE DE CAUSA RAIZ", y, styling, true, addHeaderToNewPage);
      y = addTextContent(doc, acacData.root_cause_analysis, y, styling, addHeaderToNewPage);
    }
    
    // Corrective Action Section
    if (acacData.corrective_action) {
      y = addSectionTitle(doc, "AÇÃO CORRETIVA", y, styling, true, addHeaderToNewPage);
      y = addTextContent(doc, acacData.corrective_action, y, styling, addHeaderToNewPage);
    }
    
    // Immediate Actions Section
    if (acacData.immediate_actions) {
      y = addSectionTitle(doc, "AÇÕES IMEDIATAS", y, styling, true, addHeaderToNewPage);
      y = addTextContent(doc, acacData.immediate_actions, y, styling, addHeaderToNewPage);
    }
    
    // Verification and Approvals section
    y = addSectionTitle(doc, "VERIFICAÇÕES E APROVAÇÕES", y, styling, true, addHeaderToNewPage);
    
    // Two columns layout
    const colWidth = styling.contentWidth / 2;
    
    // Left column (Verification of action)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.text(`Verificação da Ação:`, styling.margin, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      acacData.action_verification_date ? 
        format(new Date(acacData.action_verification_date), "dd/MM/yyyy") : 
        'Pendente',
      styling.margin + 40, 
      y
    );
    
    // Right column (Effectiveness verification)
    const rightColX = styling.margin + colWidth + 10;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`Verificação de Eficácia:`, rightColX, y);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(
      acacData.effectiveness_verification_date ? 
        format(new Date(acacData.effectiveness_verification_date), "dd/MM/yyyy") : 
        'Pendente',
      rightColX + 45, 
      y
    );
    
    y += 15;
    
    // Signature fields
    // Check if we have space for signatures
    if (y + 50 > styling.maxContentHeight) {
      addHeaderToNewPage();
      y = 20;
    }
    
    // Draw signature lines
    doc.setDrawColor(100, 100, 100);
    
    // Responsible signature
    doc.line(styling.margin + 10, y, styling.margin + styling.contentWidth/2 - 10, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(acacData.responsible_name || "Responsável", styling.margin + (styling.contentWidth/4), y + 5, { align: 'center' });
    doc.text("Responsável", styling.margin + (styling.contentWidth/4), y + 10, { align: 'center' });
    
    // Auditor signature
    doc.line(styling.margin + styling.contentWidth/2 + 10, y, styling.margin + styling.contentWidth - 10, y);
    doc.text(acacData.auditor_name || "Auditor", styling.margin + styling.contentWidth/2 + (styling.contentWidth/4), y + 5, { align: 'center' });
    doc.text("Auditor", styling.margin + styling.contentWidth/2 + (styling.contentWidth/4), y + 10, { align: 'center' });
    
    // Update page numbers in footers
    updatePageNumbers(doc, styling);
    
    // Generate filename and save the PDF
    const filename = generateFilename('ACAC', acacData.code);
    doc.save(filename);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao gerar PDF ACAC:", error);
    throw error;
  }
};

// Add the missing import
import { format } from "date-fns";
