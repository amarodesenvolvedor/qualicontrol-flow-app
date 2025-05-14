
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

    // Add title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ANÁLISE DE CAUSA E AÇÃO CORRETIVA", doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += lineHeight;
    
    doc.setFontSize(12);
    doc.text(`ACAC-S: ${nonConformance.code || "N/A"}`, doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += lineHeight * 2;

    // Add section: Informações Gerais
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("1. INFORMAÇÕES GERAIS", 20, y);
    y += lineHeight * 1.2;
    
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
    y = drawField("Responsável", nonConformance.responsible_name, y);
    y = drawField("Data de Ocorrência", format(new Date(nonConformance.occurrence_date), "dd/MM/yyyy"), y);
    y = drawField("Local", nonConformance.location || "N/A", y);
    y += lineHeight;
    
    // Add section: Descrição da Não Conformidade
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("2. DESCRIÇÃO DA NÃO CONFORMIDADE", 20, y);
    y += lineHeight * 1.2;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const descriptionLines = doc.splitTextToSize(nonConformance.description || "Não fornecida", 170);
    doc.text(descriptionLines, 20, y);
    y += lineHeight * (descriptionLines.length + 1.5);
    
    // Add section: Ações Imediatas
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("3. AÇÕES IMEDIATAS TOMADAS", 20, y);
    y += lineHeight * 1.2;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const actionsLines = doc.splitTextToSize(nonConformance.immediate_actions || "Nenhuma ação registrada", 170);
    doc.text(actionsLines, 20, y);
    y += lineHeight * (actionsLines.length + 1.5);
    
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    // Add section: Análise de Causa
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("4. ANÁLISE DE CAUSA", 20, y);
    y += lineHeight * 1.2;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Espaço para preenchimento manual ou anexo posterior.", 20, y);
    y += lineHeight * 3;
    
    // Add section: Ação Corretiva
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("5. AÇÃO CORRETIVA", 20, y);
    y += lineHeight * 1.2;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Espaço para preenchimento manual ou anexo posterior.", 20, y);
    y += lineHeight * 3;
    
    // Add section: Prazo e Responsáveis
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("6. PRAZO E RESPONSÁVEIS", 20, y);
    y += lineHeight * 1.2;
    
    const responseDate = nonConformance.response_date 
      ? format(new Date(nonConformance.response_date), "dd/MM/yyyy")
      : "Não definido";
      
    y = drawField("Prazo para Resposta", responseDate, y);
    y = drawField("Auditor", nonConformance.auditor_name, y);
    y += lineHeight * 2;
    
    // Add section: Verificação da Eficácia
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("7. VERIFICAÇÃO DA EFICÁCIA", 20, y);
    y += lineHeight * 1.2;
    
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
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.text(`ACAC - ${nonConformance.code || 'S/N'} - Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 20, doc.internal.pageSize.getHeight() - 10);
      doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
    }
    
    // Save the PDF with ACAC specific filename
    doc.save(`ACAC_${nonConformance.code || "NC"}_${format(new Date(), "yyyyMMdd")}.pdf`);
    
    return Promise.resolve();
  } catch (error) {
    console.error("Error generating ACAC PDF:", error);
    throw error;
  }
};
