
import { NonConformance } from "@/types/nonConformance";
import { jsPDF } from "jspdf";
import { 
  generateFilename, 
  initializePdfStyling, 
  updatePageNumbers, 
  addSectionTitle, 
  addTextContent, 
  addFooterToPdf 
} from "./utils/pdfGenerationUtils";
import { 
  addNonConformanceHeader, 
  addBasicInformationSection, 
  addScheduleSection 
} from "./utils/nonConformanceUtils";

/**
 * Exports non-conformance data to PDF with an enhanced professional layout
 * 
 * @param nonConformance The non-conformance object to export
 * @returns A promise that resolves when the PDF has been generated
 */
export const exportNonConformanceToPDF = async (nonConformance: NonConformance): Promise<void> => {
  try {
    // Create a new PDF document in portrait format
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set document properties
    doc.setProperties({
      title: `Relatório de Não Conformidade: ${nonConformance.code || 'N/A'}`,
      subject: nonConformance.title,
      creator: 'Sistema de Não Conformidades',
      author: 'Sistema ACAC',
      keywords: 'não conformidade, qualidade, relatório'
    });

    // Initialize styling variables
    const styling = initializePdfStyling(doc);
    
    // Initialize y position
    let y = 20;
    
    // Helper function to handle adding header to new pages
    const addHeaderToNewPage = () => {
      addFooterToPdf(doc, styling);
      addNonConformanceHeader(doc, nonConformance, styling, "RELATÓRIO DE NÃO CONFORMIDADE");
    };
    
    // Add initial header with title and document info
    y = addNonConformanceHeader(doc, nonConformance, styling, "RELATÓRIO DE NÃO CONFORMIDADE");
    
    // Basic Information Section
    y = addSectionTitle(doc, "INFORMAÇÕES GERAIS", y, styling, true, addHeaderToNewPage);
    y = addBasicInformationSection(doc, nonConformance, y, styling, addHeaderToNewPage);
    
    // Date Information Section
    y = addSectionTitle(doc, "CRONOGRAMA", y, styling, true, addHeaderToNewPage);
    y = addScheduleSection(doc, nonConformance, y, styling, addHeaderToNewPage);
    
    // Description Section with improved page break handling
    y = addSectionTitle(doc, "DESCRIÇÃO", y, styling, true, addHeaderToNewPage);
    const descriptionText = nonConformance.description || "Sem descrição disponível";
    y = addTextContent(doc, descriptionText, y, styling, addHeaderToNewPage);
    
    // Immediate Actions Section with improved page break handling
    y = addSectionTitle(doc, "AÇÕES IMEDIATAS", y, styling, true, addHeaderToNewPage);
    const actionsText = nonConformance.immediate_actions || "Nenhuma ação registrada";
    y = addTextContent(doc, actionsText, y, styling, addHeaderToNewPage);
    
    // Root Cause Analysis Section (if available)
    if (nonConformance.root_cause_analysis) {
      y = addSectionTitle(doc, "ANÁLISE DE CAUSA RAIZ", y, styling, true, addHeaderToNewPage);
      y = addTextContent(doc, nonConformance.root_cause_analysis, y, styling, addHeaderToNewPage);
    }
    
    // Corrective Action Section (if available)
    if (nonConformance.corrective_action) {
      y = addSectionTitle(doc, "AÇÃO CORRETIVA", y, styling, true, addHeaderToNewPage);
      y = addTextContent(doc, nonConformance.corrective_action, y, styling, addHeaderToNewPage);
    }
    
    // Add footer with page number and generation date to all pages
    updatePageNumbers(doc, styling);
    
    // Generate filename and save the PDF
    const filename = generateFilename('NC', nonConformance.code);
    doc.save(filename);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw error;
  }
};
