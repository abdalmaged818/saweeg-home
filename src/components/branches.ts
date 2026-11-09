import { siteConfig } from "../config/site.ts";
import { goCopy } from "../content/go-redesign.ts";
import { renderIcon } from "./icons.ts";
import { branches } from "../data/branches.ts";
import type { BranchId, Locale, SiteCopy } from "../types/site.ts";

const locations: Record<BranchId,string> = {maqsed:siteConfig.links.maqsedMap,bustan:siteConfig.links.bustanMap,haram:siteConfig.links.haramMap};
const menus: Record<BranchId,string> = {maqsed:siteConfig.links.maqsedMenu,bustan:siteConfig.links.bustanMenu,haram:siteConfig.links.haramMenu};

export const renderBranches = (copy: SiteCopy, locale: Locale = "ar", asPage = false): string => {
  const ui = goCopy[locale], heading = asPage ? "h1" : "h2";
  return `<section class="branches-section container" id="branches" aria-labelledby="branches-title">
    <div class="section-heading"><span class="eyebrow">${copy.branches.eyebrow}</span><${heading} id="branches-title">${ui.branchesTitle}</${heading}><p>${copy.branches.description}</p></div>
    <div class="branches-grid">${branches.map(branch => {
      const menu = locale === "en" && branch.id !== "haram" ? menus[branch.id].replace("/menu/?","/menu/en/?") : menus[branch.id];
      return `<article class="branch-card" id="branch-${branch.id}" aria-labelledby="branch-title-${branch.id}">
        <h2 id="branch-title-${branch.id}">${ui.branchNames[branch.id]}</h2><p class="branch-card__line">${ui.branchLines[branch.id]}</p>
        <p class="branch-card__location">${renderIcon("pin")}${ui.branchLocations[branch.id]}</p>
        <section class="branch-hours${branch.id === "haram" ? " branch-hours--always" : ""}" aria-label="${ui.hours}"><h3>${ui.hours}</h3>
          ${branch.id === "haram" ? `<p class="always-time"><strong dir="ltr">24</strong><span>${ui.hourUnit}</span></p><p class="always-caption">${ui.aroundClock}</p>` : `<dl>${ui.schedules[branch.id].map(([label,time]) => `<div><dt>${label}</dt><dd>${time}</dd></div>`).join("")}</dl>`}
        </section>
        <div class="branch-actions"><a class="button button-primary" href="${menu}" data-analytics-event="branch_menu_click" data-analytics-label="${branch.id}">${branch.id === "haram" ? copy.branches.haramMenuCta : copy.branches.menuCta}</a>
          <a class="button button-outline" href="${locations[branch.id]}" target="_blank" rel="noopener noreferrer" data-analytics-event="branch_map_click" data-analytics-label="${branch.id}">${copy.branches.locationCtas[branch.id] ?? copy.branches.locationCta}<span aria-hidden="true">↗</span></a>
        </div></article>`;
    }).join("")}</div>
  </section>`;
};
