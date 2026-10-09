import assert from "node:assert/strict";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const output = "test-results/sabtiya";
fs.mkdirSync(output, { recursive: true });
const server = spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", "4173"], { stdio: "inherit" });
let browser;
const results = [];
let existingFontStylesheets;
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch("http://127.0.0.1:4173/")).ok) { ready = true; break; } } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert(ready, "Production preview must be reachable in the browser runner");
  browser = await chromium.launch();
  const states = [
    { name: "before", time: "2026-10-09T20:59:59Z" },
    { name: "launch", time: "2026-10-10T09:00:00Z" },
    { name: "weekly", time: "2026-10-10T21:00:00Z" }
  ];
  for (const width of [320, 390, 768, 1280]) {
    for (const state of states) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, timezoneId: "Pacific/Honolulu" });
      const page = await context.newPage();
      const errors = [], externalFonts = [], failed = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      page.on("request", request => { if (/fonts.googleapis|fonts.gstatic/.test(request.url())) externalFonts.push(request.url()); });
      page.on("requestfailed", request => failed.push(request.url()));
      await page.clock.setFixedTime(new Date(state.time));
      await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
      await page.reload({ waitUntil: "networkidle" });
      const metrics = await page.evaluate(() => {
        const section = document.querySelector("#sabtiya"), hero = document.querySelector(".hero"), destinations = document.querySelector("#destinations");
        const bounds = element => element?.getBoundingClientRect();
        return {
          count: document.querySelectorAll("#sabtiya").length,
          offers: section?.querySelectorAll(".sab-offer").length ?? 0,
          text: section?.textContent ?? "",
          weeklyDate: section?.querySelector("time")?.getAttribute("datetime"),
          overflow: document.documentElement.scrollWidth > innerWidth,
          clipped: [...(section?.querySelectorAll("h2,h3,p,li,a") ?? [])].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.textContent),
          buttons: [...(section?.querySelectorAll("a") ?? [])].map(e => ({ height: bounds(e).height, href: e.getAttribute("href"), target: e.target, rel: e.rel })),
          fontInherited: !section || getComputedStyle(section.querySelector(".sab-card")).fontFamily === getComputedStyle(document.body).fontFamily,
          direction: section && getComputedStyle(section).direction,
          positioned: !section || bounds(section).top >= bounds(hero).bottom - 1 && bounds(section).bottom <= bounds(destinations).top + 1,
          beforeGap: bounds(destinations).top - bounds(hero).bottom,
          columns: section?.querySelector(".sab-offers") && getComputedStyle(section.querySelector(".sab-offers")).gridTemplateColumns.split(" ").length,
          media: section?.querySelectorAll("img,.sab-logo").length ?? 0
        };
      });
      assert(!metrics.overflow && !metrics.clipped.length, JSON.stringify(metrics));
      assert(metrics.fontInherited && metrics.positioned);
      assert.equal(metrics.media, 0);
      assert(!/النسخة|REPLACE|data-replace/.test(metrics.text));
      if (state.name === "before") {
        assert.equal(metrics.count, 0);
        assert.equal(metrics.beforeGap, 0, "Inert mount must create no layout gap");
      } else {
        assert.equal(metrics.count, 1);
        assert.equal(metrics.direction, "rtl");
        assert(metrics.buttons.every(button => button.height >= 44 && button.target === "_blank" && button.rel.includes("noopener") && button.rel.includes("noreferrer")));
        const expected = ["https://maps.app.goo.gl/TrhRQ4bykuBKf6bo7?g_st=ipc",
          ...(state.name === "launch" ? ["https://maps.app.goo.gl/39mDVAhBHQNr4UfM6?g_st=ic"] : []), "https://saweegsa.com/ar"];
        assert.deepEqual(metrics.buttons.map(button => button.href), expected);
        if (state.name === "launch") {
          assert.equal(metrics.offers, 2);
          assert.equal(metrics.columns, width < 640 ? 1 : 2);
          assert(metrics.text.includes("العرضان السبت 10 أكتوبر فقط."));
          assert(!metrics.text.includes("موعدنا كل سبت"));
        } else {
          assert.equal(metrics.offers, 0);
          assert.equal(metrics.weeklyDate, "2026-10-17");
          assert(metrics.text.includes("موعدنا كل سبت"));
          assert(!metrics.text.includes("العرضان"));
        }
        await page.locator("#sabtiya a").first().focus();
        assert(await page.locator("#sabtiya a").first().evaluate(e => getComputedStyle(e).outlineStyle !== "none"));
      }
      await page.screenshot({ path: `${output}/${state.name}-${width}.png`, fullPage: true });
      for (let y = 0; y < await page.evaluate(() => document.body.scrollHeight); y += 700) {
        await page.evaluate(value => window.scrollTo(0, value), y);
      }
      await page.waitForTimeout(300);
      assert.equal(await page.locator("img").evaluateAll(images => images.filter(i => i.complete && !i.naturalWidth).length), 0);
      assert.deepEqual(errors, []);
      const fontStylesheets = [...new Set(externalFonts.filter(url => url.includes("fonts.googleapis.com")))].sort();
      if (state.name === "before" && existingFontStylesheets === undefined) existingFontStylesheets = fontStylesheets;
      assert.deepEqual(fontStylesheets, existingFontStylesheets, "Sabtiya must not add a font import beyond the existing site fonts");
      assert.deepEqual(failed, []);
      results.push({ width, state: state.name, status: "passed", metrics });
      console.log("PASS", width, state.name);
      await context.close();
    }
  }
  const context = await browser.newContext();
  const page = await context.newPage();
  const routeErrors = [];
  page.on("pageerror", error => routeErrors.push(error.message));
  for (const route of ["/en/", "/menu/?branch=maqsed", "/menu/?branch=bustan", "/menu/en/?branch=maqsed", "/menu/en/?branch=bustan", "/menu/haram/", ...["ar","en","ur","id","bn","tr","fa","fr","ms","ru"].map(l => "/menu/haram/" + l + "/")]) {
    assert((await page.goto("http://127.0.0.1:4173" + route)).ok(), route);
    assert((await page.reload()).ok(), route);
    assert.equal(await page.locator("#sabtiya").count(), 0);
    results.push({ route, status: "passed" });
  }
  assert.deepEqual(routeErrors, []);
  await context.close();
} catch (error) {
  results.push({ status: "failed", error: error.stack });
  throw error;
} finally {
  fs.writeFileSync(output + "/report.json", JSON.stringify(results, null, 2));
  await browser?.close();
  server.kill();
}
