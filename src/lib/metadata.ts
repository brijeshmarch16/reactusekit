import type { Metadata } from "next/types"

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: override.openGraph?.url ?? baseUrl,
      images: [],
      siteName: "ReactUseKit",
      ...override.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@brijeshkumar16_",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: "",
      ...override.twitter,
    },
    alternates: {
      ...override.alternates,
    },
  }
}

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? new URL("http://localhost:3000")
    : new URL("https://reactusekit.vercel.app")
