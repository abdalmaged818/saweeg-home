import { siteConfig } from "../config/site.ts";
import type { Locale, PageId } from "../types/site.ts";

const pageSegments: Record<PageId, string> = {
  home: "",
  about: "about/",
  news: "news/",
  blog: "blog/",
  opportunities: "opportunities/"
};

export const createPathFor = (prefix: string) => (locale: Locale, page: PageId): string => {
  const localeSegment = locale === "en" ? "en/" : "";
  return `${prefix}${localeSegment}${pageSegments[page]}`;
};

export const canonicalFor = (locale: Locale, page: PageId): string => {
  const localeSegment = locale === "en" ? "/en" : "";
  const pageSegment = page === "home" ? "" : `/${page}`;
  return `${siteConfig.brand.origin}${localeSegment}${pageSegment}/`;
};

export const participationPathFor = (prefix: string, locale: Locale, slug: string): string => {
  const localeSegment = locale === "en" ? "en/" : "";
  return `${prefix}${localeSegment}news/${slug}/`;
};

export const participationCanonicalFor = (locale: Locale, slug: string): string => {
  const localeSegment = locale === "en" ? "/en" : "";
  return `${siteConfig.brand.origin}${localeSegment}/news/${slug}/`;
};
