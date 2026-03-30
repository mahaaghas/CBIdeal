import { defineArrayMember, defineField, defineType } from "sanity"

export const landingPageType = defineType({
  name: "landingPage",
  title: "Landing page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.custom((value, context) => {
        const isHomepage = Boolean((context.document as { isHomepage?: boolean } | undefined)?.isHomepage)
        if (isHomepage) return true
        return value?.current ? true : "Slug is required unless this page is marked as the homepage."
      }),
    }),
    defineField({
      name: "isHomepage",
      title: "Homepage",
      type: "boolean",
      initialValue: false,
      description: "Enable this for the page that should render at /.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "trustSection" }),
        defineArrayMember({ type: "featureSection" }),
        defineArrayMember({ type: "processSection" }),
        defineArrayMember({ type: "qualificationFormSection" }),
        defineArrayMember({ type: "faqSection" }),
        defineArrayMember({ type: "ctaBannerSection" }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      isHomepage: "isHomepage",
    },
    prepare({ title, slug, isHomepage }) {
      return {
        title,
        subtitle: isHomepage ? "/" : `/${slug ?? "draft-page"}`,
      }
    },
  },
})
