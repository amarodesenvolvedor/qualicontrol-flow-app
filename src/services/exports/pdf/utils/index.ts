
// Re-export from core
export * from './core/stylingUtils';

// Re-export from layout
export * from './layout/headerFooterUtils';

// Re-export from content
export * from './content/sectionUtils';
export * from './content/textUtils';

// Re-export with renamed import to avoid conflicts
import { addStatusBadge as addContentStatusBadge } from './content/badgeUtils';
export { addContentStatusBadge };

// Re-export all from other utility files
export * from "./statusUtils";
export * from "./headerUtils";
export * from "./infoSectionUtils";

// Re-export individual items that don't cause conflicts
export { generateFilename } from './core/stylingUtils';
export { addSectionTitle, addField } from './content/sectionUtils';
export { addTextContent } from './content/textUtils';
export { updatePageNumbers, addFooterToPdf } from './layout/headerFooterUtils';
