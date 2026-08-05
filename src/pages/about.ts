import { aboutPageCopy } from "../content/about.ts";
import type { Locale } from "../types/site.ts";
import { renderPageHero } from "../components/page-hero.ts";
import { renderResponsiveImage } from "../components/responsive-image.ts";

export const renderAboutPage = (locale: Locale, prefix: string): string => {
  const copy = aboutPageCopy[locale];
  const storefront = renderResponsiveImage({
    prefix,
    base: "assets/participations/about-saweeg/about-saweeg-storefront",
    alt: copy.storefrontAlt,
    width: 1440,
    height: 2560,
    sizes: "(max-width: 899px) 100vw, 42vw",
    className: "about-story-image about-story-image--portrait",
    position: "50% 50%"
  });
  const bustan = renderResponsiveImage({
    prefix,
    base: "assets/participations/about-saweeg/about-saweeg-bustan",
    alt: copy.bustanAlt,
    width: 1440,
    height: 2560,
    sizes: "(max-width: 899px) 100vw, 42vw",
    className: "about-feature-image about-feature-image--portrait",
    position: "50% 50%"
  });
  const talbinah = renderResponsiveImage({
    prefix,
    base: "assets/participations/about-saweeg/about-saweeg-talbinah",
    alt: copy.talbinahAlt,
    width: 1440,
    height: 1800,
    sizes: "(max-width: 899px) 100vw, 42vw",
    className: "about-feature-image about-feature-image--portrait",
    position: "50% 50%"
  });

  return `${renderPageHero(copy.eyebrow, copy.title, copy.intro)}
    <section class="section about-story" aria-labelledby="about-story-title">
      <div class="container about-story-grid">
        <div class="about-story-copy">
          <h2 id="about-story-title">${copy.storyTitle}</h2>
          ${copy.story.slice(0, 2).map((paragraph) => `<p>${paragraph}</p>`).join("")}
          <blockquote><span>2022</span><p>${copy.question}</p></blockquote>
          ${copy.story.slice(2).map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
        ${storefront}
      </div>
    </section>
    <section class="section about-timeline-section" aria-labelledby="about-timeline-title">
      <div class="container">
        <div class="section-heading"><h2 id="about-timeline-title">${copy.timelineTitle}</h2></div>
        <ol class="about-timeline">
          ${copy.timeline.map((item) => `<li><span>${item.date}</span><h3>${item.title}</h3><p>${item.description}</p></li>`).join("")}
        </ol>
      </div>
    </section>
    <section class="section about-features">
      <div class="container about-features-grid">
        <article class="about-feature">${bustan}<div><h2>${copy.cityTitle}</h2><p>${copy.cityText}</p></div></article>
        <article class="about-feature">${talbinah}<div><h2>${copy.productsTitle}</h2><p>${copy.productsText}</p></div></article>
      </div>
    </section>
    <section class="section about-purpose" aria-label="${copy.visionTitle}">
      <div class="container about-purpose-grid">
        <article><h2>${copy.visionTitle}</h2><p>${copy.vision}</p></article>
        <article><h2>${copy.missionTitle}</h2><p>${copy.mission}</p></article>
        <article class="about-beliefs"><h2>${copy.beliefsTitle}</h2><ul>${copy.beliefs.map((belief) => `<li>${belief}</li>`).join("")}</ul></article>
      </div>
    </section>`;
};
