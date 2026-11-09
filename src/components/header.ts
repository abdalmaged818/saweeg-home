import { siteConfig } from "../config/site.ts";
import { goCopy } from "../content/go-redesign.ts";
import { pageAvailability } from "../config/features.ts";
import type { Locale, PageId, SiteCopy } from "../types/site.ts";

interface HeaderOptions {
  locale: Locale; page: PageId; copy: SiteCopy; prefix: string;
  pathFor: (locale: Locale, page: PageId) => string;
  localeSwitchPath?: string;
}

export const renderHeader = ({locale,page,copy,prefix,pathFor,localeSwitchPath}: HeaderOptions): string => {
  const other = locale === "ar" ? "en" : "ar";
  const ui = goCopy[locale];
  const entries = [
    {id:"home",label:copy.nav.home,href:pathFor(locale,"home")},
    {id:"menu",label:ui.menu,href:locale === "en" ? "/menu/en/" : siteConfig.links.menu},
    {id:"branches",label:ui.branches,href:pathFor(locale,"branches")},
    {id:"about",label:copy.nav.about,href:pathFor(locale,"about")},
    ...(pageAvailability.news ? [{id:"news",label:copy.nav.news,href:pathFor(locale,"news")}] : []),
    {id:"contact",label:copy.nav.contact,href:pathFor(locale,"contact")}
  ];
  const navigation = entries.map(item => `<a href="${item.href}"${page === item.id ? ' aria-current="page"' : ""}>${item.label}</a>`).join("");
  return `<header class="site-header" data-site-header>
    <div class="container header-inner">
      <a class="brand" href="${pathFor(locale,"home")}" aria-label="${copy.nav.home}"><img src="${prefix}assets/brand/logo-saweeg.svg" alt="${copy.brandAlt}" width="72" height="72"></a>
      <nav class="desktop-nav" aria-label="${copy.navigationLabel}">${navigation}</nav>
      <div class="header-actions">
        <a class="button button-primary header-store" href="${siteConfig.links.store}" target="_blank" rel="noopener noreferrer" data-analytics-event="store_click">${ui.gates[2].title}</a>
        <a class="language-link" href="${localeSwitchPath ?? pathFor(other,page)}" lang="${other}" hreflang="${other}" data-locale-switch="${other}" data-analytics-event="language_switch">${copy.languageSwitch}</a>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-navigation" aria-label="${copy.menuLabel}" data-open-label="${copy.menuLabel}" data-close-label="${copy.closeMenuLabel}" data-menu-button><span></span><span></span><span></span></button>
      </div>
    </div>
    <div class="mobile-navigation" id="mobile-navigation" hidden data-mobile-navigation><nav class="container mobile-navigation-inner" aria-label="${copy.navigationLabel}">${navigation}
      <a href="${siteConfig.links.store}" target="_blank" rel="noopener noreferrer" data-analytics-event="store_click">${ui.gates[2].title}<span aria-hidden="true">↗</span></a>
    </nav></div>
  </header>`;
};
