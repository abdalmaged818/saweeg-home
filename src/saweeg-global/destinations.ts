import {v1LocaleCodes,type WorldLocale} from "./locales.ts";

// The only public language-destination authority. Content packages remain intact.
const destinations = Object.freeze({
  ar: "/", en: "/en/", tr: "/global/tr/",
  ur: "/global/ur/", fa: "/global/fa/", id: "/global/id/"
} as const);
export function localeDestination(locale:WorldLocale):string {
  if(!Object.hasOwn(destinations,locale))throw new Error(`Locale not activated: ${locale}`);
  return destinations[locale as keyof typeof destinations];
}
export const globalContentLocales = v1LocaleCodes.filter(locale=>localeDestination(locale).startsWith("/global/"));
export const compatibilityLocales = v1LocaleCodes.filter(locale=>!globalContentLocales.includes(locale));
