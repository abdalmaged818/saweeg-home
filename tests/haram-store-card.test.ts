import { parseHTML } from "linkedom";
import { renderBranches } from "../src/components/branches.ts";
import { getCopy } from "../src/i18n/index.ts";
import { siteConfig } from "../src/config/site.ts";
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { renderHaramStoreCard, haramStorePhoto } from "../src/components/haram-store-card.ts";
import { renderHomePage } from "../src/pages/home.ts";

test("compact Haram announcement retains exact customer content and its distinct approved Maps destination", () => {
  const html = renderHaramStoreCard();
  for (const value of ["جديدنا", "فرع سويق في الحرم", "جرعة سلام من جوار خير الأنام",
    "باب السلام ٣١٤", "نستقبلكم على مدار الساعة", "موقع الفرع",
    "https://maps.app.goo.gl/t7VQtDZSWHREcnXL6?g_st=ic"]) assert(html.includes(value));
  const { document } = parseHTML(html);
  assert.equal(document.querySelectorAll("img").length, 1);
  const maps = document.querySelector('a[target="_blank"]')!;
  assert.equal(maps.getAttribute("rel"), "noopener noreferrer");
  assert.doesNotMatch(html, /media-mark|fallback|placeholder|PUT-REAL|COMPONENT|معاينة|<!--|<link|<script|<style/);
  assert.match(html, /width="1142" height="1377" loading="lazy" decoding="async"/);
});

test("Haram announcement is Arabic-only, after destinations and before the unchanged Sabtiya mount", () => {
  const ar = renderHomePage("ar", getCopy("ar"), "/", "/about/", "/opportunities/");
  const en = renderHomePage("en", getCopy("en"), "/", "/en/about/", "/en/opportunities/");
  assert.equal((ar.match(/class="swg-haram announcement-card"/g) ?? []).length, 1);
  assert(!en.includes('class="swg-haram'));
  assert(ar.indexOf('id="destinations"') < ar.indexOf('class="home-announcements'));
  assert(ar.indexOf('class="swg-haram') < ar.indexOf('id="sabtiya-slot"'));
  assert(!en.includes("sabtiya-slot"));
});

test("unchanged original photo is displayed in the approved compact portrait thumbnail", async () => {
  const source = await sharp(haramStorePhoto.source).metadata();
  const output = await sharp("public" + haramStorePhoto.output).metadata();
  assert.equal(output.format, "webp");
  assert.deepEqual([source.width, source.height], [1142, 1377]);
  assert.deepEqual([output.width, output.height], [source.width, source.height]);
  const styles = fs.readFileSync(new URL("../src/styles/haram-store-card.css", import.meta.url), "utf8");
  assert.match(styles, /aspect-ratio:\s*4\s*\/\s*5/);
  assert.match(styles, /object-fit:\s*cover;object-position:\s*50% 58%/);
  assert.match(styles, /min-height:\s*44px/);
  assert.doesNotMatch(styles, /@import|font-face|gradient|media-mark|font-family/);
  for (const selector of styles.matchAll(/(?:^|\})\s*([^@{}]+)\{/g)) assert(selector[1].trim().startsWith(".swg-haram"));
});

test("branch actions retain verified Maps and menu destinations with explicit English branch queries", () => {
  for (const locale of ["ar", "en"] as const) {
    const copy = getCopy(locale), { document } = parseHTML(renderBranches(copy, locale));
    for (const branch of ["maqsed", "bustan", "haram"] as const) {
      const menu = document.querySelector(`a[data-analytics-event="branch_menu_click"][data-analytics-label="${branch}"]`)!;
      const expected = siteConfig.links[`${branch}Menu`];
      assert.equal(menu.getAttribute("href"), locale === "en" && branch !== "haram" ? expected.replace("/menu/?", "/menu/en/?") : expected);
      assert.equal(menu.hasAttribute("target"), false);
      const map = document.querySelector(`a[data-analytics-event="branch_map_click"][data-analytics-label="${branch}"]`)!;
      assert.equal(map.getAttribute("href"), siteConfig.links[`${branch}Map`]);
    }
  }
  const { document } = parseHTML(renderHaramStoreCard());
  const actions = document.querySelector(".swg-haram__actions")!;
  assert.equal(actions.querySelectorAll("a").length, 2);
  const menu = actions.querySelector('a[data-analytics-label="haram"]')!;
  assert.equal(menu.getAttribute("href"), siteConfig.links.haramMenu);
  assert.equal(menu.textContent, getCopy("ar").branches.haramMenuCta);
  assert.equal(menu.hasAttribute("target"), false);
});
