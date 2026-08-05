import { siteConfig } from "../config/site.ts";
import type { Destination, SiteCopy } from "../types/site.ts";

export const renderDestinationCard = (destination: Destination, copy: SiteCopy): string => {
  const content = copy.destinations.cards[destination.id];

  if (destination.id === "delivery") {
    return `
      <article class="destination-card destination-card--delivery">
        <h3>${content.title}</h3>
        <p>${content.description}</p>
        <div class="delivery-actions">
          <a class="button button-soft" href="${siteConfig.links.hungerstation}" target="_blank" rel="noopener noreferrer" data-analytics-event="hungerstation_click">${content.hungerstation}</a>
          <a class="button button-soft" href="${siteConfig.links.keeta}" target="_blank" rel="noopener noreferrer" data-analytics-event="keeta_click">${content.keeta}</a>
        </div>
      </article>`;
  }

  const href = destination.id === "store" ? siteConfig.links.store : siteConfig.links.menu;
  const analyticsEvent = destination.id === "store" ? "store_click" : "menu_click";
  return `
    <article class="destination-card destination-card--${destination.tone}">
      <h3>${content.title}</h3>
      <p>${content.description}</p>
      <a class="button ${destination.id === "store" ? "button-light" : "button-primary"}" href="${href}" target="_blank" rel="noopener noreferrer" data-analytics-event="${analyticsEvent}">
        ${content.cta}
      </a>
    </article>`;
};
