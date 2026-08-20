/**
 * Check if a string is a valid URL.
 * @param url - The URL string to validate.
 * @param options - Configuration options for validation.
 * @param options.allowRelative - Whether to allow relative URLs (default: false).
 * @param options.protocols - Array of allowed protocols (default: ['http', 'https']).
 * @returns True if the URL is valid, false otherwise.
 */

export function isValidURL(
  url: string,
  options: {
    allowRelative?: boolean
    protocols?: string[]
  } = {}
): boolean {
  const { allowRelative = false, protocols = ["http", "https"] } = options

  if (!url || typeof url !== "string") {
    return false
  }

  // Handle relative URLs
  if (allowRelative && url.startsWith("/")) {
    return true
  }

  try {
    const urlObj = new URL(url)

    // Check if protocol is allowed
    const protocol = urlObj.protocol.slice(0, -1) // Remove trailing ':'
    return protocols.includes(protocol)
  } catch {
    return false
  }
}
