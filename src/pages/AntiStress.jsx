import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import BreathingPractice from '../components/stress/BreathingPractice.jsx';
import GestureStressBall from '../components/stress/GestureStressBall.jsx';
import PageTransition from '../components/shared/PageTransition.jsx';
import PremiumCard from '../components/shared/PremiumCard.jsx';
import SectionHeader from '../components/shared/SectionHeader.jsx';
import { antiStressCards } from '../data/mockData.js';

export default function AntiStress() {
  return (
    <PageTransition className="space-y-8">
      <SectionHeader eyebrow="Тыныштану құралдары" title="Антистресс модульдері">
        <p>Кішкене демалып алайық. Қысқа жаттығу мұғалімнің жүйке жүйесін сабақ арасында қайта реттеуге көмектеседі.</p>
      </SectionHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {antiStressCards.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.title} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <PremiumCard hover className="rounded-[1.45rem] p-5">
                <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-aqua/20 bg-aqua/12 text-aqua">
                    <Icon size={23} />
                  </span>
                  <Sparkles className="text-cloud/58" size={18} />
                </div>
                <div className="relative z-10">
                  <h2 className="font-display text-lg font-extrabold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-cloud/78">{item.description}</p>
                </div>
              </PremiumCard>
            </motion.div>
          );
        })}
      </div>

      <PremiumCard className="calm-composer p-6 sm:p-8">
        <div className="relative z-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow-chip">Жүйке жүйесін реттеу</p>
            <h2 className="mt-5 max-w-2xl text-balance font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Сабақ арасындағы бір минутты тыныш ритмге айналдыру
            </h2>
          </div>
          <div className="grid h-28 grid-cols-12 items-end gap-2">
            {Array.from({ length: 12 }).map((_, index) => (
              <span
                key={index}
                className="rounded-full bg-gradient-to-t from-sage via-aqua to-white/80 shadow-[0_0_28px_rgba(85,221,224,.16)]"
                style={{ height: `${28 + Math.sin(index * 0.8) * 18 + index * 3}%` }}
              />
            ))}
          </div>
        </div>
      </PremiumCard>

      <GestureStressBall />

      <BreathingPractice />
    </PageTransition>
  );
}
