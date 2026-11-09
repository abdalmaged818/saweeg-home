import { siteConfig } from "../config/site.ts";
import { goCopy } from "../content/go-redesign.ts";
import { pageAvailability } from "../config/features.ts";
import { renderIcon } from "./icons.ts";
import type { Locale, PageId, SiteCopy } from "../types/site.ts";

interface FooterOptions {
  locale: Locale; page: PageId; copy: SiteCopy; prefix: string;
  pathFor: (locale: Locale, page: PageId) => string;
  localeSwitchPath?: string;
}

export const renderFooter = ({locale,page,copy,prefix,pathFor,localeSwitchPath}: FooterOptions): string => {
  const other = locale === "ar" ? "en" : "ar", ui = goCopy[locale];
  return `<footer class="site-footer"><div class="container footer-content">
    <div class="footer-identity">
      <div class="footer-brand"><img src="${prefix}assets/brand/logo-saweeg.svg" alt="${copy.brandAlt}" width="88" height="88"><div><p class="footer-tagline">${ui.footerMain}</p><p class="footer-subtitle">${ui.footerSub}</p></div></div>
      <div class="footer-social">
        ${[["whatsapp",siteConfig.links.whatsapp,copy.contact.whatsapp],["tiktok",siteConfig.links.tiktok,copy.contact.tiktok],["x",siteConfig.links.x,"X"],["arrow","https://linktr.ee/saweeg",ui.links]].map(([icon,href,label]) => `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}">${renderIcon(icon as "whatsapp" | "tiktok" | "x" | "arrow")}</a>`).join("")}
      </div>
    </div>
    <nav class="footer-nav" aria-label="${copy.navigationLabel}"><h2 class="footer-nav-title">${ui.links}</h2>
      <a href="${pathFor(locale,"home")}">${copy.nav.home}</a><a href="${locale === "en" ? "/menu/en/" : siteConfig.links.menu}" data-analytics-event="menu_click">${ui.menu}</a>
      <a href="${pathFor(locale,"branches")}">${ui.branches}</a><a href="${pathFor(locale,"about")}">${copy.nav.about}</a>
      ${pageAvailability.news ? `<a href="${pathFor(locale,"news")}">${copy.nav.news}</a>` : ""}
      <a href="${pathFor(locale,"contact")}">${copy.nav.contact}</a>
    </nav>
    <nav class="footer-order" aria-label="${ui.order}"><h2>${ui.order}</h2>
      <a href="${siteConfig.links.store}" target="_blank" rel="noopener noreferrer" data-analytics-event="store_click">${ui.gates[2].title}<span aria-hidden="true">↗</span></a>
      <a href="${siteConfig.links.hungerstation}" target="_blank" rel="noopener noreferrer" data-analytics-event="hungerstation_click">${copy.destinations.cards.delivery.hungerstation}</a>
      <a href="${siteConfig.links.keeta}" target="_blank" rel="noopener noreferrer" data-analytics-event="keeta_click">${copy.destinations.cards.delivery.keeta}</a>
    </nav>
    <section class="footer-downloads" aria-labelledby="footer-profiles-heading"><h2 id="footer-profiles-heading">${copy.footer.profilesHeading}</h2><div class="footer-downloads__links">
      <a href="/assets/documents/saweeg-official-profile-2026.pdf" download="saweeg-official-profile-2026.pdf">${renderIcon("menu","footer-download-icon")}<span class="footer-download-label">${copy.footer.officialProfile}<small class="footer-download-badge">PDF</small></span></a>
      <a href="/assets/documents/saweeg-hotels-hospitality-profile-2026.pdf" download="saweeg-hotels-hospitality-profile-2026.pdf">${renderIcon("menu","footer-download-icon")}<span class="footer-download-label">${copy.footer.hospitalityProfile}<small class="footer-download-badge">PDF</small></span></a>
    </div></section>
    <div class="footer-bottom"><span>${copy.footer.rights}</span><a class="footer-language" href="${localeSwitchPath ?? pathFor(other,page)}" lang="${other}" hreflang="${other}" data-locale-switch="${other}" data-analytics-event="language_switch">${copy.languageSwitch}</a></div>
  </div></footer>`;
};
