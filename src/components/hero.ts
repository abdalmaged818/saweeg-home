import type { SiteCopy } from "../types/site.ts";

export const renderHero = (copy: SiteCopy, prefix: string, aboutPath: string): string => `
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-decoration" aria-hidden="true">
      <span class="hero-ring"></span>
      <img src="${prefix}assets/brand/saweeg-star.svg" alt="" width="320" height="320">
    </div>
    <div class="container hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">${copy.hero.kicker}</span>
        <h1 id="hero-title">${copy.hero.title}</h1>
        <p>${copy.hero.description}</p>
        <div class="button-row">
          <a class="button button-primary" href="#destinations">${copy.hero.primary}</a>
          <a class="button button-outline" href="${aboutPath}">${copy.hero.secondary}</a>
        </div>
      </div>
      <div class="hero-balance" aria-hidden="true"></div>
    </div>
  </section>`;

