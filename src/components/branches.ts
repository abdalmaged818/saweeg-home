import { siteConfig } from "../config/site.ts";
import { branches } from "../data/branches.ts";
import type { BranchId, SiteCopy } from "../types/site.ts";

const locations: Record<BranchId, string> = {
  maqsed: siteConfig.links.maqsedMap,
  bustan: siteConfig.links.bustanMap
};

const menus: Record<BranchId, string> = {
  maqsed: siteConfig.links.maqsedMenu,
  bustan: siteConfig.links.bustanMenu
};

export const renderBranches = (copy: SiteCopy): string => `
  <section class="section branches-section" id="branches" aria-labelledby="branches-title">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">${copy.branches.eyebrow}</span>
        <h2 id="branches-title">${copy.branches.title}</h2>
        <p>${copy.branches.description}</p>
      </div>
      <div class="branches-grid">
        ${branches.map((branch) => `
          <article class="branch-card">
            <h3>${copy.branches.names[branch.id]}</h3>
            <div class="branch-actions">
              <a class="button button-primary" href="${locations[branch.id]}" target="_blank" rel="noopener noreferrer">${copy.branches.locationCta}</a>
              <a class="button button-soft" href="${menus[branch.id]}" target="_blank" rel="noopener noreferrer">${copy.branches.menuCta}</a>
            </div>
          </article>`).join("")}
      </div>
    </div>
  </section>`;
