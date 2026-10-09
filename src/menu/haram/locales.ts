import { haramItemIds, type HaramItemId, type HaramLocale, type HaramLocaleContent } from "./types.ts";

const names = (values: readonly string[]): Record<HaramItemId, string> => {
  if (values.length !== haramItemIds.length) {
    throw new Error(`Expected ${haramItemIds.length} Haram product translations, received ${values.length}.`);
  }

  return Object.fromEntries(haramItemIds.map((id, index) => [id, values[index]])) as Record<HaramItemId, string>;
};

const shared = {
  storeTitle: "Saweeg Store",
  storeBody: "Discover Saweeg products in our online store.",
  storeButton: "Visit the store",
  contactTitle: "Contact Saweeg",
  contactBody: "We are happy to help you.",
  whatsapp: "WhatsApp",
  links: "Saweeg links",
  footerStore: "Online store",
  footerWhatsapp: "WhatsApp",
  footerLinks: "Saweeg links",
};

export const haramLocaleContent: Record<HaramLocale, HaramLocaleContent> = {
  ar: {
    locale: "ar", direction: "rtl", nativeLabel: "العربية", flag: "🇸🇦", menuTitle: "منيو", branchName: "فرع الحرم",
    welcome: "حيّاكم في سويق", welcomeEnglish: "Welcome to Saweeg", chooseLanguage: "اختر لغتك", chooseLanguageEnglish: "Choose your language", changeLanguage: "تغيير اللغة",
    categories: { iceCream: "الآيس كريم", desserts: "الحلويات", drinks: "المشروبات", powders: "منتجات رف", boxes: "البوكسات والهدايا" },
    productNames: names(["آيس كريم التلبينة — بسكوت", "آيس كريم التلبينة — كوب", "آيس كريم تلبينة شوكلت — بسكوت", "آيس كريم تلبينة شوكلت — كوب", "آيس كريم مكس — بسكوت", "آيس كريم مكس — كوب", "تشيز كيك بالتلبينة", "دمكة", "تمر سويق", "بسبوسة بيكان", "تارت تمر", "معمول سويق", "تلبينة باردة", "تلبينة حارة", "تلبينة حارة (1 لتر)", "قهوة سعودية", "دلة قهوة سعودية", "دلة قهوة سعودية مع حلى", "شاهي", "ثلاجة شاهي", "ماتشا التلبينة", "مياه معبأة", "ظرف بودرة تلبينة", "ظرف بودرة سويق", "ظرف مكسرات مكس", "ظرف الجابرة", "بوكس تمر صفاوي محشي بالمكسرات", "بوكس تمر عجوة محشي بالمكسرات", "بوكس أظرف الجابرة", "بوكس الإهداء", "بوكس معمول سويق", "بوكس بسبوسة بيكان", "بوكس الأظرف", "بوكس تارت تمر"]),
    priceLabel: (price) => `${price} ر.س`, vatNotice: "جميع الأسعار بالريال السعودي وشاملة ضريبة القيمة المضافة", storeEyebrow: "متجر سويق", storeTitle: "تسوّق منتجات سويق", storeBody: "اكتشف منتجات سويق من متجرنا الإلكتروني.", storeButton: "زيارة المتجر", contactTitle: "تواصل مع سويق", contactBody: "يسعدنا خدمتك والإجابة عن استفساراتك.", whatsapp: "واتساب", links: "روابط سويق", footerStore: "المتجر الإلكتروني", footerWhatsapp: "واتساب", footerLinks: "روابط سويق", imageAlt: (name) => `صورة ${name}`,
  },
  en: {
    locale: "en", direction: "ltr", nativeLabel: "English", flag: "🇬🇧", menuTitle: "Menu", branchName: "Al Haram Branch",
    welcome: "Welcome to Saweeg", welcomeEnglish: "حيّاكم في سويق", chooseLanguage: "Choose your language", chooseLanguageEnglish: "اختر لغتك", changeLanguage: "Change Language",
    categories: { iceCream: "Ice Cream", desserts: "Desserts", drinks: "Drinks", powders: "Packaged Products", boxes: "Boxes & Gifts" },
    productNames: names(["Talbinah Ice Cream — Cone", "Talbinah Ice Cream — Cup", "Talbinah Chocolate Ice Cream — Biscuit", "Talbinah Chocolate Ice Cream — Cup", "Mixed Ice Cream — Cone", "Mixed Ice Cream — Cup", "Talbinah Cheesecake", "Damkah", "Saweeg Dates", "Pecan Basbousa", "Date Tart", "Saweeg Maamoul", "Cold Talbinah", "Hot Talbinah", "Hot Talbinah (1 Litre)", "Saudi Coffee", "Saudi Coffee Dallah", "Saudi Coffee Dallah with Dessert", "Tea", "Tea Thermos", "Talbinah Matcha", "Bottled Water", "Talbinah Powder Pack", "Saweeg Powder Pack", "Mixed Nuts Pack", "Al Jabirah Sachet", "Safawi Dates Stuffed with Nuts Box", "Ajwa Dates Stuffed with Nuts Box", "Al Jabirah Sachet Box", "Gift Box", "Saweeg Maamoul Box", "Pecan Basbousa Box", "Sachet Box", "Date Tart Box"]),
    priceLabel: (price) => `SAR ${price}`, vatNotice: "All prices are in Saudi riyals and include VAT", storeEyebrow: "Saweeg Store", imageAlt: (name) => `${name} product photo`, ...shared,
  },
  ur: {
    locale: "ur", direction: "rtl", nativeLabel: "اردو", flag: "🇵🇰", menuTitle: "مینو", branchName: "الحرم برانچ",
    welcome: "سویق میں خوش آمدید", welcomeEnglish: "Welcome to Saweeg", chooseLanguage: "اپنی زبان منتخب کریں", chooseLanguageEnglish: "Choose your language", changeLanguage: "زبان تبدیل کریں",
    categories: { iceCream: "آئس کریم", desserts: "مٹھائیاں", drinks: "مشروبات", powders: "پیک شدہ مصنوعات", boxes: "باکس اور تحائف" },
    productNames: names(["تلبینہ آئس کریم — کون", "تلبینہ آئس کریم — کپ", "تلبینہ چاکلیٹ آئس کریم — کون", "تلبینہ چاکلیٹ آئس کریم — کپ", "مکس آئس کریم — کون", "مکس آئس کریم — کپ", "تلبینہ چیز کیک", "دمکہ", "سویق کھجور", "پیکان بسبوسہ", "کھجور ٹارٹ", "سویق معمول", "ٹھنڈا تلبینہ", "گرم تلبینہ", "گرم تلبینہ (1 لیٹر)", "سعودی کافی", "سعودی کافی کا دلہ", "میٹھے کے ساتھ سعودی کافی کا دلہ", "چائے", "چائے کا تھرمس", "تلبینہ ماچا", "بوتل بند پانی", "تلبینہ پاؤڈر پیک", "سویق پاؤڈر پیک", "مکس خشک میوہ پیک", "الجبیرہ ساشے", "خشک میوہ سے بھرا صفاوی کھجور باکس", "خشک میوہ سے بھرا عجوة کھجور باکس", "الجبیرہ ساشوں کا باکس", "تحفہ باکس", "سویق معمول باکس", "پیکان بسبوسہ باکس", "ساشے باکس", "کھجور ٹارٹ باکس"]),
    priceLabel: (price) => `${price} سعودی ریال`, vatNotice: "تمام قیمتیں سعودی ریال میں ہیں اور ویلیو ایڈڈ ٹیکس شامل ہے", storeEyebrow: "سویق اسٹور", storeTitle: "سویق کی مصنوعات خریدیں", storeBody: "ہمارے آن لائن اسٹور میں سویق کی مصنوعات دریافت کریں۔", storeButton: "اسٹور دیکھیں", contactTitle: "سویق سے رابطہ", contactBody: "ہم آپ کی مدد کے لیے حاضر ہیں۔", whatsapp: "واٹس ایپ", links: "سویق لنکس", footerStore: "آن لائن اسٹور", footerWhatsapp: "واٹس ایپ", footerLinks: "سویق لنکس", imageAlt: (name) => `${name} کی تصویر`,
  },
  id: {
    locale: "id", direction: "ltr", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩", menuTitle: "Menu", branchName: "Cabang Al Haram",
    welcome: "Selamat datang di Saweeg", welcomeEnglish: "Welcome to Saweeg", chooseLanguage: "Pilih bahasa Anda", chooseLanguageEnglish: "Choose your language", changeLanguage: "Ubah Bahasa",
    categories: { iceCream: "Es Krim", desserts: "Hidangan Penutup", drinks: "Minuman", powders: "Produk Kemasan", boxes: "Kotak & Hadiah" },
    productNames: names(["Es Krim Talbinah — Cone", "Es Krim Talbinah — Cup", "Es Krim Talbinah Cokelat — Cone", "Es Krim Talbinah Cokelat — Cup", "Es Krim Campur — Cone", "Es Krim Campur — Cup", "Cheesecake Talbinah", "Damkah", "Kurma Saweeg", "Basbousa Pecan", "Tart Kurma", "Maamoul Saweeg", "Talbinah Dingin", "Talbinah Panas", "Talbinah Panas (1 Liter)", "Kopi Saudi", "Dallah Kopi Saudi", "Dallah Kopi Saudi dengan Hidangan Penutup", "Teh", "Termos Teh", "Matcha Talbinah", "Air Minum Kemasan", "Kemasan Bubuk Talbinah", "Kemasan Bubuk Saweeg", "Kemasan Kacang Campur", "Saset Al Jabirah", "Kotak Kurma Safawi Isi Kacang", "Kotak Kurma Ajwa Isi Kacang", "Kotak Saset Al Jabirah", "Kotak Hadiah", "Kotak Maamoul Saweeg", "Kotak Basbousa Pecan", "Kotak Saset", "Kotak Tart Kurma"]),
    priceLabel: (price) => `SAR ${price}`, vatNotice: "Semua harga dalam riyal Saudi dan sudah termasuk PPN", storeEyebrow: "Toko Saweeg", storeTitle: "Belanja produk Saweeg", storeBody: "Temukan produk Saweeg di toko online kami.", storeButton: "Kunjungi toko", contactTitle: "Hubungi Saweeg", contactBody: "Kami siap membantu Anda.", whatsapp: "WhatsApp", links: "Tautan Saweeg", footerStore: "Toko online", footerWhatsapp: "WhatsApp", footerLinks: "Tautan Saweeg", imageAlt: (name) => `Foto produk ${name}`,
  },
  bn: {
    locale: "bn", direction: "ltr", nativeLabel: "বাংলা", flag: "🇧🇩", menuTitle: "মেনু", branchName: "হারাম শাখা",
    welcome: "সুইকে স্বাগতম", welcomeEnglish: "Welcome to Saweeg", chooseLanguage: "আপনার ভাষা নির্বাচন করুন", chooseLanguageEnglish: "Choose your language", changeLanguage: "ভাষা পরিবর্তন",
    categories: { iceCream: "আইসক্রিম", desserts: "মিষ্টান্ন", drinks: "পানীয়", powders: "প্যাকেটজাত পণ্য", boxes: "বক্স ও উপহার" },
    productNames: names(["তালবিনা আইসক্রিম — কোন", "তালবিনা আইসক্রিম — কাপ", "তালবিনা চকলেট আইসক্রিম — কোন", "তালবিনা চকলেট আইসক্রিম — কাপ", "মিক্স আইসক্রিম — কোন", "মিক্স আইসক্রিম — কাপ", "তালবিনা চিজকেক", "দামকা", "Saweeg খেজুর", "পেকান বাদামের বাসবুসা", "খেজুরের টার্ট", "Saweeg মামুল", "ঠান্ডা তালবিনা", "গরম তালবিনা", "গরম তালবিনা (1 লিটার)", "সৌদি কফি", "সৌদি কফির দাল্লা", "মিষ্টান্নসহ সৌদি কফির দাল্লা", "চা", "চায়ের ফ্লাস্ক", "তালবিনা ম্যাচা", "বোতলজাত পানি", "তালবিনা পাউডারের প্যাকেট", "Saweeg পাউডারের প্যাকেট", "মিশ্র বাদামের প্যাকেট", "আল জাবিরাহ স্যাশে", "বাদামভরা সাফাওয়ি খেজুরের বক্স", "বাদামভরা আজওয়া খেজুরের বক্স", "আল জাবিরাহ স্যাশের বক্স", "উপহার বক্স", "Saweeg মামুল বক্স", "পেকান বাদামের বাসবুসা বক্স", "স্যাশের বক্স", "খেজুরের টার্ট বক্স"]),
    priceLabel: (price) => `SAR ${price}`, vatNotice: "সব মূল্য সৌদি রিয়ালে এবং ভ্যাটসহ", storeEyebrow: "Saweeg স্টোর", storeTitle: "Saweeg পণ্য কিনুন", storeBody: "আমাদের অনলাইন স্টোরে Saweeg পণ্য খুঁজে নিন।", storeButton: "স্টোরে যান", contactTitle: "Saweeg-এর সাথে যোগাযোগ", contactBody: "আমরা আপনাকে সাহায্য করতে প্রস্তুত।", whatsapp: "হোয়াটসঅ্যাপ", links: "Saweeg লিংক", footerStore: "অনলাইন স্টোর", footerWhatsapp: "হোয়াটসঅ্যাপ", footerLinks: "Saweeg লিংক", imageAlt: (name) => `${name}-এর পণ্যের ছবি`,
  },
  tr: {
    locale: "tr", direction: "ltr", nativeLabel: "Türkçe", flag: "🇹🇷", menuTitle: "Menü", branchName: "Al Haram Şubesi",
    welcome: "Saweeg'e hoş geldiniz", welcomeEnglish: "Welcome to Saweeg", chooseLanguage: "Dilinizi seçin", chooseLanguageEnglish: "Choose your language", changeLanguage: "Dili Değiştir",
    categories: { iceCream: "Dondurma", desserts: "Tatlılar", drinks: "İçecekler", powders: "Paketli Ürünler", boxes: "Kutular ve Hediyeler" },
    productNames: names(["Talbinah Dondurma — Külah", "Talbinah Dondurma — Kap", "Talbinah Çikolatalı Dondurma — Külah", "Talbinah Çikolatalı Dondurma — Kap", "Karışık Dondurma — Külah", "Karışık Dondurma — Kap", "Talbinah Cheesecake", "Damkah", "Saweeg Hurma", "Pekanlı Basbousa", "Hurmali Tart", "Saweeg Maamoul", "Soğuk Talbinah", "Sıcak Talbinah", "Sıcak Talbinah (1 Litre)", "Suudi Kahvesi", "Dallah Suudi Kahvesi", "Tatlı ile Dallah Suudi Kahvesi", "Çay", "Termos Çay", "Talbinah Matcha", "Şişe Su", "Talbina Tozu Paketi", "Saweeg Tozu Paketi", "Karışık Kuruyemiş Paketi", "Al Jabirah Saşesi", "Kuruyemiş Dolgulu Safawi Hurma Kutusu", "Kuruyemiş Dolgulu Ajwa Hurma Kutusu", "Al Jabirah Saşe Kutusu", "Hediye Kutusu", "Saweeg Maamoul Kutusu", "Pekanlı Basbousa Kutusu", "Saşe Kutusu", "Hurmali Tart Kutusu"]),
    priceLabel: (price) => `SAR ${price}`, vatNotice: "Tüm fiyatlar Suudi riyali cinsindendir ve KDV dahildir", storeEyebrow: "Saweeg Mağazası", storeTitle: "Saweeg ürünlerini keşfedin", storeBody: "Saweeg ürünlerini çevrim içi mağazamızda keşfedin.", storeButton: "Mağazaya git", contactTitle: "Saweeg ile iletişim", contactBody: "Size yardımcı olmaktan mutluluk duyarız.", whatsapp: "WhatsApp", links: "Saweeg bağlantıları", footerStore: "Çevrim içi mağaza", footerWhatsapp: "WhatsApp", footerLinks: "Saweeg bağlantıları", imageAlt: (name) => `${name} ürün fotoğrafı`,
  },
  fa: {
    locale: "fa", direction: "rtl", nativeLabel: "فارسی", flag: "🇮🇷", menuTitle: "منو", branchName: "شعبه الحرم",
    welcome: "به سویق خوش آمدید", welcomeEnglish: "Welcome to Saweeg", chooseLanguage: "زبان خود را انتخاب کنید", chooseLanguageEnglish: "Choose your language", changeLanguage: "تغییر زبان",
    categories: { iceCream: "بستنی", desserts: "دسرها", drinks: "نوشیدنی‌ها", powders: "محصولات بسته‌بندی‌شده", boxes: "باکس‌ها و هدایا" },
    productNames: names(["بستنی تلبینه — قیفی", "بستنی تلبینه — لیوانی", "بستنی تلبینه شکلاتی — قیفی", "بستنی تلبینه شکلاتی — لیوانی", "بستنی میکس — قیفی", "بستنی میکس — لیوانی", "چیزکیک تلبینه", "دمکه", "خرمای سوییق", "بسبوسه پکان", "تارت خرما", "معمول سوییق", "تلبینه سرد", "تلبینه گرم", "تلبینه گرم (۱ لیتر)", "قهوه سعودی", "دله قهوه سعودی", "دله قهوه سعودی همراه با دسر", "چای", "فلاسک چای", "ماچا تلبینه", "آب بطری", "بسته پودر تلبینه", "بسته پودر سوییق", "بسته آجیل مخلوط", "ساشه الجابره", "باکس خرمای صفاوی پرشده با آجیل", "باکس خرمای عجوه پرشده با آجیل", "باکس ساشه‌های الجابره", "باکس هدیه", "باکس معمول سوییق", "باکس بسبوسه پکان", "باکس ساشه", "باکس تارت خرما"]),
    priceLabel: (price) => `${price} ریال سعودی`, vatNotice: "همه قیمت‌ها به ریال سعودی و شامل مالیات بر ارزش افزوده هستند", storeEyebrow: "فروشگاه سوییق", storeTitle: "محصولات سوییق را خریداری کنید", storeBody: "محصولات سوییق را در فروشگاه آنلاین ما ببینید.", storeButton: "مشاهده فروشگاه", contactTitle: "ارتباط با سوییق", contactBody: "با خوشحالی به شما کمک می‌کنیم.", whatsapp: "واتساپ", links: "پیوندهای سوییق", footerStore: "فروشگاه آنلاین", footerWhatsapp: "واتساپ", footerLinks: "پیوندهای سوییق", imageAlt: (name) => `تصویر ${name}`,
  },
  fr: {
    locale: "fr", direction: "ltr", nativeLabel: "Français", flag: "🇫🇷", menuTitle: "Menu", branchName: "Succursale Al Haram",
    welcome: "Bienvenue chez Saweeg", welcomeEnglish: "Welcome to Saweeg", chooseLanguage: "Choisissez votre langue", chooseLanguageEnglish: "Choose your language", changeLanguage: "Changer de langue",
    categories: { iceCream: "Glaces", desserts: "Desserts", drinks: "Boissons", powders: "Produits emballés", boxes: "Boîtes et cadeaux" },
    productNames: names(["Glace à la talbinah — Cornet", "Glace à la talbinah — Pot", "Glace à la talbinah au chocolat — Cornet", "Glace à la talbinah au chocolat — Pot", "Glace mixte — Cornet", "Glace mixte — Pot", "Cheesecake à la talbinah", "Damkah", "Dattes Saweeg", "Basbousa aux noix de pécan", "Tarte aux dattes", "Maamoul Saweeg", "Talbinah froide", "Talbinah chaude", "Talbinah chaude (1 litre)", "Café saoudien", "Café saoudien en dallah", "Café saoudien en dallah avec dessert", "Thé", "Thermos de thé", "Matcha à la talbinah", "Eau en bouteille", "Paquet de poudre de talbinah", "Paquet de poudre Saweeg", "Paquet de fruits à coque mélangés", "Sachet Al Jabirah", "Boîte de dattes Safawi farcies aux noix", "Boîte de dattes Ajwa farcies aux noix", "Boîte de sachets Al Jabirah", "Boîte cadeau", "Boîte de Maamoul Saweeg", "Boîte de Basbousa aux noix de pécan", "Boîte de sachets", "Boîte de tarte aux dattes"]),
    priceLabel: (price) => `${price} SAR`, vatNotice: "Tous les prix sont en riyals saoudiens, TVA comprise", storeEyebrow: "Boutique Saweeg", storeTitle: "Découvrez les produits Saweeg", storeBody: "Retrouvez les produits Saweeg dans notre boutique en ligne.", storeButton: "Visiter la boutique", contactTitle: "Contacter Saweeg", contactBody: "Nous sommes heureux de vous aider.", whatsapp: "WhatsApp", links: "Liens Saweeg", footerStore: "Boutique en ligne", footerWhatsapp: "WhatsApp", footerLinks: "Liens Saweeg", imageAlt: (name) => `Photo du produit ${name}`,
  },
  ms: {
    locale: "ms", direction: "ltr", nativeLabel: "Bahasa Melayu", flag: "🇲🇾", menuTitle: "Menu", branchName: "Cawangan Al Haram",
    welcome: "Selamat datang ke Saweeg", welcomeEnglish: "Welcome to Saweeg", chooseLanguage: "Pilih bahasa anda", chooseLanguageEnglish: "Choose your language", changeLanguage: "Tukar Bahasa",
    categories: { iceCream: "Ais Krim", desserts: "Pencuci Mulut", drinks: "Minuman", powders: "Produk Berbungkus", boxes: "Kotak dan Hadiah" },
    productNames: names(["Ais Krim Talbinah — Kon", "Ais Krim Talbinah — Cawan", "Ais Krim Talbinah Coklat — Kon", "Ais Krim Talbinah Coklat — Cawan", "Ais Krim Campuran — Kon", "Ais Krim Campuran — Cawan", "Kek Keju Talbinah", "Damkah", "Kurma Saweeg", "Basbousa Pecan", "Tart Kurma", "Maamoul Saweeg", "Talbinah Sejuk", "Talbinah Panas", "Talbinah Panas (1 Liter)", "Kopi Saudi", "Dallah Kopi Saudi", "Dallah Kopi Saudi dengan Pencuci Mulut", "Teh", "Termos Teh", "Matcha Talbinah", "Air Botol", "Pek Serbuk Talbinah", "Pek Serbuk Saweeg", "Pek Kacang Campuran", "Paket Al Jabirah", "Kotak Kurma Safawi Berinti Kacang", "Kotak Kurma Ajwa Berinti Kacang", "Kotak Saset Al Jabirah", "Kotak Hadiah", "Kotak Maamoul Saweeg", "Kotak Basbousa Pecan", "Kotak Paket", "Kotak Tart Kurma"]),
    priceLabel: (price) => `SAR ${price}`, vatNotice: "Semua harga dalam riyal Saudi dan termasuk cukai nilai tambah (VAT)", storeEyebrow: "Kedai Saweeg", storeTitle: "Terokai produk Saweeg", storeBody: "Temui produk Saweeg di kedai dalam talian kami.", storeButton: "Lawati kedai", contactTitle: "Hubungi Saweeg", contactBody: "Kami sedia membantu anda.", whatsapp: "WhatsApp", links: "Pautan Saweeg", footerStore: "Kedai dalam talian", footerWhatsapp: "WhatsApp", footerLinks: "Pautan Saweeg", imageAlt: (name) => `Foto produk ${name}`,
  },
  ru: {
    locale: "ru", direction: "ltr", nativeLabel: "Русский", flag: "🇷🇺", menuTitle: "Меню", branchName: "Филиал «Аль-Харам»",
    welcome: "Добро пожаловать в Saweeg", welcomeEnglish: "Welcome to Saweeg", chooseLanguage: "Выберите язык", chooseLanguageEnglish: "Choose your language", changeLanguage: "Сменить язык",
    categories: { iceCream: "Мороженое", desserts: "Десерты", drinks: "Напитки", powders: "Упакованные продукты", boxes: "Наборы и подарки" },
    productNames: names(["Мороженое из тальбины — рожок", "Мороженое из тальбины — стаканчик", "Шоколадное мороженое из тальбины — рожок", "Шоколадное мороженое из тальбины — стаканчик", "Мороженое микс — рожок", "Мороженое микс — стаканчик", "Чизкейк из тальбины", "Дамка", "Финики Saweeg", "Басбуса с пеканом", "Тарт с финиками", "Маамуль Saweeg", "Холодная тальбина", "Горячая тальбина", "Горячая тальбина (1 литр)", "Саудовский кофе", "Саудовский кофе в далле", "Саудовский кофе в далле с десертом", "Чай", "Термос чая", "Матча с тальбиной", "Бутилированная вода", "Упаковка порошка тальбины", "Упаковка порошка Saweeg", "Упаковка ореховой смеси", "Саше Al Jabirah", "Набор фиников Сафави с орехами", "Набор фиников Аджва с орехами", "Коробка саше Al Jabirah", "Подарочный набор", "Набор маамуль Saweeg", "Набор басбусы с пеканом", "Набор саше", "Набор тартов с финиками"]),
    priceLabel: (price) => `${price} SAR`, vatNotice: "Все цены указаны в саудовских риялах и включают НДС", storeEyebrow: "Магазин Saweeg", storeTitle: "Откройте для себя продукты Saweeg", storeBody: "Найдите продукты Saweeg в нашем интернет-магазине.", storeButton: "Перейти в магазин", contactTitle: "Связаться с Saweeg", contactBody: "Мы рады вам помочь.", whatsapp: "WhatsApp", links: "Ссылки Saweeg", footerStore: "Интернет-магазин", footerWhatsapp: "WhatsApp", footerLinks: "Ссылки Saweeg", imageAlt: (name) => `Фотография продукта ${name}`,
  },
};
