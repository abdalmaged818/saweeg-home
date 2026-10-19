export interface CanonicalProductImage {
  file: string;
  fit: "cover" | "contain";
  position: string;
}

// Product photographs belong to a stable variant identifier, never to a branch,
// language, display name, or card position. Branches only supply availability and price.
export const canonicalProductImages = {
  "talbinah-ice-cream-biscuit": {"file":"talbinah-ice-cream-biscuit-2026-10.webp","fit":"cover","position":"center"},
  "talbinah-ice-cream-cup": {"file":"talbinah-ice-cream-2026-09.webp","fit":"cover","position":"center"},
  "chocolate-ice-cream-biscuit": {"file":"chocolate-ice-cream-biscuit-2026-10-refresh.webp","fit":"cover","position":"center"},
  "chocolate-ice-cream-cup": {"file":"chocolate-ice-cream-cup-2026-10-refresh.webp","fit":"cover","position":"center"},
  "mixed-ice-cream-biscuit": {"file":"mixed-ice-cream-biscuit-2026-10-refresh.webp","fit":"cover","position":"center"},
  "mixed-ice-cream-cup": {"file":"mixed-ice-cream-cup-2026-10-refresh.webp","fit":"cover","position":"center"},
  "cold-talbinah": {"file":"cold-talbinah-2026-09.webp","fit":"cover","position":"center"},
  "hot-talbinah": {"file":"hot-talbinah-2026-09.webp","fit":"cover","position":"center"},
  "hot-talbinah-one-liter": {"file":"hot-talbinah-one-liter.webp","fit":"contain","position":"center"},
  "talbinah-matcha": {"file":"talbinah-matcha-2026-10.webp","fit":"cover","position":"center"},
  "lotus-cheesecake": {"file":"talbinah-lotus-cheesecake-2026-09.webp","fit":"cover","position":"center"},
  "damkah": {"file":"damkah-2026-09.webp","fit":"cover","position":"center"},
  "dates-with-saweeg": {"file":"dates-with-saweeg-2026-09.webp","fit":"cover","position":"center"},
  "talbinah-powder-sachet": {"file":"talbinah-powder.webp","fit":"contain","position":"center"},
  "saweeg-powder-sachet": {"file":"sawiq-powder.webp","fit":"contain","position":"center"},
  "mixed-nuts-sachet": {"file":"mixed-caramelized-nuts-pack.webp","fit":"contain","position":"center"},
  "al-jabirah-sachet": {"file":"haram-al-jabirah-sachet.webp","fit":"contain","position":"center"},
  "safawi-dates-nuts-box": {"file":"safawi-dates-gift-box-2026-09.webp","fit":"cover","position":"center"},
  "al-jabirah-box": {"file":"al-jabirah-box.webp","fit":"contain","position":"center"},
  "gift-box": {"file":"gift-box-2026-09.webp","fit":"cover","position":"center"},
  "saweeg-maamoul-box": {"file":"maamoul-box-2026-09.webp","fit":"cover","position":"center"},
  "pecan-basbousa-box": {"file":"haram-pecan-basbousa-box.webp","fit":"contain","position":"center"},
  "sachet-box": {"file":"talbinah-sachet-box-2026-10.webp","fit":"contain","position":"center"},
  "madini-crepe-cheese": {"file":"madini-crepe-cheese.webp","fit":"cover","position":"center"},
  "madini-crepe-signature": {"file":"madini-crepe-signature.webp","fit":"cover","position":"center"},
  "date-pecan-tart-box": {"file":"date-pecan-tart-box.webp","fit":"contain","position":"center"},
  "talbinah-sachets": {"file":"talbinah-sachets.webp","fit":"contain","position":"center"},
  "pecan-basbousa": null,
  "date-tart": null,
  "saweeg-maamoul": null,
  "saudi-coffee": null,
  "saudi-coffee-dallah": null,
  "saudi-coffee-dallah-with-sweets": null,
  "tea": null,
  "tea-thermos": null,
  "bottled-water": null,
  "ajwa-dates-nuts-box": null,
  "date-tart-box": null
} satisfies Record<string, CanonicalProductImage | null>;

export type ProductImageKey = keyof typeof canonicalProductImages;

// A null entry is an approved text-only product, not a missing-map fallback.
export const canonicalImageFor = (catalogId: string): CanonicalProductImage | undefined => {
  if (!Object.hasOwn(canonicalProductImages, catalogId)) {
    throw new Error("Unknown product-image key: " + catalogId);
  }
  return canonicalProductImages[catalogId as ProductImageKey] ?? undefined;
};

// Retained historical processor outputs; deliberately not assigned to active variants.
export const retainedLegacyImageOutputs = {
  "talbinah-matcha.webp": "Superseded by the approved 2026-10 Matcha image",
  "talbinah-sachet-box-12-2026-09.webp": "Superseded by the approved 2026-10 sachet box image"
} as const;
