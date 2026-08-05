import type { SiteCopy } from "../types/site.ts";

export const renderAboutPreview = (copy: SiteCopy, _prefix: string, aboutPath: string): string => `
  <section class="section" id="about" aria-labelledby="about-title">
    <div class="container about-preview-grid">
      <article class="surface-card about-copy">
        <span class="eyebrow">${copy.about.eyebrow}</span>
        <h2 id="about-title">${copy.about.title}</h2>
        <p>${copy.about.short}</p>
        <a class="text-link" href="${aboutPath}">${copy.about.cta}<span aria-hidden="true">↗</span></a>
      </article>
    </div>
  </section>`;

export const renderAboutStory = (copy: SiteCopy, heroImagePath: string): string => `
  <section class="section story-section" aria-labelledby="story-title">
    <div class="container story-stack">
      <div class="story-copy">
        <h2 id="story-title">${copy.about.storyTitle}</h2>
        <p>${copy.about.paragraphOne}</p>
        <p>${copy.about.paragraphTwo}</p>
      </div>
      <figure class="about-image-card" id="city-image">
        <img src="${heroImagePath}" alt="${copy.hero.imageAlt}" width="1600" height="1600" loading="lazy" decoding="async">
      </figure>
      <article class="brand-definition">
        <h2>${copy.about.brandDefinitionTitle}</h2>
        <p>${copy.about.brandDefinition}</p>
      </article>
    </div>
  </section>`;
