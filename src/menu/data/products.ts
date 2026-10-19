import { sharedItemFields } from "../i18n/catalog.ts";
import type { Product } from "../types/menu";

const sharedBranches = ["maqsed", "bustan"] as const;

const records: Omit<Product, "nameAr" | "nameEn" | "quantityAr" | "quantityEn" | "noteAr" | "noteEn">[] = [
  {
    id: "talbinah-ice-cream",
    catalogId: "talbinah-ice-cream-cup",
    price: 14,
    category: "talbinah",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "chocolate-ice-cream-cup",
    price: 14,
    category: "talbinah",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "chocolate-ice-cream-biscuit",
    price: 10,
    category: "talbinah",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "mixed-ice-cream-cup",
    price: 14,
    category: "talbinah",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "mixed-ice-cream-biscuit",
    price: 10,
    category: "talbinah",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "cold-talbinah",
    price: 15,
    category: "talbinah",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "hot-talbinah",
    price: 15,
    category: "talbinah",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "talbinah-matcha",
    price: 22,
    category: "talbinah",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "hot-talbinah-one-liter",
    price: 49,
    category: "talbinah",
    displayMode: "image",
    branches: ["maqsed"]
  },
  {
    id: "talbinah-lotus-cheesecake",
    catalogId: "lotus-cheesecake",
    price: 19,
    category: "sweets",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "dates-with-saweeg",
    price: 19,
    category: "sweets",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "damkah",
    price: 19,
    category: "sweets",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "madini-crepe-cheese",
    price: 9,
    category: "sweets",
    displayMode: "image",
    branches: ["bustan"]
  },
  {
    id: "madini-crepe-signature",
    price: 9,
    category: "sweets",
    displayMode: "image",
    branches: ["bustan"]
  },
  {
    id: "maamoul-box",
    catalogId: "saweeg-maamoul-box",
    price: 78,
    category: "boxes",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "safawi-dates-gift-box",
    catalogId: "safawi-dates-nuts-box",
    price: 78,
    category: "boxes",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "date-pecan-tart-box",
    price: 51,
    category: "boxes",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "talbinah-sachet-box",
    catalogId: "sachet-box",
    price: 68,
    category: "boxes",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "al-jabirah-box",
    price: 68,
    category: "boxes",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "gift-box",
    price: 42,
    category: "boxes",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "talbinah-powder",
    catalogId: "talbinah-powder-sachet",
    price: 25,
    category: "ready",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "saweeg-powder",
    catalogId: "saweeg-powder-sachet",
    price: 25,
    category: "ready",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "talbinah-sachets",
    price: 6,
    category: "ready",
    displayMode: "image",
    branches: [...sharedBranches]
  },
  {
    id: "mixed-caramelized-nuts-sachet",
    catalogId: "mixed-nuts-sachet",
    price: 12,
    category: "ready",
    displayMode: "image",
    branches: [...sharedBranches]
  }
];

export const products: Product[] = records.map(record => ({ ...record, ...sharedItemFields(record.id) }));
