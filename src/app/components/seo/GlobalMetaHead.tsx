import React from 'react';

type AlternateLink = {
  href: string;
  hreflang?: string;
};

type OpenGraphMeta = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  siteName?: string;
  type?: string;
};

export type GlobalMetaProps = {
  title: string;
  description?: string;
  canonicalUrl?: string;
  alternates?: AlternateLink[];
  robots?: string; // e.g. "index,follow" or "ALL"
  og?: OpenGraphMeta;
  author?: string;
  copyright?: string;
  revisitAfter?: string; // e.g. '1 day'
  noFollowPageNumber?: string | number;
  classification?: string;
  includeLegacyDefaults?: boolean; // controls resource-type, distribution, rating, pragma
};

export default function GlobalMetaHead(props: GlobalMetaProps) {
  const {
    title,
    description,
    canonicalUrl,
    alternates,
    robots = 'index,follow',
    og,
    author,
    copyright,
    revisitAfter,
    noFollowPageNumber,
    classification,
    includeLegacyDefaults,
  } = props;

  const ogTitle = og?.title ?? title;
  const ogDescription = og?.description ?? description;

  return (
    <>
      {/* Primary meta */}
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}
      {typeof robots === 'string' ? <meta name="robots" content={robots} /> : null}

      {/* Alternates (hreflang and platform-specific deep links) */}
      {alternates?.map((alt) => (
        <link key={`${alt.hreflang ?? 'alt'}-${alt.href}`} rel="alternate" href={alt.href} {...(alt.hreflang ? { hreflang: alt.hreflang } : {})} />
      ))}

      {/* Open Graph */}
      {ogTitle ? <meta property="og:title" content={ogTitle} /> : null}
      {ogDescription ? <meta property="og:description" content={ogDescription} /> : null}
      {og?.type ? <meta property="og:type" content={og.type} /> : <meta property="og:type" content="website" />}
      {og?.url ? <meta property="og:url" content={og.url} /> : null}
      {og?.image ? <meta property="og:image" content={og.image} /> : null}
      {og?.siteName ? <meta property="og:site_name" content={og.siteName} /> : null}

      {/* Optional/legacy SEO signals */}
      {author ? <meta name="author" content={author} /> : null}
      {copyright ? <meta name="copyright" content={copyright} /> : null}
      {typeof noFollowPageNumber !== 'undefined' ? (
        <meta name="noFollowPageNumber" content={String(noFollowPageNumber)} />
      ) : null}
      {classification ? <meta name="classification" content={classification} /> : null}
      {revisitAfter ? <meta property="revisit-after" content={revisitAfter} /> : null}

      {includeLegacyDefaults ? (
        <>
          <meta name="resource-type" content="document" />
          <meta name="distribution" content="GLOBAL" />
          <meta name="rating" content="general" />
          <meta name="pragma" content="no-cache" />
          {/* Content-Language is largely redundant with <html lang> */}
          <meta name="Content-Language" content="en" />
        </>
      ) : null}
    </>
  );
}


