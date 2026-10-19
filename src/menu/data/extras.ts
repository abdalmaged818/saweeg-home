import { sharedItemFields } from "../i18n/catalog.ts";
import type { Extra } from "../types/menu";

const sharedBranches = ["maqsed", "bustan"] as const;

const records: Omit<Extra, "nameAr" | "nameEn" | "quantityAr" | "quantityEn" | "noteAr" | "noteEn">[] = [
  {
    id: "saudi-coffee-cup",
    price: 6,
    branches: [...sharedBranches]
  },
  {
    id: "saudi-coffee-dallah",
    price: 21,
    branches: ["maqsed"]
  },
  {
    id: "saudi-coffee-dallah-with-sweets",
    price: 39,
    branches: ["maqsed"]
  },
  {
    id: "water",
    price: 1,
    branches: [...sharedBranches]
  },
  {
    id: "maamoul",
    price: 21,
    branches: [...sharedBranches]
  },
  {
    id: "tart",
    price: 11,
    branches: [...sharedBranches]
  },
  {
    id: "basbousa",
    price: 11,
    branches: [...sharedBranches]
  },
  {
    id: "coffee-of-the-day-maqsed",
    price: 6,
    branches: []
  },
  {
    id: "coffee-of-the-day-bustan",
    price: 10,
    branches: ["bustan"]
  },
  {
    id: "tea",
    price: 5,
    branches: ["bustan"]
  },
  {
    id: "tea-flask",
    price: 25,
    branches: ["bustan"]
  }
];

export const extras: Extra[] = records.map(record => ({ ...record, ...sharedItemFields(record.id) }));
