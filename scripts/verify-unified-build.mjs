import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distRoot = path.join(projectRoot, "dist");

const expectedFiles = [
  "index.html",
  "en/index.html",
  "about/index.html",
  "en/about/index.html",
  "news/index.html",
  "en/news/index.html",
  "news/umrah-forum-2026/index.html",
  "en/news/umrah-forum-2026/index.html",
  "news/cultures-festival-2026/index.html",
  "en/news/cultures-festival-2026/index.html",
  "news/bustan-emir-visit/index.html",
  "en/news/bustan-emir-visit/index.html",
  "news/princess-sara-meeting/index.html",
  "en/news/princess-sara-meeting/index.html",
  "menu/index.html",
  "menu/en/index.html",
  "menu/404.html",
  "menu/site.webmanifest",
  "menu/assets/brand/logo-saweeg.svg",
  "assets/social/saweeg-gateway-preview-20260910.png",
  "assets/documents/saweeg-official-profile-2026.pdf",
  "assets/documents/saweeg-hotels-hospitality-profile-2026.pdf",
  "favicon-saweeg-202609.ico",
  "favicon-saweeg-202609-16.png",
  "favicon-saweeg-202609-32.png",
  "favicon-saweeg-202609-apple-touch-180.png",
  "assets/brand/favicon-saweeg-202609-192.png",
  "assets/brand/favicon-saweeg-202609-512.png",
  "menu/favicon-saweeg-202609.ico",
  "menu/favicon-saweeg-202609-16.png",
  "menu/favicon-saweeg-202609-32.png",
  "menu/favicon-saweeg-202609-apple-touch-180.png",
  "menu/assets/brand/favicon-saweeg-202609-192.png",
  "menu/assets/brand/favicon-saweeg-202609-512.png",
  "CNAME",
  "robots.txt",
  "sitemap.xml"
];

const failures = [];

for (const relative of expectedFiles) {
  if (!fs.existsSync(path.join(distRoot, ...relative.split("/")))) {
    failures.push(`Missing build file: ${relative}`);
  }
}

const readDist = (relative) =>
  fs.readFileSync(path.join(distRoot, ...relative.split("/")), "utf8");

const menuAr = readDist("menu/index.html");
const menuEn = readDist("menu/en/index.html");
const menuNotFound = readDist("menu/404.html");
const homeAr = readDist("index.html");
const homeEn = readDist("en/index.html");
const sitemap = readDist("sitemap.xml");
const manifest = JSON.parse(readDist("menu/site.webmanifest"));
const homeManifest = JSON.parse(readDist("site.webmanifest"));
const cname = readDist("CNAME").trim();
const homepageWelcome = "سلام من لدن أرض السلام";
const socialPreview = "https://go.saweegsa.com/assets/social/saweeg-gateway-preview-20260910.png";

for (const [html, label] of [[homeAr, "Arabic homepage"], [homeEn, "English homepage"]]) {
  const occurrences = html.split(homepageWelcome).length - 1;
  if (occurrences !== 1) failures.push(`${label} must contain the welcome phrase exactly once`);
}

for (const relative of expectedFiles.filter((file) => file.endsWith(".html") && !["index.html", "en/index.html"].includes(file))) {
  if (readDist(relative).includes(homepageWelcome)) {
    failures.push(`Welcome phrase must not appear outside the homepage: ${relative}`);
  }
}

const requiredHtmlSnippets = [
  [menuAr, "https://go.saweegsa.com/menu/", "Arabic menu canonical"],
  [menuAr, "https://go.saweegsa.com/menu/en/", "Arabic menu alternate"],
  [menuEn, "https://go.saweegsa.com/menu/en/", "English menu canonical"],
  [menuEn, "https://go.saweegsa.com/menu/", "English menu alternate"],
  [menuAr, "/menu/site.webmanifest?v=202609", "Arabic menu manifest"],
  [menuEn, "/menu/site.webmanifest?v=202609", "English menu manifest"],
  [menuAr, "/menu/favicon-saweeg-202609.ico", "Arabic menu favicon"],
  [menuEn, "/menu/favicon-saweeg-202609.ico", "English menu favicon"],
  [homeAr, "favicon-saweeg-202609.ico", "Arabic homepage favicon"],
  [homeEn, "favicon-saweeg-202609.ico", "English homepage favicon"]
];

for (const [html, snippet, label] of requiredHtmlSnippets) {
  if (!html.includes(snippet)) failures.push(`Missing ${label}: ${snippet}`);
}

for (const [html, label] of [[homeAr, "Arabic homepage"], [homeEn, "English homepage"]]) {
  for (const [path, download] of [
    ["/assets/documents/saweeg-official-profile-2026.pdf", "saweeg-official-profile-2026.pdf"],
    ["/assets/documents/saweeg-hotels-hospitality-profile-2026.pdf", "saweeg-hotels-hospitality-profile-2026.pdf"]
  ]) {
    if (!html.includes(`href="${path}" download="${download}"`)) {
      failures.push(`Missing profile download in ${label}: ${path}`);
    }
  }
}

const socialMetadataPages = [
  [homeAr, "Arabic homepage"],
  [homeEn, "English homepage"],
  [menuAr, "Arabic menu"],
  [menuEn, "English menu"],
  [menuNotFound, "Menu not found page"]
];
for (const [html, label] of socialMetadataPages) {
  const normalizedHtml = html.replace(/\s+/g, " ");
  const ogImageCount = (html.match(/property="og:image"/g) ?? []).length;
  if (ogImageCount !== 1) failures.push(`${label} must contain exactly one og:image`);
  for (const required of [
    `property="og:image" content="${socialPreview}"`,
    `property="og:image:secure_url" content="${socialPreview}"`,
    'property="og:image:type" content="image/png"',
    'property="og:image:width" content="1200"',
    'property="og:image:height" content="630"',
    'name="twitter:card" content="summary_large_image"',
    `name="twitter:image" content="${socialPreview}"`,
    'name="twitter:image:alt"'
  ]) {
    if (!normalizedHtml.includes(required)) failures.push(`Missing social metadata in ${label}: ${required}`);
  }
}

const publicSeoPages = expectedFiles
  .filter((file) => file.endsWith("index.html") && !file.startsWith("blog/") && !file.startsWith("opportunities/") && !file.startsWith("en/blog/") && !file.startsWith("en/opportunities/"));
for (const relative of publicSeoPages) {
  const html = readDist(relative);
  const titleCount = (html.match(/<title>/g) ?? []).length;
  const descriptionCount = (html.match(/<meta\s+name="description"/g) ?? []).length;
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="(https:\/\/[^\"]+)"/);
  const alternateCount = (html.match(/<link\s+rel="alternate"\s+hreflang="(?:ar|en|x-default)"\s+href="https:\/\//g) ?? []).length;
  if (titleCount !== 1) failures.push(`${relative} must contain exactly one title`);
  if (descriptionCount !== 1) failures.push(`${relative} must contain exactly one meta description`);
  if (!canonicalMatch) failures.push(`${relative} must contain an absolute HTTPS canonical URL`);
  if (alternateCount !== 3) failures.push(`${relative} must contain Arabic, English, and x-default hreflang links`);
}

const parseJsonLd = (html, label) => {
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (matches.length !== 1) {
    failures.push(`${label} must contain exactly one JSON-LD script`);
    return null;
  }
  try {
    return JSON.parse(matches[0][1]);
  } catch {
    failures.push(`${label} contains invalid JSON-LD`);
    return null;
  }
};

for (const [html, label, canonical] of [
  [menuAr, "Arabic menu", "https://go.saweegsa.com/menu/"],
  [menuEn, "English menu", "https://go.saweegsa.com/menu/en/"]
]) {
  const jsonLd = parseJsonLd(html, label);
  const graph = jsonLd?.["@graph"];
  const menu = Array.isArray(graph) ? graph.find((item) => item?.["@type"] === "Menu") : null;
  if (!menu || menu.url !== canonical) failures.push(`${label} must expose a canonical Menu JSON-LD entity in initial HTML`);
  if (!new RegExp(`<link\\s+rel="canonical"\\s+href="${canonical}"`).test(html)) {
    failures.push(`${label} canonical must not include a branch query parameter`);
  }
}

const sitemapUrls = [
  "https://go.saweegsa.com/menu/",
  "https://go.saweegsa.com/menu/en/"
];
for (const url of sitemapUrls) {
  if (!sitemap.includes(url)) failures.push(`Missing sitemap URL: ${url}`);
}
if (/\?branch=(?:maqsed|bustan)/.test(sitemap)) {
  failures.push("Sitemap must not contain query-parameter menu variants");
}
const robots = readDist("robots.txt");
if (!robots.includes("Sitemap: https://go.saweegsa.com/sitemap.xml")) {
  failures.push("robots.txt must reference the absolute sitemap URL");
}

if (cname !== "go.saweegsa.com") failures.push(`Unexpected CNAME: ${cname}`);
if (manifest.start_url !== "/menu/") failures.push(`Unexpected menu start_url: ${manifest.start_url}`);
if (manifest.scope !== "/menu/") failures.push(`Unexpected menu scope: ${manifest.scope}`);
const menuIconSources = manifest.icons.map((icon) => icon.src);
const homeIconSources = homeManifest.icons.map((icon) => icon.src);
for (const source of [
  "/menu/assets/brand/favicon-saweeg-202609-192.png",
  "/menu/assets/brand/favicon-saweeg-202609-512.png"
]) {
  if (!menuIconSources.includes(source)) failures.push(`Missing menu manifest icon: ${source}`);
}
for (const source of [
  "assets/brand/favicon-saweeg-202609-192.png",
  "assets/brand/favicon-saweeg-202609-512.png"
]) {
  if (!homeIconSources.includes(source)) failures.push(`Missing homepage manifest icon: ${source}`);
}

const productDirectory = path.join(distRoot, "menu", "assets", "products");
const productImages = fs.existsSync(productDirectory)
  ? fs.readdirSync(productDirectory).filter((name) => name.endsWith(".webp"))
  : [];
if (productImages.length !== 22) {
  failures.push(`Expected 22 menu product images, found ${productImages.length}`);
}

const textExtensions = new Set([".html", ".js", ".css", ".xml", ".json", ".webmanifest", ".txt"]);
const textFiles = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.isFile() && textExtensions.has(path.extname(entry.name).toLowerCase())) textFiles.push(absolute);
  }
};
walk(distRoot);

for (const absolute of textFiles) {
  const content = fs.readFileSync(absolute, "utf8");
  if (content.includes("menu.saweegsa.com")) {
    failures.push(`Legacy menu domain remains in build: ${path.relative(distRoot, absolute)}`);
  }
}

const verifyLocalReferences = (relative, html) => {
  const htmlPath = path.join(distRoot, ...relative.split("/"));
  const pattern = /(?:src|href)="([^"]+)"/g;
  for (const match of html.matchAll(pattern)) {
    const raw = match[1];
    if (/^(?:https?:|mailto:|tel:|#|data:)/i.test(raw)) continue;
    const clean = raw.split("#", 1)[0].split("?", 1)[0];
    if (!clean) continue;
    const resolved = clean.startsWith("/")
      ? path.join(distRoot, ...clean.slice(1).split("/"))
      : path.resolve(path.dirname(htmlPath), clean);
    if (!fs.existsSync(resolved)) failures.push(`Broken local reference in ${relative}: ${raw}`);
  }
};

for (const relative of expectedFiles.filter((file) => file.endsWith(".html"))) {
  verifyLocalReferences(relative, readDist(relative));
}

const result = {
  expectedFiles: expectedFiles.length,
  checkedTextFiles: textFiles.length,
  productImages: productImages.length,
  legacyDomainReferences: failures.filter((item) => item.includes("Legacy menu domain")).length,
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
