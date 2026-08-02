import type { SiteCopy } from "../types/site.ts";

export const renderAboutPreview = (copy: SiteCopy, prefix: string, aboutPath: string): string => `
  <section class="section" id="about" aria-labelledby="about-title">
    <div class="container about-grid">
      <article class="surface-card about-copy">
        <span class="eyebrow">${copy.about.eyebrow}</span>
        <h2 id="about-title">${copy.about.title}</h2>
        <p>${copy.about.short}</p>
        <a class="text-link" href="${aboutPath}">${copy.about.cta}<span aria-hidden="true">↗</span></a>
      </article>
      <div class="brand-composition" role="img" aria-label="${copy.about.visualLabel}">
        <span class="composition-orbit composition-orbit--one"></span>
        <span class="composition-orbit composition-orbit--two"></span>
        <img src="${prefix}assets/brand/saweeg-star.svg" alt="" width="160" height="160">
      </div>
    </div>
  </section>`;

export const renderAboutStory = (copy: SiteCopy, prefix: string): string => `
  <section class="section story-section" aria-labelledby="story-title">
    <div class="container story-grid">
      <div class="story-copy">
        <span class="eyebrow">${copy.about.eyebrow}</span>
        <h2 id="story-title">${copy.about.title}</h2>
        <p>${copy.about.paragraphOne}</p>
        <p>${copy.about.paragraphTwo}</p>
      </div>
      <div class="story-mark" aria-hidden="true">
        <img src="${prefix}assets/brand/saweeg-star.svg" alt="" width="220" height="220">
      </div>
    </div>
  </section>`;

