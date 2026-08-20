import { useEffect, useRef } from "react"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

/**
 * A custom hook that sets up an timeout to call a callback function at specified intervals.
 * @param callback - The function to be called at each timeout.
 * @param delay - The time in milliseconds between each call. If null, the timeout is not set.
 */

export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null || delay < 0) {
      return
    }

    const tick = () => savedCallback.current()
    const id = setTimeout(tick, delay)

    return () => clearTimeout(id)
  }, [delay])
}
