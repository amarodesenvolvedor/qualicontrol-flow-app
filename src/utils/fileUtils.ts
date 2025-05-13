
/**
 * Sanitizes a filename to make it safe for storage systems
 * Removes accents, special characters, and replaces spaces with underscores
 */
export const sanitizeFilename = (filename: string): string => {
  // Get the file extension
  const lastDot = filename.lastIndexOf('.');
  const ext = lastDot !== -1 ? filename.substring(lastDot) : '';
  const nameWithoutExt = lastDot !== -1 ? filename.substring(0, lastDot) : filename;
  
  // Remove accents/diacritics
  const withoutAccents = nameWithoutExt.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Replace spaces with underscores and remove other special characters
  const sanitized = withoutAccents
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_.-]/g, '')
    .replace(/_{2,}/g, '_'); // Replace multiple underscores with a single one
  
  return sanitized + ext;
};

/**
 * Creates a storage-safe filename with timestamp prefix for uniqueness
 */
export const createSafeStorageFilename = (originalFilename: string): {
  safeFilename: string;
  originalFilename: string;
} => {
  const timestamp = Date.now();
  const sanitizedName = sanitizeFilename(originalFilename);
  return {
    safeFilename: `${timestamp}_${sanitizedName}`,
    originalFilename
  };
};
