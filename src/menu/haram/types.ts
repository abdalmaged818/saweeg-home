import type { CanonicalProductImage } from "../data/catalog-images.ts";

export const haramLocales = ["ar", "en", "ur", "id", "bn", "tr", "fa", "fr", "ms", "ru"] as const;
export type HaramLocale = (typeof haramLocales)[number];

export const haramItemIds = [
  "talbinah-ice-cream-biscuit",
  "talbinah-ice-cream-cup",
  "chocolate-ice-cream-biscuit",
  "chocolate-ice-cream-cup",
  "mixed-ice-cream-biscuit",
  "mixed-ice-cream-cup",
  "lotus-cheesecake",
  "damkah",
  "dates-with-saweeg",
  "pecan-basbousa",
  "date-tart",
  "saweeg-maamoul",
  "cold-talbinah",
  "hot-talbinah",
  "hot-talbinah-one-liter",
  "saudi-coffee",
  "saudi-coffee-dallah",
  "saudi-coffee-dallah-with-sweets",
  "tea",
  "tea-thermos",
  "talbinah-matcha",
  "bottled-water",
  "talbinah-powder-sachet",
  "saweeg-powder-sachet",
  "mixed-nuts-sachet",
  "al-jabirah-sachet",
  "safawi-dates-nuts-box",
  "ajwa-dates-nuts-box",
  "al-jabirah-box",
  "gift-box",
  "saweeg-maamoul-box",
  "pecan-basbousa-box",
  "sachet-box",
  "date-tart-box"
] as const;

export type HaramItemId = (typeof haramItemIds)[number];
export const haramCategoryIds = ["iceCream", "desserts", "drinks", "powders", "boxes"] as const;
export type HaramCategoryId = (typeof haramCategoryIds)[number];

export interface HaramMenuItem {
  id: HaramItemId;
  catalogId: string;
  category: HaramCategoryId;
  price: number;
  image?: CanonicalProductImage;
}

export interface HaramLocaleContent {
  locale: HaramLocale;
  direction: "rtl" | "ltr";
  nativeLabel: string;
  flag: string;
  menuTitle: string;
  branchName: string;
  welcome: string;
  welcomeEnglish: string;
  chooseLanguage: string;
  chooseLanguageEnglish: string;
  changeLanguage: string;
  categories: Record<HaramCategoryId, string>;
  productNames: Record<HaramItemId, string>;
  priceLabel: (price: number) => string;
  vatNotice: string;
  storeEyebrow: string;
  storeTitle: string;
  storeBody: string;
  storeButton: string;
  contactTitle: string;
  contactBody: string;
  whatsapp: string;
  links: string;
  footerStore: string;
  footerWhatsapp: string;
  footerLinks: string;
  imageAlt: (name: string) => string;
}
