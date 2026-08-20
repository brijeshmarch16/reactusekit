import { HomeLayout } from "fumadocs-ui/layouts/home"
import { baseOptions, linkItems } from "@/lib/layout.shared"

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout
      {...baseOptions}
      links={[
        {
          text: "Docs",
          url: "/docs",
        },
        ...linkItems,
      ]}
    >
      {children}
    </HomeLayout>
  )
}
