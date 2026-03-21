import { defineField, defineType } from "sanity"

export const heroSecondaryCardType = defineType({
  name: "heroSecondaryCard",
  title: "Hero side card",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "linkObject",
    }),
  ],
})
