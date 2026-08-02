import { siteConfig } from "../config/site.ts";
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
  return `
    <footer class="site-footer">
      <img class="footer-pattern" src="${prefix}assets/brand/saweeg-pattern.svg" alt="" width="900" height="280" aria-hidden="true">
      <div class="container footer-content">
        <div class="footer-brand">
          <img src="${prefix}assets/brand/logo-saweeg.svg" alt="${copy.brandAlt}" width="88" height="88">
          <p>${copy.footer.tagline}</p>
        </div>
        <nav class="footer-nav" aria-label="${copy.navigationLabel}">
          <a href="${siteConfig.links.store}" target="_blank" rel="noopener noreferrer">${copy.destinations.cards.store.title}</a>
          <a href="${siteConfig.links.menu}" target="_blank" rel="noopener noreferrer">${copy.destinations.cards.menu.title}</a>
          <a href="${pathFor(locale, "about")}">${copy.nav.about}</a>
          <a href="${pathFor(locale, "news")}">${copy.nav.news}</a>
          <a href="${pathFor(locale, "blog")}">${copy.nav.blog}</a>
        </nav>
        <div class="footer-bottom">
          <span>${copy.footer.rights}</span>
          <a class="footer-language" href="${pathFor(otherLocale, page)}" lang="${otherLocale}" hreflang="${otherLocale}" data-locale-switch="${otherLocale}">${copy.languageSwitch}</a>
        </div>
      </div>
    </footer>`;
};
