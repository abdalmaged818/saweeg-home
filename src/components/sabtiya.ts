export const sabtiyaSchedule = {
  timeZone: "Asia/Riyadh",
  start: Date.parse("2026-10-10T00:00:00+03:00"),
  end: Date.parse("2026-10-11T00:00:00+03:00")
} as const;

const riyadhDate = (now: Date): Date => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: sabtiyaSchedule.timeZone, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(now);
  const value = (type: string): number => Number(parts.find(part => part.type === type)?.value);
  return new Date(Date.UTC(value("year"), value("month") - 1, value("day")));
};

export const getSabtiyaState = (now = new Date()) => {
  if (now.getTime() < sabtiyaSchedule.start) return { version: "hidden" as const };
  if (now.getTime() < sabtiyaSchedule.end) return { version: "launch" as const };
  const saturday = riyadhDate(now);
  saturday.setUTCDate(saturday.getUTCDate() + (6 - saturday.getUTCDay() + 7) % 7);
  const dateLabel = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
    timeZone: "UTC", day: "numeric", month: "long"
  }).format(saturday);
  return { version: "weekly" as const, dateLabel, date: saturday.toISOString().slice(0, 10) };
};

const maqsed = "https://maps.app.goo.gl/TrhRQ4bykuBKf6bo7?g_st=ipc";
const haram = "https://maps.app.goo.gl/39mDVAhBHQNr4UfM6?g_st=ic";
const store = "https://saweegsa.com/ar";
const button = (href: string, label: string, variant: string): string =>
  `<a class="sab-btn sab-btn--${variant}" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label} — يفتح في علامة تبويب جديدة">${label}</a>`;

export const renderSabtiya = (now = new Date()): string => {
  const state = getSabtiyaState(now);
  if (state.version === "hidden") return "";
  const content = state.version === "launch" ? `
    <h2 id="sabtiya-title">سبتية سويق <span>اليوم السبت 10 أكتوبر</span></h2>
    <div class="sab-offers">
      <article class="sab-offer" aria-label="عرض الفروع">
        <h3>في الفروع:</h3>
        <p>اشترِ قطعة تشيز كيك بسعرها المعتاد،<br>وأضف منتجًا واحدًا من القائمة بريال.</p>
        <ul class="sab-terms">
          <li>خيارات منتج الريال: التلبينة الحارة • الآيس كريم • التلبينة الباردة • علبة تارت • علبة بسبوسة</li>
          <li>عرض الفروع في المقصد والحرم فقط، منتج واحد مع كل قطعة، والعرض قابل للتكرار.</li>
        </ul>
        <div class="sab-actions">${button(maqsed, "موقع المقصد", "green")}${button(haram, "موقع الحرم", "line")}</div>
      </article>
      <article class="sab-offer sab-offer--store" aria-label="عرض المتجر الإلكتروني">
        <h3>في المتجر الإلكتروني:</h3>
        <p>بوكس الجابرة بـ79 ريالًا،<br>ومعه كيس تلبينة نبوية إضافي 250 جم هدية، قيمته 30 ريالًا.</p>
        <ul class="sab-terms">
          <li>هدية المتجر إضافية، غير الكيس الموجود داخل البوكس.</li>
          <li>لا يُضاف خصم 10% المعتاد لهذا العرض.</li>
          <li>الشحن على العميل؛ مجاني عند وصول إجمالي الفاتورة إلى 199 ريالًا فأكثر.</li>
        </ul>
        <div class="sab-actions">${button(store, "اطلب باقة الجابرة", "gold")}</div>
      </article>
    </div>
    <span class="sab-date">العرضان السبت 10 أكتوبر فقط.</span>` : `
    <h2 id="sabtiya-title">سبتية سويق <span>موعدنا كل سبت</span></h2>
    <p class="sab-intro">تلقونا داخل مقصد قباء، بجوار مسجد قباء.<br>موعدنا الجاي السبت <time datetime="${state.date}">${state.dateLabel}</time>.</p>
    <ul class="sab-common"><li>تفاصيل السبتية الجاية بنشاركها معكم.</li></ul>
    <div class="sab-actions sab-actions--center">${button(maqsed, "شوف موقع المقصد", "green")}${button(store, "تعرّف على متجر سويق", "line")}</div>`;
  return `<section class="sabtiya-section container" id="sabtiya" dir="rtl" aria-labelledby="sabtiya-title"><div class="sab-card">${content}</div></section>`;
};

export const initializeSabtiya = (): void => {
  const slot = document.querySelector<HTMLTemplateElement>("#sabtiya-slot");
  if (!slot) return;
  let current = "";
  let timer: ReturnType<typeof setTimeout>;
  const update = (): void => {
    const now = new Date();
    const markup = renderSabtiya(now);
    if (markup !== current) {
      document.querySelector("#sabtiya")?.remove();
      slot.insertAdjacentHTML("beforebegin", markup);
      current = markup;
    }
    clearTimeout(timer);
    const tomorrow = riyadhDate(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const midnight = tomorrow.getTime() - 3 * 60 * 60 * 1000;
    timer = setTimeout(update, midnight - now.getTime() + 50);
  };
  update();
  window.addEventListener("pageshow", update);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) update();
  });
};
