import { defineArrayMember, defineField, defineType } from "sanity"

export const processSectionType = defineType({
  name: "processSection",
  title: "Process section",
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
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [defineArrayMember({ type: "processStep" })],
      validation: (Rule) => Rule.required().min(2),
    }),
  ],
})
