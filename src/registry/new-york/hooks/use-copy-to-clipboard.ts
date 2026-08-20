import { useCallback, useState } from "react"

/**
 * Custom hook to copy text to clipboard.
 * @returns {Object} An object containing the copy function, copied state, and error state.
 */

interface UseCopyToClipboardResult {
  copy: (text: string) => Promise<boolean>
  copied: boolean
  error: string | null
}

export function useCopyToClipboard(): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      setError("Clipboard API not supported")
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setError(null)

      setTimeout(() => setCopied(false), 2000)
      return true
    } catch {
      setError("Failed to copy")
      setCopied(false)
      return false
    }
  }, [])

  return { copy, copied, error }
}
