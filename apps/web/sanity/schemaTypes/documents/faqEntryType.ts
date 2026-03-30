import { defineField, defineType } from "sanity"

export const faqEntryType = defineType({
  name: "faqEntry",
  title: "FAQ entry",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      description: "Optional internal label such as Investor, Company, or Privacy.",
    }),
  ],
})
