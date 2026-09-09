import type { SiteCopy } from "../types/site.ts";

const offerUrl = "https://saweegsa.com/ar/national-day-aljabirah-boxes-offer/p874393190";

export const renderNationalDayOffer = (copy: SiteCopy, prefix: string): string => `
  <section class="national-day-offer" aria-labelledby="national-day-offer-title">
    <div class="container">
      <a class="national-day-offer-card" href="${offerUrl}">
        <div class="national-day-offer-copy">
          <span class="eyebrow">${copy.nationalDayOffer.badge}</span>
          <h2 id="national-day-offer-title">${copy.nationalDayOffer.heading}</h2>
          <p>${copy.nationalDayOffer.offer}</p>
          <span class="national-day-offer-cta" aria-hidden="true">${copy.nationalDayOffer.cta}</span>
        </div>
        <figure class="national-day-offer-media">
          <img src="${prefix}assets/images/national-day-aljabirah-offer-2026-09.webp" alt="${copy.nationalDayOffer.imageAlt}" width="1306" height="1306" decoding="async" fetchpriority="high">
        </figure>
      </a>
    </div>
  </section>`;
