import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getCopy } from "../src/i18n/index.ts";
import type { Locale, PageId } from "../src/types/site.ts";
import { renderAboutPage } from "../src/pages/about.ts";
import { renderBlogPage } from "../src/pages/blog.ts";
import { renderDocument } from "../src/pages/document.ts";
import { renderHomePage } from "../src/pages/home.ts";
import { renderNewsPage } from "../src/pages/news.ts";
import { createPathFor } from "../src/pages/routes.ts";

interface PageTarget {
  locale: Locale;
  page: PageId;
  file: string;
  prefix: string;
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const targets: PageTarget[] = [
  { locale: "ar", page: "home", file: "index.html", prefix: "./" },
  { locale: "en", page: "home", file: "en/index.html", prefix: "../" },
  { locale: "ar", page: "about", file: "about/index.html", prefix: "../" },
  { locale: "en", page: "about", file: "en/about/index.html", prefix: "../../" },
  { locale: "ar", page: "news", file: "news/index.html", prefix: "../" },
  { locale: "en", page: "news", file: "en/news/index.html", prefix: "../../" },
  { locale: "ar", page: "blog", file: "blog/index.html", prefix: "../" },
  { locale: "en", page: "blog", file: "en/blog/index.html", prefix: "../../" }
];

const renderPage = ({ locale, page, prefix }: PageTarget): string => {
  const copy = getCopy(locale);
  const pathFor = createPathFor(prefix);
  let content = "";

  if (page === "home") content = renderHomePage(locale, copy, prefix, pathFor(locale, "about"));
  if (page === "about") content = renderAboutPage(copy, prefix, pathFor(locale, "home"));
  if (page === "news") content = renderNewsPage(copy, pathFor(locale, "home"));
  if (page === "blog") content = renderBlogPage(copy, pathFor(locale, "home"));

  return renderDocument({ locale, page, prefix, content });
};

for (const target of targets) {
  const outputPath = resolve(projectRoot, target.file);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderPage(target), "utf8");
}

const notFoundCopy = getCopy("ar");
const notFoundContent = `
  <section class="not-found" aria-labelledby="not-found-title">
    <div class="container not-found-inner">
      <span class="eyebrow">${notFoundCopy.notFound.eyebrow}</span>
      <h1 id="not-found-title">${notFoundCopy.notFound.title}</h1>
      <p>${notFoundCopy.notFound.description}</p>
      <a class="button button-primary" href="./">${notFoundCopy.notFound.cta}</a>
    </div>
  </section>`;
await writeFile(resolve(projectRoot, "404.html"), renderDocument({
  locale: "ar",
  page: "home",
  prefix: "./",
  content: notFoundContent,
  noIndex: true,
  dynamicBase: true
}), "utf8");

console.log(`Generated ${targets.length + 1} HTML pages.`);
