import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from "fumadocs-mdx/config"
import lastModified from "fumadocs-mdx/plugins/last-modified"

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
})

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkCodeTabOptions: {
      parseMdx: true,
    },
    remarkNpmOptions: {
      packageManagers: [
        {
          name: "pnpm",
          command: (command) => {
            if (command.startsWith("npx")) {
              return command.replace(/^npx /, "pnpm dlx ")
            }
            if (command.startsWith("npm")) {
              return command.replace(/^npm install /, "pnpm add ")
            }
            return command
          },
        },
        {
          name: "npm",
          command: (command) => {
            if (command.startsWith("npx")) {
              return command
            }
            if (command.startsWith("npm")) {
              return command
            }
            return command
          },
        },
        {
          name: "yarn",
          command: (command) => {
            if (command.startsWith("npx")) {
              return command.replace(/^npx /, "yarn ")
            }
            if (command.startsWith("npm")) {
              return command.replace(/^npm install /, "yarn add ")
            }
            return command
          },
        },
        {
          name: "bun",
          command: (command) => {
            if (command.startsWith("npx")) {
              return command.replace(/^npx /, "bunx --bun ")
            }
            if (command.startsWith("npm")) {
              return command.replace(/^npm install /, "bun add ")
            }
            return command
          },
        },
      ],
      persist: {
        id: "package-manager",
      },
    },
  },
})
