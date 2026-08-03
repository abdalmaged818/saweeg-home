import { siteConfig } from "./site.ts";
import type { PageId } from "../types/site.ts";

const isValidExternalUrl = (value: string): boolean => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

const hasAvailableOpportunity = (
  siteConfig.features.careers && isValidExternalUrl(siteConfig.links.careersUrl)
) || (
  siteConfig.features.collaboration && isValidExternalUrl(siteConfig.links.collaborationUrl)
);

export const pageAvailability: Record<PageId, boolean> = {
  home: true,
  about: true,
  news: siteConfig.features.news,
  blog: siteConfig.features.blog,
  opportunities: siteConfig.features.opportunities && hasAvailableOpportunity
};

export const isPagePublic = (page: PageId): boolean => pageAvailability[page];
