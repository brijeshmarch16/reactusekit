import { useEffect, useRef } from "react"

/**
 * Custom hook to detect clicks outside the element.
 * @param callback - Function to call when a click outside the element is detected.
 * @returns A ref to attach to the element you want to monitor for outside clicks.
 */

export function useClickOutside<T extends HTMLElement>(callback: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [callback])

  return ref
}
