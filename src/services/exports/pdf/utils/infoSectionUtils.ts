
import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { NonConformance } from "@/types/nonConformance";
import { PdfStylingOptions } from "./pdfGenerationUtils";

/**
 * Add two-column basic information section
 */
export const addBasicInformationSection = (
  doc: jsPDF,
  nonConformance: NonConformance,
  y: number,
  styling: PdfStylingOptions,
  onPageBreak: () => void
): number => {
  // Two columns for basic info
  const colWidth = styling.contentWidth / 2;
  let leftY = y;
  let rightY = y;
  
  // Left column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.text(`Departamento:`, styling.margin, leftY);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(nonConformance.department?.name || 'N/A', styling.margin + 35, leftY);
  leftY += 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(`Local:`, styling.margin, leftY);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(nonConformance.location || 'N/A', styling.margin + 35, leftY);
  leftY += 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(`Responsável:`, styling.margin, leftY);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(nonConformance.responsible_name || 'N/A', styling.margin + 35, leftY);
  leftY += 6;
  
  // Right column (starts at the middle of the page)
  const rightColX = styling.margin + colWidth + 10;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.text(`Auditor:`, rightColX, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(nonConformance.auditor_name || 'N/A', rightColX + 35, y);
  rightY += 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(`Data Ocorrência:`, rightColX, rightY);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(
    nonConformance.occurrence_date ? format(new Date(nonConformance.occurrence_date), "dd/MM/yyyy") : 'N/A', 
    rightColX + 35, 
    rightY
  );
  rightY += 6;
  
  // Use the lowest y value to continue
  return Math.max(leftY, rightY) + 5;
};

/**
 * Add schedule information section
 */
export const addScheduleSection = (
  doc: jsPDF,
  nonConformance: NonConformance,
  y: number,
  styling: PdfStylingOptions,
  onPageBreak: () => void
): number => {
  // Two columns for dates
  const colWidth = styling.contentWidth / 2;
  let leftY = y;
  let rightY = y;
  
  // Left column
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(10);
  doc.text(`Data Resposta:`, styling.margin, leftY);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(
    nonConformance.response_date ? format(new Date(nonConformance.response_date), "dd/MM/yyyy") : 'Não definida', 
    styling.margin + 35, 
    leftY
  );
  leftY += 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(`Verificação Ação:`, styling.margin, leftY);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(
    nonConformance.action_verification_date ? 
      format(new Date(nonConformance.action_verification_date), "dd/MM/yyyy") : 
      'Não definida', 
    styling.margin + 35, 
    leftY
  );
  leftY += 6;
  
  // Right column (starts at the middle of the page)
  const rightColX = styling.margin + colWidth + 10;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(`Verificação Eficácia:`, rightColX, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(
    nonConformance.effectiveness_verification_date ? 
      format(new Date(nonConformance.effectiveness_verification_date), "dd/MM/yyyy") : 
      'Não definida',
    rightColX + 35, 
    y
  );
  rightY += 6;
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text(`Data Conclusão:`, rightColX, rightY);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(
    nonConformance.completion_date ? 
      format(new Date(nonConformance.completion_date), "dd/MM/yyyy") : 
      'Não definida',
    rightColX + 35, 
    rightY
  );
  rightY += 6;
  
  // Use the lowest y value to continue
  return Math.max(leftY, rightY) + 5;
};
