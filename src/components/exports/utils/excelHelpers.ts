
import * as XLSX from 'xlsx';

/**
 * Apply styling to Excel worksheet header
 */
export const styleWorksheetHeader = (ws: XLSX.WorkSheet, headerRange: XLSX.Range): void => {
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const cell = XLSX.utils.encode_cell({ r: 0, c: C });
    if (!ws[cell]) continue;
    if (!ws[cell].s) ws[cell].s = {};
    ws[cell].s.font = { bold: true, color: { rgb: "FFFFFF" } };
    ws[cell].s.fill = { fgColor: { rgb: "293594" } }; // Corporate blue
    ws[cell].s.alignment = { horizontal: "center" };
  }
};

/**
 * Apply styling to Excel worksheet data rows
 */
export const styleWorksheetData = (ws: XLSX.WorkSheet, dataRange: XLSX.Range): void => {
  for (let R = 1; R <= dataRange.e.r; ++R) {
    for (let C = dataRange.s.c; C <= dataRange.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cell]) continue;
      if (!ws[cell].s) ws[cell].s = {};
      
      // Add borders to all cells
      ws[cell].s.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      };
      
      // Alternate row coloring
      if (R % 2 === 1) {
        ws[cell].s.fill = { fgColor: { rgb: "F5F5FA" } }; // Light background
      }
    }
  }
};

/**
 * Apply styling to a single metadata cell (typically a header)
 */
export const styleMetadataHeader = (ws: XLSX.WorkSheet, cellAddress: string): void => {
  if (!ws[cellAddress]) return;
  
  if (!ws[cellAddress].s) ws[cellAddress].s = {};
  ws[cellAddress].s.font = { bold: true, color: { rgb: "FFFFFF" } };
  ws[cellAddress].s.fill = { fgColor: { rgb: "293594" } };
};
