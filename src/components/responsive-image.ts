interface ResponsiveImageOptions {
  prefix: string;
  base: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
  position?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

export const renderResponsiveImage = ({
  prefix,
  base,
  alt,
  width,
  height,
  sizes,
  className = "",
  position = "50% 50%",
  loading = "lazy",
  fetchPriority = "auto"
}: ResponsiveImageOptions): string => {
  const path = `${prefix}${base}`;
  return `<picture class="${className}">
    <source type="image/webp" srcset="${path}-640.webp 640w, ${path}-960.webp 960w, ${path}-1440.webp 1440w" sizes="${sizes}">
    <img src="${path}-960.webp" alt="${alt}" width="${width}" height="${height}" loading="${loading}" fetchpriority="${fetchPriority}" decoding="async" style="object-position:${position}">
  </picture>`;
};
