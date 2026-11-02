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
  item("talbinah-ice-cream-biscuit", "iceCream", 10),
  item("talbinah-ice-cream-cup", "iceCream", 14),
  item("chocolate-ice-cream-biscuit", "iceCream", 10),
  item("chocolate-ice-cream-cup", "iceCream", 14),
  item("mixed-ice-cream-biscuit", "iceCream", 10),
  item("mixed-ice-cream-cup", "iceCream", 14),
  item("lotus-cheesecake", "desserts", 19),
  item("damkah", "desserts", 19),
  item("dates-with-saweeg", "desserts", 19),
  item("pecan-basbousa", "desserts", 11),
  item("date-tart", "desserts", 11),
  item("saweeg-maamoul", "desserts", 21),
  item("cold-talbinah", "drinks", 15),
  item("hot-talbinah", "drinks", 15),
  item("hot-talbinah-one-liter", "drinks", 49),
  item("saudi-coffee", "drinks", 6),
  item("saudi-coffee-dallah", "drinks", 21),
  item("saudi-coffee-dallah-with-sweets", "drinks", 39),
  item("tea", "drinks", 5),
  item("tea-thermos", "drinks", 25),
  item("talbinah-matcha", "drinks", 22),
  item("bottled-water", "drinks", 1),
  item("talbinah-powder-sachet", "powders", 25),
  item("saweeg-powder-sachet", "powders", 25),
  item("mixed-nuts-sachet", "powders", 12),
  item("al-jabirah-sachet", "powders", 6),
  item("safawi-dates-nuts-box", "boxes", 78),
  item("ajwa-dates-nuts-box", "boxes", 85),
  item("al-jabirah-box", "boxes", 68),
  item("gift-box", "boxes", 42),
  item("saweeg-maamoul-box", "boxes", 78),
  item("pecan-basbousa-box", "boxes", 51),
  item("sachet-box", "boxes", 68),
  item("date-tart-box", "boxes", 51)
];
