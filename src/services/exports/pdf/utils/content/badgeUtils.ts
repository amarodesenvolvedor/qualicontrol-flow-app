
import { jsPDF } from "jspdf";

/**
 * Add a status badge to the PDF
 */
export const addStatusBadge = (
  doc: jsPDF, 
  status: string, 
  x: number, 
  y: number, 
  statusMap: Record<string, string>
): void => {
  const statusText = statusMap[status] || status;
  
  // Create a color-coded status badge
  const statusColor = status === 'resolved' || status === 'closed' 
    ? [0, 150, 50] // Green for completed statuses
    : status === 'in-progress'
      ? [230, 140, 0] // Orange for in progress
      : [220, 50, 50]; // Red for pending
  
  const statusWidth = doc.getTextWidth(statusText) + 10;
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(x - statusWidth, y - 5, statusWidth, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(statusText, x - (statusWidth / 2), y - 1, { align: 'center' });
};
