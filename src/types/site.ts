export type Locale = "ar" | "en";
export type PageId = "home" | "about" | "news" | "blog" | "opportunities";
export type DestinationId = "store" | "menu" | "delivery";
export type QuickLinkId = "whatsapp" | "tiktok" | "x" | "maqsed" | "bustan";
export type BranchId = "maqsed" | "bustan";
export type NewsKind = "news" | "blog";
export type OpportunityId = "careers" | "collaboration";
export type IconName = "bag" | "menu" | "delivery" | "whatsapp" | "tiktok" | "x" | "pin" | "arrow" | "people" | "handshake";

export interface Destination {
  id: DestinationId;
  tone: DestinationId;
  icon: IconName;
}

export interface QuickLink {
  id: QuickLinkId;
  icon: IconName;
}

export interface Branch {
  id: BranchId;
}

export interface NewsItem {
  id: "menu-launch" | "friendship-day" | "talbinah-story";
  kind: NewsKind;
}

export interface Opportunity {
  id: OpportunityId;
}

export interface PageMetaCopy {
  title: string;
  description: string;
}

export interface SiteCopy {
  localeName: string;
  languageSwitch: string;
  skipLink: string;
  brandAlt: string;
  menuLabel: string;
  closeMenuLabel: string;
  navigationLabel: string;
  nav: {
    home: string;
    about: string;
    news: string;
    blog: string;
    contact: string;
  };
  meta: Record<PageId, PageMetaCopy>;
  hero: {
    kicker: string;
    title: string;
    description: string;
    imageAlt: string;
    primary: string;
    secondary: string;
  };
  destinations: {
    eyebrow: string;
    title: string;
    description: string;
    cards: Record<DestinationId, {
      title: string;
      description: string;
      cta?: string;
      hungerstation?: string;
      keeta?: string;
    }>;
  };
  quickLinks: Record<QuickLinkId, string>;
  about: {
    eyebrow: string;
    title: string;
    short: string;
    paragraphOne: string;
    paragraphTwo: string;
    cta: string;
    visualLabel: string;
    brandDefinitionTitle: string;
    brandDefinition: string;
  };
  values: {
    sectionLabel: string;
    title: string;
    mission: { title: string; description: string };
    vision: { title: string; description: string };
    belief: { title: string; description: string };
  };
  latest: {
    eyebrow: string;
    title: string;
    description: string;
    newsTag: string;
    blogTag: string;
    items: Record<NewsItem["id"], { title: string; description: string }>;
  };
  opportunities: {
    eyebrow: string;
    title: string;
    description: string;
    homeTitle: string;
    homeDescription: string;
    homeCta: string;
    pageEyebrow: string;
    pageTitle: string;
    pageIntro: string;
    cards: Record<OpportunityId, { title: string; description: string; cta: string }>;
  };
  branches: {
    eyebrow: string;
    title: string;
    description: string;
    locationCta: string;
    menuCta: string;
    names: Record<BranchId, string>;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    whatsapp: string;
    tiktok: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
  internal: {
    aboutEyebrow: string;
    aboutTitle: string;
    aboutIntro: string;
    newsEyebrow: string;
    newsTitle: string;
    newsIntro: string;
    blogEyebrow: string;
    blogTitle: string;
    blogIntro: string;
    backHome: string;
  };
  notFound: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
  };
}
