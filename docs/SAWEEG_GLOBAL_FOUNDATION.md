# Saweeg Global: non-public Phase 1 foundation

## Baseline and scope

Approved baseline: `2afc684df303c0bc5aadf97631f338ec10bd9189` (merged visual redesign PR #43).
Work began in a fresh clean clone with freshly fetched `origin/main` at that exact commit and no open PRs.
No production entry imports this module. No routes, navigation links, sitemap records, domain, DNS,
CNAME, redirects, hosting settings, analytics or deployment behavior are added.
This PR must not be merged or deployed without a new explicit approval.

## Architecture

`src/saweeg-global/` separates the locale registry, Arabic master/key schema, review validation,
featured-product references, branches/menu availability, editorial media, shared-shell adapter,
section renderers, scoped interaction lifecycle and scoped styles.

The ten exact endonyms use `world.languages.{code}.label`. The manifest records native direction,
relative future route intent, content/terminology/editorial/religious/direction/typography review,
inactive activation, and an empty future welcome-phrase slot. These are not generated routes.
All ten locales are inactive. Arabic is the only approved content package; nine packages are absent,
pending, and rejected rather than rendered using raw keys, draft English or inherited Arabic.

`world.hero.cta` and `world.about.heading` are independent keys even though their Arabic is identical.
Product-name keys end in `.name`; Matcha and Al Jabirah use the approved `matchaTalbinah` and
`alJabirahBox` content IDs. A separate golden Arabic snapshot guards the exact approved copy.

## Authoritative data and assets

- Product references use stable canonical variant IDs. `featuredImage()` delegates directly to
  `src/menu/data/catalog-images.ts`; no filenames, fit modes, positions, or prices are duplicated
  in product records or translations. The eight selected variants are hot/cold Talbinah,
  Talbinah cup ice cream, Matcha, Talbinah/Saweeg powders, Al Jabirah box and Maamoul box.
- Management's newer implementation brief approves the existing Al Jabirah box and Maamoul box
  mappings. The older reference's provisional warnings do not block these two approved selections.
- Shared menu locales/URLs and Maqsed/Bustan Maps destinations come from existing repository sources.
  Haram's ten menu locales come from the existing typed Haram registry. The newer approved Haram
  Maps destination is Global-only; no existing homepage, branch, menu or campaign link is changed.
- Branch names, locations and approved hours are explicit Arabic content references, independently
  translatable later. No branch price is imported, inferred, normalized or synchronized.
- Existing product and editorial assets remain unchanged. The two extra original photographs
  (`image3.png`, Talbinah bowl; `image19.png`, Maqsed storefront) come from the owner-supplied
  October Stories deck. They are preserved byte-for-byte under `assets-source/saweeg-global/`,
  with source SHA-256 fixtures, not copied from the prototype's embedded image data.
- These two sources are not in `public/` or the production build. The isolated loopback test server
  explicitly resolves them. The future activation phase must decide public asset delivery, derivatives
  and hosting without silently adding a public source path in this phase.

The 4:3 product/branch frame controls layout. Existing product fit and position remain canonical.
The three approved branch/photos have their own editorial focal positions. No source dimensions
resize a card, and no placeholder or substitute product photograph is used.

## Shared shell without a production change

`shared-shell.ts` composes the actual current `renderHeader()` and `renderFooter()` outputs using typed
slot props. It populates their navigation, actions and labels through scoped DOM slots; it does not
copy their structural HTML, fork the renderers, or modify current production call sites.
Missing shell slots throw explicitly. Current Go Saweeg components remain the sole source of the
header/footer structure, official logo and geometry. Global omits the PDF section and replaces the
two-language toggle with the selector action only inside its isolated rendered root.

This adapter avoids touching a production-bundled component during the strictly non-public phase.
Styles and controllers are scoped to `.swg-world`. Existing semantic tokens, typography, buttons,
focus patterns and icon renderer are reused. No existing stylesheet or token is edited.

## Translation and religious review workflow

The final Arabic schema is the 20 October 2026 v1 handoff, retained verbatim as a test reference
in `tests/fixtures/saweeg-global/arabic-handoff-v1.md`. Its 82 stable keys comprise exactly 72
Arabic content keys and ten fixed native-language label keys. Tests compare the combined manifest
and every value with that reference, reject unknown source keys, and pin the Hadith UTF-8 digest.
Both Hadith keys store the exact approved Arabic source. Arabic renders it once; the separate
meaning slot is used only by future non-Arabic content after its independent review gates pass.
The linked header logo uses `world.brand.homeLabel` and a decorative empty image alt. The unlinked
footer logo uses the invariant brand name `Saweeg`, without adding a localization key. No shell
geometry, image presentation, production entry or publication gate changes in this correction.

Later human-reviewed packages must supply exactly every required content key, their own locale,
reviewer and revision provenance, and all explicit review approvals. Unknown/missing/empty/raw-key
values fail validation. A copied Arabic master cannot masquerade as another language. There is no
fallback resolver or machine translation. `glossary.ts` records brand/terminology constraints, not
translations. Saweeg remains the brand and must not be replaced by the generic food term.

The Arabic Hadith source is retained explicitly in its own `lang=ar dir=rtl` blockquote and figure.
Any later translated Hadith requires a separate `religious: approved` review, even when ordinary
content is complete. Its figure contains no marketing CTA. No medical claim or global-shipping
promise is added.

`approvedContent()` is a completeness/review gate. `assertPublicActivation()` is a separate,
closed Phase 1 publication gate. The isolated preview can render approved Arabic only; a public
render request always fails, and nine pending languages are rejected. Readiness never implies
activation. Phase 3 must separately approve topology, add production route generation and connect
an explicitly activated manifest; this PR performs none of those actions.

## Isolated preview and validation

`tests/fixtures/saweeg-global/` is not a production build entry. `tests/saweeg-global-browser.mjs`
serves it on `127.0.0.1` with no public deployment, then closes the server. Non-Arabic preview
requests return 403 with an empty response, not fallback content. LTR geometry is tested by mirroring
the approved Arabic layout in the test only, not inventing an English translation package. The
unavailable-menu component is tested in Arabic against a branch's Urdu-availability condition.

The runner checks selector, Arabic page, mirrored geometry and unavailable-menu disclosure at
320, 390, 768 and 1280px. It validates equal card heights, native-label arrow direction, product
catalog filenames/fit/position, 4:3 media, fonts/images, keyboard focus, 44px targets, mobile menu
focus/Escape/desktop reset, refresh, no overflow, no raw keys and no console/network errors.
Snapshots and JSON evidence are uploaded by browser CI only, never published as a site.

Existing tests remain intact and the new foundation unit tests join the normal build verifier.
A baseline source-hash fixture protects existing source/data/translation/route/asset files and the
deployment workflow. The generated social-preview source PNG is excluded from that source fixture
because its build is environment-dependent; the full generated production output, including that
PNG, is compared byte-for-byte against a baseline build made in the same environment. Both the
emitted file set and every file digest must match. No assertion is skipped or weakened.

## Prototype pieces intentionally excluded

No embedded image URIs, prototype data/config objects, draft English, raw-key pages, hash routing,
stress/demo switches, draft notice, review toolbar, fake public paths or automatic fallback is
imported. The reference provides visual guidance and exact approved Arabic copy only. The future
translation-ambiguity queue and all other website work remain outside this PR.
