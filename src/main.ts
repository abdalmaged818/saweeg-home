import "./styles/main.css";
import "./styles/sabtiya.css";
import "./styles/haram-store-card.css";
import { initializeSabtiya } from "./components/sabtiya.ts";
import { bindSharedHeader } from "./components/header-controller.ts";
import { bindReturnNavigation } from "./components/return-navigation.ts";
import { siteConfig } from "./config/site.ts";
import type { Locale } from "./types/site.ts";
import { bindAnalyticsEvents, initAnalytics } from "./analytics.ts";

initAnalytics();
bindAnalyticsEvents();

bindSharedHeader();
bindReturnNavigation();
initializeSabtiya();

// Existing homepage anchors remain valid after their content gains dedicated routes.
if (document.documentElement.dataset.page === "home" && ["#branches", "#contact"].includes(location.hash)) {
  const prefix = document.documentElement.lang === "en" ? "/en" : "";
  location.replace(`${prefix}/${location.hash.slice(1)}/`);
}

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
