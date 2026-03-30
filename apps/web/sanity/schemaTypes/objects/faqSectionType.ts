import { defineArrayMember, defineField, defineType } from "sanity"

export const faqSectionType = defineType({
  name: "faqSection",
  title: "FAQ section",
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
      name: "items",
      title: "FAQ items",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "faqEntry" }],
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
})
