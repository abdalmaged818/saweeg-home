import type { Extra, Product } from "../types/menu";

const haram = ["haram"] as const;

export const haramProducts: Product[] = [
  {
    id: "haram-talbinah-ice-cream-biscuit",
    nameAr: "آيس كريم تلبينة – بسكوت",
    nameEn: "Talbinah Ice Cream – Biscuit",
    price: 11,
    category: "talbinah",
    displayMode: "image",
    branches: [...haram]
  },
  {
    id: "haram-talbinah-ice-cream-cup",
    nameAr: "آيس كريم تلبينة – كوب",
    nameEn: "Talbinah Ice Cream – Cup",
    price: 15,
    category: "talbinah",
    displayMode: "image",
    image: "talbinah-ice-cream-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-chocolate-ice-cream-biscuit",
    nameAr: "آيس كريم شوكولاتة – بسكوت",
    nameEn: "Chocolate Ice Cream – Biscuit",
    price: 11,
    category: "talbinah",
    displayMode: "image",
    image: "chocolate-ice-cream-biscuit-2026-10.webp",
    imageFit: "contain",
    imagePosition: "center",
    branches: [...haram]
  },
  {
    id: "haram-chocolate-ice-cream-cup",
    nameAr: "آيس كريم شوكولاتة – كوب",
    nameEn: "Chocolate Ice Cream – Cup",
    price: 15,
    category: "talbinah",
    displayMode: "image",
    image: "chocolate-ice-cream-cup-2026-10.webp",
    imageFit: "contain",
    branches: [...haram]
  },
  {
    id: "haram-mixed-ice-cream-biscuit",
    nameAr: "آيس كريم مكس (تلبينة + شوكولاتة) – بسكوت",
    nameEn: "Mixed Ice Cream (Talbinah + Chocolate) – Biscuit",
    price: 11,
    category: "talbinah",
    displayMode: "image",
    image: "mixed-ice-cream-biscuit-2026-10.webp",
    imageFit: "contain",
    imagePosition: "center",
    branches: [...haram]
  },
  {
    id: "haram-mixed-ice-cream-cup",
    nameAr: "آيس كريم مكس (تلبينة + شوكولاتة) – كوب",
    nameEn: "Mixed Ice Cream (Talbinah + Chocolate) – Cup",
    price: 15,
    category: "talbinah",
    displayMode: "image",
    image: "mixed-ice-cream-cup-2026-10.webp",
    imageFit: "contain",
    imagePosition: "center",
    branches: [...haram]
  },
  {
    id: "haram-cold-talbinah",
    nameAr: "تلبينة باردة",
    nameEn: "Cold Talbinah",
    price: 16,
    category: "talbinah",
    displayMode: "image",
    image: "cold-talbinah-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-hot-talbinah",
    nameAr: "تلبينة حارة",
    nameEn: "Hot Talbinah",
    price: 16,
    category: "talbinah",
    displayMode: "image",
    image: "hot-talbinah-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-hot-talbinah-one-liter",
    nameAr: "تلبينة حارة – 1 لتر",
    nameEn: "Hot Talbinah – 1 Liter",
    price: 55,
    category: "talbinah",
    displayMode: "image",
    image: "hot-talbinah-one-liter.webp",
    imageFit: "contain",
    branches: [...haram]
  },
  {
    id: "haram-talbinah-matcha-ice-cream",
    nameAr: "ماتشا تلبينة – آيس كريم",
    nameEn: "Talbinah Matcha Ice Cream",
    price: 25,
    category: "talbinah",
    displayMode: "image",
    branches: [...haram]
  },
  {
    id: "haram-lotus-cheesecake",
    nameAr: "تشيز كيك لوتس",
    nameEn: "Lotus Cheese Cake",
    price: 20,
    category: "sweets",
    displayMode: "image",
    image: "talbinah-lotus-cheesecake-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-damkah",
    nameAr: "دمكة",
    nameEn: "Damkah",
    price: 20,
    category: "sweets",
    displayMode: "image",
    image: "damkah-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-dates-with-saweeg",
    nameAr: "تمر سويق",
    nameEn: "Dates with Saweeg (Millet)",
    price: 20,
    category: "sweets",
    displayMode: "image",
    image: "dates-with-saweeg-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-pecan-basbousa",
    nameAr: "بسبوسة بيكان",
    nameEn: "Pecan Basbousa",
    price: 13,
    category: "sweets",
    displayMode: "image",
    branches: [...haram]
  },
  {
    id: "haram-date-tart",
    nameAr: "تارت تمر",
    nameEn: "Date Tart",
    price: 13,
    category: "sweets",
    displayMode: "image",
    branches: [...haram]
  },
  {
    id: "haram-maamoul-saweeg",
    nameAr: "معمول سويق",
    nameEn: "Saweeg Maamoul",
    price: 25,
    category: "sweets",
    displayMode: "image",
    branches: [...haram]
  },
  {
    id: "haram-talbinah-powder-sachet",
    nameAr: "ظرف بودرة تلبينة",
    nameEn: "Talbinah Powder Pack",
    price: 30,
    category: "ready",
    displayMode: "image",
    image: "talbinah-powder.webp",
    imageFit: "contain",
    branches: [...haram]
  },
  {
    id: "haram-saweeg-powder-sachet",
    nameAr: "ظرف بودرة سويق",
    nameEn: "Saweeg Powder Pack",
    price: 30,
    category: "ready",
    displayMode: "image",
    image: "sawiq-powder.webp",
    imageFit: "contain",
    branches: [...haram]
  },
  {
    id: "haram-mixed-nuts-sachet",
    nameAr: "ظرف مكسرات مكس",
    nameEn: "Mixed Nuts Pack",
    price: 14,
    category: "ready",
    displayMode: "image",
    image: "mixed-caramelized-nuts-pack.webp",
    imageFit: "contain",
    branches: [...haram]
  },
  {
    id: "haram-al-jabirah-sachet",
    nameAr: "ظرف الجابرة – بالحبة",
    nameEn: "Al Jabirah Sachet – Single",
    price: 8,
    category: "ready",
    displayMode: "image",
    image: "haram-al-jabirah-sachet.webp",
    imageFit: "contain",
    branches: [...haram]
  },
  {
    id: "haram-safawi-dates-nuts-box",
    nameAr: "بوكس تمر صفاوي محشي بالمكسرات",
    nameEn: "Safawi Dates Stuffed with Mixed Nuts Gift Box",
    price: 78,
    category: "boxes",
    displayMode: "image",
    image: "safawi-dates-gift-box-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-ajwa-dates-nuts-box",
    nameAr: "بوكس تمر عجوة محشي بالمكسرات",
    nameEn: "Ajwa Dates Stuffed with Mixed Nuts Gift Box",
    price: 85,
    category: "boxes",
    displayMode: "image",
    branches: [...haram]
  },
  {
    id: "haram-al-jabirah-box",
    nameAr: "بوكس الجابرة",
    nameEn: "Al Jabirah Box",
    price: 75,
    category: "boxes",
    displayMode: "image",
    image: "al-jabirah-box.webp",
    imageFit: "contain",
    branches: [...haram]
  },
  {
    id: "haram-gift-box",
    nameAr: "بوكس الإهداء",
    nameEn: "Gift Box",
    price: 52,
    category: "boxes",
    displayMode: "image",
    image: "gift-box-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-maamoul-box",
    nameAr: "بوكس معمول سويق",
    nameEn: "Saweeg Maamoul Box",
    price: 89,
    category: "boxes",
    displayMode: "image",
    image: "maamoul-box-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-pecan-basbousa-box",
    nameAr: "بوكس بسبوسة بيكان – مستطيل",
    nameEn: "Rectangular Pecan Basbousa Box",
    price: 55,
    category: "boxes",
    displayMode: "image",
    image: "haram-pecan-basbousa-box.webp",
    imageFit: "contain",
    branches: [...haram]
  },
  {
    id: "haram-sachet-box",
    nameAr: "بوكس الأظرف",
    nameEn: "Sachet Box",
    price: 75,
    category: "boxes",
    displayMode: "image",
    image: "talbinah-sachet-box-12-2026-09.webp",
    imageFit: "cover",
    branches: [...haram]
  },
  {
    id: "haram-date-tart-box",
    nameAr: "بوكس تارت تمر",
    nameEn: "Date Tart Box",
    price: 55,
    category: "boxes",
    displayMode: "image",
    branches: [...haram]
  }
];

export const haramExtras: Extra[] = [
  {
    id: "haram-saudi-coffee",
    nameAr: "قهوة سعودية",
    nameEn: "Saudi Coffee",
    price: 7,
    branches: [...haram]
  },
  {
    id: "haram-saudi-coffee-dallah",
    nameAr: "دلة قهوة سعودية",
    nameEn: "Saudi Coffee Dallah",
    price: 25,
    branches: [...haram]
  },
  {
    id: "haram-saudi-coffee-dallah-with-sweets",
    nameAr: "دلة قهوة سعودية مع حلا",
    nameEn: "Saudi Coffee Dallah with Sweets",
    price: 45,
    branches: [...haram]
  },
  {
    id: "haram-tea",
    nameAr: "شاهي",
    nameEn: "Tea",
    price: 5,
    branches: [...haram]
  },
  {
    id: "haram-tea-flask",
    nameAr: "ثلاجة شاهي",
    nameEn: "Tea Flask",
    price: 25,
    branches: [...haram]
  },
  {
    id: "haram-water",
    nameAr: "مياه معبأة",
    nameEn: "Bottled Water",
    price: 1,
    branches: [...haram]
  }
];
