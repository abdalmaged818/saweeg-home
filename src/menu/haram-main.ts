import "./styles/main.css";
import { haramExtras, haramProducts } from "./data/haram";
import { initializeApp } from "./scripts/app";

const isEnglish = document.documentElement.lang === "en";

initializeApp({
  fixedBranch: "haram",
  products: haramProducts,
  extras: haramExtras,
  showBranchSection: false,
  showBranchLocations: false,
  hero: isEnglish
    ? {
        eyebrow: "Saweeg",
        title: "Al Haram Branch Menu",
        body: "Explore the Al Haram Branch menu and prices.",
        ctaLabel: "View Menu"
      }
    : {
        eyebrow: "سويق",
        title: "منيو فرع الحرم",
        body: "استعرض منيو فرع الحرم والأسعار.",
        ctaLabel: "استعرض المنيو"
      }
});
