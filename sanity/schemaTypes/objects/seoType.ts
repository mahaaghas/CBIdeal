import { defineField, defineType } from "sanity"

export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO title",
      type: "string",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(170),
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "openGraphTitle",
      title: "Open Graph title",
      type: "string",
    }),
    defineField({
      name: "openGraphDescription",
      title: "Open Graph description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "openGraphImage",
      title: "Open Graph image",
      type: "richImage",
    }),
    defineField({
      name: "noIndex",
      title: "No index",
      type: "boolean",
      initialValue: false,
    }),
  ],
})
