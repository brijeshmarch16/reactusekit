import { useCallback, useEffect, useRef, useState } from "react"

/**
 * A custom hook that manages state synchronized with localStorage.
 * Enhanced with custom serializers, remove functionality, and improved cross-tab sync.
 *
 * @param {string} key The localStorage key to use
 * @param {*} initialValue The initial value if no value exists in localStorage
 * @param {Object} options Configuration options for the hook
 * @param {Object} options.serializer Custom serializer function with read/write methods
 * @param {boolean} options.syncData Whether to sync data across tabs (default: true)
 * @param {boolean} options.initializeWithValue Whether to initialize with value from localStorage (default: true)
 * @returns {[*, function, function]} Returns [value, setValue, removeValue]
 */

/**
 * Options for the useLocalStorage hook
 */
export interface UseLocalStorageOptions<T> {
  /** Custom serializer function */
  serializer?: {
    read: (value: string) => T
    write: (value: T) => string
  }
  /** Function to determine if the value should be synced across tabs */
  syncData?: boolean
  /** Custom event name for cross-tab synchronization */
  initializeWithValue?: boolean
}

/**
 * Return type for useLocalStorage hook
 */
export type UseLocalStorageReturn<T> = [
  T,
  (value: T | ((val: T) => T)) => void,
  () => void,
]

// Custom hook to create a stable event callback
function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const ref = useRef<typeof fn>(fn)

  useEffect(() => {
    ref.current = fn
  })

  return useCallback((...args: Args) => {
    return ref.current?.(...args)
  }, [])
}

// Custom hook to listen for localStorage events
function useLocalStorageEventListener(callback: (e: StorageEvent) => void) {
  const eventCallback = useEventCallback(callback)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.addEventListener("storage", eventCallback)
    return () => window.removeEventListener("storage", eventCallback)
  }, [eventCallback])
}

/**
 * Default serializer for localStorage values
 */
const defaultSerializer = {
  read: (value: string) => {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  },
  write: (value: unknown) => JSON.stringify(value),
}

/**
 * Read a value from localStorage
 */
function readLocalStorageValue<T>(
  key: string,
  initialValue: T,
  serializer: { read: (value: string) => T; write: (value: T) => string }
): T {
  if (typeof window === "undefined") {
    return initialValue
  }

  try {
    const item = window.localStorage.getItem(key)
    return item !== null ? serializer.read(item) : initialValue
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error)
    return initialValue
  }
}

/**
 * Write a value to localStorage
 */
function writeLocalStorageValue<T>(
  key: string,
  value: T,
  serializer: { read: (value: string) => T; write: (value: T) => string }
): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.localStorage.setItem(key, serializer.write(value))
  } catch (error) {
    console.warn(`Error setting localStorage key "${key}":`, error)
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
  const {
    serializer = defaultSerializer as {
      read: (value: string) => T
      write: (value: T) => string
    },
    syncData = true,
    initializeWithValue = true,
  } = options

  // Get the initial value from localStorage or use the provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!initializeWithValue) {
      return initialValue
    }
    return readLocalStorageValue(key, initialValue, serializer)
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useEventCallback((value: T | ((val: T) => T)) => {
    if (typeof window === "undefined") {
      console.warn(
        `Tried setting localStorage key "${key}" even though environment is not a client`
      )
      return
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value

      // Save to localStorage
      writeLocalStorageValue(key, newValue, serializer)

      // Save state
      setStoredValue(newValue)

      // Dispatch a custom event to notify other useLocalStorage hooks
      if (syncData) {
        window.dispatchEvent(
          new CustomEvent("local-storage", {
            detail: {
              key,
              newValue,
            },
          })
        )
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  })

  // Function to remove the value from localStorage
  const removeValue = useEventCallback(() => {
    if (typeof window === "undefined") {
      console.warn(
        `Tried removing localStorage key "${key}" even though environment is not a client`
      )
      return
    }

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)

      // Dispatch a custom event to notify other useLocalStorage hooks
      if (syncData) {
        window.dispatchEvent(
          new CustomEvent("local-storage", {
            detail: {
              key,
              newValue: initialValue,
            },
          })
        )
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  })

  // Listen for changes to localStorage from other tabs/windows
  useLocalStorageEventListener(
    useEventCallback((e: StorageEvent) => {
      if (e.key === key && e.newValue !== e.oldValue && syncData) {
        try {
          if (e.newValue === null) {
            setStoredValue(initialValue)
          } else {
            setStoredValue(serializer.read(e.newValue))
          }
        } catch (error) {
          console.warn(`Error parsing localStorage key "${key}":`, error)
        }
      }
    })
  )

  // Listen for custom local-storage events (for same-tab synchronization)
  useEffect(() => {
    if (!syncData) return

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail?.key === key && e.detail?.newValue !== undefined) {
        setStoredValue(e.detail.newValue)
      }
    }

    window.addEventListener("local-storage", handleCustomEvent as EventListener)
    return () =>
      window.removeEventListener(
        "local-storage",
        handleCustomEvent as EventListener
      )
  }, [key, syncData])

  return [storedValue, setValue, removeValue]
}
