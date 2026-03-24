import { motion } from 'framer-motion';
import { Trophy, Tv, GraduationCap, Shirt } from 'lucide-react';
import { FOUNDER } from '@/utils/constants';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay, duration: 0.55 },
});

/* ── Founder section ── */
const FounderSection = () => (
  <section className="section-padding" style={{ background: 'var(--bg-page)' }}>
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Photo */}
        <motion.div {...fade(0)} className="relative">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5] max-w-sm mx-auto lg:mx-0"
            style={{ border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>

            <div className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />

            <img src={FOUNDER.avatar} alt={FOUNDER.name}
              className="w-full h-full object-cover"
              onError={e => { e.currentTarget.style.display = 'none'; }}
              loading="lazy" />

            {/* Fallback initials */}
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--blue), var(--blue-light))' }}>
              <span className="font-display text-8xl font-black" style={{ color: 'rgba(255,255,255,0.15)' }}>AB</span>
            </div>

            {/* Guinness badge */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(201,168,76,0.4)' }}>
              <Trophy size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <div>
                <p className="font-display text-xs font-bold" style={{ color: 'var(--gold)' }}>Guinness World Record™ 2009</p>
                <p className="font-arabic text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>أكبر جينز في العالم — 50م × 36م</p>
              </div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, var(--blue-light), transparent)' }} />
        </motion.div>

        {/* Bio */}
        <div>
          <motion.div {...fade(0.1)}>
            <span className="section-label">المؤسس — Fondateur</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mt-2 mb-1" style={{ color: 'var(--text-primary)' }}>
              {FOUNDER.name}
            </h2>
            <p className="font-arabic text-2xl mb-1" style={{ direction: 'rtl', color: 'var(--blue)' }}>
              {FOUNDER.name_ar}
            </p>
            <p className="font-editorial italic text-base mb-8" style={{ color: 'var(--text-muted)' }}>
              {FOUNDER.role_fr}
            </p>
          </motion.div>

          <div className="space-y-4 mb-8">
            {[
              {
                icon: <Trophy size={18} style={{ color: 'var(--gold)' }} />,
                bg: 'rgba(201,168,76,0.08)',
                border: 'rgba(201,168,76,0.25)',
                title_ar: FOUNDER.guinness_detail_ar,
                title_fr: FOUNDER.guinness_detail_fr,
              },
              {
                icon: <GraduationCap size={18} style={{ color: 'var(--blue)' }} />,
                bg: 'rgba(37,99,235,0.07)',
                border: 'var(--border)',
                title_ar: 'مدير الأكاديمية العربية للموضة — مؤسسة تعليمية متخصصة في تكوين وتأهيل مصممي الأزياء.',
                title_fr: "Directeur de l'Académie Arabe de la Mode — institution spécialisée dans la formation de stylistes.",
              },
              {
                icon: <Shirt size={18} style={{ color: 'var(--blue)' }} />,
                bg: 'rgba(37,99,235,0.07)',
                border: 'var(--border)',
                title_ar: 'من الوجوه الرائدة في قطاع النسيج والملابس بتونس، بحضور وطني ودولي متواصل.',
                title_fr: 'Figure de proue du secteur textile tunisien, reconnue sur la scène nationale et internationale.',
              },
              {
                icon: <Tv size={18} style={{ color: 'var(--blue)' }} />,
                bg: 'rgba(37,99,235,0.07)',
                border: 'var(--border)',
                title_ar: 'حضور إعلامي مستمر للحديث عن استراتيجيات تطوير قطاع الموضة والابتكار فيه.',
                title_fr: 'Intervenant régulier dans les médias sur les stratégies d\'innovation et de développement de la mode.',
              },
            ].map((item, i) => (
              <motion.div key={i} {...fade(0.15 + i * 0.08)}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                <div className="mt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <p className="font-arabic text-sm leading-relaxed mb-1" style={{ direction: 'rtl', color: 'var(--text-secondary)' }}>
                    {item.title_ar}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {item.title_fr}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ── Page ── */
const AboutPage = () => (
  <main style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>

    {/* Hero banner */}
    <section className="relative pt-24 pb-16 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--bg-section) 0%, var(--bg-page) 100%)' }}>
      <div className="absolute inset-0 pattern-arabic opacity-30 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <motion.div {...fade(0)}>
          <span className="section-label">Notre Académie</span>
          <h1 className="section-title mb-2" style={{ direction: 'rtl' }}>
            عن <span className="text-gradient-blue">الأكاديمية</span>
          </h1>
          <p className="font-editorial italic text-xl" style={{ color: 'var(--text-muted)' }}>
            À Propos de l'Académie
          </p>
        </motion.div>
      </div>
    </section>

    {/* Founder */}
    <FounderSection />

    {/* Guinness spotlight */}
    <section className="py-16" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.07), var(--bg-section))' }}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 160, damping: 16 }}
          className="inline-block mb-6"
        >
          <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto"
            style={{ border: '3px solid var(--gold)', background: 'rgba(201,168,76,0.08)', boxShadow: '0 0 50px rgba(201,168,76,0.2)' }}>
            <Trophy size={44} style={{ color: 'var(--gold)' }} />
          </div>
        </motion.div>
        <motion.div {...fade(0.15)}>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-1" style={{ color: 'var(--gold)' }}>
            Guinness World Record™
          </h2>
          <p className="font-display text-lg mb-8" style={{ color: 'var(--text-muted)' }}>2009</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            {[
              { value: '50 م', label_ar: 'الطول', label_fr: 'Longueur' },
              { value: '36 م', label_ar: 'العرض', label_fr: 'Largeur' },
              { value: '2009', label_ar: 'السنة', label_fr: 'Année' },
            ].map((s, i) => (
              <motion.div key={i} {...fade(0.2 + i * 0.08)}
                className="rounded-xl p-5"
                style={{ background: 'var(--bg-card)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <p className="font-display text-3xl font-black mb-1" style={{ color: 'var(--gold)' }}>{s.value}</p>
                <p className="font-arabic text-xs" style={{ direction: 'rtl', color: 'var(--text-muted)' }}>{s.label_ar}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label_fr}</p>
              </motion.div>
            ))}
          </div>

          <p className="font-arabic text-base leading-relaxed" style={{ direction: 'rtl', color: 'var(--text-secondary)' }}>
            أكبر سروال جينز في العالم — صُنع وعُرض في الملعب البلدي بأريانة، تونس
          </p>
          <p className="font-editorial italic text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Plus grand jean du monde — créé et exposé au stade municipal d'Ariana, Tunisie
          </p>
        </motion.div>
      </div>
    </section>

    {/* Mission & Vision */}
    <section className="section-padding pattern-arabic" style={{ background: 'var(--bg-section)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: '🎯',
              title_ar: 'مهمتنا',
              title_fr: 'Notre Mission',
              text_ar: 'تكوين أجيال من المصممين العرب القادرين على التعبير عن هويتهم الثقافية من خلال الموضة العالمية، مع الحفاظ على الموروث الحضاري العربي الأصيل.',
            },
            {
              icon: '🌟',
              title_ar: 'رؤيتنا',
              title_fr: 'Notre Vision',
              text_ar: 'أن تكون الأكاديمية العربية للموضة المؤسسة الرائدة في العالم العربي والمنطقة، معترفاً بها دولياً كمركز للإبداع في مجال الأزياء.',
            },
          ].map((item, i) => (
            <motion.div key={i} {...fade(i * 0.15)}
              className="rounded-2xl p-8"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)' }}>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h2 className="font-arabic text-2xl font-bold mb-1" style={{ direction: 'rtl', color: 'var(--text-primary)' }}>{item.title_ar}</h2>
              <p className="font-editorial italic text-base mb-4" style={{ color: 'var(--blue)' }}>{item.title_fr}</p>
              <p className="font-arabic text-sm leading-loose" style={{ direction: 'rtl', color: 'var(--text-secondary)' }}>{item.text_ar}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  </main>
);

export default AboutPage;
