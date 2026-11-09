import { returnCopy } from "../content/go-redesign.ts";

export const renderReturnNavigation = (locale: keyof typeof returnCopy, home: string): string => {
  const copy = returnCopy[locale];
  return `<nav class="page-return container" aria-label="${copy.previous}">
    <a class="button button-outline" href="${home}" data-previous-page>${copy.previous}</a>
    <a class="button button-primary" href="${home}">${copy.home}</a>
  </nav>`;
};

export const safeInternalPrevious = (referrer: string, origin: string, current: string): string | null => {
  try {
    const url = new URL(referrer);
    const previous = `${url.pathname}${url.search}${url.hash}`;
    return url.origin === origin && previous !== current ? previous : null;
  } catch { return null; }
};

export const bindReturnNavigation = (scope: ParentNode = document): void => {
  const current = `${location.pathname}${location.search}${location.hash}`;
  const existing = history.state?.saweegPrevious as unknown;
  const previous = typeof existing === "string"
    ? safeInternalPrevious(new URL(existing, location.origin).href, location.origin, current)
    : safeInternalPrevious(document.referrer, location.origin, current);
  history.replaceState({ ...history.state, saweegPrevious: previous }, "");
  scope.querySelectorAll<HTMLAnchorElement>("[data-previous-page]").forEach(link => {
    link.addEventListener("click", event => {
      const candidate = history.state?.saweegPrevious;
      const target = typeof candidate === "string" && safeInternalPrevious(new URL(candidate, location.origin).href, location.origin, `${location.pathname}${location.search}${location.hash}`);
      if (target && !window.opener && history.length > 1) { event.preventDefault(); history.back(); }
    });
  });
};
