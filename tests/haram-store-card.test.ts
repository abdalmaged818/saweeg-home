import { parseHTML } from "linkedom";
import { renderBranches } from "../src/components/branches.ts";
import { getCopy } from "../src/i18n/index.ts";
import { siteConfig } from "../src/config/site.ts";
import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import sharp from "sharp";
import { renderHaramStoreCard, haramStorePhoto } from "../src/components/haram-store-card.ts";

test("Haram introduction contains only exact approved customer content and safe Maps destination", () => {
  const html = renderHaramStoreCard();
  for (const value of ["جديدنا", "فرع سويق", "في الحرم", "جرعة سلام من جوار خير الأنام",
    "باب السلام ٣١٤", "نستقبلكم على مدار الساعة", "موقع الفرع",
    "https://maps.app.goo.gl/t7VQtDZSWHREcnXL6?g_st=ic",
    'target="_blank"', 'rel="noopener noreferrer"', 'aria-label="موقع الفرع']) assert(html.includes(value));
  assert.equal((html.match(/<img /g) ?? []).length, 1);
  assert.equal((html.match(/<svg /g) ?? []).length, 3);
  assert.doesNotMatch(html, /media-mark|fallback|placeholder|PUT-REAL|COMPONENT|معاينة|<!--|<link|<script|<style/);
  assert.match(html, /width="1142" height="1377" loading="lazy" decoding="async"/);
});

test("Haram introduction is Arabic-only, between hero and unchanged Sabtiya mount", () => {
  const home = fs.readFileSync(new URL("../src/pages/home.ts", import.meta.url), "utf8");
  assert.match(home, /locale === "ar" \? renderHaramStoreCard\(\) : ""/);
  assert(home.indexOf("renderHero(copy, prefix, aboutPath)") >= 0);
  assert(home.indexOf("renderHero(copy, prefix, aboutPath)") < home.indexOf("renderHaramStoreCard()"));
  assert(home.indexOf("renderHaramStoreCard()") < home.indexOf('id="sabtiya-slot"'));
  assert(home.indexOf('id="sabtiya-slot"') < home.indexOf('class="destinations-section"'));
});

test("Haram photo preserves full original proportions, and CSS stays isolated", async () => {
  const source = await sharp(haramStorePhoto.source).metadata();
  const output = await sharp("public" + haramStorePhoto.output).metadata();
  assert.equal(output.format, "webp");
  assert.deepEqual([source.width, source.height], [1142, 1377]);
  assert.deepEqual([output.width, output.height], [source.width, source.height]);
  const styles = fs.readFileSync(new URL("../src/styles/haram-store-card.css", import.meta.url), "utf8");
  assert.match(styles, /aspect-ratio: 4 \/ 3/);
  assert.match(styles, /object-fit: cover; object-position: 50% 58%/);
  assert.match(styles, /min-height: 48px/);
  assert.match(styles, /:focus-visible/);
  assert.doesNotMatch(styles, /@import|font-face|gradient|media-mark|font-family:(?! inherit)/);
  for (const selector of styles.matchAll(/(?:^|\})\s*([^@{}]+)\{/g)) assert(selector[1].trim().startsWith(".swg-haram"));
});

test("homepage Haram menu actions use the centralized selector, localized copy and same-tab analytics", () => {
  assert.equal(siteConfig.links.haramMenu, "/menu/haram/");
  for (const locale of ["ar", "en"] as const) {
    const copy = getCopy(locale);
    const {document} = parseHTML(renderBranches(copy));
    const menu = document.querySelector('a[data-analytics-event="branch_menu_click"][data-analytics-label="haram"]')!;
    assert(menu);
    assert.equal(menu.getAttribute("href"), siteConfig.links.haramMenu);
    assert.equal(menu.textContent, locale === "ar" ? "اطلع على المينيو" : "View Menu");
    assert.equal(menu.hasAttribute("target"), false);
    for (const branch of ["maqsed", "bustan"] as const) {
      const link = document.querySelector(`a[data-analytics-event="branch_menu_click"][data-analytics-label="${branch}"]`)!;
      assert.equal(link.getAttribute("href"), siteConfig.links[`${branch}Menu`]);
      assert.equal(link.textContent, copy.branches.menuCta);
      assert.equal(link.getAttribute("target"), "_blank");
    }
  }
  const {document} = parseHTML(renderHaramStoreCard());
  const actions = document.querySelector(".swg-haram__actions")!;
  assert.equal(actions.querySelectorAll("a").length, 2);
  const menu = actions.querySelector('a[data-analytics-label="haram"]')!;
  assert.equal(menu.getAttribute("href"), siteConfig.links.haramMenu);
  assert.equal(menu.textContent, "اطلع على المينيو");
  assert.equal(menu.getAttribute("data-analytics-event"), "branch_menu_click");
  assert.equal(menu.hasAttribute("target"), false);
  assert.equal(actions.querySelector('a[target="_blank"]')!.getAttribute("href"), "https://maps.app.goo.gl/t7VQtDZSWHREcnXL6?g_st=ic");
});
