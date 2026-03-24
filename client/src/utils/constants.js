// ════════════════════════════════════════
// AAM CONSTANTS & CONTENT
// ════════════════════════════════════════

export const BRAND = {
  name_ar: 'أكاديمية عربية للموضة',
  name_fr: 'Académie Arabe de la Mode',
  short: 'AAM',
  tagline_ar: 'حيث يلتقي الموروث العربي بموضة الغد',
  tagline_fr: 'Là où l\'héritage arabe rencontre la mode de demain',
  record: 'Guinness World Record™',
  sub_brand: '6ix'
};

export const STATS = [
  { value: 1000, suffix: '+', label_ar: 'طالب', label_fr: 'Étudiants', icon: '👨‍🎨' },
  { value: 20, suffix: '+', label_ar: 'كورس', label_fr: 'Cours', icon: '📚' },
  { value: 10, suffix: '', label_ar: 'سنوات', label_fr: 'Années', icon: '⭐' },
  { value: 1, suffix: '', label_ar: 'رقم قياسي غينيس', label_fr: 'Record Guinness', icon: '🏆' }
];

export const NAV_LINKS = [
  { path: '/', label_ar: 'الرئيسية', label_fr: 'Accueil' },
  { path: '/about', label_ar: 'عن الأكاديمية', label_fr: 'À Propos' },
  { path: '/courses', label_ar: 'الكورسات', label_fr: 'Cours' },
  { path: '/gallery', label_ar: 'المعرض', label_fr: 'Galerie' },
  { path: '/testimonials', label_ar: 'الشهادات', label_fr: 'Témoignages' },
  { path: '/shop', label_ar: 'متجر 6ix', label_fr: 'Boutique 6ix' },
  { path: '/contact', label_ar: 'تواصل معنا', label_fr: 'Contact' }
];

export const COURSE_CATEGORIES = [
  { value: 'all',             label_ar: 'الكل',          label_fr: 'Tout' },
  { value: 'تصميم',           label_ar: 'تصميم',         label_fr: 'Design' },
  { value: 'خياطة',           label_ar: 'خياطة',         label_fr: 'Couture' },
  { value: 'مولاج',           label_ar: 'مولاج',         label_fr: 'Moulage' },
  { value: 'كورساج',          label_ar: 'كورساج',        label_fr: 'Corsage' },
  { value: 'فستان الزفاف',    label_ar: 'فستان الزفاف',  label_fr: 'Robe de Mariée' },
  { value: 'تجميل',           label_ar: 'تجميل',         label_fr: 'Beauté' },
  { value: 'تسويق',           label_ar: 'تسويق',         label_fr: 'Marketing' },
  { value: '6ix Streetwear',  label_ar: '6ix ستريتوير',  label_fr: '6ix Streetwear' }
];

export const GALLERY_CATEGORIES = [
  { value: 'all', label_ar: 'الكل', label_fr: 'Tout' },
  { value: 'haute-couture', label_ar: 'هوت كوتور', label_fr: 'Haute Couture' },
  { value: 'streetwear', label_ar: 'ستريتوير', label_fr: 'Streetwear' },
  { value: 'evenement', label_ar: 'فعاليات', label_fr: 'Événements' },
  { value: 'etudiant', label_ar: 'أعمال الطلاب', label_fr: 'Travaux étudiants' },
  { value: 'collection', label_ar: 'مجموعات', label_fr: 'Collections' }
];

export const FOUNDER = {
  name: 'Arbi Bougamha',
  name_ar: 'عربي بوقمحة',
  role_ar: 'مؤسس ومدير الأكاديمية العربية للموضة',
  role_fr: 'Fondateur & Directeur — Académie Arabe de la Mode',
  avatar: '/images/team/arbi-bougamha.jpg',
  guinness_year: 2009,
  guinness_detail_ar: 'رقم قياسي عالمي غينيس 2009 — أكبر سروال جينز في العالم: 50 م طولاً × 36 م عرضاً، عُرض في الملعب البلدي بأريانة.',
  guinness_detail_fr: 'Record Guinness 2009 — Plus grand jean du monde : 50 m de long × 36 m de large, exposé au stade municipal d\'Ariana.',
  bio_ar: 'عربي بوقمحة شخصية بارزة على الصعيدين الوطني والدولي في مجال الموضة. اشتهر بدخوله موسوعة "غينيس" للأرقام القياسية عام 2009 بعد تصميمه أكبر سروال جينز في العالم (50 م × 36 م) في الملعب البلدي بأريانة. يشغل منصب مدير الأكاديمية العربية للموضة في تونس، مؤسسة تعليمية متخصصة في تدريب وتأهيل مصممي الأزياء الشباب. يُعدّ من الوجوه الرائدة في قطاع النسيج والملابس بتونس، وله حضور مستمر في وسائل الإعلام للحديث عن استراتيجيات تطوير قطاع الموضة والابتكار فيه.',
  bio_fr: 'Arbi Bougamha est une figure reconnue de la mode, tant sur le plan national qu\'international. Il est entré dans le Livre des Records Guinness en 2009 en concevant le plus grand jean du monde (50 m × 36 m), exposé au stade municipal d\'Ariana. Directeur de l\'Académie Arabe de la Mode en Tunisie, il forme et accompagne la nouvelle génération de stylistes arabes. Figure incontournable du secteur textile tunisien, il intervient régulièrement dans les médias pour défendre l\'innovation et le développement de la filière mode.',
};

export const TEAM_MEMBERS = [
  {
    name: 'Arbi Bougamha',
    name_ar: 'عربي بوقمحة',
    role_ar: 'المؤسس والمدير',
    role_fr: 'Fondateur & Directeur',
    bio_fr: 'Record Guinness 2009. Directeur de l\'AAM, figure du secteur textile tunisien.',
    avatar: '/images/team/arbi-bougamha.jpg',
    isFounder: true,
  },
  {
    name: 'Maître Couturier',
    name_ar: 'أستاذ الخياطة',
    role_ar: 'أستاذ الخياطة',
    role_fr: 'Maître Couturier',
    bio_fr: 'Expert en haute couture avec 20 ans d\'expérience internationale.',
    avatar: '/images/team/couturier.jpg',
  },
  {
    name: 'Design Director',
    name_ar: 'مدير التصميم',
    role_ar: 'مدير التصميم',
    role_fr: 'Directeur Artistique',
    bio_fr: 'Fusion unique entre modernité et patrimoine arabe.',
    avatar: '/images/team/designer.jpg',
  }
];

// Design tokens exported for JS use
export const COLORS = {
  navyDeep: '#050d1f',
  navy: '#0d1b3e',
  blue: '#1a2a6c',
  blueMid: '#1565c0',
  cyan: '#00b8d4',
  blueLight: '#4fc3f7',
  white: '#ffffff',
  offWhite: '#f0f6ff',
  gold: '#c9a84c'
};
