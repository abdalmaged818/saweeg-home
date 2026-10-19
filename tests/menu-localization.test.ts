import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import ts from "typescript";
import { products } from "../src/menu/data/products.ts";
import { extras } from "../src/menu/data/extras.ts";
import { categories } from "../src/menu/data/categories.ts";
import { branches } from "../src/menu/data/branches.ts";
import { haramMenuItems } from "../src/menu/haram/data.ts";
import { haramLocales, haramItemIds, haramCategoryIds } from "../src/menu/haram/types.ts";
import { haramLocaleContent, getHaramLocale, haramProductName } from "../src/menu/haram/locales.ts";
import { sharedLocaleCatalogs, sharedItemText, sharedNameFor, sharedCatalogFor } from "../src/menu/i18n/catalog.ts";
import { sharedProductIds, sharedExtraIds, sharedCategoryIds, sharedBranchIds } from "../src/menu/i18n/ids.ts";
import { getMessages } from "../src/menu/i18n/index.ts";
import { localizationSnapshot } from "./helpers/menu-localization-snapshot.ts";
const fixture = JSON.parse(fs.readFileSync(new URL("./fixtures/foundation-phase3-localization-baseline.json", import.meta.url), "utf8"));
const exactKeys = (object: object, keys: readonly string[]) => { assert.equal(new Set(keys).size, keys.length); assert.deepEqual(Object.keys(object).sort(), [...keys].sort()); };
test("resolved localization and every commercial record equal the approved Phase 2 semantic baseline", () => { const { protectedFileHashes, ...expected } = fixture; assert.deepEqual(localizationSnapshot(), expected); });
test("shared product, extra, category and branch catalogs have complete exact stable IDs", () => { const domains = { products: sharedProductIds, extras: sharedExtraIds, categories: sharedCategoryIds, branches: sharedBranchIds }; const records = { products, extras, categories, branches }; for (const locale of ["ar", "en"] as const)
    for (const domain of Object.keys(domains) as (keyof typeof domains)[]) {
        exactKeys(sharedLocaleCatalogs[locale][domain], domains[domain]);
        assert.deepEqual([...domains[domain]].sort(), records[domain].map(x => x.id).sort());
    } assert.equal(new Set([...sharedProductIds, ...sharedExtraIds, ...sharedCategoryIds, ...sharedBranchIds]).size, sharedProductIds.length + sharedExtraIds.length + sharedCategoryIds.length + sharedBranchIds.length); });
test("all ten Haram locales have exact product/category identities and approved direction/native labels", () => { const metadata = { ar: ["العربية", "rtl"], en: ["English", "ltr"], ur: ["اردو", "rtl"], id: ["Bahasa Indonesia", "ltr"], bn: ["বাংলা", "ltr"], tr: ["Türkçe", "ltr"], fa: ["فارسی", "rtl"], fr: ["Français", "ltr"], ms: ["Bahasa Melayu", "ltr"], ru: ["Русский", "ltr"] }; exactKeys(haramLocaleContent, haramLocales); assert.equal(haramItemIds.length, 34); assert.deepEqual(haramMenuItems.map(x => x.id), [...haramItemIds]); for (const locale of haramLocales) {
    const copy = getHaramLocale(locale);
    assert.deepEqual([copy.nativeLabel, copy.direction], metadata[locale]);
    assert.equal(copy.locale, locale);
    exactKeys(copy.productNames, haramItemIds);
    exactKeys(copy.categories, haramCategoryIds);
    exactKeys(copy, Object.keys(haramLocaleContent.ar));
    for (const item of haramMenuItems)
        assert.equal(haramProductName(copy, item.id), copy.productNames[item.id]);
} assert.notStrictEqual(haramLocaleContent.id, haramLocaleContent.ms); });
test("missing and unknown locales/IDs throw instead of leaking a fallback language or ID", () => { for (const invalid of ["", "xx", "AR", "in", "my"]) {
    assert.throws(() => getHaramLocale(invalid as never));
    assert.throws(() => getMessages(invalid as never));
    assert.throws(() => sharedCatalogFor(invalid as never));
} for (const locale of ["ar", "en"] as const) {
    assert.throws(() => sharedItemText("unknown-product", locale));
    assert.throws(() => sharedNameFor("Talbinah Ice Cream", locale));
    assert.throws(() => sharedNameFor("talbinah-matcha-2026-10.webp", locale));
} assert.throws(() => haramProductName(haramLocaleContent.ur, "unknown" as never)); });
test("all localized values and applicable quantity/note states are explicit and valid", () => { const walk = (value: unknown) => { if (typeof value === "string") {
    assert(value.trim());
    assert(!value.includes("�"));
}
else if (typeof value === "function") {
    walk(value(25));
}
else if (value && typeof value === "object")
    Object.values(value).forEach(walk); }; walk(sharedLocaleCatalogs); walk(haramLocaleContent); for (const locale of ["ar", "en"] as const) {
    const messages = getMessages(locale);
    exactKeys(messages, Object.keys(getMessages("ar")));
    walk(messages);
    for (const item of [...products, ...extras]) {
        const text = sharedItemText(item.id, locale);
        assert.equal(typeof text.showQuantity, "boolean");
        if (text.quantity === null)
            assert.equal(text.showQuantity, false);
    }
} });
test("catalog syntax has no duplicate properties or positional translation machinery", () => { for (const file of ["src/menu/i18n/catalog.ts", "src/menu/i18n/ar.ts", "src/menu/i18n/en.ts", "src/menu/haram/locales.ts"]) {
    const source = fs.readFileSync(file, "utf8"), ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    const walk = (node: ts.Node) => { if (ts.isPropertyAssignment(node) && node.name.getText(ast) === "productNames")
        assert(ts.isObjectLiteralExpression(node.initializer), "Product translations must be literal ID-keyed entries"); if (ts.isObjectLiteralExpression(node)) {
        const keys = node.properties.flatMap(p => p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? [p.name.text] : []);
        assert.equal(new Set(keys).size, keys.length, file);
    } ts.forEachChild(node, walk); };
    walk(ast);
    assert.doesNotMatch(source, /names\(\[|values\[index\]|\.webp/);
} for (const file of ["products", "extras", "categories", "branches"]) {
    const source = fs.readFileSync("src/menu/data/" + file + ".ts", "utf8");
    assert.doesNotMatch(source, /\b(?:nameAr|nameEn|quantityAr|quantityEn|noteAr|noteEn)\s*:\s*"/);
} const renderer = fs.readFileSync("src/menu/templates/menu-page.ts", "utf8"); assert.doesNotMatch(renderer, /normalizedLabel|item\.nameAr|item\.nameEn|quantityTokens/); });
test("localization does not own prices or images; branch-specific prices remain independent", () => { for (const catalog of Object.values(sharedLocaleCatalogs)) {
    assert(!Object.hasOwn(catalog, "price"));
    for (const item of Object.values(catalog.products)) {
        assert(!Object.hasOwn(item, "price"));
        assert(!Object.hasOwn(item, "image"));
    }
} for (const id of ["talbinah-matcha", "gift-box"]) {
    const shared = products.find(p => p.id === id)!;
    const haram = haramMenuItems.find(p => p.id === id)!;
    assert.equal(shared.price, id === "gift-box" ? 42 : 22);
    assert.equal(haram.price, id === "gift-box" ? 45 : 25);
} for (const [id, price] of [["mixed-nuts-sachet", 12], ["saweeg-powder-sachet", 25], ["talbinah-powder-sachet", 25], ["al-jabirah-sachet", 6]] as const)
    assert.equal(haramMenuItems.find(p => p.id === id)!.price, price); });
