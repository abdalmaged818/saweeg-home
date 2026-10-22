import {activeLocaleCodes,type WorldLocale} from "./locales.ts";

// The only public language-destination authority. Content packages remain intact.
const destinations = Object.freeze({
  ar: "/", en: "/en/", tr: "/global/tr/",
  ur: "/global/ur/", fa: "/global/fa/", id: "/global/id/",
  bn: "/global/bn/", fr: "/global/fr/", ms: "/global/ms/", ru: "/global/ru/"
} as const);
export function localeDestination(locale:WorldLocale):string {
  if(!Object.hasOwn(destinations,locale))throw new Error(`Locale not activated: ${locale}`);
  return destinations[locale as keyof typeof destinations];
}
export const globalContentLocales = activeLocaleCodes.filter(locale=>localeDestination(locale).startsWith("/global/"));
export const compatibilityLocales = activeLocaleCodes.filter(locale=>!globalContentLocales.includes(locale));
