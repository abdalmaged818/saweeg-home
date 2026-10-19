import { siteConfig } from "../config/site.ts";
import type { SiteCopy } from "../types/site.ts";

export const renderHero = (copy: SiteCopy, prefix: string, aboutPath: string): string => `
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">${copy.hero.kicker}</span>
        <h1 id="hero-title">${copy.hero.title}</h1>
        <p>${copy.hero.description}</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#destinations">${copy.hero.primary}</a>
          <a class="button button-outline" href="${aboutPath}">${copy.hero.secondary}</a>
        </div>
      </div>
      <figure class="hero-media">
        <img src="${prefix}${siteConfig.assets.heroImage}" alt="${copy.hero.imageAlt}" width="1600" height="1600" fetchpriority="high" decoding="async">
      </figure>
    </div>
  </section>`;
