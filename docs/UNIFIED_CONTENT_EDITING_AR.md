# تعديل محتوى المشروع الموحد

## تعديل منتج أو سعر

المرجع الأساسي للمنتجات هو:

`src/menu/data/products.ts`

وللمشروبات والإضافات:

`src/menu/data/extras.ts`

كل عنصر يحدد الاسم بالعربية والإنجليزية، السعر، الفروع، والقسم. المنتجات المصورة تضيف `displayMode: "image"` واسم الصورة. بعد أي تعديل:

```bash
pnpm run typecheck
pnpm run build
```

## الفروع والأقسام

- الفروع: `src/menu/data/branches.ts` والنوع `BranchId` في `src/menu/types/menu.ts`.
- الأقسام: `src/menu/data/categories.ts` والنوع `CategoryId` في الملف نفسه أعلاه.
- روابط الخرائط والواتساب والمتجر: `src/menu/config/site.ts`.

إضافة فرع جديد تتطلب تحديث النوع والبيانات والنصوص واختبارات الروابط، وليست مجرد إضافة معامل جديد للرابط.

## صور المنيو

- ملفات العرض WebP: `public/menu/assets/products/`.
- الصور الأصلية: `assets-source/menu/product-images/`.
- وصف عمليات القص والتحويل: `scripts/process-menu-product-images.mjs`.

لتوليد صور العرض من المصادر:

```bash
pnpm run images:optimize:menu
```

بعدها شغّل البناء وتحقق بصريًا من العربية والإنجليزية والفرعين. لا تنقل الصور إلى `public/assets/products/`؛ هذا المسار خاص بالبوابة وقد يسبب التباسًا أو تعارضًا.

## نصوص المنيو

- العربية: `src/menu/i18n/ar.ts`.
- الإنجليزية: `src/menu/i18n/en.ts`.
- قالب العرض: `src/menu/templates/menu-page.ts`.

## محتوى البوابة والمشاركات

- إعدادات وروابط البوابة: `src/config/site.ts`.
- العربية والإنجليزية: `src/i18n/ar.ts` و`src/i18n/en.ts`.
- بيانات المشاركات وSEO والصور: `src/data/participations.ts`.
- نصوص المشاركات: `src/content/participations.ts`.
- صور المشاركات: `public/assets/participations/` والمصادر في `assets-source/events/`.

روابط المنيو في البوابة أصبحت داخلية في `src/config/site.ts`، ويجب أن تبقى تحت `/menu/` مع معامل الفرع الصحيح.
