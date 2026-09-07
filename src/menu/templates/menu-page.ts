import { assetUrl, branchMapUrl, menuBasePath, siteConfig } from "../config/site";
import { branches } from "../data/branches";
import { categories } from "../data/categories";
import { extras } from "../data/extras";
import { products } from "../data/products";
import { getMessages } from "../i18n";
import type {
  AppState,
  Branch,
  CompactProduct,
  Extra,
  ImageProduct,
  Language
} from "../types/menu";

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

const localName = (
  item: { nameAr: string; nameEn: string },
  language: Language
): string => (language === "ar" ? item.nameAr : item.nameEn);

const localQuantity = (
  item: { quantityAr?: string; quantityEn?: string },
  language: Language
): string | undefined =>
  language === "ar" ? item.quantityAr : item.quantityEn;

const localNote = (
  item: { noteAr?: string; noteEn?: string },
  language: Language
): string | undefined => language === "ar" ? item.noteAr : item.noteEn;

const normalizedLabel = (value: string): string =>
  value.toLocaleLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");

const isQuantityAlreadyInName = (
  item: { nameAr: string; nameEn: string; quantityAr?: string; quantityEn?: string },
  language: Language
): boolean => {
  const quantity = localQuantity(item, language);
  if (!quantity) return false;
  const name = normalizedLabel(localName(item, language));
  const normalizedQuantity = normalizedLabel(quantity);
  const quantityTokens = quantity
    .split(/[\s\p{P}\p{S}]+/u)
    .map(normalizedLabel)
    .filter(Boolean);
  return name.includes(normalizedQuantity) || quantityTokens.every((token) => name.includes(token));
};

const appendProductDetails = (
  container: HTMLElement,
  product: ImageProduct | CompactProduct,
  language: Language,
  classPrefix: "product-card" | "compact-product-card"
): void => {
  const quantity = localQuantity(product, language);
  const note = localNote(product, language);
  if (quantity && !isQuantityAlreadyInName(product, language)) {
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
  const languagePath = language === "en" ? "en/" : "";
  const query = new URLSearchParams(
    typeof window === "undefined" ? undefined : window.location.search
  );
  query.set("branch", branch);
  const hash = typeof window === "undefined" ? "" : window.location.hash;
  return `${menuBasePath}${languagePath}?${query.toString()}${hash}`;
};

const createBrand = (
  language: Language,
  branch: AppState["branch"]
): HTMLAnchorElement => {
  const brand = createElement("a", "brand");
  brand.href = appHref(language, branch);
  brand.setAttribute(
    "aria-label",
    language === "ar" ? "العودة إلى منيو سويق" : "Back to Saweeg menu"
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
  image.alt = language === "ar" ? "شعار سويق" : "Saweeg logo";
  image.width = 80;
  image.height = 40;
  image.decoding = "async";
  image.dataset.fallbackKind = "logo";

  mark.append(fallback, image);
  brand.append(mark);
  return brand;
};

const createHeader = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const header = createElement("header", "site-header");
  const shell = createElement("div", "header-shell container");
  const actions = createElement("div", "header-actions");

  const languageLink = createElement(
    "a",
    "language-link",
    state.language === "ar" ? "EN" : "العربية"
  );
  languageLink.href = appHref(
    state.language === "ar" ? "en" : "ar",
    state.branch
  );
  languageLink.dataset.languageLink = "";

  const menuButton = createElement(
    "button",
    "mobile-menu-button"
  ) as HTMLButtonElement;
  menuButton.type = "button";
  menuButton.setAttribute("aria-label", messages.mobileMenuOpen);
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-controls", "mobile-menu");
  menuButton.dataset.mobileMenuButton = "";
  const menuIcon = createElement("span", "mobile-menu-button__icon");
  menuIcon.setAttribute("aria-hidden", "true");
  menuIcon.append(
    createElement("span"),
    createElement("span"),
    createElement("span")
  );
  menuButton.append(menuIcon);
  actions.append(languageLink, menuButton);
  shell.append(createBrand(state.language, state.branch), actions);
  header.append(shell);
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

const createHero = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "hero");
  const inner = createElement("div", "hero__inner container");
  const content = createElement("div", "hero__content");
  const button = createElement(
    "a",
    "button button--primary",
    messages.chooseBranch
  );
  button.href = "#branch-picker";
  content.append(
    createElement("p", "eyebrow", messages.heroEyebrow),
    createElement("h1", "hero__title", messages.heroTitle),
    createElement("p", "hero__body", messages.heroBody),
    button
  );
  inner.append(content);
  section.append(inner);
  return section;
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
      `${name}${state.language === "ar" ? "، " : ", "}${messages.branchActive}`
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
  const footer = createElement("footer", "site-footer");
  const inner = createElement("div", "container footer-grid");
  const brandColumn = createElement("div", "footer-brand");
  const logoWrap = createElement("div", "footer-logo-wrap");
  const logo = createElement("img", "footer-logo");
  logo.src = assetUrl(siteConfig.logoPath);
  logo.alt = state.language === "ar" ? "شعار سويق" : "Saweeg logo";
  logo.width = 68;
  logo.height = 68;
  logo.loading = "lazy";
  logo.decoding = "async";
  logoWrap.append(logo);
  brandColumn.append(logoWrap, createElement("p", "footer-tagline", messages.footerTagline));

  const nav = createElement("nav", "footer-nav");
  nav.setAttribute(
    "aria-label",
    state.language === "ar" ? "روابط التذييل" : "Footer links"
  );
  const footerLinks = [
    { label: messages.store, href: siteConfig.links.onlineStore },
    { label: messages.contactWhatsapp, href: siteConfig.links.whatsapp },
    { label: messages.saweegLinks, href: siteConfig.links.linktree }
  ];
  footerLinks.forEach(({ label, href }) => {
    const link = createElement("a", "footer-link", label);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    nav.append(link);
  });
  const language = createElement("a", "footer-link", messages.language);
  language.href = appHref(
    state.language === "ar" ? "en" : "ar",
    state.branch
  );
  language.dataset.languageLink = "";
  nav.append(language);

  const copyright = createElement(
    "p",
    "copyright",
    `© ${new Date().getFullYear()} ${siteConfig.copyrightName[state.language]}. ${messages.copyright}`
  );
  inner.append(brandColumn, nav, copyright);
  footer.append(inner);
  return footer;
};

const createProductCard = (
  product: ImageProduct,
  language: Language
): HTMLElement => {
  const messages = getMessages(language);
  const article = createElement("article", "product-card");
  article.dataset.productId = product.id;
  article.dataset.displayMode = product.displayMode;
  const media = createElement("div", "product-card__media");
  const decorative = createElement("span", "product-card__fallback");
  decorative.setAttribute("aria-hidden", "true");
  const image = createElement("img", "product-card__image");
  const name = localName(product, language);
  image.src = assetUrl(`assets/products/${product.image}`);
  image.alt = messages.productImageAlt(name);
  image.width = 1400;
  image.height = 1050;
  image.loading = "lazy";
  image.decoding = "async";
  image.dataset.fallbackKind = "product";
  image.style.objectFit = product.imageFit ?? "cover";
  image.style.objectPosition = product.imagePosition ?? "center";
  image.style.transformOrigin = product.imagePosition ?? "center";
  image.style.setProperty("--image-scale", String(product.imageScale ?? 1));
  media.append(decorative, image);

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
  article.append(media, content);
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
  const quantity = language === "ar" ? extra.quantityAr : extra.quantityEn;
  if (quantity && !isQuantityAlreadyInName(extra, language)) {
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
  state: AppState
): void => {
  const fragment = document.createDocumentFragment();
  categories
    .filter((category) => category.id !== "drinks")
    .forEach((category) => {
      const categoryProducts = products.filter(
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
  state: AppState
): void => {
  const fragment = document.createDocumentFragment();
  extras
    .filter((extra) => extra.branches.includes(state.branch))
    .forEach((extra) => fragment.append(createExtraRow(extra, state.language)));
  container.replaceChildren(fragment);
};

export const renderMenuPage = (
  root: HTMLElement,
  state: AppState
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
    createHero(state),
    createBranchSection(state),
    menuSection,
    extrasSection,
    createBranchLocationsSection(state),
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

  renderMenuSections(menuSections, state);
  renderExtras(extrasList, state);

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
    link.href = appHref(state.language, state.branch);
  });
};
