import type { SiteCopy } from "../types/site.ts";
import { renderAboutStory } from "../components/about.ts";
import { renderPageHero } from "../components/page-hero.ts";
import { renderValues } from "../components/values.ts";

export const renderAboutPage = (copy: SiteCopy, prefix: string, homePath: string): string => `
  ${renderPageHero(copy.internal.aboutEyebrow, copy.internal.aboutTitle, copy.internal.aboutIntro)}
  ${renderAboutStory(copy, prefix)}
  ${renderValues(copy)}
  <section class="section compact-cta-section">
    <div class="container compact-cta">
      <p>${copy.hero.description}</p>
      <a class="button button-primary" href="${homePath}">${copy.internal.backHome}</a>
    </div>
  </section>
`;

