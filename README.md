# مشروع سويق الموحد

المصدر الوحيد للبوابة والمنيو. يجمع بناء Vite واحد الصفحات التالية على النطاق الرسمي `https://go.saweegsa.com`:

- البوابة العربية: `/`
- البوابة الإنجليزية: `/en/`
- المشاركات العربية والإنجليزية: `/news/` و`/en/news/`
- المنيو العربية: `/menu/?branch=maqsed` أو `/menu/?branch=bustan`
- المنيو الإنجليزية: `/menu/en/?branch=maqsed` أو `/menu/en/?branch=bustan`

## التشغيل والتحقق

يتطلب Node.js 22 أو أحدث وpnpm 11.19.0.

```bash
pnpm install --frozen-lockfile
pnpm run dev
pnpm run typecheck
pnpm run build
pnpm run preview
```

يشغّل `pnpm run build` توليد صفحات البوابة، فحص TypeScript، البناء الموحد، ثم فحصًا آليًا للمسارات وملفات المنيو وغياب أي اعتماد على `menu.saweegsa.com`.

## مواقع الكود والمحتوى

- صفحات ومكونات البوابة: `src/pages/` و`src/components/`.
- نصوص البوابة: `src/i18n/` و`src/content/`.
- المشاركات: `src/data/participations.ts` و`src/content/participations.ts`.
- تطبيق المنيو: `src/menu/`.
- منتجات وأسعار المنيو: `src/menu/data/products.ts` و`src/menu/data/extras.ts`.
- فروع المنيو: `src/menu/data/branches.ts`.
- صور المنيو المنشورة: `public/menu/assets/products/`.
- صور المنيو المصدرية: `assets-source/menu/product-images/`.
- معالجة صور المنيو: `pnpm run images:optimize:menu`.
- مداخل المنيو: `menu/index.html` و`menu/en/index.html`.

## النشر

الفرع `main` فقط هو الذي يرفع `dist/` إلى GitHub Pages. طلبات الدمج تبني وتتحقق دون نشر. ملف `public/CNAME` يبقى `go.saweegsa.com`، ولا يحتاج الدمج إلى Netlify أو تغيير DNS للنطاق الأساسي.

قبل دمج فرع التوحيد، اقرأ:

- `docs/UNIFIED_LOCAL_SETUP_AR.md`
- `docs/UNIFIED_CONTENT_EDITING_AR.md`
- `docs/UNIFIED_DEPLOYMENT_AND_ROLLBACK_AR.md`
- `docs/LEGACY_MENU_TRANSITION_AR.md`

حزمة التسليم المؤرخة قبل هذا الفرع تمثل النسخة المنفصلة قبل الدمج. تُنشأ حزمة تسليم نهائية جديدة بعد اعتماد الفرع ونشره والتحقق من الإنتاج.
