import { getMessages } from "../../src/menu/i18n/index.ts";
import { canonicalImageFor } from "../../src/menu/data/catalog-images.ts";
import { products } from "../../src/menu/data/products.ts";
import { extras } from "../../src/menu/data/extras.ts";
import { categories } from "../../src/menu/data/categories.ts";
import { branches } from "../../src/menu/data/branches.ts";
import { haramMenuItems } from "../../src/menu/haram/data.ts";
import { haramLocaleContent } from "../../src/menu/haram/locales.ts";
import { sharedLocaleCatalogs } from "../../src/menu/i18n/catalog.ts";
import { ar } from "../../src/menu/i18n/ar.ts";
import { en } from "../../src/menu/i18n/en.ts";
export const serializeLocalization = (value: any, key = ""): any => typeof value === "function" ? { samples: (key === "priceLabel" ? [0, 1, 6, 12, 14, 22, 25, 42, 45, 49, 55, 68, 78, 89] : ["__PRODUCT_NAME__"]).map(input => [input, value(input)]) } : Array.isArray(value) ? value.map(item => serializeLocalization(item)) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).map(([key, item]) => [key, serializeLocalization(item, key)])) : value;
export const localizationSnapshot = () => serializeLocalization({ baseline: "b4f973505ed44ffd8ed045612d5fa90643c64e22", products, extras, categories, branches, haram: haramMenuItems, sharedCatalog: sharedLocaleCatalogs, ui: { ar, en }, haramLocales: haramLocaleContent, routes: resolveLocalizationRoutes({ products, extras, categories, sharedCatalog: sharedLocaleCatalogs, haram: haramMenuItems }, { ar, en }, haramLocaleContent) });
export const resolveLocalizationRoutes = (data: any, ui: any, haram: any) => {
    const routes: Record<string, unknown> = {};
    for (const locale of ["ar", "en"])
        for (const branch of ["maqsed", "bustan"]) {
            const field = locale === "ar" ? "nameAr" : "nameEn";
            const itemText = (item: any) => { const copy = data.sharedCatalog[locale][Object.hasOwn(data.sharedCatalog[locale].products, item.id) ? "products" : "extras"][item.id]; return { id: item.id, name: copy.name, quantity: copy.quantity, note: copy.note, showQuantity: copy.showQuantity, price: item.price, currencyText: ui[locale].priceLabel(item.price), availability: item.branches }; };
            routes["/menu/" + (locale === "en" ? "en/" : "") + "?branch=" + branch] = { locale, direction: locale === "ar" ? "rtl" : "ltr", branch, categories: data.categories.map((category: any) => ({ id: category.id, name: category[field] })), products: data.products.filter((item: any) => item.branches.includes(branch)).map((item: any) => ({ ...itemText(item), category: item.category, imageKey: item.catalogId ?? item.id, image: canonicalImageFor(item.catalogId ?? item.id) ?? null })), extras: data.extras.filter((item: any) => item.branches.includes(branch)).map(itemText) };
        }
    routes["/menu/haram/"] = { locale: "ar", direction: "rtl", languages: Object.entries(haram).map(([locale, copy]: [
            string,
            any
        ]) => ({ locale, label: copy.nativeLabel, direction: copy.direction, href: "/menu/haram/" + locale + "/" })) };
    for (const [locale, copy] of Object.entries(haram) as [
        string,
        any
    ][])
        routes["/menu/haram/" + locale + "/"] = { locale, direction: copy.direction, products: data.haram.map((item: any) => ({ id: item.id, name: copy.productNames[item.id], category: item.category, categoryName: copy.categories[item.category], price: item.price, currencyText: copy.priceLabel(item.price), imageKey: item.catalogId, image: item.image ?? null, textOnly: !item.image, imageAlt: item.image ? copy.imageAlt(copy.productNames[item.id]) : null })), ui: serializeLocalization(copy) };
    return routes;
};
