/**
 * Truncate text to a maximum length with ellipsis.
 * @param text - The text to truncate.
 * @param maxLength - Maximum length before truncation.
 * @returns The truncated text with ellipsis if needed.
 */

export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}
