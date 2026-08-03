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
      <div class="about-brand-panel">
        <img src="${prefix}assets/brand/logo-saweeg.svg" alt="${copy.brandAlt}" width="220" height="220">
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
      <article class="brand-definition">
        <img src="${prefix}assets/brand/logo-saweeg.svg" alt="${copy.brandAlt}" width="180" height="180">
        <h2>${copy.about.brandDefinitionTitle}</h2>
        <p>${copy.about.brandDefinition}</p>
      </article>
    </div>
  </section>`;
