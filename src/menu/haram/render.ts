import { assetUrl, siteConfig } from "../config/site";
import { haramMenuItems } from "./data";
import { haramLocaleContent } from "./locales";
import type { HaramCategoryId, HaramLocale, HaramLocaleContent, HaramMenuItem } from "./types";

const selectorPath = "/menu/haram/";
const categoryOrder: HaramCategoryId[] = ["iceCream", "desserts", "drinks", "powders", "boxes"];

const create = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
};

const externalLink = (label: string, href: string, className: string): HTMLAnchorElement => {
  const link = create("a", className, label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
};

const localePath = (locale: HaramLocale): string => `${selectorPath}${locale}/`;

const createSharedHeader = (copy: HaramLocaleContent, isSelector = false): HTMLElement => {
  const wrapper = document.createDocumentFragment();
  const welcome = create("div", "welcome-strip haram-welcome-strip");
  welcome.lang = "ar";
  welcome.dir = "rtl";
  welcome.append(create("p", "welcome-strip__text", "سلام من لدن أرض السلام"));

  const header = create("header", "site-header haram-site-header");
  header.dataset.siteHeader = "";
  const inner = create("div", "container header-inner");
  const brand = create("a", "brand") as HTMLAnchorElement;
  brand.href = "/";
  brand.setAttribute("aria-label", copy.locale === "ar" ? "الصفحة الرئيسية لسويق" : "Saweeg home");
  const image = create("img") as HTMLImageElement;
  image.src = assetUrl(siteConfig.logoPath);
  image.alt = copy.locale === "ar" ? "شعار سويق" : "Saweeg logo";
  image.width = 72;
  image.height = 72;
  image.decoding = "async";
  brand.append(image);

  const desktopNav = create("nav", "desktop-nav haram-site-header__nav");
  desktopNav.setAttribute("aria-label", copy.branchName);
  const branchLink = create("a", undefined, copy.branchName);
  branchLink.href = selectorPath;
  branchLink.setAttribute("aria-current", isSelector ? "page" : "false");
  desktopNav.append(branchLink);

  const actions = create("div", "header-actions");
  const changeLanguage = create("a", "language-link", isSelector ? copy.chooseLanguage : copy.changeLanguage);
  changeLanguage.href = isSelector ? "#haram-languages" : selectorPath;
  const menuButton = create("button", "menu-button") as HTMLButtonElement;
  menuButton.type = "button";
  menuButton.dataset.menuButton = "";
  menuButton.dataset.openLabel = copy.chooseLanguage;
  menuButton.dataset.closeLabel = copy.changeLanguage;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", copy.chooseLanguage);
  menuButton.append(create("span"), create("span"), create("span"));
  actions.append(changeLanguage, menuButton);

  const mobileNavigation = create("div", "mobile-navigation") as HTMLDivElement;
  mobileNavigation.dataset.mobileNavigation = "";
  mobileNavigation.hidden = true;
  const mobileInner = create("div", "container mobile-navigation-inner");
  const mobileNav = create("nav");
  mobileNav.setAttribute("aria-label", copy.branchName);
  const mobileBranch = create("a", undefined, copy.branchName);
  mobileBranch.href = selectorPath;
  const mobileLanguage = create("a", undefined, isSelector ? copy.chooseLanguage : copy.changeLanguage);
  mobileLanguage.href = isSelector ? "#haram-languages" : selectorPath;
  mobileNav.append(mobileBranch, mobileLanguage);
  mobileInner.append(mobileNav);
  mobileNavigation.append(mobileInner);
  inner.append(brand, desktopNav, actions);
  header.append(inner, mobileNavigation);
  wrapper.append(welcome, header);

  const chrome = create("div", "haram-shared-header");
  chrome.append(wrapper);
  return chrome;
};

const createImageMedia = (
  item: HaramMenuItem,
  name: string,
  copy: HaramLocaleContent,
  article: HTMLElement
): HTMLElement | undefined => {
  if (!item.image) return undefined;
  const media = create("div", "haram-product__media");
  const image = create("img", "haram-product__image") as HTMLImageElement;
  image.src = assetUrl(`assets/products/${item.image.file}`);
  image.alt = copy.imageAlt(name);
  image.loading = "lazy";
  image.decoding = "async";
  image.width = 1400;
  image.height = 1050;
  image.style.objectFit = item.image.fit;
  image.style.objectPosition = item.image.position ?? "center";
  const removeMedia = (): void => {
    article.classList.add("haram-product--text-only");
    media.remove();
  };
  image.addEventListener("error", removeMedia, { once: true });
  media.append(image);
  return media;
};

const createProduct = (item: HaramMenuItem, copy: HaramLocaleContent): HTMLElement => {
  const name = copy.productNames[item.id];
  const article = create(
    "article",
    item.image ? "haram-product" : "haram-product haram-product--text-only"
  );
  article.dataset.productId = item.id;
  article.dataset.catalogId = item.catalogId;
  const media = createImageMedia(item, name, copy, article);
  const body = create("div", "haram-product__body");
  body.append(
    create("h3", "haram-product__name", name),
    create("p", "haram-product__price", copy.priceLabel(item.price))
  );
  if (media) article.append(media);
  article.append(body);
  return article;
};

const createProductRun = (items: HaramMenuItem[], copy: HaramLocaleContent): HTMLElement => {
  const hasMedia = Boolean(items[0]?.image);
  const grid = create(
    "div",
    `haram-product-grid haram-product-grid--${hasMedia ? "media" : "text-only"}`
  );
  items.forEach((item) => grid.append(createProduct(item, copy)));
  return grid;
};

const createProductRuns = (items: HaramMenuItem[], copy: HaramLocaleContent): HTMLElement[] => {
  const runs: HaramMenuItem[][] = [];
  let currentRun: HaramMenuItem[] = [];
  let currentRunHasMedia: boolean | undefined;

  items.forEach((item) => {
    const hasMedia = Boolean(item.image);
    if (currentRunHasMedia !== undefined && currentRunHasMedia !== hasMedia) {
      runs.push(currentRun);
      currentRun = [];
    }
    currentRun.push(item);
    currentRunHasMedia = hasMedia;
  });

  if (currentRun.length) runs.push(currentRun);
  return runs.map((run) => createProductRun(run, copy));
};

const createFooter = (copy: HaramLocaleContent): HTMLElement => {
  const footer = create("footer", "haram-footer");
  const inner = create("div", "haram-shell haram-footer__inner");
  const logo = create("img", "haram-footer__logo") as HTMLImageElement;
  logo.src = assetUrl(siteConfig.logoPath);
  logo.alt = copy.locale === "ar" ? "شعار سويق" : "Saweeg logo";
  logo.width = 72;
  logo.height = 48;
  logo.loading = "lazy";
  const nav = create("nav", "haram-footer__links");
  nav.setAttribute("aria-label", copy.footerLinks);
  nav.append(
    externalLink(copy.footerStore, siteConfig.links.onlineStore, "haram-footer__link"),
    externalLink(copy.footerWhatsapp, siteConfig.links.whatsapp, "haram-footer__link"),
    externalLink(copy.footerLinks, siteConfig.links.linktree, "haram-footer__link")
  );
  inner.append(logo, nav, create("p", "haram-footer__copyright", `© ${new Date().getFullYear()} Saweeg`));
  footer.append(inner);
  return footer;
};

const createStoreAndContact = (copy: HaramLocaleContent): HTMLElement => {
  const section = create("section", "haram-support section");
  const shell = create("div", "container destinations-grid haram-support__grid");
  const store = create("article", "destination-card destination-card--store");
  store.append(
    create("p", "eyebrow eyebrow--dark", copy.storeEyebrow),
    create("h2", undefined, copy.storeTitle),
    create("p", undefined, copy.storeBody),
    externalLink(copy.storeButton, siteConfig.links.onlineStore, "button button-light")
  );
  const contact = create("article", "destination-card");
  const actions = create("div", "button-row");
  actions.append(
    externalLink(copy.whatsapp, siteConfig.links.whatsapp, "button button-primary"),
    externalLink(copy.links, siteConfig.links.linktree, "button button-soft")
  );
  contact.append(create("h2", undefined, copy.contactTitle), create("p", undefined, copy.contactBody), actions);
  shell.append(store, contact);
  section.append(shell);
  return section;
};

export const renderHaramSelector = (root: HTMLElement): void => {
  const arabic = haramLocaleContent.ar;
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";
  document.title = "فرع الحرم | سويق";
  const page = create("div", "haram haram--selector");
  const main = create("main", "haram-selector-main");
  const shell = create("div", "container haram-selector-main__inner");
  shell.append(
    create("p", "haram-selector-main__eyebrow", arabic.branchName),
    create("h1", "haram-selector-main__heading", arabic.chooseLanguage),
    create("p", "haram-selector-main__subheading", arabic.chooseLanguageEnglish)
  );
  const grid = create("nav", "haram-language-grid");
  grid.id = "haram-languages";
  grid.setAttribute("aria-label", arabic.chooseLanguage);
  Object.values(haramLocaleContent).forEach((copy) => {
    const card = create("a", "haram-language-card");
    card.href = localePath(copy.locale);
    card.lang = copy.locale;
    card.dir = copy.direction;
    card.append(
      create("span", "haram-language-card__label", copy.nativeLabel),
      create("span", "haram-language-card__arrow", "→")
    );
    grid.append(card);
  });
  shell.append(grid);
  main.append(shell);
  page.append(createSharedHeader(arabic, true), main, createFooter(arabic));
  root.replaceChildren(page);
};

export const renderHaramMenu = (root: HTMLElement, locale: HaramLocale): void => {
  const copy = haramLocaleContent[locale];
  document.documentElement.lang = locale;
  document.documentElement.dir = copy.direction;
  document.title = `${copy.menuTitle} | ${copy.branchName} | Saweeg`;
  const page = create("div", "haram haram--menu");
  const main = create("main", "haram-main");
  const intro = create("section", "haram-menu-intro");
  const introInner = create("div", "container");
  introInner.append(create("p", "haram-menu-intro__branch", copy.branchName), create("h1", undefined, copy.menuTitle));
  intro.append(introInner);
  main.append(intro);

  const menu = create("div", "container haram-menu");
  categoryOrder.forEach((category) => {
    const items = haramMenuItems.filter((item) => item.category === category);
    const section = create("section", "haram-category");
    const titleId = `haram-category-${category}`;
    const heading = create("h2", "haram-category__heading", copy.categories[category]);
    heading.id = titleId;
    section.setAttribute("aria-labelledby", titleId);
    section.append(heading, ...createProductRuns(items, copy));
    menu.append(section);
  });
  const changeBottom = create("a", "text-link haram-menu__change", copy.changeLanguage);
  changeBottom.href = selectorPath;
  menu.append(changeBottom);
  main.append(menu, createStoreAndContact(copy));
  page.append(createSharedHeader(copy), main, createFooter(copy));
  root.replaceChildren(page);
};
