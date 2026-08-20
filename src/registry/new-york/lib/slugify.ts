/**
 * Convert a string to a URL-friendly slug.
 * @param text - The text to slugify.
 * @param options - Configuration options for slugification.
 * @param options.separator - Character to use as separator (default: '-').
 * @param options.lowercase - Whether to convert to lowercase (default: true).
 * @param options.strict - Whether to use strict mode (default: false).
 * @returns A URL-friendly slug.
 */

export function slugify(
  text: string,
  options: {
    separator?: string
    lowercase?: boolean
    strict?: boolean
  } = {}
): string {
  const { separator = "-", lowercase = true, strict = false } = options

  if (!text || typeof text !== "string") {
    return ""
  }

  let slug = text.toString()

  // Convert to lowercase if specified
  if (lowercase) {
    slug = slug.toLowerCase()
  }

  // Replace accented characters with their base equivalents
  slug = slug.normalize("NFD").replace(/\p{M}/gu, "")

  if (strict) {
    // Strict mode: only keep alphanumeric characters and separators
    slug = slug.replace(/[^a-zA-Z0-9]/g, separator)
  } else {
    // Standard mode: replace spaces and special characters
    slug = slug
      .replace(/[^\w\s-]/g, "") // Remove special characters except word chars, spaces, and hyphens
      .replace(/[\s_-]+/g, separator) // Replace spaces, underscores, and multiple hyphens with separator
  }

  // Remove leading/trailing separators and collapse multiple separators
  slug = slug
    .replace(new RegExp(`^${separator}+|${separator}+$`, "g"), "") // Remove leading/trailing separators
    .replace(new RegExp(`${separator}+`, "g"), separator) // Collapse multiple separators

  return slug
}
