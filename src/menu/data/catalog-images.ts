export interface CanonicalProductImage {
  file: string;
  fit: "cover" | "contain";
  position?: string;
}

// Product photographs belong to a stable variant identifier, never to a branch,
// language, display name, or card position. Branches only supply availability and price.
export const canonicalProductImages: Record<string, CanonicalProductImage> = {
  "talbinah-ice-cream-cup": { file: "talbinah-ice-cream-2026-09.webp", fit: "cover" },
  "chocolate-ice-cream-biscuit": { file: "chocolate-ice-cream-biscuit-2026-10-refresh.webp", fit: "cover" },
  "chocolate-ice-cream-cup": { file: "chocolate-ice-cream-cup-2026-10-refresh.webp", fit: "cover" },
  "mixed-ice-cream-biscuit": { file: "mixed-ice-cream-biscuit-2026-10-refresh.webp", fit: "cover" },
  "mixed-ice-cream-cup": { file: "mixed-ice-cream-cup-2026-10-refresh.webp", fit: "cover" },
  "cold-talbinah": { file: "cold-talbinah-2026-09.webp", fit: "cover" },
  "hot-talbinah": { file: "hot-talbinah-2026-09.webp", fit: "cover" },
  "hot-talbinah-one-liter": { file: "hot-talbinah-one-liter.webp", fit: "contain" },
  "talbinah-matcha": { file: "talbinah-matcha.webp", fit: "contain" },
  "lotus-cheesecake": { file: "talbinah-lotus-cheesecake-2026-09.webp", fit: "cover" },
  damkah: { file: "damkah-2026-09.webp", fit: "cover" },
  "dates-with-saweeg": { file: "dates-with-saweeg-2026-09.webp", fit: "cover" },
  "talbinah-powder-sachet": { file: "talbinah-powder.webp", fit: "contain" },
  "saweeg-powder-sachet": { file: "sawiq-powder.webp", fit: "contain" },
  "mixed-nuts-sachet": { file: "mixed-caramelized-nuts-pack.webp", fit: "contain" },
  "al-jabirah-sachet": { file: "haram-al-jabirah-sachet.webp", fit: "contain" },
  "safawi-dates-nuts-box": { file: "safawi-dates-gift-box-2026-09.webp", fit: "cover" },
  "al-jabirah-box": { file: "al-jabirah-box.webp", fit: "contain" },
  "gift-box": { file: "gift-box-2026-09.webp", fit: "cover" },
  "saweeg-maamoul-box": { file: "maamoul-box-2026-09.webp", fit: "cover" },
  "pecan-basbousa-box": { file: "haram-pecan-basbousa-box.webp", fit: "contain" },
  "sachet-box": { file: "talbinah-sachet-box-12-2026-09.webp", fit: "cover" }
};

export const canonicalImageFor = (catalogId: string): CanonicalProductImage | undefined =>
  canonicalProductImages[catalogId];
