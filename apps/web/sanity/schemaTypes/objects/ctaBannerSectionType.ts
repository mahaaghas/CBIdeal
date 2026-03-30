import { defineField, defineType } from "sanity"

export const ctaBannerSectionType = defineType({
  name: "ctaBannerSection",
  title: "CTA banner section",
  type: "object",
  fields: [
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "primaryAction", title: "Primary CTA", type: "linkObject", validation: (Rule) => Rule.required() }),
    defineField({ name: "secondaryAction", title: "Secondary CTA", type: "linkObject" }),
  ],
})
