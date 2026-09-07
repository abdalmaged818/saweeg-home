import type { Extra } from "../types/menu";

const sharedBranches = ["maqsed", "bustan"] as const;

export const extras: Extra[] = [
  {
    id: "saudi-coffee-cup",
    nameAr: "كوب قهوة سعودية",
    nameEn: "Saudi Coffee Cup",
    quantityAr: "كوب",
    quantityEn: "Cup",
    price: 6,
    branches: [...sharedBranches]
  },
  {
    id: "saudi-coffee-dallah",
    nameAr: "دلة قهوة سعودية",
    nameEn: "Saudi Coffee Dallah",
    quantityAr: "دلة",
    quantityEn: "Dallah",
    price: 21,
    branches: [...sharedBranches]
  },
  {
    id: "saudi-coffee-dallah-with-sweets",
    nameAr: "دلة قهوة سعودية مع حلى",
    nameEn: "Saudi Coffee Dallah with Sweets",
    quantityAr: "دلة مع حلى",
    quantityEn: "Dallah with Sweets",
    price: 39,
    branches: [...sharedBranches]
  },
  {
    id: "water",
    nameAr: "ماء",
    nameEn: "Water",
    quantityAr: "عبوة",
    quantityEn: "Bottle",
    price: 1.5,
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
    price: 10,
    branches: ["maqsed"]
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
    nameAr: "شاي",
    nameEn: "Tea",
    quantityAr: "كوب",
    quantityEn: "Cup",
    price: 5,
    branches: ["bustan"]
  },
  {
    id: "tea-flask",
    nameAr: "ثلاجة شاي",
    nameEn: "Tea Flask",
    quantityAr: "ثلاجة",
    quantityEn: "Flask",
    price: 25,
    branches: ["bustan"]
  }
];
