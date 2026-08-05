import type { SiteCopy } from "../types/site.ts";

export const renderHero = (copy: SiteCopy): string => `
  <section class="hero hero--text-only" aria-labelledby="hero-title">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">${copy.hero.kicker}</span>
        <h1 id="hero-title">${copy.hero.title}</h1>
        <p>${copy.hero.description}</p>
      </div>
    </div>
  </section>`;
