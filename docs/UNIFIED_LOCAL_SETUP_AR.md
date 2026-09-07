# التشغيل المحلي للمشروع الموحد

## المتطلبات

- Node.js 22 أو أحدث.
- pnpm `11.19.0`، وهو الإصدار المثبت في `package.json` وفي GitHub Actions.
- Git.

## التثبيت والتشغيل

من جذر `saweeg-home`:

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

يفتح Vite عادة على `http://localhost:5173`. المسارات الأساسية:

- `http://localhost:5173/`
- `http://localhost:5173/en/`
- `http://localhost:5173/news/`
- `http://localhost:5173/menu/?branch=maqsed`
- `http://localhost:5173/menu/?branch=bustan`
- `http://localhost:5173/menu/en/?branch=maqsed`
- `http://localhost:5173/menu/en/?branch=bustan`

جرّب فتح كل رابط مباشرة ثم إعادة تحميله، ولا تكتفِ بالانتقال من الصفحة الرئيسية.

## البناء والفحص

```bash
pnpm run typecheck
pnpm run build
pnpm run preview
```

`pnpm run build` ينفذ أربع مراحل متتابعة:

1. توليد صفحات البوابة وملف sitemap.
2. فحص TypeScript لكل من البوابة والمنيو.
3. بناء جميع الصفحات إلى `dist/`.
4. تشغيل `scripts/verify-unified-build.mjs` للتحقق من المسارات والأصول وCNAME وغياب نطاق المنيو القديم من ناتج البناء.

لا تعدل الملفات المولدة مثل `index.html` و`en/index.html` وصفحات `news/` الخاصة بالبوابة يدويًا؛ عدل المصدر ثم أعد البناء. مدخلا المنيو `menu/index.html` و`menu/en/index.html` ملفات مصدر وليسا ناتجًا مولدًا.

## بنية تمنع التعارض

- البوابة تستخدم `src/` و`public/assets/`.
- المنيو تستخدم `src/menu/` و`public/menu/assets/`.
- كل صفحة تحمل ملف CSS وJavaScript الخاص بها؛ لا تُحمّل أنماط المنيو في صفحات البوابة.
- كل أصول المنيو تبدأ من `/menu/`، لذلك تعمل الصفحة العربية والإنجليزية عند الفتح المباشر.
