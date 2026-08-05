export type ParticipationStatus = "published" | "draft";
export type ParticipationCategory = "forum" | "visit" | "community" | "hospitality";
export type ParticipationAspect = "portrait" | "landscape";

export interface ParticipationGalleryImage {
  src: string;
  altAr: string;
  altEn: string;
  width: number;
  height: number;
  aspect: ParticipationAspect;
  position?: string;
}

export interface Participation {
  id: string;
  slug: string;
  status: "published";
  category: ParticipationCategory;
  year: number;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  heroImage: string;
  heroAltAr: string;
  heroAltEn: string;
  heroWidth: number;
  heroHeight: number;
  heroAspect: ParticipationAspect;
  heroPosition?: string;
  gallery: ParticipationGalleryImage[];
  seoTitleAr: string;
  seoTitleEn: string;
  seoDescriptionAr: string;
  seoDescriptionEn: string;
}

export interface DraftParticipation {
  id: string;
  slug: string;
  status: "draft";
  category: ParticipationCategory;
  year: number;
  titleAr: string;
  titleEn: string;
  missing: Array<"images" | "approved-content">;
}

export type ParticipationRecord = Participation | DraftParticipation;

const asset = (folder: string, name: string): string =>
  `assets/participations/${folder}/${name}`;

export const publishedParticipations: Participation[] = [
  {
    id: "umrah-forum-2026",
    slug: "umrah-forum-2026",
    status: "published",
    category: "forum",
    year: 2026,
    titleAr: "سويق في منتدى العمرة والزيارة 2026",
    titleEn: "Saweeg at the 2026 Umrah and Visit Forum",
    excerptAr: "قدّم سويق جانبًا من الموروث الغذائي المديني ضمن تجربة تجمع بين أصالة المنتج وجودة التقديم.",
    excerptEn: "Saweeg presented a facet of Madinah’s culinary heritage through an experience combining authenticity with thoughtful presentation.",
    heroImage: asset("umrah-forum-2026", "umrah-forum-2026-hero"),
    heroAltAr: "جناح سويق وفريقه في منتدى العمرة والزيارة 2026",
    heroAltEn: "The Saweeg stand and team at the 2026 Umrah and Visit Forum",
    heroWidth: 1440,
    heroHeight: 1800,
    heroAspect: "portrait",
    heroPosition: "50% 44%",
    gallery: [
      {
        src: asset("umrah-forum-2026", "umrah-forum-2026-gallery-01"),
        altAr: "تقديم التلبينة وسط أجواء منتدى العمرة والزيارة",
        altEn: "Serving Talbinah during the Umrah and Visit Forum",
        width: 1440,
        height: 2050,
        aspect: "portrait",
        position: "50% 48%"
      },
      {
        src: asset("umrah-forum-2026", "umrah-forum-2026-gallery-02"),
        altAr: "بدء تحضير التلبينة في جناح سويق",
        altEn: "Preparing Talbinah at the Saweeg stand",
        width: 1440,
        height: 1800,
        aspect: "portrait",
        position: "50% 50%"
      },
      {
        src: asset("umrah-forum-2026", "umrah-forum-2026-gallery-03"),
        altAr: "تزيين كوب التلبينة بالمكسرات",
        altEn: "Finishing a cup of Talbinah with nuts",
        width: 1440,
        height: 1800,
        aspect: "portrait",
        position: "50% 54%"
      },
      {
        src: asset("umrah-forum-2026", "umrah-forum-2026-gallery-04"),
        altAr: "تجهيز أكواب سويق خلف الكواليس",
        altEn: "Preparing Saweeg cups behind the scenes",
        width: 1440,
        height: 2051,
        aspect: "portrait",
        position: "50% 44%"
      }
    ],
    seoTitleAr: "سويق في منتدى العمرة والزيارة 2026 | سويق",
    seoTitleEn: "Saweeg at the 2026 Umrah and Visit Forum | Saweeg",
    seoDescriptionAr: "مشاركة سويق في منتدى العمرة والزيارة 2026، وتقديم الموروث الغذائي للمدينة المنورة ضمن تجربة عصرية لضيوف وزوار المنتدى.",
    seoDescriptionEn: "Saweeg’s participation in the 2026 Umrah and Visit Forum, presenting Madinah’s culinary heritage through a contemporary visitor experience."
  },
  {
    id: "cultures-festival-2026",
    slug: "cultures-festival-2026",
    status: "published",
    category: "forum",
    year: 2026,
    titleAr: "سويق في مهرجان الثقافات والشعوب 2026",
    titleEn: "Saweeg at the 2026 Festival of Cultures and Peoples",
    excerptAr: "قدّم سويق الموروث الغذائي المديني أمام جمهور متعدد الثقافات في تجربة تحمل قصة المكان بلغة معاصرة.",
    excerptEn: "Saweeg shared Madinah’s culinary heritage with a multicultural audience through a contemporary expression of place.",
    heroImage: asset("cultures-festival-2026", "cultures-festival-2026-hero"),
    heroAltAr: "منتج سويق وهوية العلامة عند مدخل مهرجان الثقافات والشعوب",
    heroAltEn: "A Saweeg product and brand identity at the Festival of Cultures and Peoples",
    heroWidth: 1440,
    heroHeight: 1800,
    heroAspect: "portrait",
    heroPosition: "50% 38%",
    gallery: [
      {
        src: asset("cultures-festival-2026", "cultures-festival-2026-gallery-01"),
        altAr: "تجربة تذوق منتج سويق في المهرجان",
        altEn: "A Saweeg tasting experience at the festival",
        width: 1440,
        height: 1800,
        aspect: "portrait",
        position: "50% 40%"
      },
      {
        src: asset("cultures-festival-2026", "cultures-festival-2026-gallery-02"),
        altAr: "منتج سويق داخل أجواء المهرجان",
        altEn: "A Saweeg product within the festival setting",
        width: 1440,
        height: 1800,
        aspect: "portrait",
        position: "50% 48%"
      },
      {
        src: asset("cultures-festival-2026", "cultures-festival-2026-gallery-03"),
        altAr: "عبوة التلبينة الباردة من سويق",
        altEn: "A bottle of Saweeg cold Talbinah",
        width: 1440,
        height: 1800,
        aspect: "portrait",
        position: "50% 50%"
      },
      {
        src: asset("cultures-festival-2026", "cultures-festival-2026-gallery-04"),
        altAr: "تقديم كوب التلبينة لزوار المهرجان",
        altEn: "Presenting a cup of Talbinah to festival visitors",
        width: 1440,
        height: 1800,
        aspect: "portrait",
        position: "50% 42%"
      }
    ],
    seoTitleAr: "سويق في مهرجان الثقافات والشعوب 2026",
    seoTitleEn: "Saweeg at the 2026 Festival of Cultures and Peoples | Saweeg",
    seoDescriptionAr: "قدّم سويق الموروث الغذائي المديني أمام جمهور متعدد الثقافات في مهرجان الثقافات والشعوب بالمدينة المنورة.",
    seoDescriptionEn: "Saweeg presented Madinah’s culinary heritage to a multicultural audience at the Festival of Cultures and Peoples in Madinah."
  },
  {
    id: "bustan-emir-visit",
    slug: "bustan-emir-visit",
    status: "published",
    category: "visit",
    year: 2026,
    titleAr: "زيارة أمير منطقة المدينة المنورة لفرع سويق في بستان المستظل",
    titleEn: "Visit of the Governor of Madinah Region to Saweeg at Bustan Al-Mustazal",
    excerptAr: "محطة نعتز بها في مسيرة سويق، قدّم خلالها الفريق تجربة التلبينة النبوية ورؤية العلامة.",
    excerptEn: "A milestone in Saweeg’s journey, during which the team presented the Talbinah experience and the brand’s vision.",
    heroImage: asset("bustan-emir-visit", "bustan-emir-visit-hero"),
    heroAltAr: "جانب من جلسة الضيافة خلال زيارة أمير منطقة المدينة المنورة",
    heroAltEn: "A hospitality gathering during the visit of the Governor of Madinah Region",
    heroWidth: 1440,
    heroHeight: 1080,
    heroAspect: "landscape",
    heroPosition: "50% 48%",
    gallery: [
      {
        src: asset("bustan-emir-visit", "bustan-emir-visit-gallery-01"),
        altAr: "واجهة فرع سويق في بستان المستظل",
        altEn: "The Saweeg storefront at Bustan Al-Mustazal",
        width: 1440,
        height: 2560,
        aspect: "portrait",
        position: "50% 50%"
      },
      {
        src: asset("bustan-emir-visit", "bustan-emir-visit-gallery-02"),
        altAr: "أجواء بستان المستظل ليلًا",
        altEn: "The evening atmosphere at Bustan Al-Mustazal",
        width: 1440,
        height: 2560,
        aspect: "portrait",
        position: "50% 50%"
      },
      {
        src: asset("bustan-emir-visit", "bustan-emir-visit-gallery-03"),
        altAr: "صورة جماعية لفريق سويق والمشاركين",
        altEn: "A group photo of the Saweeg team and participants",
        width: 1440,
        height: 958,
        aspect: "landscape",
        position: "50% 45%"
      },
      {
        src: asset("bustan-emir-visit", "bustan-emir-visit-gallery-04"),
        altAr: "تفاصيل واجهة وهوية فرع سويق",
        altEn: "Details of the Saweeg storefront and identity",
        width: 1440,
        height: 2560,
        aspect: "portrait",
        position: "50% 50%"
      }
    ],
    seoTitleAr: "زيارة أمير منطقة المدينة المنورة لفرع سويق",
    seoTitleEn: "Visit of the Governor of Madinah Region to Saweeg | Saweeg",
    seoDescriptionAr: "محطة يعتز بها سويق خلال زيارة أمير منطقة المدينة المنورة لفرع العلامة في بستان المستظل.",
    seoDescriptionEn: "A milestone for Saweeg during the visit of the Governor of Madinah Region to the brand’s Bustan Al-Mustazal branch."
  },
  {
    id: "princess-sara-meeting",
    slug: "princess-sara-meeting",
    status: "published",
    category: "visit",
    year: 2026,
    titleAr: "لقاء الأميرة سارة بنت بندر بن عبدالعزيز",
    titleEn: "Meeting with Princess Sara bint Bandar bin Abdulaziz",
    excerptAr: "لقاء جمع بين التراث والهوية والمنتجات السعودية ذات القيمة الثقافية.",
    excerptEn: "An encounter bringing together heritage, identity, and Saudi products with cultural value.",
    heroImage: asset("princess-sara-meeting", "princess-sara-meeting-hero"),
    heroAltAr: "تقديم مجموعة من منتجات سويق خلال لقاء الأميرة سارة بنت بندر",
    heroAltEn: "Presenting a selection of Saweeg products during the meeting with Princess Sara bint Bandar",
    heroWidth: 1440,
    heroHeight: 2560,
    heroAspect: "portrait",
    heroPosition: "50% 46%",
    gallery: [
      {
        src: asset("princess-sara-meeting", "princess-sara-meeting-gallery-01"),
        altAr: "جانب من تقديم منتجات سويق خلال اللقاء",
        altEn: "Presenting Saweeg products during the meeting",
        width: 1440,
        height: 1080,
        aspect: "landscape",
        position: "50% 50%"
      },
      {
        src: asset("princess-sara-meeting", "princess-sara-meeting-gallery-02"),
        altAr: "جانب من جلسة اللقاء وتقديم منتجات سويق",
        altEn: "A view of the meeting and Saweeg product presentation",
        width: 1440,
        height: 1080,
        aspect: "landscape",
        position: "50% 50%"
      }
    ],
    seoTitleAr: "لقاء الأميرة سارة بنت بندر | سويق",
    seoTitleEn: "Meeting with Princess Sara bint Bandar | Saweeg",
    seoDescriptionAr: "لقاء سويق بصاحبة السمو الملكي الأميرة سارة بنت بندر، وتقديم مجموعة من منتجات العلامة المستوحاة من موروث المدينة المنورة.",
    seoDescriptionEn: "Saweeg’s meeting with Her Royal Highness Princess Sara bint Bandar and the presentation of products inspired by Madinah’s heritage."
  }
];

export const draftParticipations: DraftParticipation[] = [
  {
    id: "umrah-forum-dinner",
    slug: "umrah-forum-dinner",
    status: "draft",
    category: "hospitality",
    year: 2026,
    titleAr: "العشاء المصاحب لمنتدى العمرة والزيارة",
    titleEn: "Dinner accompanying the Umrah and Visit Forum",
    missing: ["images"]
  },
  {
    id: "friendship-day-mda",
    slug: "friendship-day-mda",
    status: "draft",
    category: "community",
    year: 2026,
    titleAr: "اليوم الدولي للصداقة في هيئة تطوير المنطقة",
    titleEn: "International Day of Friendship at the Madinah Region Development Authority",
    missing: ["images"]
  },
  {
    id: "deputy-governor-visit",
    slug: "deputy-governor-visit",
    status: "draft",
    category: "visit",
    year: 2026,
    titleAr: "زيارة نائب أمير منطقة المدينة",
    titleEn: "Visit of the Deputy Governor of Madinah Region",
    missing: ["images"]
  },
  {
    id: "al-ittihad-hospitality",
    slug: "al-ittihad-hospitality",
    status: "draft",
    category: "hospitality",
    year: 2026,
    titleAr: "ضيافة نادي الاتحاد",
    titleEn: "Al-Ittihad Club Hospitality",
    missing: ["approved-content"]
  },
  {
    id: "al-mirdan-hotel",
    slug: "al-mirdan-hotel",
    status: "draft",
    category: "hospitality",
    year: 2026,
    titleAr: "فندق الميردان",
    titleEn: "Al-Mirdan Hotel",
    missing: ["approved-content"]
  },
  {
    id: "maden-hotel-2026",
    slug: "maden-hotel-2026",
    status: "draft",
    category: "hospitality",
    year: 2026,
    titleAr: "فندق مادن 7-2026",
    titleEn: "Maden Hotel 7-2026",
    missing: ["approved-content"]
  },
  {
    id: "dates-exhibition-2026",
    slug: "dates-exhibition-2026",
    status: "draft",
    category: "forum",
    year: 2026,
    titleAr: "معرض التمور 2026",
    titleEn: "Dates Exhibition 2026",
    missing: ["approved-content"]
  },
  {
    id: "jeddah-park-2025",
    slug: "jeddah-park-2025",
    status: "draft",
    category: "forum",
    year: 2025,
    titleAr: "معرض جدة بارك 2025",
    titleEn: "Jeddah Park Exhibition 2025",
    missing: ["approved-content"]
  }
];

export const participationRecords: ParticipationRecord[] = [
  ...publishedParticipations,
  ...draftParticipations
];

export const getPublishedParticipation = (slug: string): Participation | undefined =>
  publishedParticipations.find((participation) => participation.slug === slug);
