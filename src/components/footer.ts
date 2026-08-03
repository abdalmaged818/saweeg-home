import { siteConfig } from "../config/site.ts";
import { pageAvailability } from "../config/features.ts";
import type { Locale, PageId, SiteCopy } from "../types/site.ts";

interface FooterOptions {
  locale: Locale;
  page: PageId;
  copy: SiteCopy;
  prefix: string;
  pathFor: (locale: Locale, page: PageId) => string;
}

export const renderFooter = ({ locale, page, copy, prefix, pathFor }: FooterOptions): string => {
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const optionalLinks = [
    { page: "news" as const, label: copy.nav.news },
    { page: "blog" as const, label: copy.nav.blog },
    { page: "opportunities" as const, label: copy.nav.opportunities }
  ].filter(({ page: optionalPage }) => pageAvailability[optionalPage]);
  return `
    <footer class="site-footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <img src="${prefix}assets/brand/logo-saweeg.svg" alt="${copy.brandAlt}" width="88" height="88">
          <p>${copy.footer.tagline}</p>
        </div>
        <nav class="footer-nav" aria-label="${copy.navigationLabel}">
          <a href="${siteConfig.links.store}" target="_blank" rel="noopener noreferrer" data-analytics-event="store_click">${copy.destinations.cards.store.title}</a>
          <a href="${siteConfig.links.menu}" target="_blank" rel="noopener noreferrer" data-analytics-event="menu_click">${copy.destinations.cards.menu.title}</a>
          <a href="${pathFor(locale, "about")}">${copy.nav.about}</a>
          ${optionalLinks.map(({ page: optionalPage, label }) => `<a href="${pathFor(locale, optionalPage)}">${label}</a>`).join("")}
        </nav>
        <div class="footer-bottom">
          <span>${copy.footer.rights}</span>
          <a class="footer-language" href="${pathFor(otherLocale, page)}" lang="${otherLocale}" hreflang="${otherLocale}" data-locale-switch="${otherLocale}" data-analytics-event="language_switch">${copy.languageSwitch}</a>
        </div>
      </div>
    </footer>`;
};
