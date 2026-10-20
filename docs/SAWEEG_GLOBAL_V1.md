# Saweeg Global V1 — scoped public release

Production baseline: PR #45 standard merge `4f2a5431a9e33a29136b55d3467903c4f17b39fc`.
Owner authorization: 20 October 2026, Asia/Riyadh. Host remains `https://go.saweegsa.com`.

Only `/global/` and `/global/{ar,en,tr,ur,fa,id}/` are generated. The other four registry
locales remain inactive, absent and without fallback. Global pages use `noindex,follow`,
active-only hreflang and an x-default selector. The production sitemap is unchanged.

The exact original YAML remains the only editable Wave 1 source. Its deterministic 82-key
source validation and 72-key internal packages are unchanged. Full `approvedContent` still
rejects the five packages awaiting complete review. The owner-authorized V1 capability is
explicitly limited to original Arabic Hadith: `publicV1Content` projects 71 display keys and
has no translated-meaning slot. Religious review remains pending. No review category or
source metadata is silently approved, normalized or rewritten.

The build uses a development-only pinned DOM implementation to reuse the actual foundation
renderers, shared-shell adapter, image catalog, branches and links. Complete static HTML
is generated at build time, not a copied standalone template or a fallback shell. The
client bundle contains interaction code/styles only, never locale dictionaries, review
metadata or unapproved religious meanings. Public composition refuses a supplied meaning.
The Arabic original appears once with its exact localized citation. Religious content
remains separate from commercial controls. Urdu/Persian isolation changes only semantic
markup; stored and visible text remains unchanged.

Existing Vite inputs/generation are untouched. An isolated second bundle writes only under
`dist/global/`; the build hashes all 183 pre-existing production files before/after and
rejects any mutation. Two approved editorial PNGs are copied byte-for-byte into the new
namespace. No existing source image, product image, menu, price, route, campaign or asset
changes. Shared-shell content typing is narrowed, with transpiled runtime equality checked
against Phase 1. No shared geometry or existing navigation is edited.

The exact approved deployment-workflow hash override and structural comparison remain intact.
The original browser workflow is unchanged. A separate read-only CI browser workflow tests
the seven public routes, 24 locale/viewport combinations plus four selector widths, card
navigation/back/forward/refresh, RTL/LTR, mobile/Escape, keyboard focus, 44px targets, reduced
motion, exact image fit/position, source text, metadata and inactive-route rejection. Evidence
is stored only as CI artifacts. Set `GLOBAL_V1_ORIGIN=https://go.saweegsa.com` and a separate
`GLOBAL_V1_RESULTS` directory to run the same assertions against production after deployment.

Independent religious review, including Persian source/reference attribution, remains required
before any future translated meaning is made public. Wave 2, alternate domains and DNS work
are outside this release.
