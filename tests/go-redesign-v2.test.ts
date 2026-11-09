import assert from "node:assert/strict";
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import test from "node:test";
import { parseHTML } from "linkedom";
import { getCopy } from "../src/i18n/index.ts";
import { renderHomePage } from "../src/pages/home.ts";
import { renderBranches } from "../src/components/branches.ts";
import { renderContactPage } from "../src/pages/contact.ts";
import { renderHeader } from "../src/components/header.ts";
import { renderFooter } from "../src/components/footer.ts";
import { createPathFor } from "../src/pages/routes.ts";
import { renderReturnNavigation, safeInternalPrevious } from "../src/components/return-navigation.ts";
import { goCopy, returnCopy } from "../src/content/go-redesign.ts";

const baseline = "dc961fd9810857c0f544b40698f179a90fe21a61";
const gitFile=promisify(execFile);
console.log("Go v2 verification module loaded");
const read = (file: string) => fs.readFileSync(file, "utf8");
const assertAdditiveSitemap = (before: string, after: string): void => {
  const additions=["branches/","en/branches/","contact/","en/contact/"].map(path=>"https://go.saweegsa.com/"+path);
  let original=after;
  for(const href of additions){
    const line="  <url><loc>"+href+"</loc></url>\n";
    assert.equal(original.split(line).length,2,href);
    original=original.replace(line,"");
  }
  assert.equal(original,before,"Every previous sitemap byte must remain unchanged");
};

test("v2 preserves all commercial data, localization, image assets, campaigns and article content against production", {timeout:180000}, async () => {
  const files = execFileSync("git", ["-c", "core.quotePath=false", "ls-tree", "-r", "--name-only", baseline,
    "src/menu/data", "src/menu/i18n", "src/menu/haram/data.ts", "src/menu/haram/locales.ts",
    "src/config/site.ts", "src/menu/config/site.ts", "src/content/about.ts", "src/content/participations.ts",
    "src/data/participations.ts", "src/pages/about.ts", "src/pages/participation.ts", "src/analytics.ts",
    "content-source", "public", "assets-source"], {encoding:"utf8"}).trim().split("\n");
  assert(files.length > 100);
  console.log("Verifying every baseline source and asset:",files.length);
  for (const [index,file] of files.entries()) {
    const {stdout:before}=await gitFile("git", ["show", baseline + ":" + file], {encoding:"buffer",maxBuffer:64*1024*1024});
    // Keep runner IPC and file I/O responsive while comparing every original byte.
    const after=await fs.promises.readFile(file);
    if(file==="public/sitemap.xml") assertAdditiveSitemap(before.toString("utf8"),after.toString("utf8"));
    // Compare the complete buffers byte-for-byte, but report only the filename
    // and comparison result instead of constructing a multi-megabyte image diff.
    else assert.equal(Buffer.compare(after,before),0,file);
    if((index+1)%25===0)console.log("Verified baseline files:",index+1,"/",files.length);
  }
  const previous = execFileSync("git", ["show", baseline + ":src/components/sabtiya.ts"], {encoding:"utf8"});
  assert.equal(read("src/components/sabtiya.ts").replace("sabtiya-section announcement-card","sabtiya-section container"), previous);
});

test("visual source transitions cannot exempt commercial data, translations or image assets", () => {
  const transition=JSON.parse(read("tests/fixtures/go-redesign-v2-source-transition.json"));
  for(const file of Object.keys(transition.files))assert(!/^(?:src\/menu\/(?:data|i18n)\/|src\/menu\/haram\/(?:data|locales)\.ts|assets-source\/|content-source\/|public\/(?!sitemap\.xml$))/.test(file),file+": commercial/content asset exception is forbidden");
  assertAdditiveSitemap(execFileSync("git",["show",baseline+":public/sitemap.xml"],{encoding:"utf8"}),read("public/sitemap.xml"));
});

test("home has three approved destinations, compact welcome and only the existing Arabic announcements", () => {
  for (const locale of ["ar", "en"] as const) {
    const copy = getCopy(locale);
    const {document} = parseHTML(renderHomePage(locale, copy, "/", "/about/", "/opportunities/"));
    assert.equal(document.querySelector("h1")!.textContent, goCopy[locale].welcome);
    assert.equal(document.querySelectorAll(".destination-gate").length, 3);
    assert.deepEqual([...document.querySelectorAll(".destination-gate")].map(a=>a.getAttribute("href")),
      [locale === "en" ? "/menu/en/" : "/menu/", locale === "en" ? "/en/branches/" : "/branches/", "https://saweegsa.com/ar"]);
    assert.equal(document.querySelectorAll(".home-announcements").length, locale === "ar" ? 1 : 0);
    assert.equal(document.querySelectorAll(".story-section,.quick-links,.participations-home,.delivery-actions").length,0);
  }
});

test("header has exactly one home item per navigation and footer retains all downloads and its two approved lines", () => {
  for (const locale of ["ar", "en"] as const) {
    const options = {locale, page:"about" as const, copy:getCopy(locale),prefix:"/",pathFor:createPathFor("/")};
    const {document:header} = parseHTML(renderHeader(options));
    for (const selector of [".desktop-nav", ".mobile-navigation-inner"]) {
      assert.equal([...header.querySelectorAll(selector + " a")].filter(a=>a.textContent===getCopy(locale).nav.home).length,1);
    }
    const {document:footer} = parseHTML(renderFooter(options));
    assert.equal(footer.querySelector(".footer-tagline")!.textContent,goCopy[locale].footerMain);
    assert.equal(footer.querySelector(".footer-subtitle")!.textContent,goCopy[locale].footerSub);
    assert.equal(footer.querySelectorAll("a[download]").length,2);
    assert.equal(footer.querySelectorAll(".footer-social a").length,4);
  }
});

test("branch hours and actual contact/download destinations are explicit without fabricated business information", () => {
  const {document} = parseHTML(renderBranches(getCopy("ar"),"ar",true));
  for (const value of ["من هنا بدأت حكاية سويق","٤:٣٠ عصرًا – ١٢ منتصف الليل","٤:٣٠ عصرًا – ٢ صباحًا",
    "٦ صباحًا – ١٢ ظهرًا","٤:٣٠ عصرًا – ١١:٣٠ مساءً","نستقبلكم على مدار الساعة"]) assert(document.toString().includes(value));
  assert.equal(document.querySelector(".always-time strong")!.textContent,"24");
  const {document:contact} = parseHTML(renderContactPage("ar",getCopy("ar")));
  assert.equal(contact.querySelectorAll(".contact-rows a").length,8);
  assert.equal(contact.querySelectorAll("a[download]").length,2);
  assert.equal(contact.querySelector('a[href="https://wa.me/966570052424"]')?.getAttribute("rel"),"noopener noreferrer");
});

test("return navigation is localized, keeps direct-entry fallback, and rejects external and self referers", () => {
  assert.equal(safeInternalPrevious("https://other.example/", "https://go.saweegsa.com","/about/"),null);
  assert.equal(safeInternalPrevious("https://go.saweegsa.com/about/", "https://go.saweegsa.com","/about/"),null);
  assert.equal(safeInternalPrevious("not a url", "https://go.saweegsa.com","/about/"),null);
  assert.equal(safeInternalPrevious("https://go.saweegsa.com/menu/?branch=bustan#extras", "https://go.saweegsa.com","/about/"),"/menu/?branch=bustan#extras");
  for (const locale of Object.keys(returnCopy) as (keyof typeof returnCopy)[]) {
    const {document} = parseHTML(renderReturnNavigation(locale,"/"));
    assert.equal(document.querySelectorAll("a").length,2);
    assert.equal(document.querySelector("[data-previous-page]")!.getAttribute("href"),"/");
    assert.equal(document.querySelector("[data-previous-page]")!.textContent,returnCopy[locale].previous);
  }
  const app=read("src/menu/scripts/app.ts");
  assert(!app.includes("getStoredBranch"));
  assert.match(app,/fixedBranch \?\? validBranch\(params\.get\("branch"\)\) \?\? "maqsed"/);
  assert.match(app,/saweegPrevious/);
  assert.match(app,/get\("branch"\) === "haram"/);
});

test("approved semantic palette, independent text selectors and all existing product media remain explicit", () => {
  const tokens=read("src/styles/tokens.css");
  for (const color of ["#5c6351","#344331","#f4f1ec","#e8e5dc","#c4a972","#d3c19f"]) assert(tokens.toLowerCase().includes(color));
  const pages=read("src/styles/go-pages.css");
  assert.match(pages,/\.destination-gate \.icon-chip\{[^}]*background:var\(--color-icon-tile\);color:var\(--color-white\)/);
  for(const file of ["src/menu/styles/components.css","src/menu/haram/haram.css"]) assert.match(read(file),/aspect-ratio:\s*4\s*\/\s*3/);
  assert.match(read("src/styles/sabtiya.css"),/background:var\(--color-primary-dark\)/);
  assert.match(read("src/styles/sabtiya.css"),/box-shadow:var\(--focus-ring-on-dark\)/);
  const menu=read("src/menu/templates/menu-page.ts");
  assert.match(menu,/haram\.href = menuBasePath \+ "haram\/"/);
  assert(!menu.includes('createElement("h2", "section-title", messages.branchSectionTitle)'));
  assert(!menu.includes("messages.branchSectionBody"));
  assert(!read("src/styles/participations.css").includes("border-inline-start: 4px"));
});
