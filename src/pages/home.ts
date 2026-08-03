import { destinations } from "../data/destinations.ts";
import type { SiteCopy } from "../types/site.ts";
import { renderAboutPreview } from "../components/about.ts";
import { renderBranches } from "../components/branches.ts";
import { renderContact } from "../components/contact.ts";
import { renderDestinationCard } from "../components/destination-card.ts";
import { renderHero } from "../components/hero.ts";
import { renderOpportunityPreview } from "../components/opportunities.ts";

export const renderHomePage = (copy: SiteCopy, prefix: string, aboutPath: string, opportunitiesPath: string, heroImagePath: string): string => `
  ${renderHero(copy, heroImagePath)}
  <section class="destinations-section" id="destinations" aria-label="${copy.destinations.title}">
    <div class="container">
      <div class="destinations-grid">
        ${destinations.map((destination) => renderDestinationCard(destination, copy)).join("")}
      </div>
    </div>
  </section>
  ${renderBranches(copy)}
  ${renderAboutPreview(copy, prefix, aboutPath)}
  ${renderOpportunityPreview(copy, opportunitiesPath)}
  ${renderContact(copy)}
`;
