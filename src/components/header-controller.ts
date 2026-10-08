export const bindSharedHeader = (scope: ParentNode = document): void => {
  const header = scope.querySelector<HTMLElement>("[data-site-header]");
  const menuButton = header?.querySelector<HTMLButtonElement>("[data-menu-button]");
  const mobileNavigation = header?.querySelector<HTMLElement>("[data-mobile-navigation]");

  const closeMenu = (): void => {
    if (!menuButton || !mobileNavigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", menuButton.dataset.openLabel ?? "");
    mobileNavigation.hidden = true;
    document.body.classList.remove("menu-open");
  };

  const openMenu = (): void => {
    if (!menuButton || !mobileNavigation) return;
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", menuButton.dataset.closeLabel ?? "");
    mobileNavigation.hidden = false;
    document.body.classList.add("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    if (expanded) closeMenu(); else openMenu();
  });

  mobileNavigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!header || menuButton?.getAttribute("aria-expanded") !== "true") return;
    if (event.target instanceof Node && !header.contains(event.target)) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton?.focus();
    }
  });

  window.matchMedia("(min-width: 900px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
};
