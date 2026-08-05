import { siteConfig } from "../config/site.ts";
import { getCopy } from "../i18n/index.ts";
import type { Locale, PageId } from "../types/site.ts";
import { renderFooter } from "../components/footer.ts";
import { renderHeader } from "../components/header.ts";
import { canonicalFor, createPathFor } from "./routes.ts";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface DocumentOptions {
  locale: Locale;
  page: PageId;
  prefix: string;
  content: string;
  noIndex?: boolean;
  dynamicBase?: boolean;
  title?: string;
  description?: string;
  canonical?: string;
  alternateAr?: string;
  alternateEn?: string;
  localeSwitchPath?: string;
  socialImage?: string;
  socialImageAlt?: string;
  socialImageWidth?: number;
  socialImageHeight?: number;
  articleHeadline?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const jsonLd = (
  locale: Locale,
  canonical: string,
  title: string,
  socialImage: string,
  articleHeadline?: string,
  breadcrumbs: BreadcrumbItem[] = []
): string => JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.brand.origin}/#organization`,
      name: locale === "ar" ? siteConfig.brand.nameAr : siteConfig.brand.nameEn,
      url: siteConfig.brand.origin,
      logo: `${siteConfig.brand.origin}/assets/brand/logo-saweeg.svg`,
      sameAs: [siteConfig.links.tiktok, siteConfig.links.x]
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.brand.origin}/#website`,
      url: siteConfig.brand.origin,
      name: locale === "ar" ? "بوابة سويق الرسمية" : "Official Saweeg Gateway",
      inLanguage: locale,
      publisher: { "@id": `${siteConfig.brand.origin}/#organization` }
    },
    articleHeadline ? {
      "@type": "Article",
      url: canonical,
      headline: articleHeadline,
      image: socialImage,
      inLanguage: locale,
      mainEntityOfPage: canonical,
      publisher: { "@id": `${siteConfig.brand.origin}/#organization` }
    } : {
      "@type": "WebPage",
      url: canonical,
      name: title,
      inLanguage: locale,
      isPartOf: { "@id": `${siteConfig.brand.origin}/#website` }
    },
    ...(breadcrumbs.length > 0 ? [{
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }] : [])
  ]
}).replaceAll("<", "\\u003c");

export const renderDocument = ({
  locale,
  page,
  prefix,
  content,
  noIndex = false,
  dynamicBase = false,
  title,
  description,
  canonical: canonicalOverride,
  alternateAr,
  alternateEn,
  localeSwitchPath,
  socialImage: socialImageOverride,
  socialImageAlt,
  socialImageWidth = 1200,
  socialImageHeight = 630,
  articleHeadline,
  breadcrumbs = []
}: DocumentOptions): string => {
  const copy = getCopy(locale);
  const pathFor = createPathFor(prefix);
  const canonical = canonicalOverride ?? canonicalFor(locale, page);
  const alternateLocale: Locale = locale === "ar" ? "en" : "ar";
  const direction = locale === "ar" ? "rtl" : "ltr";
  const metadata = {
    title: title ?? copy.meta[page].title,
    description: description ?? copy.meta[page].description
  };
  const socialImage = socialImageOverride ?? `${siteConfig.brand.origin}/assets/social/saweeg-og.png`;
  const arCanonical = alternateAr ?? canonicalFor("ar", page);
  const enCanonical = alternateEn ?? canonicalFor("en", page);

  return `<!doctype html>
<html lang="${locale}" dir="${direction}" data-page="${page}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  ${dynamicBase ? '<script>(function(){var base=document.createElement("base");var firstPath=location.pathname.split("/").filter(Boolean)[0];base.href=location.hostname.endsWith(".github.io")&&firstPath?"/"+firstPath+"/":"/";document.head.appendChild(base);}());</script>' : ""}
  <title>${metadata.title}</title>
  <meta name="description" content="${metadata.description}">
  <meta name="theme-color" content="#F8F6F1">
  ${noIndex ? '<meta name="robots" content="noindex, follow">' : ""}
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="ar" href="${arCanonical}">
  <link rel="alternate" hreflang="en" href="${enCanonical}">
  <link rel="alternate" hreflang="x-default" href="${arCanonical}">
  <meta property="og:type" content="${articleHeadline ? "article" : "website"}">
  <meta property="og:site_name" content="Saweeg">
  <meta property="og:locale" content="${locale === "ar" ? "ar_SA" : "en_US"}">
  <meta property="og:locale:alternate" content="${alternateLocale === "ar" ? "ar_SA" : "en_US"}">
  <meta property="og:title" content="${metadata.title}">
  <meta property="og:description" content="${metadata.description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:width" content="${socialImageWidth}">
  <meta property="og:image:height" content="${socialImageHeight}">
  <meta property="og:image:alt" content="${socialImageAlt ?? copy.brandAlt}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${metadata.title}">
  <meta name="twitter:description" content="${metadata.description}">
  <meta name="twitter:image" content="${socialImage}">
  <link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml">
  <link rel="icon" href="${prefix}favicon-32x32.png" sizes="32x32" type="image/png">
  <link rel="icon" href="${prefix}favicon-16x16.png" sizes="16x16" type="image/png">
  <link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png" sizes="180x180">
  <link rel="manifest" href="${prefix}site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">${jsonLd(locale, canonical, metadata.title, socialImage, articleHeadline, breadcrumbs)}</script>
</head>
<body>
  <a class="skip-link" href="#main-content">${copy.skipLink}</a>
  ${renderHeader({ locale, page, copy, prefix, pathFor, localeSwitchPath })}
  <main id="main-content">${content}</main>
  ${renderFooter({ locale, page, copy, prefix, pathFor, localeSwitchPath })}
  <script type="module" src="${prefix}src/main.ts"></script>
</body>
</html>`;
};
