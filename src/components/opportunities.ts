import { siteConfig } from "../config/site.ts";
import { opportunities } from "../data/opportunities.ts";
import type { OpportunityId, SiteCopy } from "../types/site.ts";
import { renderIcon } from "./icons.ts";

const featureEnabled: Record<OpportunityId, boolean> = {
  careers: siteConfig.features.careers,
  collaboration: siteConfig.features.collaboration
};

const urls: Record<OpportunityId, string> = {
  careers: siteConfig.links.careersUrl,
  collaboration: siteConfig.links.collaborationUrl
};

export const renderOpportunities = (copy: SiteCopy): string => `
  <section class="section opportunity-section" aria-labelledby="opportunities-title">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">${copy.opportunities.eyebrow}</span>
        <h2 id="opportunities-title">${copy.opportunities.title}</h2>
        <p>${copy.opportunities.description}</p>
      </div>
      <div class="opportunity-grid">
        ${opportunities.map((item) => {
          const content = copy.opportunities.cards[item.id];
          const showButton = featureEnabled[item.id] && urls[item.id].startsWith("https://");
          return `
            <article class="opportunity-card">
              <span class="opportunity-icon">${renderIcon(item.icon)}</span>
              <h3>${content.title}</h3>
              <p>${content.description}</p>
              ${showButton ? `<a class="button button-outline" href="${urls[item.id]}" target="_blank" rel="noopener noreferrer">${content.cta}</a>` : ""}
            </article>`;
        }).join("")}
      </div>
    </div>
  </section>`;

