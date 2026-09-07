const markLoaded = (image: HTMLImageElement): void => {
  image.hidden = false;
  image.dataset.imageState = "loaded";
  image.closest(".brand__mark")?.classList.add("has-image");
  image.closest("[data-logo-frame]")?.classList.add("has-image");
};

const markMissing = (image: HTMLImageElement): void => {
  image.dataset.imageState = "missing";
  image.hidden = true;
  image.removeAttribute("src");
  image.closest(".brand__mark")?.classList.remove("has-image");
  image.closest("[data-logo-frame]")?.classList.remove("has-image");
};

export const attachImageFallbacks = (scope: ParentNode): void => {
  scope
    .querySelectorAll<HTMLImageElement>("img[data-fallback-kind]:not([data-fallback-ready])")
    .forEach((image) => {
      image.dataset.fallbackReady = "true";
      image.addEventListener("load", () => markLoaded(image), { once: true });
      image.addEventListener("error", () => markMissing(image), { once: true });

      if (image.complete) {
        if (image.naturalWidth > 0) {
          markLoaded(image);
        } else {
          markMissing(image);
        }
      }
    });
};
