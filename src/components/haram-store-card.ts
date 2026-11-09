import { siteConfig } from "../config/site.ts";
import { getCopy } from "../i18n/index.ts";

export const haramStorePhoto = {
  source: "assets-source/branches/haram/IMG_2578.PNG",
  output: "/assets/images/saweeg-haram-storefront-2026-10.webp"
} as const;

export const renderHaramStoreCard = (): string => `
  <article class="swg-haram announcement-card" aria-labelledby="swg-haram-title" dir="rtl">
    <div class="swg-haram__intro">
      <div class="swg-haram__media"><img src="${haramStorePhoto.output}" alt="واجهة سويق في فرع الحرم عند باب السلام" width="1142" height="1377" loading="lazy" decoding="async"></div>
      <div><span class="swg-haram__label">جديدنا</span><h2 id="swg-haram-title">فرع سويق في الحرم</h2><p>جرعة سلام من جوار خير الأنام</p></div>
    </div>
    <ul class="swg-haram__info"><li>باب السلام ٣١٤</li><li>نستقبلكم على مدار الساعة</li></ul>
    <div class="swg-haram__actions">
      <a class="button button-primary" href="${siteConfig.links.haramMenu}" data-analytics-event="branch_menu_click" data-analytics-label="haram">${getCopy("ar").branches.haramMenuCta}</a>
      <a class="button button-text" href="https://maps.app.goo.gl/t7VQtDZSWHREcnXL6?g_st=ic" target="_blank" rel="noopener noreferrer" aria-label="موقع الفرع — يفتح خرائط Google في نافذة جديدة">موقع الفرع<span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
