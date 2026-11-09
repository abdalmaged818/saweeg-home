import type { Locale } from "../types/site.ts";

// Approved interface copy from the Go Saweeg v2 handoff; menu data stays independent.
export const goCopy = {
  ar: {
    welcome: "يا هلا فيك", welcomeSub: "كل ما يخص سويق، في مكان واحد.",
    menu: "المنيو", branches: "الفروع", branchesTitle: "فروع سويق",
    gates: [
      { title: "المنيو", text: "اختر فرعك وشوف الأصناف والأسعار.", cta: "شوف المنيو", meta: "المقصد، بستان المستظل، والحرم بعشر لغات" },
      { title: "فروعنا", text: "تعرّف على فروع سويق وافتح موقع الفرع.", cta: "شوف الفروع", meta: "3 فروع في المدينة المنورة" },
      { title: "المتجر الإلكتروني", text: "تسوّق منتجات سويق أونلاين.", cta: "تسوّق الآن", meta: "saweegsa.com" }
    ],
    footerMain: "تجربة تتوارثها الأجيال", footerSub: "أول علامة سعودية متخصصة بالتلبينة",
    hours: "أوقات العمل", hourUnit: "ساعة", aroundClock: "نستقبلكم على مدار الساعة",
    branchNames: { maqsed: "فرع المقصد", bustan: "فرع بستان المستظل", haram: "فرع الحرم" },
    branchLines: { maqsed: "من هنا بدأت حكاية سويق", bustan: "مذاق سويق وسط هدوء البستان", haram: "جرعة سلام من جوار خير الأنام" },
    branchLocations: { maqsed: "داخل مقصد قباء، بجوار مسجد قباء", bustan: "داخل بستان المستظل، المدينة المنورة", haram: "باب السلام ٣١٤" },
    schedules: { maqsed: [["السبت – الأربعاء", "٤:٣٠ عصرًا – ١٢ منتصف الليل"], ["الخميس والجمعة", "٤:٣٠ عصرًا – ٢ صباحًا"]], bustan: [["الفترة الصباحية", "٦ صباحًا – ١٢ ظهرًا"], ["الفترة المسائية", "٤:٣٠ عصرًا – ١١:٣٠ مساءً"]] },
    contactTitle: "خلك قريب من سويق", contactIntro: "تابع أخبارنا، تواصل معنا، واكتشف كل جديد من قلب المدينة المنورة.",
    channels: "قنوات التواصل", delivery: "اطلب سويق الآن", downloads: "تحميل الملفات التعريفية",
    store: "تسوّق من سويق", storeText: "اطلب التلبينة والسويق والبوكسات والهدايا من متجرنا الإلكتروني.", storeCta: "زيارة المتجر",
    links: "روابط سويق", order: "اطلب سويق", branchAction: "شوف الفروع"
  },
  en: {
    welcome: "Welcome to Saweeg", welcomeSub: "Everything Saweeg, in one place.",
    menu: "Menu", branches: "Branches", branchesTitle: "Saweeg branches",
    gates: [
      { title: "Menu", text: "Choose your branch to see items and prices.", cta: "View the menu", meta: "Al-Maqsed, Bustan Al-Mustazal, and Al Haram in ten languages" },
      { title: "Our branches", text: "Find a Saweeg branch and open its location.", cta: "View branches", meta: "3 branches in Madinah" },
      { title: "Online store", text: "Shop Saweeg products online.", cta: "Shop now", meta: "saweegsa.com" }
    ],
    footerMain: "An experience passed down through generations", footerSub: "The first Saudi brand specializing in Talbinah",
    hours: "Opening hours", hourUnit: "hours", aroundClock: "Welcoming you around the clock",
    branchNames: { maqsed: "Al-Maqsed Branch", bustan: "Bustan Al-Mustazal Branch", haram: "Al Haram Branch" },
    branchLines: { maqsed: "Where the Saweeg story began", bustan: "The taste of Saweeg in the calm of the garden", haram: "A moment of peace beside the Prophet’s Mosque" },
    branchLocations: { maqsed: "Inside Maqsed Quba, beside Quba Mosque", bustan: "Inside Bustan Al-Mustazal, Madinah", haram: "Bab Al-Salam 314" },
    schedules: { maqsed: [["Saturday – Wednesday", "4:30 PM – midnight"], ["Thursday and Friday", "4:30 PM – 2:00 AM (next day)"]], bustan: [["Morning", "6:00 AM – noon"], ["Evening", "4:30 PM – 11:30 PM"]] },
    contactTitle: "Stay close to Saweeg", contactIntro: "Follow our news, reach out, and discover everything new from the heart of Madinah.",
    channels: "Get in touch", delivery: "Order Saweeg now", downloads: "Download Saweeg Profiles",
    store: "Shop Saweeg", storeText: "Discover talbinah, saweeg, gift boxes, and more in our online store.", storeCta: "Visit the store",
    links: "Saweeg links", order: "Order Saweeg", branchAction: "View branches"
  }
} as const satisfies Record<Locale, unknown>;

export const returnCopy = {
  ar: { previous: "العودة للصفحة السابقة", home: "العودة للصفحة الرئيسية", nav: "الرئيسية" },
  en: { previous: "Back to previous page", home: "Back to homepage", nav: "Home" },
  ur: { previous: "پچھلے صفحے پر واپس جائیں", home: "مرکزی صفحے پر واپس جائیں", nav: "مرکزی صفحہ" },
  id: { previous: "Kembali ke halaman sebelumnya", home: "Kembali ke beranda", nav: "Beranda" },
  bn: { previous: "আগের পাতায় ফিরুন", home: "হোমপেজে ফিরুন", nav: "হোম" },
  tr: { previous: "Önceki sayfaya dön", home: "Ana sayfaya dön", nav: "Ana sayfa" },
  fa: { previous: "بازگشت به صفحهٔ قبل", home: "بازگشت به صفحهٔ اصلی", nav: "خانه" },
  fr: { previous: "Revenir à la page précédente", home: "Retour à l’accueil", nav: "Accueil" },
  ms: { previous: "Kembali ke halaman sebelumnya", home: "Kembali ke laman utama", nav: "Laman utama" },
  ru: { previous: "Вернуться на предыдущую страницу", home: "На главную страницу", nav: "Главная" }
} as const;
