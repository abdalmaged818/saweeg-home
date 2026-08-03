# Saweeg Home

The official bilingual gateway for Saweeg. It is intentionally isolated from
[`saweeg-menu`](https://github.com/abdalmaged818/saweeg-menu) so the existing
menu deployment and `menu.saweegsa.com` custom domain remain untouched.

Official domain: <https://go.saweegsa.com>

## Local development

```bash
npm install
npm run dev
```

Validation:

```bash
npm run typecheck
npm run build
npm run preview
```

## Content and configuration

- External URLs and feature flags: `src/config/site.ts`
- Arabic content: `src/i18n/ar.ts`
- English content: `src/i18n/en.ts`
- Destinations, branches, news, and opportunities: `src/data/`
- Brand assets: `public/assets/brand/`
- Approved home hero image: `public/assets/images/saweeg-madinah-hero.png`

Career and collaboration buttons remain disabled until valid URLs are added to
`siteConfig.links.careersUrl` and `siteConfig.links.collaborationUrl`. Enable
the corresponding flag only after adding the URL.

## Deployment

GitHub Actions builds every push to `feature/saweeg-home` and deploys `main` to
GitHub Pages. The custom domain is declared in `public/CNAME` and the production
site is served from the domain root. DNS needs one `go` CNAME pointing to
`abdalmaged818.github.io`; no `menu`, store, or nameserver record should change.
