import type { Locale, SiteCopy } from "../types/site.ts";

const locationUrl = "https://share.google/Ctlfhbpf2EXtLsI1O";

export const renderJeddahParkEvent = (locale: Locale, copy: SiteCopy, prefix: string): string => `
  <section class="jeddah-park-event" aria-labelledby="jeddah-park-event-title">
    <div class="container">
      <a class="jeddah-park-event__card" href="${locationUrl}" target="_blank" rel="noopener noreferrer" dir="${locale === "ar" ? "rtl" : "ltr"}">
        <figure class="jeddah-park-event__media">
          <img class="jeddah-park-event__image" src="${prefix}assets/images/jeddah-park-national-day-2026.jpg" alt="${copy.jeddahParkEvent.imageAlt}" width="760" height="570" decoding="async">
        </figure>
        <div class="jeddah-park-event__body">
          <span class="jeddah-park-event__eyebrow">${copy.jeddahParkEvent.eyebrow}</span>
          <h2 class="jeddah-park-event__title" id="jeddah-park-event-title">${copy.jeddahParkEvent.heading}</h2>
          <p class="jeddah-park-event__description">${copy.jeddahParkEvent.description}</p>
          <span class="jeddah-park-event__cta" aria-hidden="true">${copy.jeddahParkEvent.cta}</span>
        </div>
      </a>
    </div>
  </section>
`;
