# انتقال رابط المنيو القديم

## الوضع الحالي

`menu.saweegsa.com` مرتبط بـGitHub Pages الخاصة بمستودع `saweeg-menu`. سجل DNS من نوع CNAME يشير إلى `abdalmaged818.github.io`، وهو نفس هدف GitHub Pages العام، لكن اختيار الموقع يتم عبر إعداد Pages وملف CNAME في المستودع. تغيير CNAME في DNS وحده لا يستطيع إضافة المسار `/menu/` ولا ينفذ تحويل HTTP.

## المرحلة الانتقالية الجاهزة

الفرع المحلي `chore/redirect-to-unified-menu` في `saweeg-menu` يستبدل تطبيق المنيو بملفات صغيرة تحت `site/`. يقوم JavaScript باستخدام `location.replace` بالتحويل التالي:

| الرابط القديم | النتيجة |
|---|---|
| `https://menu.saweegsa.com/?branch=maqsed` | `https://go.saweegsa.com/menu/?branch=maqsed` |
| `https://menu.saweegsa.com/?branch=bustan&utm_source=qr#extras` | `https://go.saweegsa.com/menu/?branch=bustan&utm_source=qr#extras` |
| `https://menu.saweegsa.com/en/?branch=maqsed` | `https://go.saweegsa.com/menu/en/?branch=maqsed` |
| `https://menu.saweegsa.com/en/old-path?branch=bustan#branches` | `https://go.saweegsa.com/menu/en/?branch=bustan#branches` |

التحويل يحفظ اللغة، جميع معاملات الرابط، والجزء الذي يبدأ بـ`#`. المسارات غير المعروفة تعود إلى جذر المنيو باللغة المطابقة. توجد ثلاثة اختبارات Node لهذه الحالات.

هذا **تحويل من المتصفح عبر HTML/JavaScript وليس HTTP 301**. وسم `meta refresh` احتياطي إذا عُطل JavaScript، لكنه لا يحفظ المعاملات أو `#`.

## لماذا يبقى المستودع القديم مؤقتًا؟

GitHub Pages لا توفر قاعدة 301 تضيف `/menu/` إلى نطاق مخصص مستقل ضمن هذا التنظيم. إبقاء `saweeg-menu` كصفحة تحويل صغيرة يحافظ على QR والروابط المحفوظة. وتظل ملفات التطبيق القديمة محفوظة مؤقتًا داخله للرجوع فقط، لكنها لا تُبنى ولا تُنشر ولا تُعد مصدرًا للمحتوى الجديد إلى أن يعتمد حذفها لاحقًا.

## الاستغناء عن المستودع القديم لاحقًا

يمكن الاستغناء عنه فقط بعد نقل خدمة `menu.saweegsa.com` إلى خدمة تحويل على مستوى HTTP أو edge تدعم:

- تحويل `/` إلى `https://go.saweegsa.com/menu/`.
- تحويل `/en/` إلى `https://go.saweegsa.com/menu/en/`.
- تمرير query string.
- معالجة المسارات غير المعروفة.
- اختبار سلوك fragment `#` في المتصفحات؛ وإذا كان حفظه شرطًا صارمًا فتبقى صفحة JavaScript خفيفة أكثر ضمانًا.

يستلزم ذلك تغيير DNS أو إعداد خدمة جديدة وموافقة منفصلة. لا يوجد احتياج لإدخال Netlify الآن، ولم يتغير DNS أو Pages أثناء تجهيز الدمج.
