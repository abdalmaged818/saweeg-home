# Saweeg Global Wave 2 limited owner-authorized release

The owner authorizes ordinary website content for Bengali (`bn`), French (`fr`), Malay (`ms`) and Russian (`ru`), using the existing original-Arabic-Hadith-only publication policy. This is not native-human linguistic certification or independent religious approval.

The submitted YAML is the sole editable localization authority. Its SHA-256 is `1defb9a692d899734a93c128e269d6621b8cd2130cb8ce4f93e0eab615457c6f`. The unchanged review handoff has SHA-256 `d849ac0cfc162abec9fb24b1d5f4f96057c33f76909fe32cf6f1b560ff07ea2f`. The handoff is documentation, not runtime input.

Source packages retain `ready-for-owner-review`, `religious-review-required`, `publishable: false`, `native_human_review_completed: false` and independent-review blockers. Generated internal packages preserve all 72 values and source review metadata. Public build-time projection removes `world.talbinah.hadithTranslation` entirely, including from client bundles and metadata. Only the byte-identical Arabic quotation is rendered once, with `lang="ar" dir="rtl"` and each supplied localized citation.

Reproduce generated content with `node --experimental-strip-types scripts/global-wave2.mjs --write`. Verify without editing with the same command without `--write`. Production generation verifies both waves before rendering. Exactly 82 source values per locale split into 72 internal values and ten invariant labels; public projections contain 71 values.

`locales.ts` derives active locales in the approved ten-language selector order; `destinations.ts` remains the sole public destination map. Arabic and English remain `/` and `/en/`; their old Global routes remain noindex compatibility redirects. The other eight languages use `/global/{locale}/`. All Global routes remain `noindex,follow` and excluded from the production sitemap.

Bengali receives a Global-page-only Noto Sans Bengali font. Existing shell structure, navigation behavior, tokens, Wave 1 copy, product images, menus, independent branch prices, routes and campaigns are unchanged. The existing 183 non-Global emitted files are protected byte-for-byte by the generation guard and browser comparison. Required browser widths are 320, 360, 390, 430, 768 and 1280 pixels.
