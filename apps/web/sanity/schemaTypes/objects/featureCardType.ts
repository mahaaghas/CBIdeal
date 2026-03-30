import { defineField, defineType } from "sanity"

export const featureCardType = defineType({
  name: "featureCard",
  title: "Feature or benefit card",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Optional image",
      type: "richImage",
    }),
  ],
})
