import { haramMenuItems } from "../haram/data.ts";
import { haramLocaleContent } from "../haram/locales.ts";
import type { Extra, Product } from "../types/menu.ts";

const haram = ["haram"] as const;

const genericCategory = {
  iceCream: "talbinah",
  desserts: "sweets",
  powders: "ready",
  boxes: "boxes",
} as const;

// Compatibility exports for the shared menu implementation. The dedicated Haram
// renderer reads haramMenuItems directly, so prices never need to be copied here.
export const haramProducts: Product[] = haramMenuItems
  .filter((item) => item.category !== "drinks")
  .map((item) => {
    if (item.category === "drinks") {
      throw new Error("Drinks must be exported as Haram extras.");
    }
    return {
      id: `haram-${item.id}`,
      nameAr: haramLocaleContent.ar.productNames[item.id],
      nameEn: haramLocaleContent.en.productNames[item.id],
      price: item.price,
      category: genericCategory[item.category],
      displayMode: "image" as const,
      ...(item.image
        ? {
            image: item.image.file,
            imageFit: item.image.fit,
            imagePosition: item.image.position,
          }
        : {}),
      branches: [...haram],
    };
  });

export const haramExtras: Extra[] = haramMenuItems
  .filter((item) => item.category === "drinks")
  .map((item) => ({
    id: `haram-${item.id}`,
    nameAr: haramLocaleContent.ar.productNames[item.id],
    nameEn: haramLocaleContent.en.productNames[item.id],
    price: item.price,
    branches: [...haram],
  }));
