import { useLocalStorage } from "@/registry/new-york/hooks/use-local-storage"

type InstallationType = "cli" | "manual"

export function useConfig() {
  const [installationType, setInstallationType] =
    useLocalStorage<InstallationType>("installationType", "cli", {
      serializer: {
        read: (value: string) => (value === "manual" ? "manual" : "cli"),
        write: (value: InstallationType) => value,
      },
    })

  return [installationType, setInstallationType] as const
}
