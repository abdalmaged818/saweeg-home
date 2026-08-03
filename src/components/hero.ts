import type { SiteCopy } from "../types/site.ts";

export const renderHero = (copy: SiteCopy, heroImagePath: string): string => `
  <section class="hero${heroImagePath ? " hero--with-image" : " hero--text-only"}" aria-labelledby="hero-title">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">${copy.hero.kicker}</span>
        <h1 id="hero-title">${copy.hero.title}</h1>
        <p>${copy.hero.description}</p>
      </div>
      ${heroImagePath ? `
        <figure class="hero-media">
          <img src="${heroImagePath}" alt="${copy.hero.imageAlt}" width="1600" height="1600" fetchpriority="high" decoding="async">
        </figure>` : ""}
    </div>
  </section>`;
