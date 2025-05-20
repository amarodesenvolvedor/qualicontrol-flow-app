
import { jsPDF } from "jspdf";

/**
 * Estimate the height needed for an item's content
 */
export function estimateContentHeight(doc: jsPDF, item: Record<string, any>): number {
  let estimatedHeight = 0;
  const lineHeight = 12;
  
  Object.entries(item).forEach(([_, value]) => {
    const valueStr = String(value);
    if (valueStr.length > 40) {
      // For longer values, estimate multiple lines
      const lines = Math.ceil(valueStr.length / 40);
      estimatedHeight += lines * lineHeight;
    } else {
      estimatedHeight += lineHeight;
    }
  });
  
  return estimatedHeight;
}
