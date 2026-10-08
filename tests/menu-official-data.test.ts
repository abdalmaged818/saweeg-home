import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

import { canonicalImageFor, canonicalProductImages } from "../src/menu/data/catalog-images.ts";
import { extras } from "../src/menu/data/extras.ts";
import { products } from "../src/menu/data/products.ts";
import { haramMenuItems } from "../src/menu/haram/data.ts";
import { haramLocaleContent } from "../src/menu/haram/locales.ts";
import { haramItemIds, haramLocales } from "../src/menu/haram/types.ts";
import type { BranchId } from "../src/menu/types/menu.ts";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const branchProductIds = (branch: BranchId): string[] =>
  products.filter((product) => product.branches.includes(branch)).map((product) => product.id);

const branchExtraPrices = (branch: BranchId): Record<string, number> =>
  Object.fromEntries(
    extras.filter((extra) => extra.branches.includes(branch)).map((extra) => [extra.id, extra.price])
  );

test("Maqsed and Bustan menus retain their confirmed products and prices", () => {
  const maqsed = branchProductIds("maqsed");
  const bustan = branchProductIds("bustan");
  assert.equal(maqsed.length, 22);
  assert.equal(bustan.length, 23);
  for (const productId of [
    "chocolate-ice-cream-cup",
    "chocolate-ice-cream-biscuit",
    "mixed-ice-cream-cup",
    "mixed-ice-cream-biscuit"
  ]) {
    const product = products.find((candidate) => candidate.id === productId);
    assert(product, `Missing shared product ${productId}`);
    assert.deepEqual(product.branches, ["maqsed", "bustan"]);
    assert.equal(product.price, productId.includes("cup") ? 14 : 10);
    assert(maqsed.includes(productId));
    assert(bustan.includes(productId));
  }
  assert(maqsed.includes("hot-talbinah-one-liter"));
  assert(!bustan.includes("hot-talbinah-one-liter"));
  assert.deepEqual(branchExtraPrices("maqsed"), {
    "saudi-coffee-cup": 6, "saudi-coffee-dallah": 21, "saudi-coffee-dallah-with-sweets": 39,
    water: 1, maamoul: 21, tart: 11, basbousa: 11
  });
  assert.deepEqual(branchExtraPrices("bustan"), {
    "saudi-coffee-cup": 6, water: 1, maamoul: 21, tart: 11, basbousa: 11,
    "coffee-of-the-day-bustan": 10, tea: 5, "tea-flask": 25
  });
});

test("Al Haram has exactly the approved 34 priced variants without duplicates", () => {
  const expectedPrices = {
    "talbinah-ice-cream-biscuit": 11, "talbinah-ice-cream-cup": 15,
    "chocolate-ice-cream-biscuit": 11, "chocolate-ice-cream-cup": 15,
    "mixed-ice-cream-biscuit": 11, "mixed-ice-cream-cup": 15,
    "lotus-cheesecake": 20, damkah: 20, "dates-with-saweeg": 20, "pecan-basbousa": 13,
    "date-tart": 13, "saweeg-maamoul": 25, "cold-talbinah": 16, "hot-talbinah": 16,
    "hot-talbinah-one-liter": 55, "saudi-coffee": 7, "saudi-coffee-dallah": 25,
    "saudi-coffee-dallah-with-sweets": 45, tea: 5, "tea-thermos": 25, "talbinah-matcha": 25,
    "bottled-water": 1, "talbinah-powder-sachet": 25, "saweeg-powder-sachet": 25,
    "mixed-nuts-sachet": 12, "al-jabirah-sachet": 6, "safawi-dates-nuts-box": 78,
    "ajwa-dates-nuts-box": 85, "al-jabirah-box": 75, "gift-box": 52,
    "saweeg-maamoul-box": 89, "pecan-basbousa-box": 55, "sachet-box": 75, "date-tart-box": 55
  } as const;
  assert.equal(haramMenuItems.length, 34);
  assert.equal(new Set(haramMenuItems.map((item) => item.id)).size, 34);
  assert.deepEqual(Object.fromEntries(haramMenuItems.map((item) => [item.id, item.price])), expectedPrices);
  const matcha = haramMenuItems.find((item) => item.id === "talbinah-matcha");
  assert.equal(matcha?.category, "drinks");
  assert.equal(haramMenuItems.filter((item) => item.category === "iceCream").length, 6);
  assert.equal(haramMenuItems.filter((item) => item.category === "drinks").length, 10);
});

test("Al Haram shelf sachet prices are centralized, unique, and scoped to the approved products", () => {
  const approvedShelfPrices = {
    "mixed-nuts-sachet": 12,
    "saweeg-powder-sachet": 25,
    "talbinah-powder-sachet": 25,
    "al-jabirah-sachet": 6
  } as const;
  const expectedNames = {
    "mixed-nuts-sachet": { ar: "ظرف مكسرات مكس", en: "Mixed Nuts Sachet" },
    "saweeg-powder-sachet": { ar: "ظرف بودرة سويق", en: "Saweeg Powder Sachet" },
    "talbinah-powder-sachet": { ar: "ظرف بودرة تلبينة", en: "Talbinah Powder Sachet" },
    "al-jabirah-sachet": { ar: "ظرف الجابرة", en: "Al Jabirah Sachet" }
  } as const;

  for (const [id, price] of Object.entries(approvedShelfPrices)) {
    const matches = haramMenuItems.filter((item) => item.id === id);
    assert.equal(matches.length, 1, `Expected one centralized Al Haram record for ${id}`);
    assert.equal(matches[0]?.price, price);
    assert.equal(matches[0]?.category, "powders");
    assert.equal(matches[0]?.catalogId, id);
    assert.equal(haramItemIds.indexOf(id as (typeof haramItemIds)[number]), haramMenuItems.indexOf(matches[0]!));

    for (const locale of haramLocales) {
      assert.ok(haramLocaleContent[locale].productNames[id as (typeof haramItemIds)[number]].trim());
    }
    assert.equal(haramLocaleContent.ar.productNames[id as (typeof haramItemIds)[number]], expectedNames[id as keyof typeof expectedNames].ar);
    assert.equal(haramLocaleContent.en.productNames[id as (typeof haramItemIds)[number]], expectedNames[id as keyof typeof expectedNames].en);
  }

  const sharedCataloguePrices = Object.fromEntries(
    products
      .filter((product) => ["talbinah-powder-sachet", "saweeg-powder-sachet", "mixed-nuts-sachet"].includes(product.catalogId ?? product.id))
      .map((product) => [product.catalogId ?? product.id, { price: product.price, branches: product.branches }])
  );
  assert.deepEqual(sharedCataloguePrices, {
    "talbinah-powder-sachet": { price: 25, branches: ["maqsed", "bustan"] },
    "saweeg-powder-sachet": { price: 25, branches: ["maqsed", "bustan"] },
    "mixed-nuts-sachet": { price: 12, branches: ["maqsed", "bustan"] }
  });
});

test("every Haram locale supplies all translations, UI labels, and the approved direction", () => {
  const rtlLocales = new Set(["ar", "ur", "fa"]);
  for (const locale of haramLocales) {
    const copy = haramLocaleContent[locale];
    assert.equal(copy.direction, rtlLocales.has(locale) ? "rtl" : "ltr");
    assert.equal(Object.keys(copy.productNames).length, haramItemIds.length);
    for (const itemId of haramItemIds) {
      assert.ok(copy.productNames[itemId].trim(), `${locale} is missing ${itemId}`);
    }
    assert.ok(copy.changeLanguage.trim());
    assert.ok(copy.vatNotice.trim());
    assert.ok(copy.imageAlt(copy.productNames[haramItemIds[0]]).trim());
  }
  assert.equal(haramLocaleContent.ar.productNames["talbinah-matcha"], "ماتشا التلبينة");
  assert.equal(haramLocaleContent.en.productNames["talbinah-matcha"], "Talbinah Matcha");
});

test("canonical product photos map only to their stable product variants", () => {
  const approvedCanonicalImages = {
    "talbinah-ice-cream-biscuit": "talbinah-ice-cream-biscuit-2026-10.webp",
    "chocolate-ice-cream-cup": "chocolate-ice-cream-cup-2026-10-refresh.webp",
    "chocolate-ice-cream-biscuit": "chocolate-ice-cream-biscuit-2026-10-refresh.webp",
    "mixed-ice-cream-cup": "mixed-ice-cream-cup-2026-10-refresh.webp",
    "mixed-ice-cream-biscuit": "mixed-ice-cream-biscuit-2026-10-refresh.webp",
    "talbinah-matcha": "talbinah-matcha-2026-10.webp",
    "sachet-box": "talbinah-sachet-box-2026-10.webp"
  } as const;
  for (const [catalogId, file] of Object.entries(approvedCanonicalImages)) {
    assert.equal(canonicalImageFor(catalogId)?.file, file);
    const users = Object.entries(canonicalProductImages)
      .filter(([, image]) => image.file === file)
      .map(([id]) => id);
    assert.deepEqual(users, [catalogId]);
  }
  assert.equal(canonicalImageFor("talbinah-ice-cream-cup")?.file, "talbinah-ice-cream-2026-09.webp");
  assert.equal(canonicalImageFor("pecan-basbousa"), undefined);
  assert.equal(canonicalImageFor("date-tart"), undefined);
  assert.equal(canonicalImageFor("saweeg-maamoul"), undefined);
});

test("approved Talbinah photos follow existing availability in every applicable menu", () => {
  const sharedProductImages = {
    "talbinah-matcha": "talbinah-matcha-2026-10.webp",
    "sachet-box": "talbinah-sachet-box-2026-10.webp"
  } as const;
  for (const [catalogId, file] of Object.entries(sharedProductImages)) {
    const product = products.find((candidate) => (candidate.catalogId ?? candidate.id) === catalogId);
    assert(product, `Missing shared ${catalogId} product`);
    assert.deepEqual(product.branches, ["maqsed", "bustan"]);
    assert.equal(canonicalImageFor(product.catalogId ?? product.id)?.file, file);
  }
  assert.equal(
    products.some((product) => (product.catalogId ?? product.id) === "talbinah-ice-cream-biscuit"),
    false
  );

  const haramProductImages = {
    "talbinah-ice-cream-biscuit": "talbinah-ice-cream-biscuit-2026-10.webp",
    "talbinah-matcha": "talbinah-matcha-2026-10.webp",
    "sachet-box": "talbinah-sachet-box-2026-10.webp"
  } as const;
  for (const [catalogId, file] of Object.entries(haramProductImages)) {
    const item = haramMenuItems.find((candidate) => candidate.catalogId === catalogId);
    assert(item, `Missing Al Haram ${catalogId} product`);
    assert.equal(item.image?.file, file);
    for (const locale of haramLocales) {
      assert.ok(haramLocaleContent[locale].productNames[item.id].trim(), `${locale} is missing ${item.id}`);
    }
  }
});

test("Haram source pages route every locale through one renderer and one price source", () => {
  const main = fs.readFileSync(path.join(projectRoot, "src", "menu", "haram-main.ts"), "utf8");
  const renderer = fs.readFileSync(path.join(projectRoot, "src", "menu", "haram", "render.ts"), "utf8");
  assert.match(main, /renderHaramMenu/);
  assert.match(main, /window\.location\.replace\("\/menu\/haram\/"\)/);
  assert.match(renderer, /haramMenuItems/);
  assert.match(renderer, /haram-product--text-only/);
  assert.doesNotMatch(renderer, /fallback|placeholder/i);
});

test("Haram refinement keeps the shared site shell and compact accessible menu presentation", () => {
  const haramMain = fs.readFileSync(path.join(projectRoot, "src", "menu", "haram-main.ts"), "utf8");
  const renderer = fs.readFileSync(path.join(projectRoot, "src", "menu", "haram", "render.ts"), "utf8");
  const styles = fs.readFileSync(path.join(projectRoot, "src", "menu", "haram", "haram.css"), "utf8");
  const headerController = fs.readFileSync(path.join(projectRoot, "src", "components", "header-controller.ts"), "utf8");

  assert.match(haramMain, /\.\.\/styles\/main\.css/);
  assert.match(haramMain, /bindSharedHeader\(root\)/);
  assert.match(renderer, /welcome-strip haram-welcome-strip/);
  assert.match(renderer, /site-header haram-site-header/);
  assert.match(renderer, /menu-button/);
  assert.match(headerController, /\[data-menu-button\]/);
  assert.match(headerController, /\[data-mobile-navigation\]/);
  assert.match(renderer, /haram-language-card__arrow/);
  assert.doesNotMatch(renderer, /haram-language-card__flag|copy\.flag|copy\.vatNotice/);
  assert.doesNotMatch(styles, /haram-category__heading::after|haram-selector-hero|haram-menu-intro__vat/);
  assert.match(styles, /\.haram-product__media\s*\{[\s\S]*?aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(styles, /\.haram-product__media\s*\{[\s\S]*?background:\s*#faf5ee/);
  assert.match(styles, /\.haram-product--text-only\s*\.haram-product__body/);
  assert.match(renderer, /if \(!item\.image\) return undefined/);
  assert.match(styles, /\.haram-language-card\[dir="rtl"\]\s+\.haram-language-card__arrow/);
  assert.match(styles, /\.haram-language-grid\s*\{[\s\S]*?grid-auto-rows:\s*var\(--haram-language-card-block-size\)/);
  assert.match(styles, /\.haram-language-card\s*\{[\s\S]*?height:\s*100%/);
  assert.match(styles, /\.haram-language-card__label\s*\{[\s\S]*?flex:\s*1 1 auto/);
  assert.match(styles, /\.haram-language-card__arrow\s*\{[\s\S]*?inline-size:\s*1\.25rem/);
  assert.match(renderer, /createProductRuns/);
  assert.match(renderer, /hasMedia \? "media" : "text-only"/);
});

test("supplied product source assets, outputs, and processing jobs remain one-to-one", async () => {
  const processor = fs.readFileSync(path.join(projectRoot, "scripts", "process-menu-product-images.mjs"), "utf8");
  const assetRoot = path.join(projectRoot, "assets-source", "menu", "product-images");
  const outputRoot = path.join(projectRoot, "public", "menu", "assets", "products");
  const expectedIceCreamJobs = [
    ["chocolate-ice-cream-cup-2026-10-refresh.png", "chocolate-ice-cream-cup-2026-10-refresh.webp"],
    ["chocolate-ice-cream-biscuit-2026-10-refresh.png", "chocolate-ice-cream-biscuit-2026-10-refresh.webp"],
    ["mixed-ice-cream-cup-2026-10-refresh.png", "mixed-ice-cream-cup-2026-10-refresh.webp"],
    ["mixed-ice-cream-biscuit-2026-10-refresh.png", "mixed-ice-cream-biscuit-2026-10-refresh.webp"]
  ] as const;
  const expectedProductJobs = [
    ["talbinah-ice-cream-biscuit-2026-10.png", "talbinah-ice-cream-biscuit-2026-10.webp"],
    ["talbinah-sachet-box-2026-10.png", "talbinah-sachet-box-2026-10.webp"],
    ["talbinah-matcha-2026-10.png", "talbinah-matcha-2026-10.webp"]
  ] as const;
  for (const [source, output] of [...expectedIceCreamJobs, ...expectedProductJobs]) {
    assert.ok(fs.existsSync(path.join(assetRoot, source)), `Missing protected source asset: ${source}`);
    assert.ok(fs.existsSync(path.join(outputRoot, output)), `Missing generated WebP asset: ${output}`);
  }
  for (const [source, output] of expectedIceCreamJobs) {
    assert.match(processor, new RegExp(`suppliedIceCreamImage\\([\\s\\S]*?"${source}"[\\s\\S]*?"${output}"`));
  }
  for (const [source, output] of expectedProductJobs) {
    assert.match(processor, new RegExp(`suppliedProductImage\\([\\s\\S]*?"${source}"[\\s\\S]*?"${output}"`));
    const metadata = await sharp(path.join(outputRoot, output)).metadata();
    assert.equal(metadata.format, "webp");
    assert.equal(metadata.width, 1400);
    assert.equal(metadata.height, 1050);
  }
});
