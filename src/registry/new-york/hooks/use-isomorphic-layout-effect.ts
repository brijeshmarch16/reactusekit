import { useEffect, useLayoutEffect } from "react"

/**
 * A custom hook that provides a cross-platform compatible `useLayoutEffect`.
 * It uses `useEffect` on the server and `useLayoutEffect` on the client.
 * @param {Function} effect - The effect function to run.
 * @param {Array} deps - The dependencies array for the effect.
 * @returns {void}
 */

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect
