import type { Locale } from "../types/site.ts";
import { renderParticipationsListing } from "../components/participations.ts";

export const renderNewsPage = (locale: Locale, prefix: string): string => renderParticipationsListing(locale, prefix);
