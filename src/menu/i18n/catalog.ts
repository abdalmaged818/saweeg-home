import type { Language } from "../types/menu.ts";
import type { SharedProductId, SharedExtraId, SharedCategoryId, SharedBranchId } from "./ids.ts";
import { haramLocaleContent } from "../haram/locales.ts";
import { haramItemIds, type HaramItemId } from "../haram/types.ts";
export interface ItemText { name: string; quantity: string | null; note: string | null; showQuantity: boolean; }
export interface SharedLocaleCatalog { products: Record<SharedProductId, ItemText>; extras: Record<SharedExtraId, ItemText>; categories: Record<SharedCategoryId, string>; branches: Record<SharedBranchId, string>; }
export const sharedLocaleCatalogs = {
  "ar": {
    "products": {
      "talbinah-ice-cream": {
        "name": "آيس كريم تلبينة",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "chocolate-ice-cream-cup": {
        "name": "آيس كريم تلبينة شوكلت – كوب",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "chocolate-ice-cream-biscuit": {
        "name": "آيس كريم تلبينة شوكلت – بسكوت",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "mixed-ice-cream-cup": {
        "name": "آيس كريم مكس (تلبينة + شوكولاتة) – كوب",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "mixed-ice-cream-biscuit": {
        "name": "آيس كريم مكس (تلبينة + شوكولاتة) – بسكوت",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "cold-talbinah": {
        "name": "تلبينة باردة",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "hot-talbinah": {
        "name": "تلبينة حارة",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "talbinah-matcha": {
        "name": "ماتشا تلبينة",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "hot-talbinah-one-liter": {
        "name": "تلبينة حارة – 1 لتر",
        "quantity": "1 لتر",
        "note": null,
        "showQuantity": false
      },
      "talbinah-lotus-cheesecake": {
        "name": "تشيز كيك تلبينة",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "dates-with-saweeg": {
        "name": "تمر بالسويق",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "damkah": {
        "name": "الدمكة",
        "quantity": "8 قطع",
        "note": null,
        "showQuantity": true
      },
      "madini-crepe-cheese": {
        "name": "كريب مديني أجبان",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "madini-crepe-signature": {
        "name": "كريب مديني سجنتشر",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "maamoul-box": {
        "name": "بوكس معمول",
        "quantity": "27 قطعة",
        "note": null,
        "showQuantity": true
      },
      "safawi-dates-gift-box": {
        "name": "بوكس تمر صفاوي محشي مكسرات",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "date-pecan-tart-box": {
        "name": "بوكس تارت التمر والبيكان",
        "quantity": "14 قطعة",
        "note": null,
        "showQuantity": true
      },
      "talbinah-sachet-box": {
        "name": "بوكس أظرف التلبينة",
        "quantity": "12 ظرف",
        "note": null,
        "showQuantity": true
      },
      "al-jabirah-box": {
        "name": "بوكس أظرف الجابرة",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "gift-box": {
        "name": "بوكس الإهداء",
        "quantity": "عبوتان من اختيارك",
        "note": null,
        "showQuantity": true
      },
      "talbinah-powder": {
        "name": "بودرة تلبينة نبوية",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "saweeg-powder": {
        "name": "بودرة سويق",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "talbinah-sachets": {
        "name": "أظرف التلبينة",
        "quantity": "ظرف واحد",
        "note": null,
        "showQuantity": true
      },
      "mixed-caramelized-nuts-sachet": {
        "name": "ظرف مكسرات مكرملة مكس",
        "quantity": null,
        "note": null,
        "showQuantity": false
      }
    },
    "extras": {
      "saudi-coffee-cup": {
        "name": "كوب قهوة سعودية",
        "quantity": "كوب",
        "note": null,
        "showQuantity": false
      },
      "saudi-coffee-dallah": {
        "name": "دلة قهوة سعودية",
        "quantity": "دلة",
        "note": null,
        "showQuantity": false
      },
      "saudi-coffee-dallah-with-sweets": {
        "name": "دلة قهوة سعودية مع حلى",
        "quantity": "دلة مع حلى",
        "note": null,
        "showQuantity": false
      },
      "water": {
        "name": "ماء",
        "quantity": "عبوة",
        "note": null,
        "showQuantity": true
      },
      "maamoul": {
        "name": "معمول",
        "quantity": "5 قطع",
        "note": null,
        "showQuantity": true
      },
      "tart": {
        "name": "تارت",
        "quantity": "قطعتان",
        "note": null,
        "showQuantity": true
      },
      "basbousa": {
        "name": "بسبوسة",
        "quantity": "قطعتان",
        "note": null,
        "showQuantity": true
      },
      "coffee-of-the-day-maqsed": {
        "name": "قهوة اليوم",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "coffee-of-the-day-bustan": {
        "name": "قهوة اليوم",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "tea": {
        "name": "شاهي",
        "quantity": "كوب",
        "note": null,
        "showQuantity": true
      },
      "tea-flask": {
        "name": "شاهي",
        "quantity": "ثلاجة",
        "note": null,
        "showQuantity": true
      }
    },
    "categories": {
      "talbinah": "تلبينة وآيس كريم",
      "sweets": "حلويات",
      "boxes": "بوكسات وهدايا",
      "ready": "منتجات رف",
      "drinks": "مشروبات وإضافات"
    },
    "branches": {
      "maqsed": "فرع المقصد",
      "bustan": "فرع بستان المستظل"
    }
  },
  "en": {
    "products": {
      "talbinah-ice-cream": {
        "name": "Talbinah Ice Cream",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "chocolate-ice-cream-cup": {
        "name": "Talbinah Chocolate Ice Cream – Cup",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "chocolate-ice-cream-biscuit": {
        "name": "Talbinah Chocolate Ice Cream – Biscuit",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "mixed-ice-cream-cup": {
        "name": "Mixed Ice Cream (Talbinah + Chocolate) – Cup",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "mixed-ice-cream-biscuit": {
        "name": "Mixed Ice Cream (Talbinah + Chocolate) – Biscuit",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "cold-talbinah": {
        "name": "Cold Talbinah",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "hot-talbinah": {
        "name": "Hot Talbinah",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "talbinah-matcha": {
        "name": "Talbinah Matcha",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "hot-talbinah-one-liter": {
        "name": "Hot Talbinah – 1 Liter",
        "quantity": "1 Liter",
        "note": null,
        "showQuantity": false
      },
      "talbinah-lotus-cheesecake": {
        "name": "Talbinah Cheesecake",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "dates-with-saweeg": {
        "name": "Dates with Saweeg (Millet)",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "damkah": {
        "name": "Damkah",
        "quantity": "8 Pieces",
        "note": null,
        "showQuantity": true
      },
      "madini-crepe-cheese": {
        "name": "Madini Crepe Cheese",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "madini-crepe-signature": {
        "name": "Madini Crepe Signature",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "maamoul-box": {
        "name": "Maamoul Box",
        "quantity": "27 Pieces",
        "note": null,
        "showQuantity": true
      },
      "safawi-dates-gift-box": {
        "name": "Safawi Dates Stuffed with Mixed Nuts Gift Box",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "date-pecan-tart-box": {
        "name": "Date Pecan Tart Box",
        "quantity": "14 Pieces",
        "note": null,
        "showQuantity": true
      },
      "talbinah-sachet-box": {
        "name": "Talbinah Sachet Box",
        "quantity": "12 Sachets",
        "note": null,
        "showQuantity": true
      },
      "al-jabirah-box": {
        "name": "Al Jabirah Sachet Box",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "gift-box": {
        "name": "Gift Box",
        "quantity": "2 Containers of Your Choice",
        "note": null,
        "showQuantity": true
      },
      "talbinah-powder": {
        "name": "Talbinah Powder Pack",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "saweeg-powder": {
        "name": "Saweeg Powder Pack",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "talbinah-sachets": {
        "name": "Talbinah Sachets",
        "quantity": "1 Sachet",
        "note": null,
        "showQuantity": true
      },
      "mixed-caramelized-nuts-sachet": {
        "name": "Mixed Nuts Pack",
        "quantity": null,
        "note": null,
        "showQuantity": false
      }
    },
    "extras": {
      "saudi-coffee-cup": {
        "name": "Saudi Coffee",
        "quantity": "Cup",
        "note": null,
        "showQuantity": true
      },
      "saudi-coffee-dallah": {
        "name": "Saudi Coffee",
        "quantity": "Dallah",
        "note": null,
        "showQuantity": true
      },
      "saudi-coffee-dallah-with-sweets": {
        "name": "Saudi Coffee",
        "quantity": "Dallah with Sweets",
        "note": null,
        "showQuantity": true
      },
      "water": {
        "name": "Water",
        "quantity": "Bottle",
        "note": null,
        "showQuantity": true
      },
      "maamoul": {
        "name": "Maamoul",
        "quantity": "5 Pieces",
        "note": null,
        "showQuantity": true
      },
      "tart": {
        "name": "Tart",
        "quantity": "2 Pieces",
        "note": null,
        "showQuantity": true
      },
      "basbousa": {
        "name": "Basbousa",
        "quantity": "2 Pieces",
        "note": null,
        "showQuantity": true
      },
      "coffee-of-the-day-maqsed": {
        "name": "Coffee of the Day",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "coffee-of-the-day-bustan": {
        "name": "Coffee of the Day",
        "quantity": null,
        "note": null,
        "showQuantity": false
      },
      "tea": {
        "name": "Tea",
        "quantity": "Cup",
        "note": null,
        "showQuantity": true
      },
      "tea-flask": {
        "name": "Tea",
        "quantity": "Flask",
        "note": null,
        "showQuantity": true
      }
    },
    "categories": {
      "talbinah": "Talbinah & Ice Cream",
      "sweets": "Desserts",
      "boxes": "Boxes & Gifts",
      "ready": "Packaged Products",
      "drinks": "Drinks & Extras"
    },
    "branches": {
      "maqsed": "Al-Maqsad Branch",
      "bustan": "Bustan Al-Mustazal Branch"
    }
  }
} satisfies Record<Language, SharedLocaleCatalog>;
export const sharedCatalogFor = (locale: Language): SharedLocaleCatalog => {
  if (!Object.hasOwn(sharedLocaleCatalogs, locale)) throw new Error("Unknown shared menu locale: " + locale);
  return sharedLocaleCatalogs[locale];
};
const requireEntry = <T>(entries: Record<string, T>, id: string): T => {
  if (!Object.hasOwn(entries, id)) throw new Error("Unknown menu localization ID: " + id);
  return entries[id];
};
// Compatibility IDs are stable presentation aliases, never names or image keys.
const legacyHaramIds = new Map<string, HaramItemId>(haramItemIds.map(id => ["haram-" + id, id]));
export const sharedItemText = (id: string, locale: Language): ItemText => {
  const copy = sharedCatalogFor(locale);
  if (Object.hasOwn(copy.products, id)) return requireEntry(copy.products, id);
  if (Object.hasOwn(copy.extras, id)) return requireEntry(copy.extras, id);
  const haramId = legacyHaramIds.get(id);
  if (haramId) return { name: haramLocaleContent[locale].productNames[haramId], quantity: null, note: null, showQuantity: false };
  throw new Error("Unknown menu item localization ID: " + id);
};
export const sharedNameFor = (id: string, locale: Language): string => {
  const copy = sharedCatalogFor(locale);
  if (Object.hasOwn(copy.categories, id)) return requireEntry(copy.categories, id);
  if (Object.hasOwn(copy.branches, id)) return requireEntry(copy.branches, id);
  return sharedItemText(id, locale).name;
};
// Derived bilingual views preserve consumers; text is editable only above.
export const sharedItemFields = (id: string) => {
  const ar = sharedItemText(id, "ar"), en = sharedItemText(id, "en");
  return { nameAr: ar.name, nameEn: en.name, ...(ar.quantity === null ? {} : {quantityAr: ar.quantity}), ...(en.quantity === null ? {} : {quantityEn: en.quantity}), ...(ar.note === null ? {} : {noteAr: ar.note}), ...(en.note === null ? {} : {noteEn: en.note}) };
};
