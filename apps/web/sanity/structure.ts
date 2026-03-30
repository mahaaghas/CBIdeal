import type { StructureResolver } from "sanity/structure"

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site settings")
        .id("site-settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("landingPage").title("Landing pages"),
      S.documentTypeListItem("blogPost").title("Blog posts"),
      S.documentTypeListItem("faqEntry").title("FAQs"),
      S.documentTypeListItem("author").title("Authors"),
      S.documentTypeListItem("category").title("Categories"),
    ])
