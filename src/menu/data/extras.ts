import type { Extra } from "../types/menu";

const sharedBranches = ["maqsed", "bustan"] as const;

export const extras: Extra[] = [
  {
    id: "saudi-coffee-cup",
    nameAr: "كوب قهوة سعودية",
    nameEn: "Saudi Coffee",
    quantityAr: "كوب",
    quantityEn: "Cup",
    price: 6,
    branches: [...sharedBranches]
  },
  {
    id: "saudi-coffee-dallah",
    nameAr: "دلة قهوة سعودية",
    nameEn: "Saudi Coffee",
    quantityAr: "دلة",
    quantityEn: "Dallah",
    price: 21,
    branches: ["maqsed"]
  },
  {
    id: "saudi-coffee-dallah-with-sweets",
    nameAr: "دلة قهوة سعودية مع حلى",
    nameEn: "Saudi Coffee",
    quantityAr: "دلة مع حلى",
    quantityEn: "Dallah with Sweets",
    price: 39,
    branches: ["maqsed"]
  },
  {
    id: "water",
    nameAr: "ماء",
    nameEn: "Water",
    quantityAr: "عبوة",
    quantityEn: "Bottle",
    price: 1,
    branches: [...sharedBranches]
  },
  {
    id: "maamoul",
    nameAr: "معمول",
    nameEn: "Maamoul",
    quantityAr: "5 قطع",
    quantityEn: "5 Pieces",
    price: 21,
    branches: [...sharedBranches]
  },
  {
    id: "tart",
    nameAr: "تارت",
    nameEn: "Tart",
    quantityAr: "قطعتان",
    quantityEn: "2 Pieces",
    price: 11,
    branches: [...sharedBranches]
  },
  {
    id: "basbousa",
    nameAr: "بسبوسة",
    nameEn: "Basbousa",
    quantityAr: "قطعتان",
    quantityEn: "2 Pieces",
    price: 11,
    branches: [...sharedBranches]
  },
  {
    id: "coffee-of-the-day-maqsed",
    nameAr: "قهوة اليوم",
    nameEn: "Coffee of the Day",
    price: 6,
    branches: []
  },
  {
    id: "coffee-of-the-day-bustan",
    nameAr: "قهوة اليوم",
    nameEn: "Coffee of the Day",
    price: 10,
    branches: ["bustan"]
  },
  {
    id: "tea",
    nameAr: "شاهي",
    nameEn: "Tea",
    quantityAr: "كوب",
    quantityEn: "Cup",
    price: 5,
    branches: ["bustan"]
  },
  {
    id: "tea-flask",
    nameAr: "شاهي",
    nameEn: "Tea",
    quantityAr: "ثلاجة",
    quantityEn: "Flask",
    price: 25,
    branches: ["bustan"]
  }
];
