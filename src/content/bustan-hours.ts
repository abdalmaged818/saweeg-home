// Current branch operating hours; historical localization handoffs remain immutable.
export const bustanPeriods = {
  ar: [["الفترة الصباحية", "من السبت إلى الخميس، من ٦ صباحًا إلى ١٢ ظهرًا."], ["الفترة المسائية", "يوميًا، من ٤:٣٠ عصرًا إلى ١١:٣٠ مساءً."]],
  en: [["Morning", "Saturday to Thursday, from 6:00 AM to noon."], ["Evening", "Daily, from 4:30 PM to 11:30 PM."]]
} as const;

export const bustanHours = {
  ar: "الفترة الصباحية: من السبت إلى الخميس، من ٦ صباحًا إلى ١٢ ظهرًا. الفترة المسائية: يوميًا، من ٤:٣٠ عصرًا إلى ١١:٣٠ مساءً.",
  en: "Morning: Saturday to Thursday, from 6:00 AM to noon. Evening: daily, from 4:30 PM to 11:30 PM.",
  tr: "Sabah: Cumartesi–Perşembe 06.00–12.00. Akşam: her gün 16.30–23.30.",
  ur: "صبح: ہفتہ سے جمعرات، صبح ۶ سے دوپہر ۱۲ بجے تک۔ شام: روزانہ، شام ۴:۳۰ سے رات ۱۱:۳۰ بجے تک۔",
  fa: "نوبت صبح: شنبه تا پنجشنبه، از ۶ صبح تا ۱۲ ظهر. نوبت عصر: هر روز، از ۱۶:۳۰ تا ۲۳:۳۰.",
  id: "Pagi: Sabtu hingga Kamis, pukul 06.00–12.00. Sore: setiap hari, pukul 16.30–23.30.",
  bn: "সকালের সময়: শনিবার থেকে বৃহস্পতিবার, সকাল ৬টা থেকে দুপুর ১২টা। বিকেলের সময়: প্রতিদিন, বিকেল ৪:৩০টা থেকে রাত ১১:৩০টা।",
  fr: "Matin : du samedi au jeudi, de 6 h à midi. Soir : tous les jours, de 16 h 30 à 23 h 30.",
  ms: "Pagi: Sabtu hingga Khamis, 6:00 pagi–12:00 tengah hari. Petang: setiap hari, 4:30 petang–11:30 malam.",
  ru: "Утром: с субботы по четверг, с 06:00 до 12:00. Вечером: ежедневно, с 16:30 до 23:30."
} as const;
