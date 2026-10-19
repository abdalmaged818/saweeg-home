import type { Branch } from "../types/menu.ts";
import { sharedNameFor } from "../i18n/catalog.ts";
export const branches: Branch[] = [
  {
    "id": "maqsed"
  },
  {
    "id": "bustan"
  }
].map(record => ({ id: record.id as Branch["id"], nameAr: sharedNameFor(record.id, "ar"), nameEn: sharedNameFor(record.id, "en") }));
