import { AnimatePresence, motion } from 'framer-motion';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  Compass,
  HeartPulse,
  Loader2,
  Mic2,
  Radar,
  ScanFace,
  Sparkles,
  Waves,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PageTransition from '../components/shared/PageTransition.jsx';
import StatusPill from '../components/shared/StatusPill.jsx';
import TransitionNavLink from '../components/shared/TransitionNavLink.jsx';
import EmotionalCore from '../components/three/EmotionalCore.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { moodOptions } from '../data/mockData.js';
import { useWellbeingCamera } from '../hooks/useWellbeingCamera.js';
import { requestCameraAdvice } from '../services/aiService.js';
import { getMoodRecommendation } from '../utils/recommendations.js';

const emotionalTheme = {
  calm: { color: '#55DDE0', orb: 'calm' },
  tired: { color: '#C7A990', orb: 'tired' },
  stress: { color: '#F0B38A', orb: 'stress' },
  anxious: { color: '#7C6DF2', orb: 'anxious' },
  happy: { color: '#55DDE0', orb: 'happy' },
};

const copy = {
  kk: {
    eyebrow: 'Эмоциялық күйді зерделі талдау',
    title: 'Эмоциялық күйіңізді ЖИ жұмсақ оқиды',
    lead:
      'Камера, өзін-өзі тексеру және ЖИ ұсыныстары бір тірі эмоциялық өзекке бірігіп, мұғалімге қысымсыз, жылы қалпына келу бағытын көрсетеді.',
    nav: ['Эмоциялық радар', 'ЖИ тексерісі', 'Қалпына келу'],
    centerLabel: 'ЖИ эмоциялық серігі',
    weather: 'Бүгінгі эмоционалдық атмосфера',
    weatherValue: {
      calm: 'Тыныш назар',
      tired: 'Жұмсақ шаршау',
      stress: 'Күш түскен сәт',
      anxious: 'Жұмсақ белгі',
      happy: 'Жарқын ресурс',
    },
    moodLabels: {
      calm: 'Тыныш',
      tired: 'Шаршау',
      stress: 'Күйзеліс',
      anxious: 'Алаңдау',
      happy: 'Қуаныш',
    },
    risk: {
      low: 'ТӨМЕН',
      moderate: 'ОРТАША',
      high: 'ЖОҒАРЫ',
      title: 'Күйіп кету қаупі',
      calmness: 'Тыныштық ұпайы',
    },
    analyticsTitle: 'Эмоциялық радар',
    timelineTitle: 'Күн ішіндегі эмоционалдық жол',
    scanTitle: 'Терең ЖИ тексерісі',
    scanSubtitle: 'Камера диагноз қоймайды, тек сыртқы сигналдарды жұмсақ контекстке айналдырады.',
    scanWaiting: 'Камераны қосқанда ЖИ бет, мимика және қол сигналдарын тыныш режимде оқиды.',
    scanConfidence: 'сенімділік',
    scanButtonOn: 'Сканды бастау',
    scanButtonOff: 'Тоқтату',
    loading: 'Жүктелуде',
    supportTitle: 'ЖИ серігінің хабары',
    recoveryTitle: 'Қалпына келу',
    insightTitle: 'ЖИ байқауы',
    askAi: 'ЖИ кеңес алу',
    recommendations: {
      calm: 'Осы тыныш ырғақты жоғалтпай, келесі сабаққа дейін 90 секунд үнсіз дем алып көріңіз.',
      tired: 'Шаршау - көп күш бергеніңіздің белгісі. Бір міндетті жеңілдетіп, су ішіп, экраннан қысқа үзіліс алыңыз.',
      stress: 'Қазір жүйке жүйесін тез шешімге итермелемей, бір минуттық тыныс жаттығуын ашып, қарқынды баяулатуға болады.',
      anxious: 'Алаңдауды кішкентай нақты әрекетке түсіріңіз: қағазға бір ғана келесі қадамды жазыңыз.',
      happy: 'Бұл ресурс. Жақсы сәтті күнделікке белгілеп, оны күннің соңына дейін сақтайтын бір шағын әдет таңдаңыз.',
    },
    insights: {
      calm: 'ЖИ тұрақты назар мен тыныш эмоционалдық тонды байқап тұр. Осы күйді сақтау үшін шағын үзілістер көмектеседі.',
      tired: 'ЖИ ұзақ ой еңбегінен кейінгі жұмсақ шаршау сигналдарын байқады.',
      stress: 'ЖИ ұзақ ой еңбегінен кейін эмоциялық күш түсу белгілерін байқады.',
      anxious: 'ЖИ ойдың жылдамдығы мен денелік кернеу арасында байланыс болуы мүмкін екенін көрсетеді.',
      happy: 'ЖИ жылы энергия мен ашық ресурсты байқап тұр. Оны күнделік арқылы бекіту пайдалы.',
    },
    companion: {
      calm: 'Сіздің тыныштығыңыз - бүгінгі жұмыстың тірегі. Оны қорғауға болады.',
      tired: 'Бәрін бірден көтеру міндет емес. Бір кішкентай үзіліс те кәсіби қамқорлық.',
      stress: 'Сіз жалғыз емессіз. Қазір ең маңыздысы - өзіңізге қысымды азайту.',
      anxious: 'Алаңдау келгенде, денеге қайта оралу көмектеседі: дем, аяқ, орындық, осы сәт.',
      happy: 'Жақсы энергияны байқау - оны көбейтудің бірінші қадамы.',
    },
  },
  ru: {
    eyebrow: 'Зерделі эмоционалдық талдау',
    title: 'ЖИ эмоционалдық күйді жұмсақ оқиды',
    lead:
      'Камера, өзін-өзі тексеру және ЖИ ұсыныстары бір тірі эмоциялық өзекке бірігіп, мұғалімге қысымсыз қалпына келу бағытын көрсетеді.',
    nav: ['Эмоциялық радар', 'ЖИ тексерісі', 'Қалпына келу'],
    centerLabel: 'ЖИ эмоциялық серігі',
    weather: 'Бүгінгі эмоционалдық атмосфера',
    weatherValue: {
      calm: 'Тыныш назар',
      tired: 'Жұмсақ шаршау',
      stress: 'Күш түскен сәт',
      anxious: 'Жұмсақ белгі',
      happy: 'Жарқын ресурс',
    },
    moodLabels: {
      calm: 'Тыныш',
      tired: 'Шаршау',
      stress: 'Күйзеліс',
      anxious: 'Алаңдау',
      happy: 'Қуаныш',
    },
    risk: {
      low: 'ТӨМЕН',
      moderate: 'ОРТАША',
      high: 'ЖОҒАРЫ',
      title: 'Күйіп кету қаупі',
      calmness: 'Тыныштық ұпайы',
    },
    analyticsTitle: 'Эмоциялық радар',
    timelineTitle: 'Күн ішіндегі эмоционалдық жол',
    scanTitle: 'Терең ЖИ тексерісі',
    scanSubtitle: 'Камера диагноз қоймайды, тек сыртқы сигналдарды жұмсақ контекстке айналдырады.',
    scanWaiting: 'Камераны қосқанда ЖИ бет, мимика және қол сигналдарын тыныш режимде оқиды.',
    scanConfidence: 'сенімділік',
    scanButtonOn: 'Тексеруді бастау',
    scanButtonOff: 'Тоқтату',
    loading: 'Жүктелуде',
    supportTitle: 'ЖИ серігінің хабары',
    recoveryTitle: 'Қалпына келу',
    insightTitle: 'ЖИ байқауы',
    askAi: 'ЖИ кеңес алу',
    recommendations: {
      calm: 'Осы тыныш ырғақты жоғалтпай, келесі сабаққа дейін 90 секунд үнсіз дем алып көріңіз.',
      tired: 'Шаршау көп күш бергеніңізді көрсетеді. Бір міндетті жеңілдетіп, су ішіп, экраннан қысқа үзіліс алыңыз.',
      stress: 'Қазір шешімді жылдамдатудың қажеті жоқ. Бір минуттық тыныс жаттығуын ашып, қарқынды жұмсақ баяулатыңыз.',
      anxious: 'Алаңдауды шағын әрекетке түсіріңіз: дәл қазір жасай алатын бір келесі қадамды жазыңыз.',
      happy: 'Бұл ресурс. Жақсы сәтті күнделікке белгілеп, осы күйді сақтайтын бір шағын әдет таңдаңыз.',
    },
    insights: {
      calm: 'ЖИ тұрақты назар мен тыныш эмоционалдық тонды байқап тұр. Қысқа үзілістер осы күйді сақтауға көмектеседі.',
      tired: 'ЖИ ұзақ ой еңбегінен кейінгі жұмсақ шаршау белгілерін байқады.',
      stress: 'ЖИ ұзақ ой еңбегінен кейін эмоциялық күш түсу белгілерін байқады.',
      anxious: 'ЖИ ой ағынының жылдамдығы мен денелік кернеу арасында байланыс болуы мүмкін екенін көрсетеді.',
      happy: 'ЖИ жылы энергия мен ашық ресурсты байқап тұр. Оны күнделік арқылы бекіту пайдалы.',
    },
    companion: {
      calm: 'Сіздің тыныштығыңыз - бүгінгі жұмыстың тірегі. Оны қорғауға болады.',
      tired: 'Бәрін бірден көтеру міндет емес. Кішкентай үзіліс те кәсіби қамқорлық.',
      stress: 'Сіз жалғыз емессіз. Қазір ең маңыздысы - өзіңізге қысымды азайту.',
      anxious: 'Алаңдау келгенде, денеге қайта оралу көмектеседі: дем, аяқ, орындық, осы сәт.',
      happy: 'Жақсы энергияны байқау - оны көбейтудің бірінші қадамы.',
    },
  },
};

const faceCopy = {
  kk: {
    waiting: ['Камера дайын', 'Күйді жұмсақ тексеру үшін камераны қосыңыз.'],
    calm: ['бірқалыпты күй', 'Бетіңіздегі сыртқы белгілер тыныш ырғаққа жақын.'],
    tired: ['шаршау белгісі', 'Көз айналасы мен мимикада шаршауға ұқсас белгі бар.'],
    tense: ['кернеу байқалды', 'Қас пен жақ аймағында кернеуге ұқсас белгі бар.'],
    positive: ['жылы энергия', 'Жылы мимика байқалады. Осы ресурсты сақтап көріңіз.'],
  },
  ru: {
    waiting: ['Камера готова', 'Включите камеру для мягкой проверки состояния.'],
    calm: ['ровное состояние', 'Внешние признаки лица похожи на спокойный ритм.'],
    tired: ['признаки усталости', 'В зоне глаз и мимике есть признаки, похожие на усталость.'],
    tense: ['заметно напряжение', 'В зоне бровей и челюсти есть признаки, похожие на напряжение.'],
    positive: ['тёплая энергия', 'Мимика выглядит более открытой. Попробуйте сохранить этот ресурс.'],
  },
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function metricPercent(value) {
  return `${Math.round(clamp(value, 0, 1) * 100)}%`;
}

function getRiskLabel(value, labels) {
  if (value >= 68) return labels.high;
  if (value >= 38) return labels.moderate;
  return labels.low;
}

function getRadarPoint(index, total, value) {
  const angle = -Math.PI / 2 + (index / total) * Math.PI * 2;
  const radius = 40 * (value / 100);
  return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius];
}

function EmotionalRadar({ metrics, accent }) {
  const points = metrics
    .map((metric, index) => getRadarPoint(index, metrics.length, metric.value).join(','))
    .join(' ');

  return (
    <div className="emotional-radar" style={{ '--mood-accent': accent }}>
      <svg viewBox="0 0 100 100" role="img" aria-label="Эмоциялық радар кескіні">
        {[20, 32, 44].map((radius) => (
          <circle key={radius} cx="50" cy="50" r={radius} className="radar-ring" />
        ))}
        {metrics.map((metric, index) => {
          const [x, y] = getRadarPoint(index, metrics.length, 100);
          return <line key={metric.label} x1="50" y1="50" x2={x} y2={y} className="radar-axis" />;
        })}
        <motion.polygon
          key={points}
          points={points}
          className="radar-shape"
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        />
        {metrics.map((metric, index) => {
          const [x, y] = getRadarPoint(index, metrics.length, metric.value);
          return <circle key={`${metric.label}-dot`} cx={x} cy={y} r="1.7" className="radar-dot" />;
        })}
      </svg>

      {metrics.map((metric, index) => {
        const [x, y] = getRadarPoint(index, metrics.length, 92);
        return (
          <span
            key={metric.label}
            className="radar-label"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {metric.label}
          </span>
        );
      })}
    </div>
  );
}

function EmotionalTimeline({ items }) {
  return (
    <div className="emotional-timeline">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          className="timeline-node"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * index }}
        >
          <span
            className="timeline-glow"
            style={{ height: `${item.value}%`, background: item.color, color: item.color }}
          />
          <span className="timeline-dot" style={{ background: item.color, color: item.color }} />
          <span className="timeline-label">{item.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

function BurnoutRiskMeter({ value, label }) {
  return (
    <div className="burnout-meter">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-cloud/66">Күйіп кету белгісі</span>
        <strong className="text-sm text-white">{label}</strong>
      </div>
      <div className="burnout-track">
        <motion.span
          className="burnout-fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          className="burnout-marker"
          initial={{ left: '0%' }}
          animate={{ left: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

function AnalyticsPanel({ mood, moodLabel, metrics, timeline, riskValue, riskLabel, calmnessScore, pageCopy, accent }) {
  return (
    <motion.aside
      className="mood-glass-panel mood-analytics-panel"
      initial={{ opacity: 0, x: -34, y: 18 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.22, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-aqua/76">{pageCopy.analyticsTitle}</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{moodLabel}</h2>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ink/12 bg-ink/8 text-aqua">
          <Radar size={22} />
        </span>
      </div>

      <div className="relative z-10 mt-5">
        <EmotionalRadar metrics={metrics} accent={accent} />
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-2 gap-3">
        <div className="mood-mini-readout">
          <span>{pageCopy.risk.calmness}</span>
          <strong>{calmnessScore}%</strong>
        </div>
        <div className="mood-mini-readout">
          <span>{pageCopy.risk.title}</span>
          <strong>{riskLabel}</strong>
        </div>
      </div>

      <div className="relative z-10 mt-4">
        <BurnoutRiskMeter value={riskValue} label={riskLabel} />
      </div>

      <div className="relative z-10 mt-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cloud/66">
            {pageCopy.timelineTitle}
          </p>
          <span className="text-xs font-bold text-cloud/72">{mood.score}%</span>
        </div>
        <EmotionalTimeline items={timeline} />
      </div>
    </motion.aside>
  );
}

function ImmersiveScanPanel({
  onMoodDetected,
  onSignalsChange,
  aiAdvice,
  aiBusy = false,
  onAskAi,
  pageCopy,
}) {
  const { language } = useLanguage();
  const camera = useWellbeingCamera({ enableFace: true, enableHands: true });
  const localFaceCopy = faceCopy[language] ?? faceCopy.kk;
  const face = camera.signals.face;
  const hand = camera.signals.hand;
  const [faceTitle, faceAdvice] = localFaceCopy[face.state] ?? localFaceCopy.waiting;
  const confidence = face.detected ? Math.round(clamp(62 + face.balance * 0.24 + face.smile * 18, 0, 98)) : 0;

  useEffect(() => {
    onSignalsChange?.(camera.signals);

    if (camera.active && face.detected) {
      onMoodDetected?.(face.moodKey);
    }
  }, [camera.active, camera.signals, face.detected, face.moodKey, onMoodDetected, onSignalsChange]);

  return (
    <motion.aside
      className="mood-glass-panel immersive-scan-panel"
      initial={{ opacity: 0, x: 34, y: 18 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.32, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <div className="relative z-10 mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-aqua/76">Камера ЖИ</p>
          <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{pageCopy.scanTitle}</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            if (camera.active || camera.loading) {
              camera.stop();
              return;
            }
            void camera.start();
          }}
          disabled={!camera.supported}
          className={camera.active ? 'secondary-button min-h-11 px-4 text-sm focus-ring' : 'premium-button min-h-11 px-4 text-sm focus-ring'}
        >
          {camera.loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : camera.active ? (
            <CameraOff size={18} />
          ) : (
            <Camera size={18} />
          )}
          {camera.loading ? pageCopy.loading : camera.active ? pageCopy.scanButtonOff : pageCopy.scanButtonOn}
        </button>
      </div>

      <div className="scan-frame">
        <video
          ref={camera.videoRef}
          className={[
            'h-full min-h-[310px] w-full object-cover opacity-85',
            camera.active ? 'scale-x-[-1]' : 'hidden',
          ].join(' ')}
          muted
          playsInline
          autoPlay
        />

        {!camera.active ? (
          <div className="scan-placeholder absolute inset-0 grid place-items-center text-center">
            <div>
              <ScanFace className="mx-auto text-aqua" size={44} />
              <p className="mt-4 text-sm leading-7 text-cloud/62">
                {camera.supported ? pageCopy.scanWaiting : localFaceCopy.waiting[1]}
              </p>
            </div>
          </div>
        ) : null}

        <div className="scan-grid-overlay" />
        <div className="scan-sweep" />
        <span className="scan-corner scan-corner-tl" />
        <span className="scan-corner scan-corner-tr" />
        <span className="scan-corner scan-corner-bl" />
        <span className="scan-corner scan-corner-br" />

        {camera.active && hand.detected ? (
          <span
            className="hand-signal"
            style={{ left: `${hand.x * 100}%`, top: `${hand.y * 100}%` }}
          />
        ) : null}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <StatusPill color={face.detected ? 'sage' : 'iris'}>{faceTitle}</StatusPill>
        </div>
        <div className="scan-confidence">
          <strong>{confidence || '--'}%</strong>
          <span>{pageCopy.scanConfidence}</span>
        </div>
      </div>

      <p className="relative z-10 mt-4 text-sm leading-7 text-cloud/64">
        {aiAdvice || faceAdvice || pageCopy.scanSubtitle}
      </p>

      <div className="relative z-10 mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {[
          ['Тепе-теңдік', `${face.balance}%`, face.balance / 100],
          ['Жымию', metricPercent(face.smile), face.smile],
          ['Кернеу', metricPercent(face.tension), face.tension],
        ].map(([label, value, percent]) => (
          <div key={label} className="scan-metric">
            <span>{label}</span>
            <strong>{value}</strong>
            <i style={{ width: metricPercent(percent) }} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAskAi}
        disabled={!face.detected || aiBusy}
        className="secondary-button relative z-10 mt-4 min-h-11 w-full text-sm focus-ring disabled:cursor-not-allowed disabled:opacity-55"
      >
        {aiBusy ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
        {pageCopy.askAi}
      </button>

      {camera.error ? (
        <p className="relative z-10 mt-3 rounded-2xl border border-peach/20 bg-peach/10 px-4 py-3 text-sm text-cloud/68">
          {camera.error}
        </p>
      ) : null}
    </motion.aside>
  );
}

function InsightDock({ pageCopy, selectedMood, recommendation, cameraAdvice, aiBusy }) {
  const recoverySteps = [
    { icon: Waves, label: '01', text: recommendation },
    { icon: Mic2, label: '02', text: pageCopy.companion[selectedMood] },
    {
      icon: Compass,
      label: '03',
      text: cameraAdvice || pageCopy.insights[selectedMood],
    },
  ];

  return (
    <motion.section
      className="mood-insight-dock"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.52, duration: 0.76, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="insight-primary">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-aqua/76">
              {pageCopy.insightTitle}
            </p>
            <h2 className="mt-2 font-display text-2xl font-extrabold text-white">{pageCopy.supportTitle}</h2>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-aqua/18 bg-aqua/12 text-aqua">
            {aiBusy ? <Loader2 className="animate-spin" size={22} /> : <HeartPulse size={22} />}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={selectedMood}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-5 text-base leading-8 text-cloud/72"
          >
            {pageCopy.insights[selectedMood]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="recovery-stream">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cloud/68">
            {pageCopy.recoveryTitle}
          </p>
          <TransitionNavLink to="/stress" className="secondary-button min-h-10 px-4 text-sm focus-ring">
            <Zap size={16} />
            1 мин
          </TransitionNavLink>
        </div>

        {recoverySteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.label}
              className="recovery-step"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 + index * 0.08 }}
            >
              <span>{step.label}</span>
              <Icon size={18} />
              <p>{step.text}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

export default function MoodAnalysis() {
  const { t, language } = useLanguage();
  const [selectedMood, setSelectedMood] = useState('calm');
  const [cameraSignals, setCameraSignals] = useState(null);
  const [cameraAdvice, setCameraAdvice] = useState('');
  const [cameraAdviceBusy, setCameraAdviceBusy] = useState(false);
  const lastAdviceRef = useRef({ key: '', time: 0 });
  const pageCopy = copy[language] ?? copy.kk;

  const mood = moodOptions.find((item) => item.key === selectedMood) ?? moodOptions[0];
  const theme = emotionalTheme[selectedMood] ?? emotionalTheme.calm;
  const moodLabel = pageCopy.moodLabels[selectedMood] ?? mood.label;
  const recommendation = useMemo(
    () => (language === 'ru' ? pageCopy.recommendations[selectedMood] : getMoodRecommendation(selectedMood)),
    [language, pageCopy.recommendations, selectedMood],
  );

  const face = cameraSignals?.face;
  const tension = face?.tension ?? Math.max(0, (100 - mood.score) / 100);
  const smile = face?.smile ?? (selectedMood === 'happy' ? 0.72 : 0.18);
  const cameraBalance = face?.balance ?? mood.score;
  const calmnessScore = Math.round(clamp(mood.score * 0.74 + cameraBalance * 0.26));
  const riskValue = Math.round(
    clamp((100 - mood.score) * 0.62 + tension * 30 + (selectedMood === 'tired' ? 12 : 0) + (selectedMood === 'stress' ? 10 : 0)),
  );
  const riskLabel = getRiskLabel(riskValue, pageCopy.risk);
  const orbLevel = clamp((100 - mood.score) / 100 + tension * 0.45 + (face?.detected ? 0.12 : 0.04), 0.16, 0.94);

  const radarMetrics = useMemo(
    () => [
      { label: 'Тыныштық', value: calmnessScore },
      { label: 'Назар', value: clamp(mood.score + (selectedMood === 'calm' ? 10 : -4)) },
      { label: 'Қуат', value: clamp(selectedMood === 'tired' ? 34 : mood.score + smile * 16) },
      { label: 'Күйзеліс', value: clamp((100 - mood.score) * 0.72 + tension * 36) },
      { label: 'Қалпына келу', value: clamp(100 - riskValue + 16) },
    ],
    [calmnessScore, mood.score, riskValue, selectedMood, smile, tension],
  );

  const timeline = useMemo(() => {
    const base = [
      ['08:00', mood.score - 14],
      ['10:30', mood.score - 2],
      ['12:15', selectedMood === 'stress' ? 36 : mood.score + 5],
      ['15:00', selectedMood === 'tired' ? 38 : mood.score - 8],
      ['18:00', mood.score + (selectedMood === 'happy' ? 8 : 2)],
    ];

    return base.map(([label, value], index) => ({
      label,
      value: clamp(value, 18, 92),
      color: index === 2 ? '#F0B38A' : index === 4 ? theme.color : '#55DDE0',
    }));
  }, [mood.score, selectedMood, theme.color]);

  const handleMoodDetected = useCallback((moodKey) => {
    if (!moodKey) return;
    setSelectedMood(moodKey);
  }, []);

  const askCameraAi = useCallback(
    async (signals = cameraSignals) => {
      if (!signals?.face?.detected || cameraAdviceBusy) return;

      setCameraAdviceBusy(true);
      const advice = await requestCameraAdvice({
        signals,
        locale: language,
        context: moodLabel,
      });
      setCameraAdvice(advice);
      setCameraAdviceBusy(false);
    },
    [cameraAdviceBusy, cameraSignals, language, moodLabel],
  );

  useEffect(() => {
    if (!cameraSignals?.face?.detected) return undefined;

    const key = `${cameraSignals.face.state}-${cameraSignals.face.moodKey}-${language}`;
    const now = Date.now();

    if (lastAdviceRef.current.key === key || now - lastAdviceRef.current.time < 9000) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      lastAdviceRef.current = { key, time: Date.now() };
      askCameraAi(cameraSignals);
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [askCameraAi, cameraSignals, language]);

  return (
    <PageTransition
      className="mood-cinematic-page"
      style={{ '--mood-accent': theme.color }}
    >
      <section className="mood-ai-experience" style={{ '--mood-accent': theme.color }}>
        <div className="mood-bg-layer mood-bg-aurora-one" />
        <div className="mood-bg-layer mood-bg-aurora-two" />
        <div className="mood-bg-particles" />
        <div className="mood-bg-noise" />

        <motion.nav
          className="mood-floating-nav"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62 }}
        >
          <span className="mood-nav-brand">
            <Sparkles size={16} />
            {t('mood.title')}
          </span>
          {pageCopy.nav.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </motion.nav>

        <div className="relative z-10 mx-auto max-w-4xl pt-10 text-center">
          <StatusPill color="aqua">{pageCopy.eyebrow}</StatusPill>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.72 }}
            className="mt-5 font-display text-4xl font-extrabold leading-[1.02] text-white sm:text-6xl lg:text-7xl"
          >
            {pageCopy.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.72 }}
            className="mx-auto mt-5 max-w-3xl text-base leading-8 text-cloud/84 sm:text-lg"
          >
            {pageCopy.lead}
          </motion.p>
        </div>

        <div className="mood-orb-theater">
          <AnalyticsPanel
            mood={mood}
            moodLabel={moodLabel}
            metrics={radarMetrics}
            timeline={timeline}
            riskValue={riskValue}
            riskLabel={riskLabel}
            calmnessScore={calmnessScore}
            pageCopy={pageCopy}
            accent={theme.color}
          />

          <motion.div
            className="mood-orb-centerpiece"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="orb-weather-badge">
              <span>{pageCopy.weather}</span>
              <strong>{pageCopy.weatherValue[selectedMood]}</strong>
            </div>

            <EmotionalCore
              state={theme.orb}
              level={orbLevel}
              immersive
              frameless
              className="mood-main-orb"
            />

            <div className="orb-core-caption">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                {pageCopy.centerLabel}
              </span>
              <strong>{calmnessScore}%</strong>
            </div>

            <div className="mood-state-selector" aria-label={t('mood.mark')}>
              {moodOptions.map((item) => {
                const itemTheme = emotionalTheme[item.key] ?? emotionalTheme.calm;
                const active = item.key === selectedMood;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedMood(item.key)}
                    className={active ? 'mood-state-chip mood-state-chip-active' : 'mood-state-chip'}
                    style={{ '--chip-accent': itemTheme.color }}
                  >
                    <span />
                    {pageCopy.moodLabels[item.key] ?? item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <ImmersiveScanPanel
            onMoodDetected={handleMoodDetected}
            onSignalsChange={setCameraSignals}
            aiAdvice={cameraAdvice}
            aiBusy={cameraAdviceBusy}
            onAskAi={() => askCameraAi()}
            pageCopy={pageCopy}
          />
        </div>

        <InsightDock
          pageCopy={pageCopy}
          selectedMood={selectedMood}
          recommendation={recommendation}
          cameraAdvice={cameraAdvice}
          aiBusy={cameraAdviceBusy}
        />
      </section>
    </PageTransition>
  );
}
