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
  "CNAME",
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
const sitemap = readDist("sitemap.xml");
const manifest = JSON.parse(readDist("menu/site.webmanifest"));
const cname = readDist("CNAME").trim();

const requiredHtmlSnippets = [
  [menuAr, "https://go.saweegsa.com/menu/", "Arabic menu canonical"],
  [menuAr, "https://go.saweegsa.com/menu/en/", "Arabic menu alternate"],
  [menuEn, "https://go.saweegsa.com/menu/en/", "English menu canonical"],
  [menuEn, "https://go.saweegsa.com/menu/", "English menu alternate"],
  [menuAr, "/menu/site.webmanifest", "Arabic menu manifest"],
  [menuEn, "/menu/site.webmanifest", "English menu manifest"]
];

for (const [html, snippet, label] of requiredHtmlSnippets) {
  if (!html.includes(snippet)) failures.push(`Missing ${label}: ${snippet}`);
}

const sitemapUrls = [
  "https://go.saweegsa.com/menu/",
  "https://go.saweegsa.com/menu/en/",
  "https://go.saweegsa.com/menu/?branch=maqsed",
  "https://go.saweegsa.com/menu/?branch=bustan",
  "https://go.saweegsa.com/menu/en/?branch=maqsed",
  "https://go.saweegsa.com/menu/en/?branch=bustan"
];
for (const url of sitemapUrls) {
  if (!sitemap.includes(url)) failures.push(`Missing sitemap URL: ${url}`);
}

if (cname !== "go.saweegsa.com") failures.push(`Unexpected CNAME: ${cname}`);
if (manifest.start_url !== "/menu/") failures.push(`Unexpected menu start_url: ${manifest.start_url}`);
if (manifest.scope !== "/menu/") failures.push(`Unexpected menu scope: ${manifest.scope}`);

const productDirectory = path.join(distRoot, "menu", "assets", "products");
const productImages = fs.existsSync(productDirectory)
  ? fs.readdirSync(productDirectory).filter((name) => name.endsWith(".webp"))
  : [];
if (productImages.length !== 19) {
  failures.push(`Expected 19 menu product images, found ${productImages.length}`);
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

verifyLocalReferences("menu/index.html", menuAr);
verifyLocalReferences("menu/en/index.html", menuEn);

const result = {
  expectedFiles: expectedFiles.length,
  checkedTextFiles: textFiles.length,
  productImages: productImages.length,
  legacyDomainReferences: failures.filter((item) => item.includes("Legacy menu domain")).length,
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exitCode = 1;
