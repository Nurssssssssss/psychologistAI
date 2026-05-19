import { motion } from 'framer-motion';
import {
  ArrowRight,
  AudioLines,
  Brain,
  HeartHandshake,
  LockKeyhole,
  Mic2,
  Radar,
  ShieldCheck,
  Sparkles,
  Waves,
} from 'lucide-react';
import FeatureCard from '../components/shared/FeatureCard.jsx';
import MetricBadge from '../components/shared/MetricBadge.jsx';
import PageTransition from '../components/shared/PageTransition.jsx';
import PremiumCard from '../components/shared/PremiumCard.jsx';
import Reveal from '../components/shared/Reveal.jsx';
import StatusPill from '../components/shared/StatusPill.jsx';
import TransitionNavLink from '../components/shared/TransitionNavLink.jsx';
import EmotionalCore from '../components/three/EmotionalCore.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { modules } from '../data/mockData.js';

export default function Home() {
  const { t } = useLanguage();
  const trustSignals = [
    { icon: LockKeyhole, text: t('hero.trust') },
    { icon: Mic2, text: t('hero.voice') },
    { icon: ArrowRight, text: t('hero.daily') },
  ];
  const metrics = [
    { label: 'Дауыстық ЖИ', value: 'Қосулы', icon: AudioLines, tone: 'aqua' },
    { label: 'Күйді тексеру', value: 'Жұмсақ', icon: Brain, tone: 'iris' },
    { label: 'Қалпына келу', value: '1 мин', icon: HeartHandshake, tone: 'peach' },
  ];
  const journey = [
    {
      icon: Mic2,
      label: '01 / Тыңдау',
      title: 'Дауысты қауіпсіз кеңістікке айналдыру',
      text: 'Мұғалім сөйлейді, интерфейс тыныс алады, ал ЖИ жауап бермей тұрып эмоционалдық ырғақты сезіндіреді.',
      tone: 'aqua',
    },
    {
      icon: Radar,
      label: '02 / Сезу',
      title: 'Күй сигналдарын жұмсақ оқу',
      text: 'Камера және өзін-өзі тексеру деректері диагноз емес, адамға түсінікті жылы контекст ретінде беріледі.',
      tone: 'iris',
    },
    {
      icon: Waves,
      label: '03 / Қалпына келу',
      title: 'Бір минуттық қалпына келу сәті',
      text: 'Жүйке жүйесін бәсеңдететін тыныс, күнделік және орнығу құралдары бір тыныш ағым ішінде жұмыс істейді.',
      tone: 'peach',
    },
  ];

  return (
    <PageTransition className="home-wellness-page space-y-24">
      <section className="wellness-hero relative isolate overflow-hidden rounded-[2.4rem] px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid min-h-[calc(100svh-12rem)] items-center gap-10 lg:grid-cols-[1fr_.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-w-3xl"
          >
            <div className="mb-6 flex flex-wrap gap-2">
              <StatusPill color="aqua">{t('hero.eyebrow')}</StatusPill>
              <StatusPill color="sage">Жұмсақ эмоциялық ЖИ</StatusPill>
            </div>
            <h1 className="text-balance font-display text-[2.9rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
              {t('hero.title')}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-cloud/84">{t('hero.lead')}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <TransitionNavLink to="/mood" className="premium-button focus-ring">
                <Sparkles size={19} />
                {t('actions.start')}
              </TransitionNavLink>
              <TransitionNavLink to="/voice" className="secondary-button focus-ring">
                <Mic2 size={19} />
                {t('actions.talk')}
              </TransitionNavLink>
              <TransitionNavLink to="/mood" className="secondary-button focus-ring">
                <HeartHandshake size={19} />
                {t('actions.check')}
              </TransitionNavLink>
            </div>

            <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
              {trustSignals.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22 + index * 0.08 }}
                    className="glass-panel-soft rounded-[1.35rem] p-4"
                  >
                    <Icon className="mb-3 text-aqua" size={20} />
                    <p className="text-sm font-bold leading-6 text-cloud/78">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <div className="wellness-orb-shell relative min-h-[460px] sm:min-h-[560px] lg:min-h-[660px]">
              <EmotionalCore
                state="calm"
                level={0.18}
                immersive
                frameless
                className="wellness-main-orb absolute inset-0 h-full"
              />
              <PremiumCard className="wellness-floating-note absolute left-0 top-8 z-20 hidden max-w-64 rounded-[1.4rem] p-4 text-left lg:block">
                <span className="grid h-10 w-10 place-items-center rounded-2xl border border-aqua/20 bg-aqua/12 text-aqua">
                  <ShieldCheck size={20} />
                </span>
                <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.18em] text-cloud/68">Қауіпсіз кеңістік</p>
                <p className="mt-2 text-sm leading-6 text-cloud/78">Күйзеліс, құпиялылық және жұмсақ қалпына келу үшін жылы қолдау.</p>
              </PremiumCard>
              <PremiumCard tone="soft" className="wellness-floating-note absolute bottom-10 right-0 z-20 hidden max-w-60 rounded-[1.4rem] p-4 text-left lg:block">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-aqua/80">Тыныштық деңгейі</p>
                <p className="mt-2 font-display text-4xl font-extrabold text-white">72%</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-skyglass/18">
                  <div className="h-full w-[72%] rounded-full bg-calm-line" />
                </div>
              </PremiumCard>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 mt-6 grid w-full gap-3 sm:grid-cols-3">
          {trustSignals.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72 + index * 0.08 }}
                className="glass-panel-soft rounded-[1.2rem] p-4 text-left"
              >
                <Icon className="mb-3 text-aqua" size={20} />
                <p className="text-sm font-bold leading-6 text-cloud/82">{item.text}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="relative z-10 mt-4 grid w-full max-w-5xl gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <MetricBadge key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section className="relative isolate">
        <Reveal className="mb-8 max-w-4xl">
          <p className="eyebrow-chip">Тәжірибе жолы</p>
          <h2 className="mt-5 text-balance font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
            Әр әрекет мұғалімге өзін қайта естуге көмектеседі
          </h2>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {journey.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={index * 0.08}>
                <PremiumCard
                  hover
                  tone={index === 1 ? 'soft' : 'default'}
                  className="journey-card rounded-[1.85rem] p-6"
                >
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <div className="mb-8 flex items-center justify-between gap-4">
                        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-cloud/66">
                          {item.label}
                        </span>
                        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/14 bg-ink/8 text-aqua">
                          <Icon size={22} />
                        </span>
                      </div>
                      <h3 className="text-balance font-display text-2xl font-extrabold leading-tight text-white">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-cloud/78">{item.text}</p>
                    </div>
                    <div className="mt-8 h-20 rounded-[1.3rem] border border-ink/10 bg-[linear-gradient(90deg,rgba(85,221,224,.16),rgba(124,109,242,.1),rgba(240,179,138,.12))] p-3">
                      <div className="flex h-full items-end gap-1.5">
                        {Array.from({ length: 18 }).map((_, barIndex) => (
                          <span
                            key={barIndex}
                            className="w-full rounded-full bg-ink/70"
                            style={{
                              height: `${18 + Math.abs(Math.sin((barIndex + 1) * (index + 1))) * 58}%`,
                              opacity: 0.24 + barIndex / 34,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow-chip">Платформа модульдері</p>
            <h2 className="mt-5 max-w-3xl text-balance font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Бір платформада толық қолдау экожүйесі
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-cloud/78">
            Мұғалімнің күнделікті күйін тыңдап, талдап, тыныштандырып, пайдалы әдетке айналдыруға
            арналған біртұтас қолдау кеңістігі.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((item, index) => (
            <FeatureCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
