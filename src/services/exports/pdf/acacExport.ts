
import { NonConformance } from "@/types/nonConformance";
import { format } from "date-fns";
import { jsPDF } from "jspdf";

/**
 * Exports non-conformance data to ACAC (Analysis of Cause and Corrective Action) PDF format
 * 
 * @param nonConformance The non-conformance object to export
 * @returns A promise that resolves when the PDF has been generated
 */
export const exportAcacToPDF = async (nonConformance: NonConformance): Promise<void> => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    const lineHeight = 10;
    let y = 20;
    
    // Adicionar um cabeçalho profissional
    addHeaderToPDF(doc, 'ANÁLISE DE CAUSA E AÇÃO CORRETIVA');
    y += 25; // Espaço após o cabeçalho
    
    // Add title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ANÁLISE DE CAUSA E AÇÃO CORRETIVA", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.text(`ACAC-S: ${nonConformance.code || "N/A"}`, doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += lineHeight * 2;

    // Add section: Informações Gerais
    addSectionWithBackground(doc, "1. INFORMAÇÕES GERAIS", y);
    y += lineHeight * 1.8;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const drawField = (label: string, value: string, yPos: number) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}: `, 20, yPos);
      const labelWidth = doc.getStringUnitWidth(`${label}: `) * doc.getFontSize() / doc.internal.scaleFactor;
      doc.setFont("helvetica", "normal");
      doc.text(value || "N/A", 20 + labelWidth, yPos);
      return yPos + lineHeight;
    };
    
    y = drawField("Departamento", nonConformance.department?.name || "N/A", y);
    y = drawField("Responsável", nonConformance.responsible_name || "N/A", y);
    y = drawField("Auditor", nonConformance.auditor_name || "N/A", y); // Movido para esta seção
    y = drawField("Data de Ocorrência", nonConformance.occurrence_date ? format(new Date(nonConformance.occurrence_date), "dd/MM/yyyy") : "N/A", y);
    y = drawField("Local", nonConformance.location || "N/A", y);
    y += lineHeight;
    
    // Add section: Descrição da Não Conformidade
    addSectionWithBackground(doc, "2. DESCRIÇÃO DA NÃO CONFORMIDADE", y);
    y += lineHeight * 1.8;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const descriptionText = nonConformance.description || "Não fornecida";
    const descriptionLines = doc.splitTextToSize(descriptionText, 170);
    doc.text(descriptionLines, 20, y);
    y += lineHeight * (descriptionLines.length + 1.5);
    
    // Add section: Ações Imediatas
    addSectionWithBackground(doc, "3. AÇÕES IMEDIATAS TOMADAS", y);
    y += lineHeight * 1.8;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const actionsText = nonConformance.immediate_actions || "Nenhuma ação registrada";
    const actionsLines = doc.splitTextToSize(actionsText, 170);
    doc.text(actionsLines, 20, y);
    y += lineHeight * (actionsLines.length + 1.5);
    
    // Check if we need a new page
    if (y > 220) {
      doc.addPage();
      y = 40; // Leave space for header
      addHeaderToPDF(doc, 'ANÁLISE DE CAUSA E AÇÃO CORRETIVA');
    }
    
    // Add section: Análise de Causa
    addSectionWithBackground(doc, "4. ANÁLISE DE CAUSA", y);
    y += lineHeight * 1.8;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Se houver conteúdo para análise de causa, exibir. Caso contrário, desenhar linhas para preenchimento manual
    if (nonConformance.root_cause_analysis) {
      const analysisLines = doc.splitTextToSize(nonConformance.root_cause_analysis, 170);
      doc.text(analysisLines, 20, y);
      y += lineHeight * (analysisLines.length + 1.5);
    } else {
      // Desenhar linhas para preenchimento manual
      doc.text("", 20, y); // Espaço em branco
      y += lineHeight * 0.5;
      
      // Desenhar 4 linhas para preenchimento manual
      for (let i = 0; i < 4; i++) {
        doc.line(20, y, 190, y);
        y += lineHeight;
      }
      y += lineHeight * 0.5;
    }
    
    // Add section: Ação Corretiva
    addSectionWithBackground(doc, "5. AÇÃO CORRETIVA", y);
    y += lineHeight * 1.8;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Se houver conteúdo para ação corretiva, exibir. Caso contrário, desenhar linhas para preenchimento manual
    if (nonConformance.corrective_action) {
      const correctiveLines = doc.splitTextToSize(nonConformance.corrective_action, 170);
      doc.text(correctiveLines, 20, y);
      y += lineHeight * (correctiveLines.length + 1.5);
    } else {
      // Desenhar linhas para preenchimento manual
      doc.text("", 20, y); // Espaço em branco
      y += lineHeight * 0.5;
      
      // Desenhar 4 linhas para preenchimento manual
      for (let i = 0; i < 4; i++) {
        doc.line(20, y, 190, y);
        y += lineHeight;
      }
      y += lineHeight * 0.5;
    }
    
    // Add section: Prazo e Responsáveis
    addSectionWithBackground(doc, "6. PRAZO E RESPONSÁVEIS", y);
    y += lineHeight * 1.8;
    
    const responseDate = nonConformance.response_date 
      ? format(new Date(nonConformance.response_date), "dd/MM/yyyy")
      : "Não definido";
      
    y = drawField("Prazo para Resposta", responseDate, y);
    y += lineHeight * 2;
    
    if (y > 220) {
      doc.addPage();
      y = 40; // Leave space for header
      addHeaderToPDF(doc, 'ANÁLISE DE CAUSA E AÇÃO CORRETIVA');
    }
    
    // Add section: Verificação da Eficácia
    addSectionWithBackground(doc, "7. VERIFICAÇÃO DA EFICÁCIA", y);
    y += lineHeight * 1.8;
    
    const effectivenessDate = nonConformance.effectiveness_verification_date 
      ? format(new Date(nonConformance.effectiveness_verification_date), "dd/MM/yyyy")
      : "Não definida";
    
    y = drawField("Data de Verificação", effectivenessDate, y);
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Observações:", 20, y);
    y += lineHeight * 1.2;
    
    // Draw lines for handwritten notes
    for (let i = 0; i < 4; i++) {
      doc.line(20, y, 190, y);
      y += lineHeight;
    }
    
    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addFooterToPDF(doc, `ACAC - ${nonConformance.code || 'S/N'}`, i, pageCount);
    }
    
    // Save the PDF with ACAC specific filename
    doc.save(`ACAC_${nonConformance.code || "NC"}_${format(new Date(), "yyyyMMdd")}.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Erro ao gerar PDF de ACAC:", error);
    throw error;
  }
};

// Função auxiliar para adicionar cabeçalho ao PDF
function addHeaderToPDF(doc: jsPDF, title: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Desenhar uma barra de cabeçalho
  doc.setFillColor(41, 65, 148); // Azul corporativo
  doc.rect(0, 0, pageWidth, 20, 'F');
  
  // Adicionar título no cabeçalho
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(title, 10, 13);
  
  // Adicionar data no cabeçalho
  const today = format(new Date(), "dd/MM/yyyy");
  doc.setFontSize(10);
  doc.text(`Emitido em: ${today}`, pageWidth - 15, 13, { align: "right" });
  
  // Adicionar linha separadora abaixo do cabeçalho
  doc.setDrawColor(200, 200, 200);
  doc.line(10, 22, pageWidth - 10, 22);
  
  // Resetar cores para o conteúdo
  doc.setTextColor(0, 0, 0);
}

// Função auxiliar para adicionar rodapé ao PDF
function addFooterToPDF(doc: jsPDF, documentCode: string, currentPage: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Adicionar linha separadora acima do rodapé
  doc.setDrawColor(200, 200, 200);
  doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
  
  // Adicionar texto do rodapé
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`${documentCode} - Sistema de Gestão de Não Conformidades`, 10, pageHeight - 10);
  
  // Adicionar número da página
  doc.text(`Página ${currentPage} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: "right" });
}

// Função para adicionar título de seção com fundo colorido
function addSectionWithBackground(doc: jsPDF, title: string, y: number) {
  // Desenhar retângulo de fundo
  doc.setFillColor(240, 240, 250); // Azul muito claro
  doc.rect(10, y - 7, doc.internal.pageSize.getWidth() - 20, 10, 'F');
  
  // Adicionar título da seção
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(41, 65, 148); // Azul corporativo
  doc.text(title, 20, y);
  
  // Resetar cores para o conteúdo
  doc.setTextColor(0, 0, 0);
}
