import { siteConfig } from "../config/site.ts";
import { participationArticles, participationsUi } from "../content/participations.ts";
import type { Participation } from "../data/participations.ts";
import type { Locale } from "../types/site.ts";
import { renderResponsiveImage } from "../components/responsive-image.ts";

interface ParticipationPageOptions {
  participation: Participation;
  locale: Locale;
  prefix: string;
  homePath: string;
  participationsPath: string;
  aboutPath: string;
}

export const renderParticipationPage = ({
  participation,
  locale,
  prefix,
  homePath,
  participationsPath,
  aboutPath
}: ParticipationPageOptions): string => {
  const ui = participationsUi[locale];
  const article = participationArticles[participation.slug][locale];
  const title = locale === "ar" ? participation.titleAr : participation.titleEn;
  const heroAlt = locale === "ar" ? participation.heroAltAr : participation.heroAltEn;
  const gallery = participation.gallery.map((image) => renderResponsiveImage({
    prefix,
    base: image.src,
    alt: locale === "ar" ? image.altAr : image.altEn,
    width: image.width,
    height: image.height,
    sizes: "(max-width: 699px) 100vw, 50vw",
    className: `participation-gallery-image participation-gallery-image--${image.aspect}`,
    position: image.position
  })).join("");

  return `<article class="participation-article">
    <div class="container participation-shell">
      <nav class="breadcrumbs" aria-label="${ui.breadcrumbParticipations}">
        <a href="${homePath}">${ui.breadcrumbHome}</a><span aria-hidden="true">/</span>
        <a href="${participationsPath}">${ui.breadcrumbParticipations}</a><span aria-hidden="true">/</span>
        <span aria-current="page">${title}</span>
      </nav>
      <header class="participation-hero participation-hero--${participation.heroAspect}">
        <div class="participation-hero-copy">
          <div class="participation-hero-meta">
            <span>${ui.categories[participation.category]}</span><span aria-hidden="true">•</span><span>${participation.year}</span>
          </div>
          <h1>${title}</h1>
          <p>${article.intro}</p>
        </div>
        ${renderResponsiveImage({
          prefix,
          base: participation.heroImage,
          alt: heroAlt,
          width: participation.heroWidth,
          height: participation.heroHeight,
          sizes: "(max-width: 899px) 100vw, 48vw",
          className: `participation-hero-media participation-hero-media--${participation.heroAspect}`,
          position: participation.heroPosition,
          loading: "eager",
          fetchPriority: "high"
        })}
      </header>
      <div class="participation-body">
        ${article.sections.map((section) => `<section>
          <h2>${section.title}</h2>
          ${section.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </section>`).join("")}
        <aside class="participation-closing">
          <span>${ui.closingLabel}</span>
          <p>${article.closing}</p>
        </aside>
      </div>
      <section class="participation-gallery" aria-labelledby="participation-gallery-title">
        <h2 id="participation-gallery-title">${ui.galleryTitle}</h2>
        <div class="participation-gallery-grid">${gallery}</div>
      </section>
      <section class="participation-cta" aria-labelledby="participation-cta-title">
        <div>
          <span class="eyebrow eyebrow--dark">${ui.homeEyebrow}</span>
          <h2 id="participation-cta-title">${ui.ctaTitle}</h2>
          <p>${ui.ctaDescription}</p>
        </div>
        <div class="button-row">
          <a class="button button-light" href="${siteConfig.links.menu}" target="_blank" rel="noopener noreferrer">${ui.ctaMenu}</a>
          <a class="button button-on-dark" href="${aboutPath}">${ui.ctaAbout}</a>
          <a class="button button-on-dark" href="${homePath}#contact">${ui.ctaContact}</a>
        </div>
      </section>
    </div>
  </article>`;
};
