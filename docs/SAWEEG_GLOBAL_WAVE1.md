# Saweeg Global — private Wave 1 review

Authoritative input: `content-source/saweeg-global/saweeg-global-localization-wave1.yaml`.
The submitted 72,918 bytes are SHA-256 pinned by `scripts/global-wave1.mjs`.
Only this YAML is editable translation authority; generated TypeScript is not a second source.

`node --experimental-strip-types scripts/global-wave1.mjs --write` deterministically generates
`src/saweeg-global/content/wave1.generated.ts`. Without `--write` it verifies exact reproducibility.
The production verifier runs this check and the Wave 1 regression tests.
The development-only, version-pinned `yaml` parser rejects duplicate mappings, anchors and aliases.
Validation rejects missing, extra, reordered, empty or raw keys and changed fixed language labels.

Each of en, tr, ur, fa and id supplies 82 ordered source strings, generating 72 content strings.
The 10 native labels remain solely in the fixed registry. All remaining supplied metadata is retained.
Arabic master is unchanged. bn, fr, ms and ru have no packages and cannot fall back.

Only content status is ready-for-owner-review; all other new review categories remain pending.
Religious review and every supplied publication blocker remain unresolved, including the Persian
source-attribution/reference discrepancy. Source QA claims are not approval or test evidence.
All ten locales remain inactive and non-publishable. `approvedContent` rejects the five new locales;
`assertPublicActivation` rejects every locale.

`tests/fixtures/saweeg-global/review.ts` alone grants structural-completeness review access. It is
not a production entry and creates no public route. The ordinary public renderer retains its gate.
The fixture semantically isolates Latin runs in Urdu/Persian without modifying stored strings.
Original Arabic Hadith is separate, RTL and byte-identical; localized meanings retain attribution.
No commercial controls occur in the religious figure.

The loopback-only browser runner covers all five locales at 320/390/768/1280, plus Arabic,
native-language selector and unavailable-menu interaction. Screenshots and reports are private
CI artifacts under `test-results/saweeg-global`, never production assets. The same runner compares
the complete production file set and bytes to Phase 1 merge `4ad8147df978625388f078ce9edeab36e5d2e021`.
Existing menu, campaign and language-switching suites remain required and unchanged.

This change neither activates Global nor begins Wave 2. Owner and independent religious approval,
including Persian reference/translator verification, remain required before any future publication.
