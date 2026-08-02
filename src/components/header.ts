import type { Locale, PageId, SiteCopy } from "../types/site.ts";

interface HeaderOptions {
  locale: Locale;
  page: PageId;
  copy: SiteCopy;
  prefix: string;
  pathFor: (locale: Locale, page: PageId) => string;
}

export const renderHeader = ({ locale, page, copy, prefix, pathFor }: HeaderOptions): string => {
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const home = pathFor(locale, "home");
  const navItems = [
    ["home", copy.nav.home],
    ["about", copy.nav.about],
    ["news", copy.nav.news],
    ["blog", copy.nav.blog]
  ] as const;

  const navigation = navItems.map(([id, label]) => `
    <a href="${pathFor(locale, id)}"${page === id ? ' aria-current="page"' : ""}>${label}</a>`).join("");

  return `
    <header class="site-header" data-site-header>
      <div class="container header-inner">
        <a class="brand" href="${home}" aria-label="${copy.nav.home}">
          <img src="${prefix}assets/brand/logo-saweeg.svg" alt="${copy.brandAlt}" width="72" height="72">
        </a>
        <nav class="desktop-nav" aria-label="${copy.navigationLabel}">${navigation}
          <a href="${home}#contact">${copy.nav.contact}</a>
        </nav>
        <div class="header-actions">
          <a class="language-link" href="${pathFor(otherLocale, page)}" lang="${otherLocale}" hreflang="${otherLocale}" data-locale-switch="${otherLocale}">${copy.languageSwitch}</a>
          <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-navigation" aria-label="${copy.menuLabel}" data-open-label="${copy.menuLabel}" data-close-label="${copy.closeMenuLabel}" data-menu-button>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
      <div class="mobile-navigation" id="mobile-navigation" hidden data-mobile-navigation>
        <nav class="container mobile-navigation-inner" aria-label="${copy.navigationLabel}">${navigation}
          <a href="${home}#contact">${copy.nav.contact}</a>
        </nav>
      </div>
    </header>`;
};
