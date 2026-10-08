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

const createBrand = (copy: HaramLocaleContent, compact = false): HTMLAnchorElement => {
  const link = create("a", "haram-brand");
  link.href = selectorPath;
  link.setAttribute("aria-label", copy.chooseLanguage);
  const image = create("img", "haram-brand__logo") as HTMLImageElement;
  image.src = assetUrl(siteConfig.logoPath);
  image.alt = copy.locale === "ar" ? "شعار سويق" : "Saweeg logo";
  image.width = compact ? 72 : 84;
  image.height = compact ? 42 : 52;
  image.decoding = "async";
  const branch = create("span", "haram-brand__branch");
  branch.append(create("strong", undefined, copy.branchName));
  if (!compact) branch.append(create("span", undefined, copy.welcome));
  link.append(image, branch);
  return link;
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

const createMenuHeader = (copy: HaramLocaleContent): HTMLElement => {
  const header = create("header", "haram-header");
  const inner = create("div", "haram-shell haram-header__inner");
  const title = create("div", "haram-header__title");
  title.append(create("span", undefined, copy.menuTitle), create("strong", undefined, copy.branchName));
  const change = create("a", "haram-button haram-button--outline", copy.changeLanguage);
  change.href = selectorPath;
  inner.append(createBrand(copy, true), title, change);
  header.append(inner);
  return header;
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
  const section = create("section", "haram-support");
  const shell = create("div", "haram-shell haram-support__grid");
  const store = create("article", "haram-support__card haram-support__card--store");
  store.append(
    create("p", "haram-support__eyebrow", copy.storeEyebrow),
    create("h2", undefined, copy.storeTitle),
    create("p", undefined, copy.storeBody),
    externalLink(copy.storeButton, siteConfig.links.onlineStore, "haram-button haram-button--light")
  );
  const contact = create("article", "haram-support__card");
  const actions = create("div", "haram-support__actions");
  actions.append(
    externalLink(copy.whatsapp, siteConfig.links.whatsapp, "haram-button haram-button--primary"),
    externalLink(copy.links, siteConfig.links.linktree, "haram-button haram-button--text")
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
  const hero = create("header", "haram-selector-hero");
  const heroInner = create("div", "haram-shell haram-selector-hero__inner");
  heroInner.append(createBrand(arabic), create("p", "haram-selector-hero__english", arabic.welcomeEnglish));
  hero.append(heroInner);
  const main = create("main", "haram-selector-main");
  const shell = create("div", "haram-shell haram-selector-main__inner");
  shell.append(
    create("h1", "haram-selector-main__welcome", arabic.welcome),
    create("p", "haram-selector-main__branch", `${arabic.branchName} · Al Haram Branch`),
    create("h2", "haram-selector-main__heading", arabic.chooseLanguage),
    create("p", "haram-selector-main__subheading", arabic.chooseLanguageEnglish)
  );
  const grid = create("nav", "haram-language-grid");
  grid.setAttribute("aria-label", arabic.chooseLanguage);
  Object.values(haramLocaleContent).forEach((copy) => {
    const card = create("a", "haram-language-card");
    card.href = localePath(copy.locale);
    card.lang = copy.locale;
    card.dir = copy.direction;
    card.append(create("span", "haram-language-card__flag", copy.flag), create("span", "haram-language-card__label", copy.nativeLabel));
    grid.append(card);
  });
  shell.append(grid);
  main.append(shell);
  page.append(hero, main, createFooter(arabic));
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
  const introInner = create("div", "haram-shell");
  introInner.append(create("h1", undefined, copy.menuTitle), create("p", undefined, copy.branchName), create("p", "haram-menu-intro__vat", copy.vatNotice));
  intro.append(introInner);
  main.append(intro);

  const menu = create("div", "haram-shell haram-menu");
  categoryOrder.forEach((category) => {
    const items = haramMenuItems.filter((item) => item.category === category);
    const section = create("section", "haram-category");
    const titleId = `haram-category-${category}`;
    const heading = create("h2", "haram-category__heading", copy.categories[category]);
    heading.id = titleId;
    section.setAttribute("aria-labelledby", titleId);
    const grid = create("div", "haram-product-grid");
    items.forEach((item) => grid.append(createProduct(item, copy)));
    section.append(heading, grid);
    menu.append(section);
  });
  const changeBottom = create("a", "haram-button haram-button--secondary haram-menu__change", copy.changeLanguage);
  changeBottom.href = selectorPath;
  menu.append(changeBottom);
  main.append(menu, createStoreAndContact(copy));
  page.append(createMenuHeader(copy), main, createFooter(copy));
  root.replaceChildren(page);
};
