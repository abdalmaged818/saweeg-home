import { arabicMaster, requiredContentKeys, type WorldContent } from "./content/ar.ts";
import { localeRegistry, v1LocaleCodes, isV1Locale, type LocaleReview, type WorldLocale } from "./locales.ts";
import type {WorldDisplayContent} from "./content/types.ts";
import { wave1Content, wave1Metadata } from "./content/wave1.generated.ts";

export interface TranslationPackage {
  locale: WorldLocale;
  content: Readonly<Record<string, string>>;
  review: LocaleReview;
  provenance: { reviewer: string; revision: string };
}
// Exact generated review packages; no inherited dictionary or fallback lookup.
export const translationPackages: Readonly<Partial<Record<WorldLocale, TranslationPackage>>> = Object.freeze({
  ar: Object.freeze({locale: "ar", content: arabicMaster, review: localeRegistry.ar,
    provenance: {reviewer: "Management-approved Arabic master", revision: "2026-10-20"}}),
  ...Object.fromEntries(Object.entries(wave1Content).map(([locale,content])=>[locale,Object.freeze({
    locale,content,review:localeRegistry[locale as WorldLocale],
    provenance:{reviewer:wave1Metadata[locale as keyof typeof wave1Metadata].specialist_role,revision:"wave1-owner-review"}
  })]))
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
  const pack=translationPackages[locale];
  const issues=packageIssues(locale,pack).filter(issue=>!issue.startsWith("review:"));
  if(!isV1Locale(locale)||localeRegistry[locale].activation!=="active"||localeRegistry[locale].publicationScope!=="v1-original-hadith-only")issues.push("v1-inactive");
  if(pack&&JSON.stringify(Object.keys(pack.content))!==JSON.stringify(requiredContentKeys))issues.push("content-order");
  if(locale!=="ar"&&pack?.review.content!=="ready-for-owner-review")issues.push("not-owner-authorized-wave1");
  return issues;
}
export const publishableLocales = (): WorldLocale[] => [...v1LocaleCodes];
export function assertPublicActivation(locale: WorldLocale): void {
  const issues=publicationIssues(locale);
  if(issues.length)throw new Error(`Saweeg Global is not activated: ${locale} (${issues.join(",")})`);
}
// Build-time projection, not a public translation bundle. Full approval above remains strict.
export function publicV1Content(locale:WorldLocale):WorldDisplayContent {
  assertPublicActivation(locale);
  const {"world.talbinah.hadithTranslation":unapprovedMeaning,...content}=translationPackages[locale]!.content;
  void unapprovedMeaning;
  return content as WorldDisplayContent;
}
