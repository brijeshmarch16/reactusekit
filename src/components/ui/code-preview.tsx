import fs from "node:fs/promises"
import path from "node:path"
import type { ReactNode } from "react"
import { highlight } from "fumadocs-core/highlight"
import * as Base from "fumadocs-ui/components/codeblock"
import { Icons } from "./icon"

interface CodePreviewProps {
  registryFilePath: string
  location: string
}

export default async function CodePreview(props: CodePreviewProps) {
  const { registryFilePath, location } = props

  let content: ReactNode
  try {
    const filePath = path.join(
      process.cwd(),
      "src/registry/new-york",
      registryFilePath
    )
    const file = await fs.readFile(filePath, "utf-8")

    content = await highlight(file, {
      lang: "ts",
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
      meta: {
        title: "New York Registry",
      },
    })
  } catch (error) {
    console.error(
      `Error loading file: ${registryFilePath}. ${error instanceof Error ? error.message : String(error)}`
    )
    content =
      "Error: Could not load the file. Please check if the path is correct."
  }

  return (
    <Base.CodeBlock title={location} lang="ts" icon={<Icons.ts />}>
      <Base.Pre>{content}</Base.Pre>
    </Base.CodeBlock>
  )
}
