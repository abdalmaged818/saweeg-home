import type { SiteCopy } from "../types/site.ts";
import { renderLatest } from "../components/latest.ts";
import { renderPageHero } from "../components/page-hero.ts";

export const renderNewsPage = (copy: SiteCopy, homePath: string): string => `
  ${renderPageHero(copy.internal.newsEyebrow, copy.internal.newsTitle, copy.internal.newsIntro)}
  ${renderLatest(copy, "news")}
  <section class="section compact-cta-section">
    <div class="container compact-cta">
      <p>${copy.latest.description}</p>
      <a class="button button-primary" href="${homePath}">${copy.internal.backHome}</a>
    </div>
  </section>
`;

