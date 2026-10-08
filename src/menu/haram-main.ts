import "../styles/main.css";
import "./haram/haram.css";
import { bindSharedHeader } from "../components/header-controller.ts";
import { renderHaramMenu, renderHaramSelector } from "./haram/render";
import { haramLocales, type HaramLocale } from "./haram/types";

const root = document.querySelector<HTMLElement>("#app");

if (!root) {
  throw new Error("The Haram menu root was not found.");
}

const pageKind = document.body.dataset.haramPage;
const locale = document.body.dataset.haramLocale;

if (pageKind === "selector") {
  renderHaramSelector(root);
} else if (locale && (haramLocales as readonly string[]).includes(locale)) {
  renderHaramMenu(root, locale as HaramLocale);
} else {
  window.location.replace("/menu/haram/");
}

bindSharedHeader(root);
