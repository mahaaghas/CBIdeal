import { defineField, defineType } from "sanity"

export const trustItemType = defineType({
  name: "trustItem",
  title: "Trust item",
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
  ],
})
