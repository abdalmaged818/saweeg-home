import type { Locale } from "../types/site.ts";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
}

export interface AboutPageCopy {
  eyebrow: string;
  title: string;
  intro: string;
  storyTitle: string;
  story: string[];
  question: string;
  timelineTitle: string;
  timeline: TimelineItem[];
  visionTitle: string;
  vision: string;
  missionTitle: string;
  mission: string;
  beliefsTitle: string;
  beliefs: string[];
  storefrontAlt: string;
  bustanAlt: string;
  talbinahAlt: string;
  cityTitle: string;
  cityText: string;
  productsTitle: string;
  productsText: string;
}

export const aboutPageCopy: Record<Locale, AboutPageCopy> = {
  ar: {
    eyebrow: "عن سويق",
    title: "من المدينة المنورة بدأت حكايتنا",
    intro: "من فكرة بدأت في البيت، إلى علامة تعيد تقديم الموروث الغذائي المديني بهوية معاصرة وتجربة تحمل قصة المكان.",
    storyTitle: "قصة سويق",
    story: [
      "بدأت فكرة سويق من ارتباط عائلي قديم بمنتج السويق، الذي كان حاضرًا في المنزل ومرتبطًا بالذاكرة والعادات والتجارب المتوارثة بين الأجيال.",
      "وعلى الرغم من القيمة التاريخية والثقافية لهذا المنتج، فإنه كان يقدم غالبًا بصورة بسيطة لا تعكس قصته أو مكانته في الموروث الغذائي للمدينة المنورة.",
      "اختارت العلامة السويق والتلبينة النبوية ليكونا أساس تجربتها، وبدأ العمل على تطوير المنتجات والتغليف وطرق التقديم، بما يجعلها أكثر قربًا من مختلف الأعمار، وأكثر ملاءمة للضيافة والإهداء والتجربة اليومية.",
      "انطلق سويق فعليًا عام 2025، وافتتح أول فروعه في مقصد قباء يوم 22 مارس 2025، ثم أطلق متجره الإلكتروني يوم 24 مارس 2025، لتصل منتجاته إلى العملاء داخل المدينة المنورة ومختلف مناطق المملكة وخارجها.",
      "لا تقوم فكرة سويق على بيع المنتجات فقط، بل على بناء تجربة تحمل قصة المدينة المنورة، وتعكس أصالتها ودفء ضيافتها، وتمنح العميل شعورًا بأنه يحمل جزءًا من المدينة في كل منتج."
    ],
    question: "كيف يمكن تحويل منتج تراثي معروف إلى علامة تجارية حديثة، تحافظ على أصالته، وتقدمه بأسلوب يليق بقيمته وقصته؟",
    timelineTitle: "محطات من الحكاية",
    timeline: [
      {
        date: "2022",
        title: "بداية الفكرة",
        description: "بدأت رحلة تحويل السويق والتلبينة من منتج متوارث إلى تجربة عصرية تحمل قصة المدينة."
      },
      {
        date: "22 مارس 2025",
        title: "افتتاح أول فرع",
        description: "افتتح سويق أول فروعه في مقصد قباء بالمدينة المنورة."
      },
      {
        date: "24 مارس 2025",
        title: "إطلاق المتجر الإلكتروني",
        description: "بدأت منتجات سويق الوصول إلى العملاء داخل المدينة ومختلف مناطق المملكة وخارجها."
      }
    ],
    visionTitle: "الرؤية",
    vision: "أن يصبح سويق من أبرز العلامات السعودية المرتبطة بالمدينة المنورة، وأن تكون منتجاته امتدادًا لهوية المدينة وتجربتها، بحيث يشعر العميل بأنه يحمل جزءًا منها في كل منتج.",
    missionTitle: "الرسالة",
    mission: "إحياء الموروث الغذائي المديني والمحافظة على أصالته، وإعادة تقديمه بهوية عصرية وتجربة حديثة تليق بقيمته الثقافية.",
    beliefsTitle: "ما نؤمن به",
    beliefs: [
      "جودة المنتج",
      "الأصالة والارتباط بالمكان",
      "الابتكار في النكهات وطرق التقديم",
      "الهوية المدينية",
      "الضيافة والإهداء",
      "العناية بالتفاصيل",
      "القصة الثقافية خلف كل منتج"
    ],
    storefrontAlt: "واجهة فرع سويق في بستان المستظل",
    bustanAlt: "أجواء بستان المستظل في المدينة المنورة",
    talbinahAlt: "عبوة التلبينة الباردة من سويق",
    cityTitle: "ارتباط بالمدينة",
    cityText: "تنطلق تجربة سويق من المدينة المنورة، من موروثها ودفء ضيافتها وهوية المكان التي تحضر في تفاصيل المنتج والتقديم.",
    productsTitle: "منتجات تحمل القصة",
    productsText: "يتحول الموروث في سويق إلى منتجات وتجارب معاصرة، مع الحفاظ على أصالة الفكرة والعناية بكل تفصيل."
  },
  en: {
    eyebrow: "About Saweeg",
    title: "Our story began in Madinah",
    intro: "From an idea that began at home to a brand reintroducing Madinah’s culinary heritage through a contemporary identity and an experience that carries the story of place.",
    storyTitle: "The Saweeg story",
    story: [
      "The idea for Saweeg grew from a longstanding family connection to Sawiq, a product present in the home and closely tied to memory, tradition, and experiences passed down through generations.",
      "Despite its historical and cultural value, the product was often presented simply, without reflecting its story or its place in Madinah’s culinary heritage.",
      "The brand chose Sawiq and Talbinah as the foundation of its experience and began developing its products, packaging, and ways of serving them. The aim was to make them more approachable across age groups and better suited to hospitality, gifting, and everyday enjoyment.",
      "Saweeg officially launched in 2025, opening its first location at Maqsed Quba in Madinah on 22 March 2025. Its online store followed on 24 March 2025, bringing Saweeg products to customers across Madinah, throughout the Kingdom, and beyond.",
      "Saweeg is not simply about selling products. It is about building an experience that carries Madinah’s story, reflects its authenticity and warm hospitality, and gives every customer the feeling of taking part of the city with them in each product."
    ],
    question: "How can a familiar heritage product become a modern brand—one that preserves its authenticity and presents it in a way worthy of its value and story?",
    timelineTitle: "Milestones in our story",
    timeline: [
      {
        date: "2022",
        title: "The idea begins",
        description: "The journey began to transform Sawiq and Talbinah from inherited products into a contemporary experience carrying Madinah’s story."
      },
      {
        date: "22 March 2025",
        title: "Our first location opens",
        description: "Saweeg opened its first location at Maqsed Quba in Madinah."
      },
      {
        date: "24 March 2025",
        title: "The online store launches",
        description: "Saweeg products began reaching customers across Madinah, throughout the Kingdom, and beyond."
      }
    ],
    visionTitle: "Our vision",
    vision: "For Saweeg to become one of the leading Saudi brands associated with Madinah, with products that extend the city’s identity and experience so every customer feels they are carrying part of it with them.",
    missionTitle: "Our mission",
    mission: "To revive Madinah’s culinary heritage, preserve its authenticity, and reintroduce it through a contemporary identity and an experience worthy of its cultural value.",
    beliefsTitle: "What we believe in",
    beliefs: [
      "Product quality",
      "Authenticity and a connection to place",
      "Innovation in flavors and presentation",
      "Madinah identity",
      "Hospitality and gifting",
      "Attention to detail",
      "The cultural story behind every product"
    ],
    storefrontAlt: "The Saweeg storefront at Bustan Al-Mustazal",
    bustanAlt: "The atmosphere of Bustan Al-Mustazal in Madinah",
    talbinahAlt: "A bottle of Saweeg cold Talbinah",
    cityTitle: "Connected to Madinah",
    cityText: "The Saweeg experience begins in Madinah—in its heritage, its warm hospitality, and the identity of place present in every detail of the product and its presentation.",
    productsTitle: "Products that carry the story",
    productsText: "At Saweeg, heritage becomes a contemporary product and experience while preserving the authenticity of the idea and care in every detail."
  }
};
