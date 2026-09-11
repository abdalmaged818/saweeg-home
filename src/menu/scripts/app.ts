import { gatewayHomePath, menuBasePath } from "../config/site";
import { getMessages } from "../i18n";
import {
  renderExtras,
  renderMenuPage,
  renderMenuSections
} from "../templates/menu-page";
import type { AppState, BranchId, Language } from "../types/menu";
import { bindBranchSwitcher } from "./branch-switcher";
import { attachImageFallbacks } from "./image-fallback";
import { refreshLanguageLinks } from "./language-switcher";
import { bindMobileMenu } from "./mobile-menu";

const storageKey = "saweeg:selected-branch";

const isMenuPath = (pathname: string): boolean =>
  pathname === menuBasePath.slice(0, -1) || pathname.startsWith(menuBasePath);

const getGatewayReturnUrl = (): string | null => {
  if (!document.referrer || window.opener || window.history.length <= 1) {
    return null;
  }

  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin !== window.location.origin || isMenuPath(referrer.pathname)) {
      return null;
    }

    return `${referrer.pathname}${referrer.search}${referrer.hash}`;
  } catch {
    return null;
  }
};

const validBranch = (value: string | null): BranchId | null =>
  value === "maqsed" || value === "bustan" ? value : null;

const getStoredBranch = (): BranchId | null => {
  try {
    return validBranch(localStorage.getItem(storageKey));
  } catch {
    return null;
  }
};

const storeBranch = (branch: BranchId): void => {
  try {
    localStorage.setItem(storageKey, branch);
  } catch {
    // URL state remains authoritative when storage is unavailable.
  }
};

const getInitialState = (): AppState => {
  const params = new URLSearchParams(window.location.search);
  const language: Language =
    document.documentElement.lang === "en" ? "en" : "ar";

  return {
    language,
    branch: validBranch(params.get("branch")) ?? getStoredBranch() ?? "maqsed"
  };
};

const syncUrl = (state: AppState, mode: "push" | "replace"): void => {
  const params = new URLSearchParams(window.location.search);
  params.set("branch", state.branch);
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history[mode === "push" ? "pushState" : "replaceState"](
    { branch: state.branch },
    "",
    nextUrl
  );
};

export const initializeApp = (): void => {
  const root = document.querySelector<HTMLElement>("#app");
  if (!root) {
    throw new Error("Application root is missing.");
  }

  const state = getInitialState();
  const refs = renderMenuPage(root, state);
  const backLink = root.querySelector<HTMLAnchorElement>("[data-menu-back-link]");
  if (!backLink) {
    throw new Error("Menu back link is missing.");
  }
  backLink.href = getGatewayReturnUrl() ?? gatewayHomePath(state.language);
  bindMobileMenu(refs.mobileMenuButton, refs.mobileMenu, state.language);

  const refreshSelectionUi = (): void => {
    const messages = getMessages(state.language);
    root.querySelectorAll<HTMLButtonElement>("[data-branch]").forEach((button) => {
      const active = button.dataset.branch === state.branch;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      const label = button.textContent?.trim() ?? "";
      button.setAttribute(
        "aria-label",
        active
          ? `${label}${state.language === "ar" ? "، " : ", "}${messages.branchActive}`
          : label
      );
    });

    refreshLanguageLinks(root, state);
  };

  const refreshContent = (): void => {
    renderMenuSections(refs.menuSections, state);
    renderExtras(refs.extrasList, state);
    attachImageFallbacks(refs.menuSections);
    refreshSelectionUi();
  };

  const changeBranch = (branch: BranchId): void => {
    if (state.branch === branch) {
      return;
    }
    state.branch = branch;
    storeBranch(branch);
    syncUrl(state, "push");
    refreshContent();
  };

  bindBranchSwitcher(root, changeBranch);

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    state.branch = validBranch(params.get("branch")) ?? "maqsed";
    refreshContent();
  });

  syncUrl(state, "replace");
  refreshSelectionUi();
  attachImageFallbacks(root);
};
