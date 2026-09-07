import {
  absoluteAssetUrl,
  branchMapUrl,
  pageUrl,
  siteConfig
} from "../config/site";
import { branches } from "../data/branches";
import { categories } from "../data/categories";
import { products } from "../data/products";
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

const updateStructuredData = (state: AppState): void => {
  const script = document.querySelector<HTMLScriptElement>(
    'script[data-structured-data="menu"]'
  );
  if (!script) {
    return;
  }

  const branch = branches.find((item) => item.id === state.branch);
  const localizedBranch =
    state.language === "ar" ? branch?.nameAr : branch?.nameEn;
  const branchProducts = products.filter((product) =>
    product.branches.includes(state.branch)
  );
  const nameKey = state.language === "ar" ? "nameAr" : "nameEn";

  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Menu",
    name:
      state.language === "ar"
        ? `منيو سويق - ${localizedBranch ?? ""}`
        : `Saweeg Menu - ${localizedBranch ?? ""}`,
    url: pageUrl(state.language, state.branch),
    provider: {
      "@type": "Organization",
      name: siteConfig.brandName[state.language],
      url: siteConfig.links.onlineStore,
      logo: absoluteAssetUrl(siteConfig.logoPath),
      sameAs: [siteConfig.links.linktree]
    },
    location: branch
      ? {
          "@type": "Place",
          name: localizedBranch,
          hasMap: branchMapUrl(branch.id)
        }
      : undefined,
    hasMenuSection: categories
      .filter((category) => category.id !== "drinks")
      .map((category) => ({
        "@type": "MenuSection",
        name: category[nameKey],
        hasMenuItem: branchProducts
          .filter((product) => product.category === category.id)
          .map((product) => ({
            "@type": "MenuItem",
            name: product[nameKey],
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "SAR"
            }
          }))
      }))
  });
};

const updateSeoLinks = (state: AppState): void => {
  const currentPageUrl = pageUrl(state.language, state.branch);
  const canonical =
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) {
    canonical.href = currentPageUrl;
  }
  const openGraphUrl = document.querySelector<HTMLMetaElement>(
    'meta[property="og:url"]'
  );
  if (openGraphUrl) {
    openGraphUrl.content = currentPageUrl;
  }
  document
    .querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')
    .forEach((link) => {
      const language = link.hreflang === "en" ? "en" : "ar";
      link.href = pageUrl(language, state.branch);
    });
};

export const initializeApp = (): void => {
  const root = document.querySelector<HTMLElement>("#app");
  if (!root) {
    throw new Error("Application root is missing.");
  }

  const state = getInitialState();
  const refs = renderMenuPage(root, state);
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
    updateStructuredData(state);
    updateSeoLinks(state);
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
