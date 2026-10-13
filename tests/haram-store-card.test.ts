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
  assert(home.indexOf("renderHero(copy)") < home.indexOf("renderHaramStoreCard()"));
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
  assert.match(styles, /min-height: 52px/);
  assert.match(styles, /:focus-visible/);
  assert.doesNotMatch(styles, /@import|font-face|gradient|media-mark|font-family:(?! inherit)/);
  for (const selector of styles.matchAll(/(?:^|\})\s*([^@{}]+)\{/g)) assert(selector[1].trim().startsWith(".swg-haram"));
});
