import { arabicMaster, requiredContentKeys, type WorldContent } from "./content/ar.ts";
import { localeRegistry, type LocaleReview, type WorldLocale } from "./locales.ts";

export interface TranslationPackage {
  locale: WorldLocale;
  content: Readonly<Record<string, string>>;
  review: LocaleReview;
  provenance: { reviewer: string; revision: string };
}
// No English draft, inherited dictionary, get-or-default lookup or translation inference.
export const translationPackages: Readonly<Partial<Record<WorldLocale, TranslationPackage>>> = Object.freeze({
  ar: Object.freeze({locale: "ar", content: arabicMaster, review: localeRegistry.ar,
    provenance: {reviewer: "Management-approved Arabic master", revision: "2026-10-20"}})
});
export function packageIssues(locale: WorldLocale, pack?: TranslationPackage): string[] {
  if (!pack) return ["missing-package"];
  const issues: string[] = [];
  if (pack.locale !== locale) issues.push("wrong-locale");
  if (!pack.provenance.reviewer.trim() || !pack.provenance.revision.trim()) issues.push("missing-provenance");
  for (const key of requiredContentKeys) {
    const value = Object.hasOwn(pack.content, key) ? pack.content[key] : undefined;
    if (typeof value !== "string" || !value.trim()) issues.push(`missing:${key}`);
    else if (/world\.[a-z]|translation pending|prototype only/i.test(value)) issues.push(`unresolved:${key}`);
  }
  for (const key of Object.keys(pack.content)) if (!requiredContentKeys.includes(key as keyof WorldContent)) issues.push(`unknown:${key}`);
  for (const review of ["content", "terminology", "editorial", "direction", "typography"] as const) {
    if (pack.review[review] !== "approved") issues.push(`review:${review}`);
  }
  // Independent religious approval is mandatory even when ordinary content is complete.
  if (pack.review.religious !== "approved") issues.push("review:religious");
  if (locale !== "ar" && requiredContentKeys.every(key=>pack.content[key]===arabicMaster[key])) issues.push("master-fallback");
  return issues;
}
export function approvedContent(locale: WorldLocale): WorldContent {
  const pack = translationPackages[locale];
  const issues = packageIssues(locale, pack);
  if (issues.length || !pack) throw new Error(`Locale unavailable: ${locale} (${issues.join(",")})`);
  return pack.content as WorldContent;
}
export function publicationIssues(locale: WorldLocale): string[] {
  return [...packageIssues(locale, translationPackages[locale]), ...(
    localeRegistry[locale].activation === "inactive" ? ["phase-1-inactive"] : [])];
}
export const publishableLocales = (): WorldLocale[] => [];
export function assertPublicActivation(locale: WorldLocale): never {
  throw new Error(`Saweeg Global is not activated: ${locale} (${publicationIssues(locale).join(",")})`);
}
