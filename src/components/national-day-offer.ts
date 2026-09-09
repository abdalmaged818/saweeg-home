import type { Locale, SiteCopy } from "../types/site.ts";

const offerUrl = "https://saweegsa.com/ar/national-day-aljabirah-boxes-offer/p874393190";

export const renderNationalDayOffer = (locale: Locale, copy: SiteCopy, prefix: string): string => `
  <section class="national-day-offer" aria-labelledby="national-day-offer-title">
    <div class="container">
      <a class="saweeg-national-offer" href="${offerUrl}" dir="${locale === "ar" ? "rtl" : "ltr"}">
        <figure class="saweeg-national-offer__media">
          <img class="saweeg-national-offer__image" src="${prefix}assets/images/national-day-aljabirah-offer-2026-09.webp" alt="${copy.nationalDayOffer.imageAlt}" width="1306" height="1306" decoding="async" fetchpriority="high">
        </figure>
        <div class="saweeg-national-offer__body">
          <span class="saweeg-national-offer__eyebrow">${copy.nationalDayOffer.badge}</span>
          <h2 class="saweeg-national-offer__title" id="national-day-offer-title">${copy.nationalDayOffer.heading}</h2>
          <p class="saweeg-national-offer__offer" aria-label="${copy.nationalDayOffer.offer}">
            <span aria-hidden="true">${copy.nationalDayOffer.offerPrefix}</span>
            <span class="saweeg-national-offer__price" aria-hidden="true">
              ${copy.nationalDayOffer.offerLead ? `<span class="saweeg-national-offer__lead">${copy.nationalDayOffer.offerLead}</span>` : ""}
              <span class="saweeg-national-offer__amount">${copy.nationalDayOffer.amount}</span>
              <span class="saweeg-national-offer__currency">${copy.nationalDayOffer.currency}</span>
            </span>
          </p>
          <span class="saweeg-national-offer__cta" aria-hidden="true">
            ${copy.nationalDayOffer.cta}
            <svg class="saweeg-national-offer__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </span>
        </div>
      </a>
    </div>
  </section>`;
