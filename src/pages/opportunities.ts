import type { SiteCopy } from "../types/site.ts";
import { renderOpportunities } from "../components/opportunities.ts";
import { renderPageHero } from "../components/page-hero.ts";

export const renderOpportunitiesPage = (copy: SiteCopy, homePath: string): string => `
  ${renderPageHero(copy.opportunities.pageEyebrow, copy.opportunities.pageTitle, copy.opportunities.pageIntro)}
  ${renderOpportunities(copy)}
  <section class="section compact-cta-section">
    <div class="container compact-cta">
      <p>${copy.opportunities.homeDescription}</p>
      <a class="button button-primary" href="${homePath}">${copy.internal.backHome}</a>
    </div>
  </section>
`;
