/**
 * Normalizes a string by removing diacritics and converting to lowercase
 * This helps with searching text with special characters
 */
export function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}