import { defineArrayMember, defineField, defineType } from "sanity"

export const qualificationFormSectionType = defineType({
  name: "qualificationFormSection",
  title: "Qualification form section",
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
      name: "formType",
      title: "Form type",
      type: "string",
      options: {
        list: [
          { title: "Investor", value: "investor" },
          { title: "Company", value: "company" },
          { title: "Partner", value: "partner" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "formTitle",
      title: "Form title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "formDescription",
      title: "Form description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submitLabel",
      title: "Submit label",
      type: "string",
    }),
    defineField({
      name: "source",
      title: "Form source key",
      type: "string",
      description: "Used when storing the enquiry in Supabase.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bulletPoints",
      title: "Supporting bullet points",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
})
