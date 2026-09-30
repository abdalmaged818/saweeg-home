import assert from "node:assert/strict";
import test from "node:test";

import { extras } from "../src/menu/data/extras.ts";
import { haramExtras, haramProducts } from "../src/menu/data/haram.ts";
import { products } from "../src/menu/data/products.ts";
import type { BranchId } from "../src/menu/types/menu.ts";

const productPrices = {
  "talbinah-ice-cream": 14,
  "cold-talbinah": 15,
  "hot-talbinah": 15,
  "talbinah-matcha": 22,
  "hot-talbinah-one-liter": 49,
  "talbinah-lotus-cheesecake": 19,
  "dates-with-saweeg": 19,
  damkah: 19,
  "madini-crepe-cheese": 9,
  "madini-crepe-signature": 9,
  "maamoul-box": 78,
  "safawi-dates-gift-box": 78,
  "date-pecan-tart-box": 51,
  "talbinah-sachet-box": 68,
  "al-jabirah-box": 68,
  "gift-box": 42,
  "talbinah-powder": 25,
  "saweeg-powder": 25,
  "talbinah-sachets": 6,
  "mixed-caramelized-nuts-sachet": 12
} as const;

const branchProductIds = (branch: BranchId): string[] =>
  products
    .filter((product) => product.branches.includes(branch))
    .map((product) => product.id);

const branchExtraPrices = (branch: BranchId): Record<string, number> =>
  Object.fromEntries(
    extras
      .filter((extra) => extra.branches.includes(branch))
      .map((extra) => [extra.id, extra.price])
  );

test("all confirmed product prices are represented", () => {
  assert.deepEqual(
    Object.fromEntries(products.map((product) => [product.id, product.price])),
    productPrices
  );
});

test("branch-specific product selections match the official PDFs", () => {
  const maqsed = branchProductIds("maqsed");
  const bustan = branchProductIds("bustan");

  assert.equal(maqsed.length, 18);
  assert.equal(bustan.length, 19);
  assert(maqsed.includes("hot-talbinah-one-liter"));
  assert(!bustan.includes("hot-talbinah-one-liter"));
  assert(!maqsed.includes("madini-crepe-cheese"));
  assert(!maqsed.includes("madini-crepe-signature"));
  assert(bustan.includes("madini-crepe-cheese"));
  assert(bustan.includes("madini-crepe-signature"));
});

test("Maqsed add-ons and prices match the confirmed menu data", () => {
  assert.deepEqual(branchExtraPrices("maqsed"), {
    "saudi-coffee-cup": 6,
    "saudi-coffee-dallah": 21,
    "saudi-coffee-dallah-with-sweets": 39,
    water: 1,
    maamoul: 21,
    tart: 11,
    basbousa: 11
  });
});

test("Bustan add-ons and prices match the confirmed menu data", () => {
  assert.deepEqual(branchExtraPrices("bustan"), {
    "saudi-coffee-cup": 6,
    water: 1,
    maamoul: 21,
    tart: 11,
    basbousa: 11,
    "coffee-of-the-day-bustan": 10,
    tea: 5,
    "tea-flask": 25
  });
});

test("confirmed official labels are retained", () => {
  const byId = Object.fromEntries(products.map((product) => [product.id, product]));
  const extrasById = Object.fromEntries(extras.map((extra) => [extra.id, extra]));

  assert.equal(byId["dates-with-saweeg"].nameEn, "Dates with Saweeg (Millet)");
  assert.equal(byId["talbinah-lotus-cheesecake"].nameEn, "Talbinah Cheese Cake Lotus");
  assert.equal(byId["mixed-caramelized-nuts-sachet"].nameAr, "ظرف مكسرات مكرملة مكس");
  assert.equal(byId["talbinah-ice-cream"].noteAr, undefined);
  assert.equal(extrasById.tea.nameAr, "شاهي");
  assert.equal(extrasById["tea-flask"].nameAr, "شاهي");
});

test("official supplied product images are mapped without cropping", () => {
  const expectedImages = {
    "talbinah-sachets": "talbinah-sachets.webp",
    "talbinah-matcha": "talbinah-matcha.webp",
    "mixed-caramelized-nuts-sachet": "mixed-caramelized-nuts-pack.webp",
    "al-jabirah-box": "al-jabirah-box.webp",
    "date-pecan-tart-box": "date-pecan-tart-box.webp",
    "talbinah-powder": "talbinah-powder.webp",
    "saweeg-powder": "sawiq-powder.webp",
    "hot-talbinah-one-liter": "hot-talbinah-one-liter.webp"
  } as const;

  for (const [id, image] of Object.entries(expectedImages)) {
    const product = products.find((candidate) => candidate.id === id);
    assert(product, `Missing product ${id}`);
    assert.equal(product.displayMode, "image", `${id} should use an image card`);
    if (product.displayMode === "image") {
      assert.equal(product.image, image);
      assert.equal(product.imageFit, "contain");
    }
  }
});

test("Al Haram has exactly the 34 unique products and official prices", () => {
  const haramItems = [...haramProducts, ...haramExtras];
  const expectedPrices = {
    "haram-talbinah-ice-cream-biscuit": 11,
    "haram-talbinah-ice-cream-cup": 15,
    "haram-chocolate-ice-cream-biscuit": 11,
    "haram-chocolate-ice-cream-cup": 15,
    "haram-mixed-ice-cream-biscuit": 11,
    "haram-mixed-ice-cream-cup": 15,
    "haram-lotus-cheesecake": 20,
    "haram-damkah": 20,
    "haram-dates-with-saweeg": 20,
    "haram-pecan-basbousa": 13,
    "haram-date-tart": 13,
    "haram-maamoul-saweeg": 25,
    "haram-cold-talbinah": 16,
    "haram-hot-talbinah": 16,
    "haram-hot-talbinah-one-liter": 55,
    "haram-saudi-coffee": 7,
    "haram-saudi-coffee-dallah": 25,
    "haram-saudi-coffee-dallah-with-sweets": 45,
    "haram-tea": 5,
    "haram-tea-flask": 25,
    "haram-talbinah-matcha-ice-cream": 25,
    "haram-water": 1,
    "haram-talbinah-powder-sachet": 30,
    "haram-saweeg-powder-sachet": 30,
    "haram-mixed-nuts-sachet": 14,
    "haram-al-jabirah-sachet": 8,
    "haram-safawi-dates-nuts-box": 78,
    "haram-ajwa-dates-nuts-box": 85,
    "haram-al-jabirah-box": 75,
    "haram-gift-box": 52,
    "haram-maamoul-box": 89,
    "haram-pecan-basbousa-box": 55,
    "haram-sachet-box": 75,
    "haram-date-tart-box": 55
  } as const;

  assert.equal(haramItems.length, 34);
  assert.equal(new Set(haramItems.map((item) => item.id)).size, 34);
  assert.deepEqual(
    Object.fromEntries(haramItems.map((item) => [item.id, item.price])),
    expectedPrices
  );
  assert.equal(
    haramItems.filter((item) => item.nameAr.includes("آيس كريم شوكولاتة")).length,
    2
  );
  assert(!haramItems.some((item) => /مانجا|mango/i.test(`${item.nameAr} ${item.nameEn}`)));
});

test("Al Haram maps images only to exact approved products", () => {
  const imageFreeProductIds = haramProducts
    .filter((product) => product.displayMode === "image" && !product.image)
    .map((product) => product.id);

  assert.deepEqual(imageFreeProductIds, [
    "haram-talbinah-ice-cream-biscuit",
    "haram-chocolate-ice-cream-biscuit",
    "haram-chocolate-ice-cream-cup",
    "haram-mixed-ice-cream-biscuit",
    "haram-talbinah-matcha-ice-cream",
    "haram-pecan-basbousa",
    "haram-date-tart",
    "haram-maamoul-saweeg",
    "haram-ajwa-dates-nuts-box",
    "haram-date-tart-box"
  ]);

  const mappedImages = haramProducts
    .filter((product) => product.displayMode === "image")
    .flatMap((product) => product.image ? [product.image] : []);

  assert.equal(mappedImages.length, new Set(mappedImages).size);
});
