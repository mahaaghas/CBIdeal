import { defineField, defineType } from "sanity"

export const linkObjectType = defineType({
  name: "linkObject",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description: "Use internal paths like /for-companies or full external URLs.",
      validation: (Rule) => Rule.required(),
    }),
  ],
})
