import { canonicalImageFor } from "../data/catalog-images.ts";
import type { HaramMenuItem } from "./types.ts";

const item = (
  id: HaramMenuItem["id"],
  category: HaramMenuItem["category"],
  price: number,
  catalogId = id
): HaramMenuItem => ({ id, category, price, catalogId, image: canonicalImageFor(catalogId) });

// This is the single Al Haram price and availability source for every locale.
export const haramMenuItems: HaramMenuItem[] = [
  item("talbinah-ice-cream-biscuit", "iceCream", 11),
  item("talbinah-ice-cream-cup", "iceCream", 15),
  item("chocolate-ice-cream-biscuit", "iceCream", 11),
  item("chocolate-ice-cream-cup", "iceCream", 15),
  item("mixed-ice-cream-biscuit", "iceCream", 11),
  item("mixed-ice-cream-cup", "iceCream", 15),
  item("lotus-cheesecake", "desserts", 20),
  item("damkah", "desserts", 20),
  item("dates-with-saweeg", "desserts", 20),
  item("pecan-basbousa", "desserts", 13),
  item("date-tart", "desserts", 13),
  item("saweeg-maamoul", "desserts", 25),
  item("cold-talbinah", "drinks", 16),
  item("hot-talbinah", "drinks", 16),
  item("hot-talbinah-one-liter", "drinks", 55),
  item("saudi-coffee", "drinks", 7),
  item("saudi-coffee-dallah", "drinks", 25),
  item("saudi-coffee-dallah-with-sweets", "drinks", 45),
  item("tea", "drinks", 5),
  item("tea-thermos", "drinks", 25),
  item("talbinah-matcha", "drinks", 25),
  item("bottled-water", "drinks", 1),
  item("talbinah-powder-sachet", "powders", 25),
  item("saweeg-powder-sachet", "powders", 25),
  item("mixed-nuts-sachet", "powders", 12),
  item("al-jabirah-sachet", "powders", 6),
  item("safawi-dates-nuts-box", "boxes", 78),
  item("ajwa-dates-nuts-box", "boxes", 85),
  item("al-jabirah-box", "boxes", 75),
  item("gift-box", "boxes", 45),
  item("saweeg-maamoul-box", "boxes", 89),
  item("pecan-basbousa-box", "boxes", 55),
  item("sachet-box", "boxes", 75),
  item("date-tart-box", "boxes", 55)
];
