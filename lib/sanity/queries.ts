import { defineQuery } from "next-sanity"

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteName,
    siteDescription,
    siteUrl,
    supportEmail,
    salesEmail,
    phone,
    whatsapp,
    bookingUrl,
    demoUrl,
    location,
    footerSummary,
    footerBottomPrimary,
    footerBottomSecondary,
    socialLinks,
    defaultSeo{
      title,
      description,
      keywords,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        alt,
        asset
      },
      noIndex
    }
  }
`)

const sectionProjection = `
  _type,
  eyebrow,
  title,
  description,
  primaryAction{
    label,
    href
  },
  secondaryAction{
    label,
    href
  },
  stats[]{
    value,
    label
  },
  highlightsLabel,
  highlights,
  secondaryCard{
    eyebrow,
    title,
    description,
    cta{
      label,
      href
    }
  },
  "items": select(
    _type == "faqSection" => items[]->{
      question,
      answer
    },
    _type == "featureSection" => items[]{
      title,
      description,
      image{
        alt,
        asset
      }
    },
    _type == "trustSection" => items[]{
      title,
      description
    },
    items
  ),
  steps[]{
    title,
    description,
    icon
  },
  formType,
  formTitle,
  formDescription,
  submitLabel,
  source,
  bulletPoints
`

export const landingPageBySlugQuery = defineQuery(`
  *[_type == "landingPage" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    isHomepage,
    seo{
      title,
      description,
      keywords,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        alt,
        asset
      },
      noIndex
    },
    sections[]{
      ${sectionProjection}
    }
  }
`)

export const homepageLandingPageQuery = defineQuery(`
  *[_type == "landingPage" && isHomepage == true][0]{
    title,
    "slug": coalesce(slug.current, "home"),
    isHomepage,
    seo{
      title,
      description,
      keywords,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        alt,
        asset
      },
      noIndex
    },
    sections[]{
      ${sectionProjection}
    }
  }
`)

export const landingPageSlugsQuery = defineQuery(`
  *[_type == "landingPage" && !isHomepage && defined(slug.current)]{
    "slug": slug.current
  }
`)

export const blogPostsIndexQuery = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
    title,
    "slug": slug.current,
    excerpt,
    featuredImage{
      alt,
      asset
    },
    "category": category->{
      title,
      "slug": slug.current
    },
    tags,
    "author": author->{
      name,
      role,
      image{
        alt,
        asset
      }
    },
    publishedAt,
    seo{
      title,
      description,
      keywords,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        alt,
        asset
      },
      noIndex
    }
  }
`)

export const blogPostBySlugQuery = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    excerpt,
    featuredImage{
      alt,
      asset
    },
    "category": category->{
      title,
      "slug": slug.current
    },
    tags,
    "author": author->{
      name,
      role,
      image{
        alt,
        asset
      }
    },
    publishedAt,
    body[]{
      ...,
      _type == "richImage" => {
        ...,
        alt,
        caption,
        asset
      }
    },
    relatedPages[]{
      label,
      href
    },
    "relatedPosts": relatedPosts[]->{
      title,
      "slug": slug.current,
      excerpt,
      featuredImage{
        alt,
        asset
      },
      "category": category->{
        title,
        "slug": slug.current
      },
      tags,
      "author": author->{
        name,
        role,
        image{
          alt,
          asset
        }
      },
      publishedAt,
      seo{
        title,
        description,
        keywords,
        openGraphTitle,
        openGraphDescription,
        openGraphImage{
          alt,
          asset
        },
        noIndex
      }
    },
    seo{
      title,
      description,
      keywords,
      openGraphTitle,
      openGraphDescription,
      openGraphImage{
        alt,
        asset
      },
      noIndex
    }
  }
`)
