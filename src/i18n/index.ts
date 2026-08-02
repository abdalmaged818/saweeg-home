import { ar } from "./ar.ts";
import { en } from "./en.ts";
import type { Locale, SiteCopy } from "../types/site.ts";

export const translations: Record<Locale, SiteCopy> = { ar, en };

export const getCopy = (locale: Locale): SiteCopy => translations[locale];
