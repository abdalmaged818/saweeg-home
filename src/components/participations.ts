import { publishedParticipations, type Participation } from "../data/participations.ts";
import { participationsUi } from "../content/participations.ts";
import type { Locale } from "../types/site.ts";
import { createPathFor, participationPathFor } from "../pages/routes.ts";
import { renderResponsiveImage } from "./responsive-image.ts";

const titleFor = (item: Participation, locale: Locale): string => locale === "ar" ? item.titleAr : item.titleEn;
const excerptFor = (item: Participation, locale: Locale): string => locale === "ar" ? item.excerptAr : item.excerptEn;
const altFor = (item: Participation, locale: Locale): string => locale === "ar" ? item.heroAltAr : item.heroAltEn;

const renderCard = (item: Participation, locale: Locale, prefix: string, variant: "home" | "listing"): string => {
  const ui = participationsUi[locale];
  const path = participationPathFor(prefix, locale, item.slug);
  const mediaClass = `participation-card-media participation-card-media--${item.heroAspect}`;
  return `<article class="participation-card participation-card--${variant}">
    <a class="participation-card-image-link" href="${path}" aria-label="${titleFor(item, locale)}">
      ${renderResponsiveImage({
        prefix,
        base: item.heroImage,
        alt: altFor(item, locale),
        width: item.heroWidth,
        height: item.heroHeight,
        sizes: variant === "home" ? "(max-width: 699px) 112px, 31vw" : "(max-width: 699px) 100vw, 46vw",
        className: mediaClass,
        position: item.heroPosition
      })}
    </a>
    <div class="participation-card-body">
      <div class="participation-card-meta">
        <span>${ui.categories[item.category]}</span><span aria-hidden="true">•</span><span>${item.year}</span>
      </div>
      <h3><a href="${path}">${titleFor(item, locale)}</a></h3>
      <p>${excerptFor(item, locale)}</p>
      <a class="text-link" href="${path}">${ui.readMore}<span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
};

export const renderHomeParticipations = (locale: Locale, prefix: string): string => {
  const ui = participationsUi[locale];
  const selected = [
    publishedParticipations[0],
    publishedParticipations[2],
    publishedParticipations[1]
  ];
  return `<section class="section participations-home" aria-labelledby="participations-home-title">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">${ui.homeEyebrow}</span>
        <h2 id="participations-home-title">${ui.homeTitle}</h2>
        <p>${ui.homeDescription}</p>
      </div>
      <div class="participations-grid participations-grid--home">
        ${selected.map((item) => renderCard(item, locale, prefix, "home")).join("")}
      </div>
      <div class="participations-home-action">
        <a class="button button-outline" href="${createPathFor(prefix)(locale, "news")}">${ui.homeCta}</a>
      </div>
    </div>
  </section>`;
};

export const renderParticipationsListing = (locale: Locale, prefix: string): string => {
  const ui = participationsUi[locale];
  return `<section class="section participations-listing" aria-labelledby="participations-list-title">
    <div class="container">
      <div class="section-heading">
        <span class="eyebrow">${ui.listingEyebrow}</span>
        <h1 id="participations-list-title">${ui.listingTitle}</h1>
        <p>${ui.listingDescription}</p>
      </div>
      <div class="participations-grid participations-grid--listing">
        ${publishedParticipations.map((item) => renderCard(item, locale, prefix, "listing")).join("")}
      </div>
    </div>
  </section>`;
};
