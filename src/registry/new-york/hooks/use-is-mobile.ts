import { useSyncExternalStore } from "react"

/**
 * A custom hook that detects if the current viewport is mobile-sized.
 * It uses a media query to determine if the width is less than 768 pixels.
 * @returns {boolean} - Returns true if the viewport is mobile-sized, false otherwise.
 */

const MOBILE_BREAKPOINT = 768

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getServerSnapshot() {
  return false
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
