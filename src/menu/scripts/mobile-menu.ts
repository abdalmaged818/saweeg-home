import { getMessages } from "../i18n";
import type { Language } from "../types/menu";

export interface MobileMenuController {
  close: () => void;
}

export const bindMobileMenu = (
  button: HTMLButtonElement,
  menu: HTMLElement,
  language: Language
): MobileMenuController => {
  const messages = getMessages(language);

  const setOpen = (open: boolean): void => {
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute(
      "aria-label",
      open ? messages.mobileMenuClose : messages.mobileMenuOpen
    );
    button.classList.toggle("is-open", open);
    menu.hidden = !open;
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("a")) {
      setOpen(false);
    }
  });

  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (
      target instanceof Node &&
      button.getAttribute("aria-expanded") === "true" &&
      !menu.contains(target) &&
      !button.contains(target)
    ) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      button.focus();
    }
  });

  return {
    close: () => setOpen(false)
  };
};
