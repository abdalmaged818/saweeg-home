// Stable identities, not display order or translation-array positions.
export const sharedProductIds = [
  "talbinah-ice-cream",
  "chocolate-ice-cream-cup",
  "chocolate-ice-cream-biscuit",
  "mixed-ice-cream-cup",
  "mixed-ice-cream-biscuit",
  "cold-talbinah",
  "hot-talbinah",
  "talbinah-matcha",
  "hot-talbinah-one-liter",
  "talbinah-lotus-cheesecake",
  "dates-with-saweeg",
  "damkah",
  "madini-crepe-cheese",
  "madini-crepe-signature",
  "maamoul-box",
  "safawi-dates-gift-box",
  "date-pecan-tart-box",
  "talbinah-sachet-box",
  "al-jabirah-box",
  "gift-box",
  "talbinah-powder",
  "saweeg-powder",
  "talbinah-sachets",
  "mixed-caramelized-nuts-sachet"
] as const;
export const sharedExtraIds = [
  "saudi-coffee-cup",
  "saudi-coffee-dallah",
  "saudi-coffee-dallah-with-sweets",
  "water",
  "maamoul",
  "tart",
  "basbousa",
  "coffee-of-the-day-maqsed",
  "coffee-of-the-day-bustan",
  "tea",
  "tea-flask"
] as const;
export const sharedCategoryIds = [
  "talbinah",
  "sweets",
  "boxes",
  "ready",
  "drinks"
] as const;
export const sharedBranchIds = [
  "maqsed",
  "bustan"
] as const;
export type SharedProductId = (typeof sharedProductIds)[number];
export type SharedExtraId = (typeof sharedExtraIds)[number];
export type SharedCategoryId = (typeof sharedCategoryIds)[number];
export type SharedBranchId = (typeof sharedBranchIds)[number];
