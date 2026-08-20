import { useEffect, useRef } from "react"
import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect"

/**
 * A custom hook that sets up an interval to call a callback function at specified intervals.
 * @param callback - The function to be called at each interval.
 * @param delay - The time in milliseconds between each call. If null, the interval is not set.
 */

export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>(callback)

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null || delay < 0) {
      return
    }

    const tick = () => savedCallback.current()
    const id = setInterval(tick, delay)

    return () => clearInterval(id)
  }, [delay])
}
