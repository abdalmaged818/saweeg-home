export const localeCodes = ["ar", "en", "ur", "id", "bn", "tr", "fa", "fr", "ms", "ru"] as const;
export type WorldLocale = typeof localeCodes[number];
export type ReviewStatus = "pending" | "approved";
export type Direction = "rtl" | "ltr";
export type LanguageLabelKey = `world.languages.${WorldLocale}.label`;

export const languageLabels = {
  "world.languages.ar.label": "العربية", "world.languages.en.label": "English",
  "world.languages.ur.label": "اردو", "world.languages.id.label": "Bahasa Indonesia",
  "world.languages.bn.label": "বাংলা", "world.languages.tr.label": "Türkçe",
  "world.languages.fa.label": "فارسی", "world.languages.fr.label": "Français",
  "world.languages.ms.label": "Bahasa Melayu", "world.languages.ru.label": "Русский"
} as const satisfies Record<LanguageLabelKey, string>;

export interface LocaleReview {
  content: ReviewStatus;
  terminology: ReviewStatus;
  editorial: ReviewStatus;
  religious: ReviewStatus;
  direction: ReviewStatus;
  typography: ReviewStatus;
}
export interface WorldLocaleManifest extends LocaleReview {
  code: WorldLocale;
  labelKey: LanguageLabelKey;
  directionality: Direction;
  // Relative route intent only; no domain, hosting decision or generated route.
  futureRoute: `/${WorldLocale}/`;
  activation: "inactive";
  publishable: false;
  welcomePhrase: null;
}
export const localeRegistry = Object.freeze(Object.fromEntries(localeCodes.map(code => [code, Object.freeze({
  code, labelKey: `world.languages.${code}.label`,
  directionality: ["ar", "ur", "fa"].includes(code) ? "rtl" : "ltr",
  futureRoute: `/${code}/`, content: code === "ar" ? "approved" : "pending",
  terminology: code === "ar" ? "approved" : "pending", editorial: code === "ar" ? "approved" : "pending",
  religious: code === "ar" ? "approved" : "pending", direction: code === "ar" ? "approved" : "pending",
  typography: code === "ar" ? "approved" : "pending", activation: "inactive", publishable: false, welcomePhrase: null
})])) as Record<WorldLocale, WorldLocaleManifest>);
export const isWorldLocale = (value: string): value is WorldLocale => localeCodes.some(code => code === value);
