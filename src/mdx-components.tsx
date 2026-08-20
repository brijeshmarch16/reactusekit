import { Accordion, Accordions } from "fumadocs-ui/components/accordion"
import * as FilesComponents from "fumadocs-ui/components/files"
import * as TabsComponents from "fumadocs-ui/components/tabs"
import defaultMdxComponents from "fumadocs-ui/mdx"
import * as icons from "lucide-react"
import type { MDXComponents } from "mdx/types"
import CodePreview from "./components/ui/code-preview"
import {
  CodeTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/code-tabs"

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    ...TabsComponents,
    ...FilesComponents,
    Accordion,
    Accordions,
    CodeTabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    CodePreview,
    ...components,
  }
}
