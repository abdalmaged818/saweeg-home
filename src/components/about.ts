import { aboutPageCopy } from "../content/about.ts";
import { renderResponsiveImage } from "./responsive-image.ts";
import type { SiteCopy } from "../types/site.ts";

export const renderAboutPreview = (copy: SiteCopy, prefix: string, aboutPath: string, locale: "ar" | "en"): string => `
  <section class="section about-preview" id="about" aria-labelledby="about-title">
    <div class="container about-preview-grid">
      ${renderResponsiveImage({
        prefix,
        base: "assets/participations/about-saweeg/about-saweeg-talbinah",
        alt: aboutPageCopy[locale].talbinahAlt,
        width: 1440,
        height: 1800,
        sizes: "(max-width: 899px) 100vw, 40vw",
        className: "about-preview-media",
        position: "50% 60%"
      })}
      <article class="about-copy">
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
