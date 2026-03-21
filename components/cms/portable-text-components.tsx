import Image from "next/image"
import Link from "next/link"
import type { PortableTextReactComponents } from "@portabletext/react"
import { urlForSanityImage } from "@/lib/sanity/image"
import type { SanityImageValue } from "@/lib/sanity/types"

export const portableTextComponents: PortableTextReactComponents = {
  block: {
    normal: ({ children }) => <p className="text-base leading-8 text-muted-foreground">{children}</p>,
    h2: ({ children }) => <h2 className="section-title mt-10 text-foreground">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-2xl leading-tight text-foreground md:text-[2rem]">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary/30 pl-5 text-lg italic leading-8 text-foreground/85">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">{children}</ul>,
    number: ({ children }) => <ol className="space-y-3 pl-5 text-base leading-8 text-muted-foreground">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="list-disc">{children}</li>,
    number: ({ children }) => <li className="list-decimal">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => (
      <Link
        href={value?.href ?? "#"}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noreferrer" : undefined}
        className="text-primary underline underline-offset-4"
      >
        {children}
      </Link>
    ),
  },
  types: {
    richImage: ({ value }) => {
      const image = value as SanityImageValue
      const url = image?.asset ? urlForSanityImage(image)?.width(1400).quality(85).url() : null

      if (!url) return null

      return (
        <figure className="space-y-3">
          <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-muted/30">
            <Image
              src={url}
              alt={image.alt ?? ""}
              width={1400}
              height={840}
              className="h-auto w-full object-cover"
            />
          </div>
          {image.caption ? <figcaption className="text-sm leading-7 text-muted-foreground">{image.caption}</figcaption> : null}
        </figure>
      )
    },
  },
}
