import type { AppState } from "../types/menu";
import { updateMenuLinks } from "../templates/menu-page";

export const refreshLanguageLinks = (
  root: HTMLElement,
  state: AppState
): void => {
  updateMenuLinks(root, state);
};
