import { defineField, defineType } from "sanity"

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: "siteUrl",
      title: "Site URL",
      type: "url",
      description: "Used for canonical URLs and Open Graph metadata.",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seo",
    }),
    defineField({
      name: "supportEmail",
      title: "Support email",
      type: "string",
    }),
    defineField({
      name: "salesEmail",
      title: "Sales email",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "whatsapp",
      title: "Phone / WhatsApp",
      type: "string",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking URL",
      type: "url",
    }),
    defineField({
      name: "demoUrl",
      title: "Demo URL",
      type: "url",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "footerSummary",
      title: "Footer summary",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "footerBottomPrimary",
      title: "Footer legal line 1",
      type: "string",
    }),
    defineField({
      name: "footerBottomSecondary",
      title: "Footer legal line 2",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "x", title: "X", type: "url" }),
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Site settings",
      subtitle: "Singleton document",
    }),
  },
})
