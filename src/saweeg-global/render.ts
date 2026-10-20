import { renderIcon } from "../components/icons.ts";
import { getHaramLocale } from "../menu/haram/locales.ts";
import { approvedContent, publicV1Content, publishableLocales } from "./validation.ts";
import { localeCodes, localeRegistry, languageLabels, type WorldLocale } from "./locales.ts";
import { worldHeader,worldFooter,type ShellLink } from "./shared-shell.ts";
import { featuredProducts,featuredImage } from "./products.ts";
import { worldBranches,worldLinks,branchMenu,type WorldBranch } from "./branches.ts";
import { editorialMedia,type MediaResolver,type WorldMedia } from "./media.ts";
import type { WorldContentKey } from "./content/ar.ts";
import type { WorldDisplayContent } from "./content/types.ts";

const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
const html=(markup:string):HTMLElement=>{const t=document.createElement("template");t.innerHTML=markup.trim();return t.content.firstElementChild as HTMLElement;};
const text=(c:WorldDisplayContent,key:WorldContentKey)=>{if(key==="world.talbinah.hadithTranslation")throw new Error("Religious meaning is not public V1 content");return esc(c[key]);};
const action=(label:string,href:string,kind="primary",external=false)=>`<a class="button button--${kind}" href="${esc(href)}"${external?' target="_blank" rel="noopener noreferrer"':""}>${esc(label)}</a>`;
const image=(m:WorldMedia,c:WorldDisplayContent,resolve:MediaResolver,priority=false)=>`<img src="${esc(resolve(m))}" width="${m.width}" height="${m.height}" alt="${text(c,m.altKey)}" decoding="async" ${priority?'fetchpriority="high"':'loading="lazy"'} style="object-fit:${m.fit};object-position:${m.position}">`;
const projectName=()=>'<p class="world-project"><span lang="ar" dir="rtl">سويق للعالم</span><span lang="en" dir="ltr">Saweeg Global</span></p>';
const sections=["about","talbinah","products","branches","contact"] as const;
export interface WorldRenderOptions {
  locale: WorldLocale;
  selectorHref: string;
  localeHref: (locale:WorldLocale)=>string;
  media: MediaResolver;
  mode: "public" | "isolated-preview";
}
function contentFor(options:WorldRenderOptions):WorldDisplayContent {
  if(options.mode==="public") return publicV1Content(options.locale);
  return approvedContent(options.locale);
}
export function frame(c:WorldDisplayContent,options:WorldRenderOptions,minimal:boolean,body:string):HTMLElement {
  const links:ShellLink[]=sections.map(id=>({label:c[`world.nav.${id}`],href:`#world-${id}`}));
  const footerLinks:ShellLink[]=minimal ? [
    {label:c["world.store.cta"],href:worldLinks.store,external:true},
    {label:c["world.social.instagramCta"],href:worldLinks.instagram,external:true},
    {label:c["world.social.tiktokCta"],href:worldLinks.tiktok,external:true},
    {label:c["world.contact.whatsappCta"],href:worldLinks.whatsapp,external:true}
  ] : [...links,{label:c["world.store.cta"],href:worldLinks.store,external:true}];
  const props={content:c,selectorHref:options.selectorHref,navigation:links,footerLinks,minimal};
  const root=html(`<div class="swg-world" lang="${options.locale}" dir="${localeRegistry[options.locale].directionality}" id="world-top"><a class="skip-link" href="#world-main">${text(c,"world.navigation.skip")}</a><div class="welcome-strip" lang="${options.mode==="public"?options.locale:"ar"}" dir="${options.mode==="public"?localeRegistry[options.locale].directionality:"rtl"}"><p class="welcome-strip__text">${options.mode==="public"?text(c,"world.welcome.title"):esc(getHaramLocale("ar").welcomeStrip)}</p></div></div>`);
  root.append(worldHeader(props));
  root.append(html(`<main id="world-main" tabindex="-1">${body}</main>`),worldFooter(props));
  return root;
}
export function renderLanguageSelector(options:WorldRenderOptions):HTMLElement {
  const c=contentFor(options);
  return composeLanguageSelector(c,options);
}
// Pure composition also used by the isolated test adapter. Public entry points above/below retain their gate.
export function composeLanguageSelector(c:WorldDisplayContent,options:WorldRenderOptions):HTMLElement {
  return frame(c,options,true,`<section class="container world-welcome" aria-labelledby="world-welcome-title"><div class="world-split"><div>${projectName()}<h1 id="world-welcome-title">${text(c,"world.welcome.title")}</h1><p class="world-lead">${text(c,"world.welcome.description")}</p></div><figure class="world-media world-hero-media">${image(editorialMedia.hero,c,options.media,true)}</figure></div><div class="world-language-area"><h2>${text(c,"world.welcome.languageLabel")}</h2><ul class="world-language-grid">${(options.mode==="public"?publishableLocales():localeCodes).map(code=>`<li><a class="world-language-card" href="${esc(options.localeHref(code))}" lang="${code}" dir="${localeRegistry[code].directionality}" hreflang="${code}"><span>${esc(languageLabels[localeRegistry[code].labelKey])}</span>${renderIcon("arrow")}</a></li>`).join("")}</ul></div></section>`);
}
export function renderHero(c:WorldDisplayContent,resolve:MediaResolver):string {
  return `<section class="container world-hero" aria-labelledby="world-hero-title"><div class="world-split"><div>${projectName()}<h1 id="world-hero-title">${text(c,"world.hero.heading")}</h1><p class="world-lead">${text(c,"world.hero.description")}</p>${action(c["world.hero.cta"],"#world-about")}</div><figure class="world-media world-hero-media">${image(editorialMedia.hero,c,resolve,true)}</figure></div></section>`;
}
export function renderAbout(c:WorldDisplayContent,resolve:MediaResolver):string {
  return `<section class="world-section world-band" id="world-about" aria-labelledby="world-about-title"><div class="container world-split world-editorial"><figure class="world-media">${image(editorialMedia.about,c,resolve)}</figure><div><h2 id="world-about-title" tabindex="-1">${text(c,"world.about.heading")}</h2><p>${text(c,"world.about.description")}</p><p class="world-muted">${text(c,"world.about.heritage")}</p></div></div></section>`;
}
export function renderTalbinah(c:WorldDisplayContent,resolve:MediaResolver,locale:WorldLocale,meaning?:string):string {
  const original=approvedContent("ar")["world.talbinah.hadithText"];
  return `<section class="world-section" id="world-talbinah" aria-labelledby="world-talbinah-title"><div class="container world-split world-talbinah"><div><h2 id="world-talbinah-title" tabindex="-1">${text(c,"world.talbinah.heading")}</h2><p class="world-muted">${text(c,"world.talbinah.description")}</p><figure class="world-hadith"><p>${text(c,"world.talbinah.hadithIntro")}</p><blockquote lang="ar" dir="rtl">${esc(original)}</blockquote>${locale==="ar"||meaning===undefined?"":`<p class="world-hadith-meaning" lang="${locale}" dir="${localeRegistry[locale].directionality}">${esc(meaning)}</p>`}<figcaption>${text(c,"world.talbinah.hadithSource")}</figcaption></figure></div><figure class="world-media">${image(editorialMedia.talbinah,c,resolve)}</figure></div></section>`;
}
export function renderProducts(c:WorldDisplayContent):string {
  return `<section class="world-section world-band" id="world-products" aria-labelledby="world-products-title"><div class="container"><div class="world-section-head"><h2 id="world-products-title" tabindex="-1">${text(c,"world.products.heading")}</h2><p>${text(c,"world.products.description")}</p></div><ul class="world-product-grid">${featuredProducts.map(p=>{const m=featuredImage(p.id);return `<li><article class="world-product" data-world-product="${p.id}"><div class="world-product-media"><img src="/menu/assets/products/${m.file}" width="1400" height="1050" alt="${text(c,p.nameKey)}" loading="lazy" decoding="async" style="object-fit:${m.fit};object-position:${m.position}"></div><h3>${text(c,p.nameKey)}</h3></article></li>`;}).join("")}</ul></div></section>`;
}
export function renderMenuAvailability(branch:WorldBranch,locale:WorldLocale,c:WorldDisplayContent):string {
  const url=branchMenu(branch,locale);
  if(url) return action(c["world.menu.cta"],url,"secondary",true);
  if(!branch.menuLocales.length) return "";
  return `<div class="world-unavailable" role="status"><p>${text(c,"world.menu.languageUnavailable")}</p><button class="button button--secondary" aria-expanded="false" aria-controls="world-menu-languages-${branch.id}" data-world-disclosure>${text(c,"world.menu.chooseLanguageCta")}</button><div id="world-menu-languages-${branch.id}" hidden>${branch.menuLocales.map(code=>`<a class="button button--secondary" lang="${code}" dir="${localeRegistry[code].directionality}" hreflang="${code}" href="${esc(branchMenu(branch,code)!)}" target="_blank" rel="noopener noreferrer">${esc(languageLabels[localeRegistry[code].labelKey])}</a>`).join("")}</div></div>`;
}
export function renderBranches(c:WorldDisplayContent,resolve:MediaResolver,locale:WorldLocale):string {
  return `<section class="world-section" id="world-branches" aria-labelledby="world-branches-title"><div class="container"><div class="world-section-head"><h2 id="world-branches-title" tabindex="-1">${text(c,"world.branches.heading")}</h2><p>${text(c,"world.branches.description")}</p></div><ul class="world-branch-grid">${worldBranches.map(b=>`<li><article class="world-branch"><figure class="world-branch-media">${image(editorialMedia[b.id],c,resolve)}</figure><div class="world-branch-body"><h3>${text(c,`world.branches.${b.id}.name`)}</h3><p>${renderIcon("pin")}<span>${text(c,`world.branches.${b.id}.location`)}</span></p><p class="world-muted"><span class="world-clock" aria-hidden="true">◷</span><span>${text(c,`world.branches.${b.id}.hours`)}</span></p><div class="world-actions">${action(c["world.branches.mapCta"],b.map,"primary",true)}${renderMenuAvailability(b,locale,c)}</div></div></article></li>`).join("")}</ul></div></section>`;
}
export function renderStore(c:WorldDisplayContent):string {
  return `<section class="container" id="world-store" aria-labelledby="world-store-title"><div class="world-store"><div><h2 id="world-store-title">${text(c,"world.store.heading")}</h2><p>${text(c,"world.store.description")}</p></div>${action(c["world.store.cta"],worldLinks.store,"gold",true)}</div></section>`;
}
export function renderContact(c:WorldDisplayContent):string {
  return `<section class="world-section" id="world-contact" aria-labelledby="world-contact-title"><div class="container world-connect"><article class="world-contact"><h2 id="world-contact-title" tabindex="-1">${text(c,"world.contact.heading")}</h2><p>${text(c,"world.contact.description")}</p><a class="world-phone" href="${worldLinks.phone}" dir="ltr">${text(c,"world.contact.phone")}</a>${action(c["world.contact.whatsappCta"],worldLinks.whatsapp,"primary",true)}</article><article class="world-social"><h2>${text(c,"world.social.heading")}</h2><p>${text(c,"world.social.description")}</p><div class="world-actions">${action(c["world.social.instagramCta"],worldLinks.instagram,"secondary",true)}${action(c["world.social.tiktokCta"],worldLinks.tiktok,"secondary",true)}</div></article></div></section>`;
}
export function renderGlobalPage(options:WorldRenderOptions):HTMLElement {
  const c=contentFor(options);
  return composeGlobalPage(c,options);
}
export function composeGlobalPage(c:WorldDisplayContent,options:WorldRenderOptions,meaning?:string):HTMLElement {
  return frame(c,options,false,renderHero(c,options.media)+renderAbout(c,options.media)+renderTalbinah(c,options.media,options.locale,options.mode==="isolated-preview"?meaning:undefined)+renderProducts(c)+renderBranches(c,options.media,options.locale)+renderStore(c)+renderContact(c));
}
