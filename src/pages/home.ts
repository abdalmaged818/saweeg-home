import { goCopy } from "../content/go-redesign.ts";
import { siteConfig } from "../config/site.ts";
import { renderIcon } from "../components/icons.ts";
import { renderHaramStoreCard } from "../components/haram-store-card.ts";
import { createPathFor } from "./routes.ts";
import type { Locale, SiteCopy } from "../types/site.ts";

export const renderHomePage = (locale: Locale, _copy: SiteCopy, prefix: string, _about: string, _opportunities: string): string => {
  const ui = goCopy[locale];
  const pathFor = createPathFor(prefix);
  const destinations = [
    { href: locale === "en" ? "/menu/en/" : siteConfig.links.menu, icon: "menu" as const, event: "menu_click", external: false },
    { href: pathFor(locale, "branches"), icon: "pin" as const, event: undefined, external: false },
    { href: siteConfig.links.store, icon: "bag" as const, event: "store_click", external: true }
  ];
  return `<div class="go-home">
    <section class="welcome container" aria-labelledby="welcome-title"><h1 id="welcome-title">${ui.welcome}</h1><p>${ui.welcomeSub}</p></section>
    <nav class="container home-destinations" id="destinations" aria-label="${locale === "ar" ? "الوجهات الرئيسية" : "Main destinations"}"><ul class="destination-gates">
      ${destinations.map((destination,index) => {
        const text = ui.gates[index];
        return `<li><a class="destination-gate" href="${destination.href}"${destination.external ? ' target="_blank" rel="noopener noreferrer"' : ""}${destination.event ? ` data-analytics-event="${destination.event}"` : ""}>
          <span class="icon-chip">${renderIcon(destination.icon)}</span><span class="destination-gate__copy"><strong>${text.title}</strong><span>${text.text}</span></span>
          <span class="destination-gate__meta"${index === 2 ? ' dir="ltr"' : ""}>${text.meta}</span>
          <span class="destination-gate__cta">${text.cta}${destination.external ? '<span aria-hidden="true">↗</span>' : ""}</span>
          <span class="destination-gate__arrow" aria-hidden="true">${destination.external ? "↗" : locale === "ar" ? "←" : "→"}</span>
        </a></li>`;
      }).join("")}
    </ul></nav>
    ${locale === "ar" ? `<section class="home-announcements container" aria-label="إعلانات سويق">${renderHaramStoreCard()}<template id="sabtiya-slot"></template></section>` : ""}
  </div>`;
};
