import { getCopy } from "../../i18n/index.ts";
import { renderHeader } from "../../components/header.ts";
import { renderFooter } from "../../components/footer.ts";
import { createPathFor } from "../../pages/routes.ts";
import { sharedNameFor, sharedItemText } from "../i18n/catalog.ts";
import { assetUrl, branchMapUrl, menuBasePath, siteConfig } from "../config/site";
import { branches } from "../data/branches";
import { categories } from "../data/categories";
import { canonicalImageFor } from "../data/catalog-images";
import { extras } from "../data/extras";
import { products as defaultProducts } from "../data/products";
import { getMessages } from "../i18n";
import type {
  AppState,
  Branch,
  CompactProduct,
  Extra,
  ImageProduct,
  Language,
  Product
} from "../types/menu";

export interface MenuPageOptions {
  products?: Product[];
  extras?: Extra[];
  showBranchSection?: boolean;
  showBranchLocations?: boolean;
  hero?: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel?: string;
  };
}

export interface MenuPageRefs {
  root: HTMLElement;
  menuSections: HTMLElement;
  extrasList: HTMLElement;
  mobileMenu: HTMLElement;
  mobileMenuButton: HTMLButtonElement;
}

const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
};

const localName = (item: { id: string }, language: Language): string => sharedNameFor(item.id, language);
const localQuantity = (item: { id: string }, language: Language): string | undefined => sharedItemText(item.id, language).quantity ?? undefined;
const localNote = (item: { id: string }, language: Language): string | undefined => sharedItemText(item.id, language).note ?? undefined;
const hasSeparateQuantity = (item: { id: string }, language: Language): boolean => sharedItemText(item.id, language).showQuantity;

const appendProductDetails = (
  container: HTMLElement,
  product: ImageProduct | CompactProduct,
  language: Language,
  classPrefix: "product-card" | "compact-product-card"
): void => {
  const quantity = localQuantity(product, language);
  const note = localNote(product, language);
  if (quantity && hasSeparateQuantity(product, language)) {
    container.append(createElement("p", `${classPrefix}__quantity`, quantity));
  }
  if (note) {
    container.append(createElement("p", `${classPrefix}__note`, note));
  }
};

const appHref = (
  language: Language,
  branch: AppState["branch"]
): string => {
  if (branch === "haram") {
    return `${menuBasePath}haram/${language === "en" ? "en/" : ""}`;
  }
  const languagePath = language === "en" ? "en/" : "";
  const query = new URLSearchParams(
    typeof window === "undefined" ? undefined : window.location.search
  );
  query.set("branch", branch);
  const hash = typeof window === "undefined" ? "" : window.location.hash;
  return `${menuBasePath}${languagePath}?${query.toString()}${hash}`;
};

const brandHref = (language: Language, branch: AppState["branch"]): string =>
  branch === "haram"
    ? `${menuBasePath}${language === "en" ? "en/" : ""}`
    : appHref(language, branch);

const createBrand = (
  language: Language,
  branch: AppState["branch"]
): HTMLAnchorElement => {
  const brand = createElement("a", "brand");
  brand.href = brandHref(language, branch);
  brand.setAttribute(
    "aria-label",
    getMessages(language).backToMenu
  );
  brand.dataset.brandLink = "";

  const mark = createElement("span", "brand__mark");
  const fallback = createElement(
    "span",
    "brand__fallback",
    siteConfig.brandName[language]
  );
  const image = createElement("img", "brand__image");
  image.src = assetUrl(siteConfig.logoPath);
  image.alt = getMessages(language).logoAlt;
  image.width = 80;
  image.height = 40;
  image.decoding = "async";
  image.dataset.fallbackKind = "logo";

  mark.append(fallback, image);
  brand.append(mark);
  return brand;
};

const createHeader = (state: AppState): HTMLElement => {
  const copy = getCopy(state.language);
  const holder = createElement("div");
  holder.innerHTML = renderHeader({
    locale: state.language, page: "home", copy, prefix: "/",
    pathFor: createPathFor("/"),
    localeSwitchPath: appHref(state.language === "ar" ? "en" : "ar", state.branch)
  });
  const header = holder.firstElementChild as HTMLElement;
  header.querySelector(".header-inner")?.classList.add("header-shell");
  header.querySelector(".brand")?.replaceWith(createBrand(state.language, state.branch));
  header.querySelector(".mobile-navigation")?.remove();
  header.querySelector('[aria-current="page"]')?.removeAttribute("aria-current");
  const button = header.querySelector<HTMLButtonElement>("[data-menu-button]")!;
  button.dataset.mobileMenuButton = "";
  button.setAttribute("aria-controls", "mobile-menu");
  button.setAttribute("aria-label", getMessages(state.language).mobileMenuOpen);
  const language = header.querySelector<HTMLAnchorElement>(".language-link")!;
  language.dataset.languageLink = "";
  return header;
};

const createExternalMenuLink = (
  label: string,
  href: string
): HTMLAnchorElement => {
  const link = createElement("a", "mobile-menu__link", label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
};

const createMobileMenu = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const menu = createElement("div", "mobile-menu container");
  menu.id = "mobile-menu";
  menu.hidden = true;
  menu.dataset.mobileMenu = "";

  const card = createElement("nav", "mobile-menu__card");
  card.setAttribute("aria-label", messages.navLabel);
  const storeLink = createExternalMenuLink(
    messages.store,
    siteConfig.links.onlineStore
  );
  const maqsedLink = createExternalMenuLink(
    messages.maqsedLocation,
    siteConfig.links.maqsedMap
  );
  const bustanLink = createExternalMenuLink(
    messages.bustanLocation,
    siteConfig.links.bustanMap
  );
  const whatsappLink = createExternalMenuLink(
    messages.contactWhatsapp,
    siteConfig.links.whatsapp
  );
  const linktreeLink = createExternalMenuLink(
    messages.saweegLinks,
    siteConfig.links.linktree
  );
  const languageLink = createElement(
    "a",
    "mobile-menu__link",
    messages.language
  );
  languageLink.href = appHref(
    state.language === "ar" ? "en" : "ar",
    state.branch
  );
  languageLink.dataset.languageLink = "";
  card.append(
    storeLink,
    maqsedLink,
    bustanLink,
    whatsappLink,
    linktreeLink,
    languageLink
  );
  menu.append(card);
  return menu;
};

const createHero = (
  state: AppState,
  hero?: MenuPageOptions["hero"],
  hasBranchSelection = true
): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "hero");
  const inner = createElement("div", "hero__inner container");
  const content = createElement("div", "hero__content");
  const button = createElement(
    "a",
    "button button--primary",
    hero?.ctaLabel ?? messages.chooseBranch
  );
  button.href = hasBranchSelection ? "#branch-picker" : "#menu-products";
  content.append(
    createElement("p", "eyebrow", hero?.eyebrow ?? messages.heroEyebrow),
    createElement("h1", "hero__title", hero?.title ?? messages.heroTitle),
    createElement("p", "hero__body", hero?.body ?? messages.heroBody),
    button
  );
  inner.append(content);
  section.append(inner);
  return section;
};

const createBackNavigation = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const navigation = createElement("nav", "menu-back-navigation");
  navigation.setAttribute("aria-label", messages.backToPreviousPage);
  const inner = createElement("div", "container menu-back-navigation__inner");
  const link = createElement(
    "a",
    "button button--secondary menu-back-navigation__button",
    messages.backToPreviousPage
  );
  link.dataset.menuBackLink = "";
  inner.append(link);
  navigation.append(inner);
  return navigation;
};

const createBranchButton = (
  branch: Branch,
  state: AppState
): HTMLButtonElement => {
  const messages = getMessages(state.language);
  const name = localName(branch, state.language);
  const button = createElement(
    "button",
    "branch-option",
    name
  ) as HTMLButtonElement;
  button.type = "button";
  button.dataset.branch = branch.id;
  button.setAttribute("aria-pressed", String(state.branch === branch.id));
  if (state.branch === branch.id) {
    button.classList.add("is-active");
    button.setAttribute(
      "aria-label",
      `${name}${messages.activeSeparator}${messages.branchActive}`
    );
  }
  return button;
};

const createBranchSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "branch-section section");
  section.id = "branch-picker";
  const inner = createElement("div", "container branch-section__inner");
  const copy = createElement("div", "section-heading");
  copy.append(
    createElement("h2", "section-title", messages.branchSectionTitle),
    createElement("p", "section-copy", messages.branchSectionBody)
  );

  const controls = createElement("div", "branch-controls");
  const selector = createElement("div", "branch-selector");
  selector.setAttribute("role", "group");
  selector.setAttribute("aria-label", messages.branchSelectorLabel);
  branches.forEach((branch) => selector.append(createBranchButton(branch, state)));

  controls.append(selector);
  inner.append(copy, controls);
  section.append(inner);
  return section;
};

const createSectionHeading = (title: string, id: string): HTMLElement => {
  const heading = createElement("div", "menu-category__heading");
  const label = createElement("h2", "menu-category__title", title);
  label.id = id;
  heading.append(label);
  return heading;
};

const createMenuSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "menu-section");
  section.id = "menu-products";
  section.setAttribute("aria-label", messages.menuSectionTitle);
  const inner = createElement("div", "container menu-sections");
  inner.dataset.menuSections = "";
  section.append(inner);
  return section;
};

const createExtrasSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "menu-category menu-category--extras");
  section.id = "extras";
  section.setAttribute("aria-labelledby", "extras-title");
  const inner = createElement("div", "container");
  const list = createElement("div", "extras-card");
  list.dataset.extrasList = "";
  inner.append(createSectionHeading(messages.extrasTitle, "extras-title"), list);
  section.append(inner);
  return section;
};

const createBranchLocationsSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "locations-section section");
  section.id = "branches";
  section.setAttribute("aria-labelledby", "branch-locations-title");
  const inner = createElement("div", "container");
  const title = createElement(
    "h2",
    "section-title locations-section__title",
    messages.branchLocationsTitle
  );
  title.id = "branch-locations-title";
  const grid = createElement("div", "location-grid");

  branches.forEach((branch) => {
    const card = createElement("article", "location-card");
    const name = localName(branch, state.language);
    const heading = createElement("h3", "location-card__title", name);
    const link = createElement(
      "a",
      "button button--secondary location-card__link",
      messages.openBranchLocation
    );
    link.href = branchMapUrl(branch.id);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", messages.branchMapLabel(name));
    card.append(heading, link);
    grid.append(card);
  });

  inner.append(title, grid);
  section.append(inner);
  return section;
};

const createStoreSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "store-section section");
  const inner = createElement("div", "store-card container");
  const copy = createElement("div", "store-card__copy");
  copy.append(
    createElement("p", "eyebrow eyebrow--light", messages.storeEyebrow),
    createElement("h2", "store-card__title", messages.storeTitle),
    createElement("p", "store-card__body", messages.storeBody)
  );
  const button = createElement(
    "a",
    "button button--light",
    messages.storeButton
  );
  button.href = siteConfig.links.onlineStore;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  inner.append(copy, button);
  section.append(inner);
  return section;
};

const createContactSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "contact-section section");
  const card = createElement("div", "contact-card container");
  const copy = createElement("div", "contact-card__copy");
  copy.append(
    createElement("h2", "section-title", messages.contactTitle),
    createElement("p", "section-copy", messages.contactBody)
  );
  const actions = createElement("div", "contact-card__actions");
  const links = [
    {
      label: messages.contactWhatsappButton,
      href: siteConfig.links.whatsapp,
      className: "button button--primary"
    },
    {
      label: messages.contactLinktreeButton,
      href: siteConfig.links.linktree,
      className: "button button--text"
    }
  ];
  links.forEach(({ label, href, className }) => {
    const link = createElement("a", className, label);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    actions.append(link);
  });
  card.append(copy, actions);
  section.append(card);
  return section;
};

const createFooter = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const holder = createElement("div");
  holder.innerHTML = renderFooter({
    locale: state.language, page: "home", copy: getCopy(state.language), prefix: "/",
    pathFor: createPathFor("/"),
    localeSwitchPath: appHref(state.language === "ar" ? "en" : "ar", state.branch)
  });
  const footer = holder.firstElementChild as HTMLElement;
  const legacy = createElement("nav", "menu-footer-context-links");
  legacy.setAttribute("aria-label", messages.footerNavLabel);
  for (const [label, href] of [
    [messages.store, siteConfig.links.onlineStore],
    [messages.contactWhatsapp, siteConfig.links.whatsapp],
    [messages.saweegLinks, siteConfig.links.linktree]
  ]) legacy.append(createExternalMenuLink(label, href));
  footer.querySelector(".footer-nav")!.append(legacy);
  footer.querySelector<HTMLAnchorElement>(".footer-language")!.dataset.languageLink = "";
  footer.querySelector(".footer-bottom span")!.textContent =
    `© ${new Date().getFullYear()} ${siteConfig.copyrightName[state.language]}. ${messages.copyright}`;
  return footer;
};

const createProductCard = (
  product: ImageProduct,
  language: Language
): HTMLElement => {
  const messages = getMessages(language);
  const canonicalImage = canonicalImageFor(product.catalogId ?? product.id);
  const imageFile = canonicalImage?.file;
  const article = createElement(
    "article",
    imageFile ? "product-card" : "product-card product-card--without-image"
  );
  article.dataset.productId = product.id;
  article.dataset.displayMode = product.displayMode;
  const name = localName(product, language);
  if (imageFile) {
    const media = createElement("div", "product-card__media");
    const decorative = createElement("span", "product-card__fallback");
    decorative.setAttribute("aria-hidden", "true");
    const image = createElement("img", "product-card__image");
    image.src = assetUrl(`assets/products/${imageFile}`);
    image.alt = messages.productImageAlt(name);
    image.width = 1400;
    image.height = 1050;
    image.loading = "lazy";
    image.decoding = "async";
    image.dataset.fallbackKind = "product";
    image.style.objectFit = canonicalImage!.fit;
    image.style.objectPosition = canonicalImage!.position;
    image.style.transformOrigin = canonicalImage!.position;
    image.style.setProperty("--image-scale", String(1));
    media.append(decorative, image);
    article.append(media);
  }

  const content = createElement("div", "product-card__content");
  const copy = createElement("div", "product-card__copy");
  const title = createElement("h3", "product-card__name", name);
  copy.append(title);
  appendProductDetails(copy, product, language, "product-card");
  const price = createElement(
    "p",
    "product-card__price",
    messages.priceLabel(product.price)
  );
  content.append(copy, price);
  article.append(content);
  return article;
};

const createCompactProductCard = (
  product: CompactProduct,
  language: Language
): HTMLElement => {
  const messages = getMessages(language);
  const article = createElement("article", "compact-product-card");
  article.dataset.productId = product.id;
  article.dataset.displayMode = product.displayMode;
  const copy = createElement("div", "compact-product-card__copy");
  const title = createElement(
    "h3",
    "compact-product-card__name",
    localName(product, language)
  );
  copy.append(title);
  appendProductDetails(copy, product, language, "compact-product-card");
  const price = createElement(
    "p",
    "compact-product-card__price",
    messages.priceLabel(product.price)
  );
  article.append(copy, price);
  return article;
};

const createExtraRow = (extra: Extra, language: Language): HTMLElement => {
  const messages = getMessages(language);
  const row = createElement("div", "extra-row");
  const copy = createElement("div", "extra-row__copy");
  copy.append(createElement("h3", "extra-row__name", localName(extra, language)));
  const quantity = localQuantity(extra, language);
  if (quantity && hasSeparateQuantity(extra, language)) {
    copy.append(createElement("p", "extra-row__quantity", quantity));
  }
  row.append(
    copy,
    createElement("span", "extra-row__price", messages.priceLabel(extra.price))
  );
  return row;
};

export const renderMenuSections = (
  container: HTMLElement,
  state: AppState,
  productData: Product[] = defaultProducts
): void => {
  const fragment = document.createDocumentFragment();
  const navigation = createElement("nav", "category-navigation");
  navigation.setAttribute("aria-label", getMessages(state.language).menuSectionTitle);
  const available = categories.filter(category => category.id !== "drinks" &&
    productData.some(product => product.category === category.id && product.branches.includes(state.branch)));
  for (const category of available) {
    const link = createElement("a", undefined, localName(category, state.language));
    link.href = `#category-${category.id}`;
    navigation.append(link);
  }
  const extraLink = createElement("a", undefined, getMessages(state.language).extrasTitle);
  extraLink.href = "#extras";
  navigation.append(extraLink);
  navigation.querySelectorAll("a").forEach((link, index) => {
    link.setAttribute("aria-current", String(index === 0));
    link.addEventListener("click", () => navigation.querySelectorAll("a").forEach(
      current => current.setAttribute("aria-current", String(current === link))));
  });
  fragment.append(navigation);
  categories
    .filter((category) => category.id !== "drinks")
    .forEach((category) => {
      const categoryProducts = productData.filter(
        (product) =>
          product.branches.includes(state.branch) &&
          product.category === category.id
      );
      if (categoryProducts.length === 0) {
        return;
      }
      const section = createElement("section", "menu-category");
      const titleId = `category-${category.id}`;
      section.setAttribute("aria-labelledby", titleId);
      const imageProducts = categoryProducts.filter(
        (product): product is ImageProduct => product.displayMode === "image"
      );
      const compactProducts = categoryProducts.filter(
        (product): product is CompactProduct => product.displayMode === "compact"
      );
      const heading = createSectionHeading(
        localName(category, state.language),
        titleId
      );
      section.append(heading);

      if (imageProducts.length > 0) {
        const imageGrid = createElement("div", "product-grid products-grid");
        imageProducts.forEach((product) =>
          imageGrid.append(createProductCard(product, state.language))
        );
        section.append(imageGrid);
      }

      if (compactProducts.length > 0) {
        const compactGrid = createElement("div", "compact-products-grid");
        compactProducts.forEach((product) =>
          compactGrid.append(createCompactProductCard(product, state.language))
        );
        section.append(compactGrid);
      }

      fragment.append(section);
    });
  container.replaceChildren(fragment);
};

export const renderExtras = (
  container: HTMLElement,
  state: AppState,
  extraData: Extra[] = extras
): void => {
  const fragment = document.createDocumentFragment();
  extraData
    .filter((extra) => extra.branches.includes(state.branch))
    .forEach((extra) => fragment.append(createExtraRow(extra, state.language)));
  container.replaceChildren(fragment);
};

export const renderMenuPage = (
  root: HTMLElement,
  state: AppState,
  options: MenuPageOptions = {}
): MenuPageRefs => {
  const messages = getMessages(state.language);
  const skipLink = createElement("a", "skip-link", messages.skipToContent);
  skipLink.href = "#main-content";
  const header = createHeader(state);
  const mobileMenu = createMobileMenu(state);
  const main = createElement("main");
  main.id = "main-content";
  const menuSection = createMenuSection(state);
  const extrasSection = createExtrasSection(state);
  main.append(
    createHero(state, options.hero, options.showBranchSection !== false),
    ...(options.showBranchSection === false ? [] : [createBranchSection(state)]),
    menuSection,
    extrasSection,
    ...(options.showBranchLocations === false ? [] : [createBranchLocationsSection(state)]),
    createBackNavigation(state),
    createStoreSection(state),
    createContactSection(state)
  );
  const page = createElement("div", "site");
  page.append(skipLink, header, mobileMenu, main, createFooter(state));
  root.replaceChildren(page);

  const menuSections =
    root.querySelector<HTMLElement>("[data-menu-sections]");
  const extrasList = root.querySelector<HTMLElement>("[data-extras-list]");
  const mobileMenuButton =
    root.querySelector<HTMLButtonElement>("[data-mobile-menu-button]");

  if (
    !menuSections ||
    !extrasList ||
    !mobileMenuButton
  ) {
    throw new Error("Menu page could not be initialized.");
  }

  renderMenuSections(menuSections, state, options.products);
  renderExtras(extrasList, state, options.extras);

  return {
    root,
    menuSections,
    extrasList,
    mobileMenu,
    mobileMenuButton
  };
};

export const updateMenuLinks = (root: HTMLElement, state: AppState): void => {
  root.querySelectorAll<HTMLAnchorElement>("[data-language-link]").forEach((link) => {
    link.href = appHref(
      state.language === "ar" ? "en" : "ar",
      state.branch
    );
  });
  root.querySelectorAll<HTMLAnchorElement>("[data-brand-link]").forEach((link) => {
    link.href = brandHref(state.language, state.branch);
  });
};
