import { Code2, DatabaseZap, ShieldCheck, Workflow } from 'lucide-react';
import PageTransition from '../components/shared/PageTransition.jsx';
import PremiumCard from '../components/shared/PremiumCard.jsx';
import SectionHeader from '../components/shared/SectionHeader.jsx';
import StatusPill from '../components/shared/StatusPill.jsx';
import EmotionalCore from '../components/three/EmotionalCore.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { modules } from '../data/mockData.js';

const architecture = [
  {
    icon: Workflow,
    title: 'Көрініс қабаты',
    text: 'Интерфейс жылдам веб-құралдармен жасалған, қозғалысы жұмсақ және эмоциялық қолдауға бейімделген.',
  },
  {
    icon: DatabaseZap,
    title: 'Сервер байланысы',
    text: 'Қолданба сұрақтарды тек қорғалған сервер бағыты арқылы жіберіп, жауапты қауіпсіз алады.',
  },
  {
    icon: ShieldCheck,
    title: 'Құпия кілт қауіпсіздігі',
    text: 'ЖИ қызметінің құпия кілті браузер ішінде сақталмайды. Ол тек сервердің қорғалған ортасында тұрады.',
  },
  {
    icon: Code2,
    title: 'Қызмет қабаты',
    text: 'ЖИ жауаптары, дауысты мәтінге айналдыру және камера кеңесі бір ортақ қызмет қабаты арқылы жұмыс істейді.',
  },
];

export default function AboutProject() {
  const { t } = useLanguage();

  return (
    <PageTransition className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
        <SectionHeader eyebrow="Жоба туралы" title={t('about.title')}>
          <p>{t('about.lead')}</p>
          <p className="mt-4">
            Негізгі идея - ұстаздың дауысын есту, күйін жұмсақ талдау және қысқа антистресс
            жаттығуы арқылы ішкі ресурсын қалпына келтіру.
          </p>
        </SectionHeader>
        <PremiumCard className="rounded-[1.9rem] p-4">
          <EmotionalCore state="thinking" level={0.28} compact immersive className="rounded-[1.5rem]" />
        </PremiumCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {architecture.map((item) => {
          const Icon = item.icon;
          return (
            <PremiumCard key={item.title} hover className="rounded-[1.45rem] p-5">
              <span className="relative z-10 grid h-12 w-12 place-items-center rounded-2xl border border-aqua/20 bg-aqua/12 text-aqua">
                <Icon size={23} />
              </span>
              <div className="relative z-10">
                <h2 className="mt-5 font-display text-lg font-extrabold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-cloud/78">{item.text}</p>
              </div>
            </PremiumCard>
          );
        })}
      </div>

      <PremiumCard tone="soft" className="rounded-[1.75rem] p-5 sm:p-6">
        <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-aqua/76">Көрсетілетін бөлімдер</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-white">Көрсетілетін негізгі модульдер</h2>
          </div>
          <StatusPill color="iris">серверге дайын</StatusPill>
        </div>
        <div className="relative z-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div key={module.title} className="rounded-[1.1rem] border border-ink/10 bg-ink/34 p-4">
                <Icon className="text-aqua" size={20} />
                <h3 className="mt-3 font-bold text-white">{module.title}</h3>
                <p className="mt-2 text-sm leading-6 text-cloud/76">{module.description}</p>
              </div>
            );
          })}
        </div>
      </PremiumCard>
    </PageTransition>
  );
}
