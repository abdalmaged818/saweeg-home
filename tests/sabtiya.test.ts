import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getSabtiyaState, renderSabtiya, sabtiyaSchedule } from "../src/components/sabtiya.ts";

test("Sabtiya is absent before the authoritative Riyadh launch", () => {
  assert.equal(sabtiyaSchedule.timeZone, "Asia/Riyadh");
  assert.equal(renderSabtiya(new Date("2026-10-09T20:59:59.999Z")), "");
});

test("Only the two launch cards appear throughout 10 October in Riyadh", () => {
  for (const instant of ["2026-10-09T21:00:00Z", "2026-10-10T20:59:59.999Z"]) {
    const html = renderSabtiya(new Date(instant));
    assert.equal(getSabtiyaState(new Date(instant)).version, "launch");
    assert.equal((html.match(/<article /g) ?? []).length, 2);
    assert(html.includes("العرضان السبت 10 أكتوبر فقط."));
    assert(!html.includes("موعدنا كل سبت"));
    for (const link of html.matchAll(/<a [^>]+>/g)) {
      assert(link[0].includes('target="_blank"'));
      assert(link[0].includes('rel="noopener noreferrer"'));
      assert(link[0].includes("aria-label="));
    }
  }
});

test("Weekly version advances only after Saturday ends in Riyadh", () => {
  for (const [instant, expected] of [
    ["2026-10-10T21:00:00Z", "2026-10-17"],
    ["2026-10-16T21:00:00Z", "2026-10-17"],
    ["2026-10-17T20:59:59.999Z", "2026-10-17"],
    ["2026-10-17T21:00:00Z", "2026-10-24"],
    ["2026-12-31T21:00:00Z", "2027-01-02"]
  ]) {
    const state = getSabtiyaState(new Date(instant));
    assert.equal(state.version, "weekly");
    if (state.version === "weekly") assert.equal(state.date, expected);
    const html = renderSabtiya(new Date(instant));
    assert(html.includes("موعدنا كل سبت"));
    assert(!html.includes("sab-offers"));
    assert(!html.includes("العرضان"));
  }
});

test("Campaign decisions do not depend on the visitor timezone", () => {
  const previous = process.env.TZ;
  try {
    const expected = getSabtiyaState(new Date("2026-10-17T21:00:00Z"));
    for (const zone of ["Pacific/Honolulu", "Asia/Tokyo", "America/New_York"]) {
      process.env.TZ = zone;
      assert.deepEqual(getSabtiyaState(new Date("2026-10-17T21:00:00Z")), expected);
    }
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
});

test("Customer component has exact destinations and no template guidance or media", () => {
  const html = renderSabtiya(new Date("2026-10-10T12:00:00+03:00")) +
    renderSabtiya(new Date("2026-10-11T12:00:00+03:00"));
  for (const url of [
    "https://maps.app.goo.gl/TrhRQ4bykuBKf6bo7?g_st=ipc",
    "https://maps.app.goo.gl/39mDVAhBHQNr4UfM6?g_st=ic",
    "https://saweegsa.com/ar"
  ]) assert(html.includes(url));
  assert(!/النسخة|data-replace|REPLACE|<!--|<img|IBM Plex/.test(html));
  const css = fs.readFileSync(new URL("../src/styles/sabtiya.css", import.meta.url), "utf8");
  assert(!/@import|font-face|font-family:(?! inherit)/.test(css));
  assert(css.includes("min-height: 48px"));
  const home = fs.readFileSync(new URL("../src/pages/home.ts", import.meta.url), "utf8");
  assert(home.indexOf("renderHero(copy)") < home.indexOf('id="sabtiya-slot"'));
  assert(home.indexOf('id="sabtiya-slot"') < home.indexOf('class="destinations-section"'));
  assert(home.includes('locale === "ar"'));
});
