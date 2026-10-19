import type { Category } from "../types/menu.ts";
import { sharedNameFor } from "../i18n/catalog.ts";
export const categories: Category[] = [
  {
    "id": "talbinah"
  },
  {
    "id": "sweets"
  },
  {
    "id": "boxes"
  },
  {
    "id": "ready"
  },
  {
    "id": "drinks"
  }
].map(record => ({ id: record.id as Category["id"], nameAr: sharedNameFor(record.id, "ar"), nameEn: sharedNameFor(record.id, "en") }));
