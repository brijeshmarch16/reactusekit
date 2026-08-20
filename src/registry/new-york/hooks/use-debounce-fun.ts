import { useCallback, useRef } from "react"

/**
 * A custom hook that debounces a function.
 * @param func The function to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns A debounced version of the function.
 */

export function useDebounceFun<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): T {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedFunc = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        func(...args)
      }, delay)
    },
    [func, delay]
  )

  return debouncedFunc as T
}
