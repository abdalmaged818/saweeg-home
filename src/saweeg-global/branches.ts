import { siteConfig } from "../config/site.ts";
import { siteConfig as menuConfig, pageUrl } from "../menu/config/site.ts";
import { haramLocales } from "../menu/haram/types.ts";
import type { WorldLocale } from "./locales.ts";

export const worldLinks = Object.freeze({
  store: siteConfig.links.store, whatsapp: siteConfig.links.whatsapp,
  phone: "tel:+966570052424", instagram: "https://www.instagram.com/saweeglobal/",
  tiktok: "https://www.tiktok.com/@saweeglobal"
});
export const worldBranches = [
  {id: "maqsed", map: siteConfig.links.maqsedMap, menuLocales: menuConfig.languages.supported},
  {id: "bustan", map: siteConfig.links.bustanMap, menuLocales: menuConfig.languages.supported},
  // This approved destination is Global-only; existing production Maps links are untouched.
  {id: "haram", map: "https://maps.app.goo.gl/uWZ6hTCzjYqkamvL9", menuLocales: haramLocales}
] as const;
export type WorldBranch = typeof worldBranches[number];
export function branchMenu(branch: WorldBranch, locale: WorldLocale): string | null {
  if (!(branch.menuLocales as readonly string[]).includes(locale)) return null;
  if (branch.id === "haram") return `${siteConfig.brand.origin}/menu/haram/${locale}/`;
  if (locale !== "ar" && locale !== "en") return null;
  return pageUrl(locale, branch.id);
}
