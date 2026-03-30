import { defineArrayMember, defineField, defineType } from "sanity"

export const featureSectionType = defineType({
  name: "featureSection",
  title: "Features / benefits section",
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
      title: "Cards",
      type: "array",
      of: [defineArrayMember({ type: "featureCard" })],
      validation: (Rule) => Rule.required().min(2),
    }),
  ],
})
