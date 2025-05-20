
/**
 * Calculate proportional column widths based on header content
 */
export function calculateColumnWidths(headers: string[], totalWidth: number): number[] {
  // Default to equal distribution
  if (headers.length === 0) return [];
  
  // Calculate proportional widths
  const minColWidth = 50; // Minimum column width
  const totalChars = headers.reduce((sum, header) => sum + header.length, 0);
  
  return headers.map(header => {
    const proportion = header.length / totalChars;
    // Ensure minimum width and adjust proportionally
    return Math.max(minColWidth, Math.floor(proportion * totalWidth));
  });
}
