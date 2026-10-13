export const haramStorePhoto = {
  source: "assets-source/branches/haram/IMG_2578.PNG",
  output: "/assets/images/saweeg-haram-storefront-2026-10.webp"
} as const;

export const renderHaramStoreCard = (): string => `
  <section class="swg-haram container" aria-labelledby="swg-haram-title" dir="rtl">
    <div class="swg-haram__card">
      <div class="swg-haram__media">
        <img src="${haramStorePhoto.output}" alt="واجهة سويق في فرع الحرم عند باب السلام" width="1320" height="1592" loading="lazy" decoding="async">
      </div>
      <div class="swg-haram__body">
        <span class="swg-haram__label">جديدنا</span>
        <h2 class="swg-haram__title" id="swg-haram-title">فرع سويق <span>في الحرم</span></h2>
        <p class="swg-haram__line">جرعة سلام من جوار خير الأنام</p>
        <ul class="swg-haram__info">
          <li>
            <svg class="swg-haram__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21.5s-7-6.6-7-11.8a7 7 0 0 1 14 0c0 5.2-7 11.8-7 11.8Z" stroke="#5C6351" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="9.7" r="2.6" stroke="#C4A972" stroke-width="1.8"/></svg>
            <span>باب السلام ٣١٤</span>
          </li>
          <li>
            <svg class="swg-haram__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#5C6351" stroke-width="1.8"/><path d="M12 7v5l3.5 2.2" stroke="#C4A972" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <span>نستقبلكم على مدار الساعة</span>
          </li>
        </ul>
        <a class="swg-haram__btn" href="https://maps.app.goo.gl/t7VQtDZSWHREcnXL6?g_st=ic" target="_blank" rel="noopener noreferrer" aria-label="موقع الفرع — يفتح خرائط Google في نافذة جديدة">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21.5s-7-6.6-7-11.8a7 7 0 0 1 14 0c0 5.2-7 11.8-7 11.8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="9.7" r="2.6" stroke="currentColor" stroke-width="1.8"/></svg>
          موقع الفرع
        </a>
      </div>
    </div>
  </section>`;
