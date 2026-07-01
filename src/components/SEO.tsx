import { Helmet } from "react-helmet-async";
import {
  defaultDescription,
  defaultImage,
  defaultTitle,
  siteName,
  siteUrl,
} from "../config/seo";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  noIndex?: boolean;
}

export default function SEO({
  title,
  description = defaultDescription,
  canonical,
  image = defaultImage,
  type = "website",
  jsonLd,
  noIndex = false,
}: SEOProps) {
  const resolvedTitle = title ? (title.includes(siteName) ? title : `${title} | ${siteName}`) : defaultTitle;
  const resolvedDescription = description || defaultDescription;
  const resolvedCanonical = canonical || siteUrl;
  const resolvedImage = image || defaultImage;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{resolvedTitle}</title>
      <meta name="description" content={resolvedDescription} />
      <link rel="canonical" href={resolvedCanonical} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:type" content={type} />
      {resolvedImage && <meta property="og:image" content={resolvedImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      {resolvedImage && <meta name="twitter:image" content={resolvedImage} />}
      {jsonLdArray.map((schema, index) => (
        <script key={`${(schema as any)?.['@type'] || 'schema'}-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
