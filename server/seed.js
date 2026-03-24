import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Course from './models/Course.js';
import Product from './models/Product.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing seed data
  await Course.deleteMany({});
  await Product.deleteMany({});

  // Create admin if not exists
  const existing = await User.findOne({ email: 'admin@aam.ma' });
  if (!existing) {
    await User.create({
      name: 'Admin AAM',
      email: 'admin@aam.ma',
      password: 'admin123',
      role: 'admin',
      phone: '+21600000000'
    });
    console.log('👑 Admin created: admin@aam.ma / admin123');
  }

  // Seed courses
  const courses = await Course.insertMany([
    {
      title_ar: 'تصميم الأزياء من الصفر',
      title_fr: 'Design de Mode — Niveau Débutant',
      description_ar: 'تعلم أساسيات تصميم الأزياء من الرسم إلى التصميم الكامل. مناسب للمبتدئين.',
      description_fr: 'Apprenez les bases du design de mode, du croquis au design final. Idéal pour débutants.',
      duration: '3 mois',
      level: 'مبتدئ',
      category: 'تصميم',
      price: 2500,
      seats: 20,
      enrolledCount: 12,
      featured: true,
      instructor: { name: 'Maître Hassan', bio: 'Designer avec 15 ans d\'expérience internationale.', avatar: '' },
      curriculum: [
        { week: 1, topic_ar: 'مقدمة في عالم الموضة', topic_fr: 'Introduction au monde de la mode' },
        { week: 2, topic_ar: 'أساسيات الرسم للأزياء', topic_fr: 'Bases du croquis de mode' },
        { week: 3, topic_ar: 'الألوان والأقمشة', topic_fr: 'Couleurs et tissus' },
        { week: 4, topic_ar: 'التصميم الرقمي', topic_fr: 'Design numérique' }
      ]
    },
    {
      title_ar: 'الخياطة الاحترافية',
      title_fr: 'Couture Professionnelle',
      description_ar: 'إتقان فن الخياطة من الباترون إلى الخياطة الاحترافية.',
      description_fr: 'Maîtrisez l\'art de la couture, du patronage à la confection professionnelle.',
      duration: '4 mois',
      level: 'متوسط',
      category: 'خياطة',
      price: 3200,
      seats: 15,
      enrolledCount: 8,
      featured: true,
      instructor: { name: 'Maîtresse Fatima', bio: 'Couturière haute couture, formée à Paris.', avatar: '' },
      curriculum: [
        { week: 1, topic_ar: 'قراءة الباترون', topic_fr: 'Lecture de patronage' },
        { week: 2, topic_ar: 'قص الأقمشة', topic_fr: 'Découpe des tissus' },
        { week: 3, topic_ar: 'تقنيات الخياطة', topic_fr: 'Techniques de couture' },
        { week: 4, topic_ar: 'التشطيب الاحترافي', topic_fr: 'Finitions professionnelles' }
      ]
    },
    {
      title_ar: 'ستريتوير 6ix',
      title_fr: 'Streetwear 6ix — Design Urbain',
      description_ar: 'تعلم تصميم الملابس الحضرية بأسلوب فريد يمزج الثقافة العربية بالموضة العالمية.',
      description_fr: 'Créez des vêtements streetwear uniques mélangeant culture arabe et mode mondiale.',
      duration: '2 mois',
      level: 'مبتدئ',
      category: '6ix Streetwear',
      price: 2000,
      seats: 25,
      enrolledCount: 18,
      featured: true,
      instructor: { name: 'Youssef 6ix', bio: 'Fondateur de la marque 6ix, expert streetwear.', avatar: '' },
      curriculum: [
        { week: 1, topic_ar: 'مفهوم الستريتوير', topic_fr: 'Concept Streetwear' },
        { week: 2, topic_ar: 'تصميم التيشيرت', topic_fr: 'Design T-shirt' },
        { week: 3, topic_ar: 'الهودي والكاب', topic_fr: 'Hoodie et Cap' },
        { week: 4, topic_ar: 'إطلاق مجموعتك', topic_fr: 'Lancer votre collection' }
      ]
    },
    {
      title_ar: 'تسويق الموضة',
      title_fr: 'Marketing de la Mode',
      description_ar: 'كيف تسوق مجموعتك الخاصة وتبني علامتك التجارية في عالم الموضة.',
      description_fr: 'Comment commercialiser votre collection et construire votre marque dans la mode.',
      duration: '2 mois',
      level: 'متوسط',
      category: 'تسويق',
      price: 1800,
      seats: 30,
      enrolledCount: 22,
      featured: false,
      instructor: { name: 'Sara Marketing', bio: 'Consultante en marketing de mode, ex-Zara.', avatar: '' },
      curriculum: [
        { week: 1, topic_ar: 'استراتيجية العلامة التجارية', topic_fr: 'Stratégie de marque' },
        { week: 2, topic_ar: 'التسويق الرقمي', topic_fr: 'Marketing digital' },
        { week: 3, topic_ar: 'السوشيال ميديا للموضة', topic_fr: 'Réseaux sociaux mode' },
        { week: 4, topic_ar: 'إطلاق حملة إعلانية', topic_fr: 'Lancer une campagne' }
      ]
    },
    {
      title_ar: 'الهوت كوتور العربي',
      title_fr: 'Haute Couture Arabe',
      description_ar: 'فن الهوت كوتور بلمسة عربية أصيلة — للمتقدمين فقط.',
      description_fr: 'L\'art de la haute couture avec une touche arabe authentique — niveau avancé.',
      duration: '6 mois',
      level: 'متقدم',
      category: 'تصميم',
      price: 5500,
      seats: 10,
      enrolledCount: 7,
      featured: true,
      instructor: { name: 'La Directrice', bio: 'Fondatrice de l\'AAM, détentrice du Record Guinness.', avatar: '' },
      curriculum: [
        { week: 1, topic_ar: 'تاريخ الموضة العربية', topic_fr: 'Histoire de la mode arabe' },
        { week: 2, topic_ar: 'التطريز والزخرفة', topic_fr: 'Broderie et ornementation' },
        { week: 3, topic_ar: 'الأقمشة الفاخرة', topic_fr: 'Tissus de luxe' },
        { week: 4, topic_ar: 'تصميم لباس مناسبة', topic_fr: 'Design robe de cérémonie' }
      ]
    },
    {
      title_ar: 'المولاج — دراپيه على المانيكان',
      title_fr: 'Moulage — Drapé sur Mannequin',
      description_ar: 'تعلم فن المولاج وتشكيل القماش مباشرة على المانيكان لإنشاء أشكال مبتكرة وتصاميم فريدة.',
      description_fr: 'Maîtrisez l\'art du moulage et du drapé sur mannequin pour créer des formes innovantes et des designs uniques.',
      duration: '3 mois',
      level: 'متوسط',
      category: 'مولاج',
      price: 3500,
      seats: 12,
      enrolledCount: 5,
      featured: true,
      instructor: { name: 'Maîtresse Leila', bio: 'Spécialiste du moulage, formée à l\'École de la Chambre Syndicale.', avatar: '' },
      curriculum: [
        { week: 1, topic_ar: 'مقدمة في المولاج وأدواته', topic_fr: 'Introduction au moulage et ses outils' },
        { week: 2, topic_ar: 'تقنيات التثبيت والتشكيل', topic_fr: 'Techniques d\'épinglage et de mise en forme' },
        { week: 3, topic_ar: 'الدرابيه والثنيات الحرة', topic_fr: 'Drapé libre et fronces' },
        { week: 4, topic_ar: 'تحويل المولاج إلى باترون', topic_fr: 'Transfert du moulage en patron plat' },
        { week: 5, topic_ar: 'مشروع التخرج — تصميم كامل', topic_fr: 'Projet final — création d\'une pièce complète' }
      ]
    },
    {
      title_ar: 'الكورساج — تصميم الهياكل المقواة',
      title_fr: 'Corsage & Corset — Construction Structurée',
      description_ar: 'إتقان فن تصميم وخياطة الكورساج والكورسيه والهياكل المقواة في الأزياء الراقية.',
      description_fr: 'Maîtrisez la conception et la confection du corsage, corset et structures rigides dans la haute couture.',
      duration: '4 mois',
      level: 'متقدم',
      category: 'كورساج',
      price: 4200,
      seats: 10,
      enrolledCount: 4,
      featured: true,
      instructor: { name: 'Maîtresse Fatima', bio: 'Couturière haute couture, spécialiste des structures et baleines.', avatar: '' },
      curriculum: [
        { week: 1, topic_ar: 'تاريخ الكورسيه والكورساج', topic_fr: 'Histoire du corset et du corsage' },
        { week: 2, topic_ar: 'الباترون والهياكل الداخلية', topic_fr: 'Patronage et structures internes' },
        { week: 3, topic_ar: 'البالينات وتقنيات التقوية', topic_fr: 'Baleines et techniques de rigidification' },
        { week: 4, topic_ar: 'الأقمشة والبطانات الفاخرة', topic_fr: 'Tissus et doublures de luxe' },
        { week: 5, topic_ar: 'خياطة كورساج كامل', topic_fr: 'Confection d\'un corsage complet' },
        { week: 6, topic_ar: 'التشطيب والتفاصيل الدقيقة', topic_fr: 'Finitions et détails minutieux' }
      ]
    },
    {
      title_ar: 'فستان الزفاف — من التصميم إلى الإنجاز',
      title_fr: 'Robe de Mariée — De la Création à la Réalisation',
      description_ar: 'كورس متكامل لتصميم وخياطة فستان الزفاف، من الرسكيت والباترون إلى التطريز والتشطيب النهائي.',
      description_fr: 'Cours complet pour concevoir et confectionner une robe de mariée, du croquis au patronage jusqu\'à la broderie et finitions.',
      duration: '5 mois',
      level: 'متقدم',
      category: 'فستان الزفاف',
      price: 5800,
      seats: 8,
      enrolledCount: 6,
      featured: true,
      instructor: { name: 'La Directrice', bio: 'Fondatrice de l\'AAM, créatrice de robes de mariée primées internationalement.', avatar: '' },
      curriculum: [
        { week: 1, topic_ar: 'تصميم وريسكيت فستان الزفاف', topic_fr: 'Croquis et design de la robe de mariée' },
        { week: 2, topic_ar: 'الباترون وأخذ القياسات', topic_fr: 'Patronage et prise de mesures' },
        { week: 3, topic_ar: 'اختيار الأقمشة — الساتان والتول والدانتيل', topic_fr: 'Choix des tissus — satin, tulle, dentelle' },
        { week: 4, topic_ar: 'تجميع الفستان والتجربة الأولى', topic_fr: 'Assemblage et premier essayage' },
        { week: 5, topic_ar: 'التطريز والزينة والترتر', topic_fr: 'Broderie, ornements et strass' },
        { week: 6, topic_ar: 'الذيل والطرحة وإكسسوارات العروس', topic_fr: 'Traîne, voile et accessoires mariée' },
        { week: 7, topic_ar: 'التشطيب النهائي والعرض', topic_fr: 'Finitions finales et présentation' }
      ]
    },
    {
      title_ar: 'دورة التجميل والميكياج الاحترافي',
      title_fr: 'Beauté & Maquillage Professionnel',
      description_ar: 'تعلم فن الميكياج الاحترافي، العناية بالبشرة، ومكياج المناسبات والعروض وإطلاق علامتك في عالم التجميل.',
      description_fr: 'Apprenez l\'art du maquillage professionnel, soin de la peau, make-up événementiel et défilés, et lancez votre marque beauté.',
      duration: '3 mois',
      level: 'مبتدئ',
      category: 'تجميل',
      price: 2800,
      seats: 20,
      enrolledCount: 14,
      featured: true,
      instructor: { name: 'Yasmine Beauty', bio: 'Maquilleuse professionnelle, collaboratrice des plus grands défilés de mode en Tunisie.', avatar: '' },
      curriculum: [
        { week: 1, topic_ar: 'أنواع البشرة والعناية الأساسية', topic_fr: 'Types de peau et soins de base' },
        { week: 2, topic_ar: 'أدوات الميكياج الاحترافية', topic_fr: 'Outils de maquillage professionnels' },
        { week: 3, topic_ar: 'ميكياج النهار والسهرة', topic_fr: 'Maquillage jour et soirée' },
        { week: 4, topic_ar: 'ميكياج العروس', topic_fr: 'Maquillage de mariée' },
        { week: 5, topic_ar: 'ميكياج عروض الأزياء', topic_fr: 'Make-up pour défilés de mode' },
        { week: 6, topic_ar: 'علامتك التجارية في التجميل', topic_fr: 'Votre marque dans le secteur beauté' }
      ]
    }
  ]);
  console.log(`📚 ${courses.length} courses created`);

  // Seed 6ix products
  const products = await Product.insertMany([
    {
      name: 'T-Shirt Oversized 6ix',
      description: 'T-shirt oversized 100% coton premium, sérigraphie 6ix exclusive',
      price: 299,
      stock: 50,
      category: 'T-Shirt',
      colors: ['black', 'white'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      brand: '6ix',
      featured: true
    },
    {
      name: 'Hoodie Signature 6ix',
      description: 'Hoodie premium double-face, broderie 6ix en relief',
      price: 599,
      stock: 30,
      category: 'Hoodie',
      colors: ['black', 'white'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      brand: '6ix',
      featured: true
    },
    {
      name: 'Cap Snapback 6ix',
      description: 'Casquette snapback ajustable, broderie 6ix & AAM',
      price: 199,
      stock: 80,
      category: 'Cap',
      colors: ['black', 'white'],
      sizes: ['One Size'],
      brand: '6ix',
      featured: true
    },
    {
      name: 'Jacket Bomber 6ix',
      description: 'Bomber jacket streetwear, patches 6ix exclusifs',
      price: 899,
      stock: 20,
      category: 'Jacket',
      colors: ['black'],
      sizes: ['S', 'M', 'L', 'XL'],
      brand: '6ix',
      featured: false
    }
  ]);
  console.log(`👕 ${products.length} products created`);

  console.log('\n🎉 Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔑 Admin login: admin@aam.ma / admin123');
  console.log('🌐 Frontend: http://localhost:5173');
  console.log('🔌 API: http://localhost:5000/api');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
