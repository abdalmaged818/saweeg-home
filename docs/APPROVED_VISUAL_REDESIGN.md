# Approved Saweeg visual redesign

## Baseline and authority

- Phase 3 PR #42 was merged and deployed before this work.
- Production baseline: `cad38858aeb1e9033b1835f5a54b5f71121bc80a`.
- Branch: `feat/saweeg-approved-visual-redesign`.
- The working tree was clean, `origin/main` matched the baseline, and there were no open PRs at the start.
- The handoff, HTML prototype and 13 reference screenshots guide presentation only. The prototype's JavaScript, sample products, embedded images, review controls and hardcoded links were not imported.

## Component mapping

| Area | Production implementation |
|---|---|
| Palette, spacing and typography | Existing semantic tokens and base styles |
| Official header/footer | Existing renderers; shared `src/styles/chrome.css` consumed by site and menu |
| Hero | Existing official copy, existing CTA strings/destinations, unchanged Madinah image |
| Al Haram feature | Existing component/image/Maps destination; white card, controlled 4:3 frame, unchanged `50% 58%` focal position |
| Sabtiya | Existing component and scheduling untouched; stylesheet only |
| Destination and branch cards | Existing data/configuration and icon renderer; equal responsive card families |
| About preview | Existing responsive Talbinah photograph and existing localized factual alt text |
| Participations | Existing records/order/focal positions; 4:3 cards, excerpts and tablet horizontal treatment |
| Contact | Existing three destinations/labels; olive panel and equal mobile actions |
| Shared menus | Existing stable-ID localization, branch controller and full catalog; reused official header/footer, segmented branch control, category links, photographed/text-only cards |
| Haram | Existing ten-locale renderers; equal native-name/arrow selector cards and shared visual card language |

## Intentional differences from the prototype

- All production products, quantities, translations, extras and branch-specific prices remain present, not the six-item preview subset.
- Existing production links are unchanged, including the three currently different Haram Maps references.
- Existing compact language-switch wording is retained where production uses it (for example `EN`), rather than adopting prototype wording.
- Haram keeps its existing localized branch-specific navigation/support/footer destinations. No untranslated global navigation or newly invented multilingual labels are introduced.
- All selector cards use the same explicit row height; column widths may differ by less than 0.05px from normal browser subpixel distribution.
- The original launch campaign still works at its approved mocked dates. The prototype omitted that historical state; production scheduling remains authoritative.
- Hero and About use original repository assets/derivatives, not embedded, resized or re-encoded prototype assets.

## Regression gates

- `visual-redesign-protected-files.json` hashes protected production data, localization catalogs, route/SEO configuration, campaign logic, original assets and product derivatives against the exact baseline.
- Existing full price-table, ID-keyed localization, catalog (27 photographed / 11 text-only), palette, menu and campaign tests remain required. No product/price/translation assertion is removed or weakened.
- The source-only storefront button expectation changes from 52px to the approved 48px presentation. Browser checks independently enforce the 44px minimum interaction target.
- `visual-redesign-production-baseline.json` was captured from the saved approved production build before redesign changes. It records route directions, metadata, ordered products, prices, quantities, media mappings, existing text/links and the three campaign states.
- The browser runner checks all 17 route/state families at 320, 390, 768 and 1280px, plus extra campaign states, refresh, branch/language switching, browser back/forward, mobile navigation, category navigation, assets, focus and responsive geometry.
- Full-page screenshots wait for fonts, image loading/decoding and paint, then normalize scroll to `(0,0)`. Screenshots include navigation open/closed, all shared menu states, all ten Haram locales, media/text-only cards and campaign states.
- CI uploads `visual-redesign-results` with screenshots and `report.json`; the existing Sabtiya artifact and build-failure gate remain intact.

## Separate follow-up — not changed here

Production currently uses `t7VQtDZSWHREcnXL6?g_st=ic` on the Haram feature and `39mDVAhBHQNr4UfM6?g_st=ic` in branch configuration/Sabtiya. The prototype suggests a different Maps destination. Link normalization is explicitly outside this PR.

The Phase 3 mixed-flavor/Malay translation ambiguity queue is also untouched and requires separate approval.

No merge, deployment, repository-setting change, later foundation phase or “Saweeg to the World” work is part of this PR.