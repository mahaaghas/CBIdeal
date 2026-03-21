import { defineArrayMember, defineField, defineType } from "sanity"

export const heroSectionType = defineType({
  name: "heroSection",
  title: "Hero section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "primaryAction", title: "Primary CTA", type: "linkObject", validation: (Rule) => Rule.required() }),
    defineField({ name: "secondaryAction", title: "Secondary CTA", type: "linkObject" }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [defineArrayMember({ type: "statItem" })],
    }),
    defineField({ name: "highlightsLabel", title: "Highlights label", type: "string" }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "secondaryCard",
      title: "Secondary card",
      type: "heroSecondaryCard",
    }),
  ],
})
