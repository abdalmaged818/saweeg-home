import "./styles/main.css";
import { menuBasePath } from "./config/site";

const homeLink = document.querySelector<HTMLAnchorElement>("[data-home-link]");
if (homeLink) {
  homeLink.href = menuBasePath;
}

const logo = document.querySelector<HTMLImageElement>(
  "[data-not-found-logo-image]"
);
const logoFrame = document.querySelector<HTMLElement>("[data-not-found-logo]");

if (logo && logoFrame) {
  const markLogoLoaded = (): void => {
    logo.hidden = false;
    logoFrame.classList.add("has-image");
  };
  const markLogoMissing = (): void => {
    logo.hidden = true;
    logo.removeAttribute("src");
    logoFrame.classList.remove("has-image");
  };

  logo.addEventListener("load", markLogoLoaded, { once: true });
  logo.addEventListener("error", markLogoMissing, { once: true });

  if (logo.complete) {
    if (logo.naturalWidth > 0) {
      markLogoLoaded();
    } else {
      markLogoMissing();
    }
  }
}
