import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCopy } from "../src/i18n/index.ts";
import type { Locale, PageId } from "../src/types/site.ts";
import { renderAboutPage } from "../src/pages/about.ts";
import { renderBlogPage } from "../src/pages/blog.ts";
import { renderDocument } from "../src/pages/document.ts";
import { renderHomePage } from "../src/pages/home.ts";
import { renderNewsPage } from "../src/pages/news.ts";
import { renderOpportunitiesPage } from "../src/pages/opportunities.ts";
import { siteConfig } from "../src/config/site.ts";
import { isPagePublic } from "../src/config/features.ts";
import { canonicalFor, createPathFor } from "../src/pages/routes.ts";
import { participationCanonicalFor, participationPathFor } from "../src/pages/routes.ts";
import { publishedParticipations } from "../src/data/participations.ts";
import { renderParticipationPage } from "../src/pages/participation.ts";
import { participationsUi } from "../src/content/participations.ts";
import { haramLocaleContent } from "../src/menu/haram/locales.ts";
import { haramLocales, type HaramLocale } from "../src/menu/haram/types.ts";

interface PageTarget {
  locale: Locale;
  page: PageId;
  file: string;
  prefix: string;
  participationSlug?: string;
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const baseTargets: PageTarget[] = [
  { locale: "ar", page: "home", file: "index.html", prefix: "./" },
  { locale: "en", page: "home", file: "en/index.html", prefix: "../" },
  { locale: "ar", page: "about", file: "about/index.html", prefix: "../" },
  { locale: "en", page: "about", file: "en/about/index.html", prefix: "../../" },
  { locale: "ar", page: "news", file: "news/index.html", prefix: "../" },
  { locale: "en", page: "news", file: "en/news/index.html", prefix: "../../" },
  { locale: "ar", page: "blog", file: "blog/index.html", prefix: "../" },
  { locale: "en", page: "blog", file: "en/blog/index.html", prefix: "../../" },
  { locale: "ar", page: "opportunities", file: "opportunities/index.html", prefix: "../" },
  { locale: "en", page: "opportunities", file: "en/opportunities/index.html", prefix: "../../" }
];

const participationTargets: PageTarget[] = publishedParticipations.flatMap((participation) => [
  {
    locale: "ar" as const,
    page: "news" as const,
    file: `news/${participation.slug}/index.html`,
    prefix: "../../",
    participationSlug: participation.slug
  },
  {
    locale: "en" as const,
    page: "news" as const,
    file: `en/news/${participation.slug}/index.html`,
    prefix: "../../../",
    participationSlug: participation.slug
  }
]);

const targets: PageTarget[] = [...baseTargets, ...participationTargets];

const haramUrl = (locale?: HaramLocale): string =>
  `${siteConfig.brand.origin}/menu/haram/${locale ? `${locale}/` : ""}`;

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character] ?? character);

const renderHaramDocument = (locale?: HaramLocale): string => {
  const copy = locale ? haramLocaleContent[locale] : haramLocaleContent.ar;
  const isSelector = !locale;
  const title = isSelector
    ? "فرع الحرم | سويق"
    : `${copy.menuTitle} | ${copy.branchName} | Saweeg`;
  const description = isSelector
    ? "اختر لغتك لاستعراض منيو سويق لفرع الحرم."
    : `${copy.menuTitle} — ${copy.branchName}. ${copy.vatNotice}`;
  const canonical = haramUrl(locale);
  const alternateLinks = haramLocales
    .map((entry) => `<link rel="alternate" hreflang="${entry}" href="${haramUrl(entry)}" />`)
    .join("\n  ");
  const bodyData = isSelector
    ? "data-haram-page=\"selector\""
    : `data-haram-page=\"menu\" data-haram-locale=\"${locale}\"`;
  const fallbackTitle = isSelector ? "اختر لغتك" : escapeHtml(copy.menuTitle);
  const fallbackBody = isSelector
    ? "اختر لغة منيو فرع الحرم."
    : escapeHtml(copy.branchName);
  const socialImage = `${siteConfig.brand.origin}/assets/social/saweeg-gateway-preview-20260910.png`;
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.brand.origin}/#organization`,
        name: "Saweeg",
        url: `${siteConfig.brand.origin}/`,
        logo: `${siteConfig.brand.origin}/menu/assets/brand/logo-saweeg.svg`
      },
      {
        "@type": isSelector ? "WebPage" : "Menu",
        "@id": `${canonical}#${isSelector ? "webpage" : "menu"}`,
        name: title,
        url: canonical,
        inLanguage: locale ?? "ar",
        provider: { "@id": `${siteConfig.brand.origin}/#organization` }
      }
    ]
  });

  return `<!doctype html>
<html lang="${locale ?? "ar"}" dir="${copy.direction}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="theme-color" content="#5C6351" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="${locale ?? "ar"}" />
  <meta property="og:site_name" content="Saweeg" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${socialImage}" />
  <meta property="og:image:secure_url" content="${socialImage}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Saweeg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${socialImage}" />
  <meta name="twitter:image:alt" content="Saweeg" />
  <link rel="canonical" href="${canonical}" />
  ${alternateLinks}
  <link rel="alternate" hreflang="x-default" href="${haramUrl()}" />
  <link rel="icon" href="/menu/favicon-saweeg-202609.ico" sizes="any" />
  <link rel="manifest" href="/menu/site.webmanifest?v=202609" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <title>${escapeHtml(title)}</title>
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body ${bodyData}>
  <div id="app"><main><h1>${fallbackTitle}</h1><p>${fallbackBody}</p></main></div>
  <script type="module" src="/src/menu/haram-main.ts"></script>
</body>
</html>
`;
};

const renderHiddenPage = (locale: Locale, homePath: string): string => {
  const copy = getCopy(locale);
  return `
    <section class="not-found" aria-labelledby="hidden-page-title">
      <div class="container not-found-inner">
        <span class="eyebrow">${copy.notFound.eyebrow}</span>
        <h1 id="hidden-page-title">${copy.notFound.title}</h1>
        <p>${copy.notFound.description}</p>
        <a class="button button-primary" href="${homePath}">${copy.notFound.cta}</a>
      </div>
    </section>`;
};

const renderPage = ({ locale, page, prefix, participationSlug }: PageTarget): string => {
  const copy = getCopy(locale);
  const pathFor = createPathFor(prefix);
  let content = "";

  if (participationSlug) {
    const participation = publishedParticipations.find((item) => item.slug === participationSlug);
    if (!participation) throw new Error(`Missing participation: ${participationSlug}`);
    const canonical = participationCanonicalFor(locale, participationSlug);
    const otherLocale: Locale = locale === "ar" ? "en" : "ar";
    const title = locale === "ar" ? participation.seoTitleAr : participation.seoTitleEn;
    const description = locale === "ar" ? participation.seoDescriptionAr : participation.seoDescriptionEn;
    const headline = locale === "ar" ? participation.titleAr : participation.titleEn;
    const heroAlt = locale === "ar" ? participation.heroAltAr : participation.heroAltEn;
    const ui = participationsUi[locale];
    content = renderParticipationPage({
      participation,
      locale,
      prefix,
      homePath: pathFor(locale, "home"),
      participationsPath: pathFor(locale, "news"),
      aboutPath: pathFor(locale, "about")
    });
    return renderDocument({
      locale,
      page,
      prefix,
      content,
      title,
      description,
      canonical,
      alternateAr: participationCanonicalFor("ar", participationSlug),
      alternateEn: participationCanonicalFor("en", participationSlug),
      localeSwitchPath: participationPathFor(prefix, otherLocale, participationSlug),
      socialImage: `${siteConfig.brand.origin}/${participation.heroImage}-1440.webp`,
      socialImageAlt: heroAlt,
      socialImageWidth: participation.heroWidth,
      socialImageHeight: participation.heroHeight,
      articleHeadline: headline,
      breadcrumbs: [
        { name: ui.breadcrumbHome, url: canonicalFor(locale, "home") },
        { name: ui.breadcrumbParticipations, url: canonicalFor(locale, "news") },
        { name: headline, url: canonical }
      ]
    });
  }

  if (!isPagePublic(page)) {
    content = renderHiddenPage(locale, pathFor(locale, "home"));
    return renderDocument({ locale, page, prefix, content, noIndex: true });
  }

  if (page === "home") content = renderHomePage(
    locale,
    copy,
    prefix,
    pathFor(locale, "about"),
    pathFor(locale, "opportunities")
  );
  if (page === "about") content = renderAboutPage(locale, prefix);
  if (page === "news") content = renderNewsPage(locale, prefix);
  if (page === "blog") content = renderBlogPage(copy, pathFor(locale, "home"));
  if (page === "opportunities") content = renderOpportunitiesPage(copy, pathFor(locale, "home"));

  return renderDocument({ locale, page, prefix, content, noIndex: !isPagePublic(page) });
};

for (const target of targets) {
  const outputPath = resolve(projectRoot, target.file);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderPage(target), "utf8");
}

await mkdir(resolve(projectRoot, "menu/haram"), { recursive: true });
await writeFile(resolve(projectRoot, "menu/haram/index.html"), renderHaramDocument(), "utf8");
for (const locale of haramLocales) {
  const outputPath = resolve(projectRoot, `menu/haram/${locale}/index.html`);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    renderHaramDocument(locale),
    "utf8"
  );
}
await writeFile(
  resolve(projectRoot, "menu/haram/404.html"),
  renderHaramDocument(),
  "utf8"
);

const sitemapUrls = targets
  .filter(({ page }) => isPagePublic(page))
  .map(({ locale, page, participationSlug }) => participationSlug ? participationCanonicalFor(locale, participationSlug) : canonicalFor(locale, page));
const menuSitemapUrls = [
  `${siteConfig.brand.origin}/menu/`,
  `${siteConfig.brand.origin}/menu/en/`,
  `${siteConfig.brand.origin}/menu/haram/`,
  ...haramLocales.map((locale) => haramUrl(locale))
];
const sitemapEntries = [...sitemapUrls, ...menuSitemapUrls]
  .map((url) => `  <url><loc>${url}</loc></url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;
await writeFile(resolve(projectRoot, "public/sitemap.xml"), sitemap, "utf8");

const notFoundCopy = getCopy("ar");
const notFoundContent = `
  <section class="not-found" aria-labelledby="not-found-title">
    <div class="container not-found-inner">
      <span class="eyebrow">${notFoundCopy.notFound.eyebrow}</span>
      <h1 id="not-found-title">${notFoundCopy.notFound.title}</h1>
      <p>${notFoundCopy.notFound.description}</p>
      <a class="button button-primary" href="./">${notFoundCopy.notFound.cta}</a>
    </div>
  </section>`;
const rootNotFound = renderDocument({
  locale: "ar",
  page: "home",
  prefix: "./",
  content: notFoundContent,
  noIndex: true,
  dynamicBase: true
});
await writeFile(
  resolve(projectRoot, "404.html"),
  rootNotFound.replace(
    "</body>",
    '<script>if (location.pathname.startsWith("/menu/haram/")) location.replace("/menu/haram/");</script></body>'
  ),
  "utf8"
);

console.log(`Generated ${targets.length + 1} HTML pages.`);
