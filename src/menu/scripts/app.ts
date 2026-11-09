import { menuBasePath } from "../config/site";
import { bindReturnNavigation } from "../../components/return-navigation.ts";
import { getMessages } from "../i18n";
import {
  renderExtras,
  renderMenuPage,
  renderMenuSections,
  type MenuPageOptions
} from "../templates/menu-page";
import type { AppState, BranchId, Language } from "../types/menu";
import { bindBranchSwitcher } from "./branch-switcher";
import { attachImageFallbacks } from "./image-fallback";
import { refreshLanguageLinks } from "./language-switcher";
import { bindMobileMenu } from "./mobile-menu";

const storageKey = "saweeg:selected-branch";

const validBranch = (value: string | null): BranchId | null =>
  value === "maqsed" || value === "bustan" ? value : null;

const storeBranch = (branch: BranchId): void => {
  try {
    localStorage.setItem(storageKey, branch);
  } catch {
    // URL state remains authoritative when storage is unavailable.
  }
};

const getInitialState = (fixedBranch?: BranchId): AppState => {
  const params = new URLSearchParams(window.location.search);
  const language: Language =
    document.documentElement.lang === "en" ? "en" : "ar";

  return {
    language,
    branch: fixedBranch ?? validBranch(params.get("branch")) ?? "maqsed"
  };
};

const syncUrl = (
  state: AppState,
  mode: "push" | "replace",
  fixedBranch?: BranchId
): void => {
  if (fixedBranch) return;
  const params = new URLSearchParams(window.location.search);
  params.set("branch", state.branch);
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history[mode === "push" ? "pushState" : "replaceState"](
    { ...window.history.state, branch: state.branch,
      ...(mode === "push" ? { saweegPrevious: `${location.pathname}${location.search}${location.hash}` } : {}) },
    "",
    nextUrl
  );
};

export const initializeApp = (options: MenuPageOptions & { fixedBranch?: BranchId } = {}): void => {
  if (!options.fixedBranch && new URLSearchParams(location.search).get("branch") === "haram") {
    const query = new URLSearchParams(location.search);
    query.delete("branch");
    location.replace(`${menuBasePath}haram/${query.size ? `?${query}` : ""}${location.hash}`);
    return;
  }
  const root = document.querySelector<HTMLElement>("#app");
  if (!root) {
    throw new Error("Application root is missing.");
  }

  const state = getInitialState(options.fixedBranch);
  const refs = renderMenuPage(root, state, options);
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
    renderMenuSections(refs.menuSections, state, options.products);
    renderExtras(refs.extrasList, state, options.extras);
    attachImageFallbacks(refs.menuSections);
    refreshSelectionUi();
  };

  const changeBranch = (branch: BranchId): void => {
    if (state.branch === branch) {
      return;
    }
    state.branch = branch;
    storeBranch(branch);
    syncUrl(state, "push", options.fixedBranch);
    refreshContent();
  };

  if (!options.fixedBranch) {
    bindBranchSwitcher(root, changeBranch);
  }

  window.addEventListener("popstate", () => {
    if (!options.fixedBranch) {
      const params = new URLSearchParams(window.location.search);
      state.branch = validBranch(params.get("branch")) ?? "maqsed";
    }
    refreshContent();
  });

  syncUrl(state, "replace", options.fixedBranch);
  bindReturnNavigation(root);
  refreshSelectionUi();
  attachImageFallbacks(root);
};
