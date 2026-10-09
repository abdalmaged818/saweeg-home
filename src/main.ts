import "./styles/main.css";
import "./styles/sabtiya.css";
import { initializeSabtiya } from "./components/sabtiya.ts";
import { bindSharedHeader } from "./components/header-controller.ts";
import { siteConfig } from "./config/site.ts";
import type { Locale } from "./types/site.ts";
import { bindAnalyticsEvents, initAnalytics } from "./analytics.ts";

initAnalytics();
bindAnalyticsEvents();

bindSharedHeader();
initializeSabtiya();

document.querySelectorAll<HTMLElement>("[data-locale-switch]").forEach((link) => {
  link.addEventListener("click", () => {
    const locale = link.dataset.localeSwitch as Locale | undefined;
    if (locale) localStorage.setItem(siteConfig.localeStorageKey, locale);
  });
});

const currentLocale = document.documentElement.lang as Locale;
if (currentLocale === "ar" || currentLocale === "en") {
  localStorage.setItem(siteConfig.localeStorageKey, currentLocale);
}
