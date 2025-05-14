
// Re-export all PDF export services from their dedicated files
export * from './pdf';

// Function to generate PDF reports
export const generatePDFReport = (
  title: string,
  content: Record<string, any>,
  extraInfo?: Record<string, string>
) => {
  console.log("Generating PDF report:", title, content, extraInfo);
  // Esta função seria implementada para lidar com relatórios específicos
  // Por enquanto é apenas um stub
  return true;
};
