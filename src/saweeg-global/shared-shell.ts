import { renderHeader } from "../components/header.ts";
import { renderFooter } from "../components/footer.ts";
import { getCopy } from "../i18n/index.ts";
import type { WorldContent } from "./content/ar.ts";

export interface ShellLink { label: string; href: string; external?: boolean }
export interface WorldShellProps {
  content: WorldContent;
  selectorHref: string;
  navigation: readonly ShellLink[];
  footerLinks: readonly ShellLink[];
  minimal: boolean;
}
const parsed = (html: string): HTMLElement => {
  const template = document.createElement("template");
  template.innerHTML = html;
  const root = template.content.firstElementChild;
  if (!(root instanceof HTMLElement)) throw new Error("Shared shell root missing");
  return root;
};
export const shellAnchor = ({label,href,external}: ShellLink): HTMLAnchorElement => {
  const anchor = document.createElement("a");
  anchor.textContent = label; anchor.href = href;
  if (external) { anchor.target = "_blank"; anchor.rel = "noopener noreferrer"; }
  return anchor;
};
function required<T extends Element>(root: Element, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Shared shell slot changed: ${selector}`);
  return element;
}
// A DOM adapter composes the actual production renderers; it never forks their
// structural HTML or modifies their existing callers. Slot contracts fail closed.
export function worldHeader(props: WorldShellProps): HTMLElement {
  const c=props.content;
  const copy=getCopy("ar");
  const root=parsed(renderHeader({locale:"ar",page:"home",copy,prefix:"/",pathFor:()=>props.selectorHref}));
  const brand=required<HTMLAnchorElement>(root,".brand");
  brand.href=props.selectorHref;brand.setAttribute("aria-label",c["world.brand.homeLabel"]);
  required<HTMLImageElement>(brand,"img").alt="";
  const menu=required<HTMLButtonElement>(root,".menu-button");
  menu.setAttribute("aria-label",c["world.navigation.openMenu"]);
  menu.dataset.openLabel=c["world.navigation.openMenu"];menu.dataset.closeLabel=c["world.navigation.closeMenu"];
  for(const selector of [".desktop-nav",".mobile-navigation-inner"]) {
    const nav=required<HTMLElement>(root,selector);
    nav.replaceChildren(...props.navigation.map(shellAnchor));
    nav.setAttribute("aria-label",c["world.navigation.label"]);
  }
  const actions=required<HTMLElement>(root,".header-actions");
  if(props.minimal) {
    actions.remove(); required(root,".desktop-nav").remove(); required(root,".mobile-navigation").remove();
  } else {
    const language=required<HTMLAnchorElement>(root,".language-link");
    language.replaceWith(Object.assign(shellAnchor({label:c["world.language.changeCta"],href:props.selectorHref}),{className:"language-link"}));
  }
  root.querySelectorAll("[data-analytics-event],[data-locale-switch]").forEach(element=>{element.removeAttribute("data-analytics-event");element.removeAttribute("data-locale-switch");});
  return root;
}
export function worldFooter(props: WorldShellProps): HTMLElement {
  const c=props.content;
  const copy=getCopy("ar");
  const root=parsed(renderFooter({locale:"ar",page:"home",copy,prefix:"/",pathFor:()=>props.selectorHref}));
  const nav=required<HTMLElement>(root,".footer-nav");
  nav.setAttribute("aria-label",c["world.navigation.label"]);
  // The unlinked footer logo uses the invariant brand name, not another content key.
  required<HTMLImageElement>(root,".footer-brand img").alt="Saweeg";
  required<HTMLElement>(root,".footer-brand p").textContent=c["world.footer.tagline"];
  required<HTMLElement>(root,".footer-bottom>span").textContent=c["world.footer.rights"];
  const heading=document.createElement("h2");heading.className="footer-nav-title";heading.textContent=c["world.footer.linksTitle"];
  nav.replaceChildren(heading,...props.footerLinks.map(shellAnchor));
  required(root,".footer-downloads").remove();
  const utility=required(root,".footer-language");
  if(props.minimal)utility.remove();else{
    const row=document.createElement("div");row.className="world-footer-utility";
    row.append(shellAnchor({label:c["world.language.changeCta"],href:props.selectorHref}),shellAnchor({label:c["world.navigation.backToTop"],href:"#world-top"}));
    utility.replaceWith(row);
  }
  root.querySelectorAll("[data-analytics-event],[data-locale-switch]").forEach(element=>{element.removeAttribute("data-analytics-event");element.removeAttribute("data-locale-switch");});
  return root;
}
