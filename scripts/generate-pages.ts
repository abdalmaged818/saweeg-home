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

const sitemapUrls = targets
  .filter(({ page }) => isPagePublic(page))
  .map(({ locale, page, participationSlug }) => `  <url><loc>${participationSlug ? participationCanonicalFor(locale, participationSlug) : canonicalFor(locale, page)}</loc></url>`)
  .join("\n");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
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
await writeFile(resolve(projectRoot, "404.html"), renderDocument({
  locale: "ar",
  page: "home",
  prefix: "./",
  content: notFoundContent,
  noIndex: true,
  dynamicBase: true
}), "utf8");

console.log(`Generated ${targets.length + 1} HTML pages.`);
