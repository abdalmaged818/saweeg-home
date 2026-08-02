import { destinations } from "../data/destinations.ts";
import type { Locale, SiteCopy } from "../types/site.ts";
import { renderAboutPreview } from "../components/about.ts";
import { renderBranches } from "../components/branches.ts";
import { renderContact } from "../components/contact.ts";
import { renderDestinationCard } from "../components/destination-card.ts";
import { renderHero } from "../components/hero.ts";
import { renderLatest } from "../components/latest.ts";
import { renderOpportunities } from "../components/opportunities.ts";
import { renderQuickLinks } from "../components/quick-links.ts";
import { renderValues } from "../components/values.ts";

export const renderHomePage = (locale: Locale, copy: SiteCopy, prefix: string, aboutPath: string): string => `
  ${renderHero(copy, prefix, aboutPath)}
  <section class="section destinations-section" id="destinations" aria-labelledby="destinations-title">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">${copy.destinations.eyebrow}</span>
        <h2 id="destinations-title">${copy.destinations.title}</h2>
        <p>${copy.destinations.description}</p>
      </div>
      <div class="destinations-grid">
        ${destinations.map((destination) => renderDestinationCard(destination, copy)).join("")}
      </div>
    </div>
  </section>
  ${renderQuickLinks(copy)}
  <div class="pattern-divider" aria-hidden="true">
    <img src="${prefix}assets/brand/saweeg-pattern.svg" alt="" width="900" height="280">
  </div>
  ${renderAboutPreview(copy, prefix, aboutPath)}
  ${renderValues(copy)}
  ${renderLatest(copy)}
  ${renderOpportunities(copy)}
  ${renderBranches(copy)}
  ${renderContact(copy)}
`;

