import type { Locale } from "../types/site.ts";
import type { ParticipationCategory } from "../data/participations.ts";

export interface ArticleSection {
  title: string;
  paragraphs: string[];
}

export interface ParticipationArticleCopy {
  intro: string;
  sections: ArticleSection[];
  closing: string;
}

type LocalizedArticle = Record<Locale, ParticipationArticleCopy>;

export const participationArticles: Record<string, LocalizedArticle> = {
  "umrah-forum-2026": {
    ar: {
      intro: "شارك سويق في النسخة الثالثة من منتدى العمرة والزيارة 2026، الذي أُقيم في مركز الملك سلمان الدولي للمؤتمرات بالمدينة المنورة، ونظمته وزارة الحج والعمرة بالشراكة مع برنامج خدمة ضيوف الرحمن.",
      sections: [
        {
          title: "موروث المدينة في منصة تخدم ضيوف الرحمن",
          paragraphs: [
            "يُعد منتدى العمرة والزيارة منصة تجمع الجهات العاملة في منظومة العمرة والزيارة، وتسهم في دعم الابتكار والتكامل وتطوير التجربة المقدمة لضيوف الرحمن.",
            "جاءت مشاركة سويق امتدادًا لرؤيته في تقديم الموروث الغذائي للمدينة المنورة ضمن تجربة عصرية، والتعريف بالسويق والتلبينة النبوية بوصفهما جزءًا من القصة الثقافية والغذائية للمدينة."
          ]
        },
        {
          title: "مشاركة تتجاوز عرض المنتج",
          paragraphs: [
            "خلال المنتدى، قدّم سويق مجموعة من منتجاته وتجربته أمام الزوار والجهات المشاركة، مع التركيز على العلاقة بين المنتج والمكان، وعلى قدرة العلامات المحلية على الإسهام في إثراء تجربة الزائر من خلال الضيافة والإهداء والمنتجات التي تحمل هوية المدينة.",
            "لم تكن المشاركة مجرد عرض للمنتجات، بل مساحة لتعريف الزوار بقصة سويق ورسالته في إحياء الموروث الغذائي المديني، وتقديمه بطريقة تتناسب مع احتياجات الزوار والجهات والوفود."
          ]
        },
        {
          title: "من المدينة إلى تجربة الزائر",
          paragraphs: [
            "تعكس المشاركة توجه سويق إلى أن تكون منتجاته جزءًا من تجربة الزائر للمدينة المنورة، بحيث لا تقتصر علاقته بالمدينة على الأماكن التي يزورها، بل تمتد إلى ما يتذوقه ويحمله معه من قصصها وهويتها."
          ]
        }
      ],
      closing: "من قلب المدينة المنورة، يواصل سويق تقديم تجربة تجمع بين أصالة الموروث وجودة المنتج وجمال التقديم."
    },
    en: {
      intro: "Saweeg participated in the third edition of the 2026 Umrah and Visit Forum, held at the King Salman International Convention Center in Madinah and organized by the Ministry of Hajj and Umrah in partnership with the Pilgrim Experience Program.",
      sections: [
        {
          title: "Madinah’s heritage on a platform serving pilgrims",
          paragraphs: [
            "The Umrah and Visit Forum brings together organizations working across the Umrah and visit ecosystem, supporting innovation, integration, and the continued development of the experience offered to pilgrims.",
            "Saweeg’s participation extended its vision of presenting Madinah’s culinary heritage through a contemporary experience, introducing Sawiq and Talbinah as part of the city’s cultural and culinary story."
          ]
        },
        {
          title: "More than a product showcase",
          paragraphs: [
            "During the forum, Saweeg introduced visitors and participating organizations to a selection of its products and its wider experience. The presentation highlighted the relationship between product and place, as well as the role local brands can play in enriching a visitor’s journey through hospitality, gifting, and products rooted in Madinah’s identity.",
            "The participation was not simply a product display. It created a space to share Saweeg’s story and its mission to revive Madinah’s culinary heritage in a format suited to visitors, organizations, and delegations."
          ]
        },
        {
          title: "From Madinah to the visitor experience",
          paragraphs: [
            "The participation reflects Saweeg’s aim for its products to become part of the visitor experience in Madinah—extending the connection with the city beyond the places visited to the flavors, stories, and sense of identity carried home."
          ]
        }
      ],
      closing: "From the heart of Madinah, Saweeg continues to offer an experience that brings together authentic heritage, product quality, and thoughtful presentation."
    }
  },
  "cultures-festival-2026": {
    ar: {
      intro: "شارك سويق في مهرجان الثقافات والشعوب 2026 في نسخته الرابعة عشرة، الذي نظمته الجامعة الإسلامية بالمدينة المنورة، بمشاركة طلاب يمثلون أكثر من 90 دولة.",
      sections: [
        {
          title: "من المدينة المنورة إلى ثقافات العالم",
          paragraphs: [
            "في مساحة اجتمعت فيها ثقافات متعددة من مختلف أنحاء العالم، قدّم سويق جانبًا من الموروث الغذائي للمدينة المنورة من خلال منتجات تجمع بين الأصالة والتقديم الحديث.",
            "أتاحت المشاركة التعريف بالسويق والتلبينة النبوية ومنتجات الضيافة المدينية أمام جمهور متنوع، وإظهار قدرة المنتج الغذائي على أن يكون وسيلة لنقل قصة المجتمع وذاكرته وهويته."
          ]
        },
        {
          title: "الطعام يحمل قصة المكان",
          paragraphs: [
            "تنطلق رؤية سويق من أن الطعام لا ينقل النكهة وحدها، بل يحمل معه قصة المكان الذي خرج منه، والعادات التي ارتبط بها، والمعاني التي توارثتها أجياله.",
            "ولهذا مثّلت المشاركة فرصة لتقديم المدينة المنورة إلى زوار المهرجان من خلال تجربة غذائية دافئة وأصيلة."
          ]
        },
        {
          title: "موروث بلغة معاصرة",
          paragraphs: [
            "عمل سويق على تقديم ثقافة المكان بأسلوب حديث يمكن لمختلف الثقافات التعرف إليه، مع المحافظة على هوية المنتج وأصالته وقصته."
          ]
        }
      ],
      closing: "من المدينة المنورة إلى ثقافات العالم، يواصل سويق تقديم منتجات تحمل قصة المكان وتجمع بين الموروث والتجديد."
    },
    en: {
      intro: "Saweeg participated in the fourteenth edition of the 2026 Festival of Cultures and Peoples, organized by the Islamic University of Madinah and featuring students representing more than 90 countries.",
      sections: [
        {
          title: "From Madinah to the world’s cultures",
          paragraphs: [
            "In a setting where cultures from around the world came together, Saweeg presented an aspect of Madinah’s culinary heritage through products that combine authenticity with contemporary presentation.",
            "The participation introduced a diverse audience to Sawiq, Talbinah, and Madinah-inspired hospitality products, demonstrating how food can communicate a community’s story, memory, and identity."
          ]
        },
        {
          title: "Food carries the story of place",
          paragraphs: [
            "Saweeg’s vision begins with the belief that food conveys more than flavor. It carries the story of its place of origin, the traditions associated with it, and the meanings passed down through generations.",
            "The festival therefore offered an opportunity to introduce Madinah to visitors through a warm and authentic culinary experience."
          ]
        },
        {
          title: "Heritage in a contemporary language",
          paragraphs: [
            "Saweeg presented the culture of place in a modern way that people from different cultures could discover, while preserving the product’s identity, authenticity, and story."
          ]
        }
      ],
      closing: "From Madinah to the cultures of the world, Saweeg continues to present products that carry the story of place and bring heritage and renewal together."
    }
  },
  "bustan-emir-visit": {
    ar: {
      intro: "تشرف سويق بزيارة صاحب السمو الملكي الأمير سلمان بن سلطان بن عبدالعزيز، أمير منطقة المدينة المنورة، لفرع العلامة في بستان المستظل، برفقة معالي وزير الحج والعمرة الدكتور توفيق بن فوزان الربيعة.",
      sections: [
        {
          title: "زيارة نعتز بها",
          paragraphs: [
            "خلال الزيارة، سعد فريق سويق بتقديم مشروب التلبينة النبوية ضمن الضيافة المقدمة لسموه ولمعالي الوزير، والتعريف بتجربة العلامة ورؤيتها في إعادة تقديم الموروث الغذائي المديني بصورة معاصرة."
          ]
        },
        {
          title: "تجربة تحمل هوية المدينة",
          paragraphs: [
            "مثلت الزيارة محطة مهمة في مسيرة سويق، ودافعًا لمواصلة تطوير المنتجات والتجارب التي تحمل هوية المدينة المنورة، وتعكس أصالتها ومكانتها في مجالات الضيافة والإهداء."
          ]
        },
        {
          title: "العلامات المحلية وقصة المكان",
          paragraphs: [
            "تعكس الزيارة أهمية دعم العلامات المحلية التي تنطلق من هوية المنطقة، وتعمل على تحويل موروثها إلى منتجات وتجارب قادرة على النمو والوصول إلى شرائح أوسع."
          ]
        }
      ],
      closing: "يعتز سويق بهذه الزيارة الكريمة، وبكل فرصة تتيح له تقديم قصة المدينة المنورة من خلال منتجاتها وموروثها الغذائي."
    },
    en: {
      intro: "Saweeg was honored by the visit of His Royal Highness Prince Salman bin Sultan bin Abdulaziz, Governor of Madinah Region, to the brand’s location at Bustan Al-Mustazal, accompanied by His Excellency the Minister of Hajj and Umrah, Dr. Tawfiq bin Fawzan Al-Rabiah.",
      sections: [
        {
          title: "A visit we are proud of",
          paragraphs: [
            "During the visit, the Saweeg team was pleased to serve Talbinah as part of the hospitality offered to His Royal Highness and His Excellency the Minister, while introducing the brand experience and its vision for presenting Madinah’s culinary heritage in a contemporary form."
          ]
        },
        {
          title: "An experience rooted in Madinah’s identity",
          paragraphs: [
            "The visit marked an important milestone in Saweeg’s journey and encouraged the continued development of products and experiences that carry Madinah’s identity and reflect its authenticity in hospitality and gifting."
          ]
        },
        {
          title: "Local brands and the story of place",
          paragraphs: [
            "The visit reflects the importance of supporting local brands that grow from the region’s identity and transform its heritage into products and experiences with the potential to reach wider audiences."
          ]
        }
      ],
      closing: "Saweeg values this gracious visit and every opportunity to share Madinah’s story through its products and culinary heritage."
    }
  },
  "princess-sara-meeting": {
    ar: {
      intro: "سعد سويق بلقاء صاحبة السمو الملكي الأميرة سارة بنت بندر بن عبدالعزيز آل سعود، رئيسة مجلس إدارة الجمعية السعودية للمحافظة على التراث، والمديرة التنفيذية للمجلس الدولي للتمور.",
      sections: [
        {
          title: "لقاء يجمع التراث بالمنتج السعودي",
          paragraphs: [
            "يحمل هذا اللقاء قيمة خاصة لسويق؛ لما يجمع بين رؤية العلامة واهتمامات سموها في مجالات التراث والهوية والتمور والمنتجات السعودية ذات القيمة الثقافية."
          ]
        },
        {
          title: "هدية تحمل قصة المدينة",
          paragraphs: [
            "تشرف سويق خلال اللقاء بتقديم مجموعة مختارة من منتجاته هديةً لسموها، تحمل جانبًا من الموروث الغذائي للمدينة المنورة، وتعكس تجربة العلامة في تطوير السويق والتلبينة النبوية ومنتجات الضيافة والإهداء."
          ]
        },
        {
          title: "التراث مصدر للإبداع",
          paragraphs: [
            "يجسد اللقاء تقاطعًا مهمًا بين المحافظة على التراث وتطوير المنتجات؛ فالتراث لا يقتصر على حفظ الماضي، بل يمكن أن يتحول إلى مصدر للإبداع والابتكار وبناء منتجات تحمل قيمة اقتصادية وثقافية في الوقت نفسه."
          ]
        }
      ],
      closing: "يواصل سويق رسالته في تقديم منتجات تحمل قصة المدينة المنورة، وتجمع بين الموروث والتجديد في تجربة واحدة."
    },
    en: {
      intro: "Saweeg was pleased to meet Her Royal Highness Princess Sara bint Bandar bin Abdulaziz Al Saud, Chair of the Board of the Saudi Heritage Preservation Society and Executive Director of the International Dates Council.",
      sections: [
        {
          title: "Where heritage meets Saudi products",
          paragraphs: [
            "The meeting holds particular significance for Saweeg because it brings the brand’s vision together with Her Royal Highness’s interests in heritage, identity, dates, and Saudi products of cultural value."
          ]
        },
        {
          title: "A gift carrying Madinah’s story",
          paragraphs: [
            "During the meeting, Saweeg was honored to present Her Royal Highness with a selected collection of its products. The gift reflected an aspect of Madinah’s culinary heritage and the brand’s work in developing Sawiq, Talbinah, and hospitality and gifting products."
          ]
        },
        {
          title: "Heritage as a source of creativity",
          paragraphs: [
            "The meeting reflects an important connection between preserving heritage and developing products. Heritage is not limited to safeguarding the past; it can also become a source of creativity and innovation, supporting products with both economic and cultural value."
          ]
        }
      ],
      closing: "Saweeg continues its mission to offer products that carry Madinah’s story, bringing heritage and renewal together in one experience."
    }
  }
};

export interface ParticipationsUiCopy {
  homeEyebrow: string;
  homeTitle: string;
  homeDescription: string;
  homeCta: string;
  listingEyebrow: string;
  listingTitle: string;
  listingDescription: string;
  readMore: string;
  yearLabel: string;
  categories: Record<ParticipationCategory, string>;
  breadcrumbHome: string;
  breadcrumbParticipations: string;
  galleryTitle: string;
  closingLabel: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaMenu: string;
  ctaAbout: string;
  ctaContact: string;
}

export const participationsUi: Record<Locale, ParticipationsUiCopy> = {
  ar: {
    homeEyebrow: "من قلب المدينة المنورة",
    homeTitle: "مشاركات سويق",
    homeDescription: "محطات وتجارب شارك فيها سويق قصة المدينة المنورة من خلال الموروث والضيافة والتقديم المعاصر.",
    homeCta: "استعرض جميع المشاركات",
    listingEyebrow: "مشاركات ومحطات",
    listingTitle: "مشاركات سويق",
    listingDescription: "من المعارض والمنتديات إلى الزيارات واللقاءات، يوثق هذا القسم محطات حمل فيها سويق قصة المدينة المنورة وموروثها الغذائي إلى تجارب وجماهير مختلفة.",
    readMore: "اقرأ المشاركة",
    yearLabel: "السنة",
    categories: {
      forum: "المعارض والمنتديات",
      visit: "الزيارات واللقاءات",
      community: "المشاركات المجتمعية",
      hospitality: "الضيافة"
    },
    breadcrumbHome: "الرئيسية",
    breadcrumbParticipations: "مشاركات سويق",
    galleryTitle: "من المشاركة",
    closingLabel: "من قلب المدينة",
    ctaTitle: "اكتشف سويق",
    ctaDescription: "استعرض منيو سويق، وتعرّف على منتجات العلامة وتجربتها من قلب المدينة المنورة.",
    ctaMenu: "شوف منيو سويق",
    ctaAbout: "تعرّف على سويق",
    ctaContact: "تواصل معنا"
  },
  en: {
    homeEyebrow: "From the Heart of Madinah",
    homeTitle: "Saweeg Participations",
    homeDescription: "Moments and experiences where Saweeg shared Madinah’s story through heritage, hospitality, and contemporary presentation.",
    homeCta: "View All Participations",
    listingEyebrow: "Participations & Milestones",
    listingTitle: "Saweeg Participations",
    listingDescription: "From forums and exhibitions to visits and special encounters, this section documents moments where Saweeg carried Madinah’s story and culinary heritage to different audiences and experiences.",
    readMore: "Read participation",
    yearLabel: "Year",
    categories: {
      forum: "Exhibitions & Forums",
      visit: "Visits & Encounters",
      community: "Community Participations",
      hospitality: "Hospitality"
    },
    breadcrumbHome: "Home",
    breadcrumbParticipations: "Participations",
    galleryTitle: "From the participation",
    closingLabel: "From the heart of Madinah",
    ctaTitle: "Discover Saweeg",
    ctaDescription: "Browse the Saweeg menu and discover the brand experience from the heart of Madinah.",
    ctaMenu: "View the Saweeg menu",
    ctaAbout: "About Saweeg",
    ctaContact: "Contact us"
  }
};
