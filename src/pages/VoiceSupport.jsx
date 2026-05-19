import { motion } from 'framer-motion';
import { BrainCircuit, Mic, MicOff, Radio, Sparkles, Volume2, Waves } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ChatPanel from '../components/voice/ChatPanel.jsx';
import VoiceLevelBars from '../components/voice/VoiceLevelBars.jsx';
import PageTransition from '../components/shared/PageTransition.jsx';
import PremiumCard from '../components/shared/PremiumCard.jsx';
import SectionHeader from '../components/shared/SectionHeader.jsx';
import StatusPill from '../components/shared/StatusPill.jsx';
import EmotionalCore from '../components/three/EmotionalCore.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { chatSeed } from '../data/mockData.js';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder.js';
import { sendChatMessage, sendVoiceTranscript, synthesizeSpeech, transcribeAudio } from '../services/aiService.js';

const quickPrompts = [
  'Бүгін қатты шаршадым, бірақ сабаққа дайындалуым керек.',
  'Ата-анамен сөйлесуден кейін өзімді жайсыз сезініп тұрмын.',
  'Маған қазір қысқа тыныштандыру сөзі керек.',
];

const ritualSteps = [
  { key: 'listening', icon: Mic, label: 'Жазу', text: 'Дауыс тыныш кеңістікке түседі' },
  { key: 'thinking', icon: BrainCircuit, label: 'Ойлану', text: 'ЖИ жұмсақ жауап дайындайды' },
  { key: 'speaking', icon: Waves, label: 'Қолдау', text: 'Қолдау дыбыс болып қайтады' },
];

export default function VoiceSupport() {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState(chatSeed);
  const [input, setInput] = useState('');
  const [voiceState, setVoiceState] = useState('idle');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [busy, setBusy] = useState(false);
  const audioRef = useRef(null);
  const audioUrlRef = useRef('');
  const speechRunRef = useRef(0);
  const recorder = useVoiceRecorder({
    language: language === 'kk' ? 'kk-KZ' : 'ru-RU',
  });
  const cancelRecording = recorder.cancel;

  const releaseServerAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = '';
    }
  }, []);

  const stopSpeech = useCallback(() => {
    speechRunRef.current += 1;
    releaseServerAudio();
    window.speechSynthesis?.cancel();
  }, [releaseServerAudio]);

  useEffect(() => {
    if (recorder.recording) {
      setVoiceState('listening');
      if (recorder.transcript) setInput(recorder.transcript);
    }
  }, [recorder.recording, recorder.transcript]);

  useEffect(() => {
    if (recorder.status === 'idle' && voiceState === 'listening') setVoiceState('idle');
  }, [recorder.status, voiceState]);

  useEffect(() => {
    return () => {
      cancelRecording();
      stopSpeech();
    };
  }, [cancelRecording, stopSpeech]);

  const statusText = useMemo(() => {
    if (voiceState === 'listening') return t('voice.listening');
    if (voiceState === 'thinking') return t('voice.thinking');
    if (voiceState === 'speaking') return t('voice.speaking');
    if (recorder.status === 'starting') return language === 'ru' ? 'Включаю микрофон...' : 'Микрофон қосылып жатыр...';
    if (recorder.status === 'stopping') return language === 'ru' ? 'Обрабатываю запись...' : 'Жазба өңделіп жатыр...';
    return t('voice.ready');
  }, [language, recorder.status, t, voiceState]);

  const visualLevel =
    voiceState === 'listening'
      ? Math.max(recorder.level, 0.18)
      : voiceState === 'speaking'
        ? 0.68
        : voiceState === 'thinking'
          ? 0.34
          : 0.12;

  const speakWithBrowserVoice = useCallback(
    (text, speechId) => {
      if (!window.speechSynthesis) {
        window.setTimeout(() => {
          if (speechRunRef.current === speechId) setVoiceState('idle');
        }, 1200);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'kk' ? 'kk-KZ' : 'ru-RU';
      utterance.rate = 0.92;
      utterance.pitch = 1.02;
      const voices = window.speechSynthesis.getVoices?.() ?? [];
      const targetLanguage = language === 'kk' ? 'kk' : 'ru';
      const preferredVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith(targetLanguage));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.onend = () => {
        if (speechRunRef.current === speechId) setVoiceState('idle');
      };
      utterance.onerror = () => {
        if (speechRunRef.current === speechId) setVoiceState('idle');
      };
      window.speechSynthesis.speak(utterance);
    },
    [language],
  );

  const speak = useCallback(
    async (text) => {
      const cleanText = text.trim();
      if (!cleanText || !ttsEnabled) {
        setVoiceState('idle');
        return;
      }

      const speechId = speechRunRef.current + 1;
      speechRunRef.current = speechId;
      setVoiceState('speaking');
      releaseServerAudio();
      window.speechSynthesis?.cancel();

      try {
        const audioBlob = await synthesizeSpeech({ text: cleanText, locale: language });
        if (speechRunRef.current !== speechId) return;

        const audioUrl = URL.createObjectURL(audioBlob);
        audioUrlRef.current = audioUrl;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          if (speechRunRef.current === speechId) {
            releaseServerAudio();
            setVoiceState('idle');
          }
        };
        audio.onerror = () => {
          if (speechRunRef.current === speechId) {
            releaseServerAudio();
            speakWithBrowserVoice(cleanText, speechId);
          }
        };

        await audio.play();
      } catch (error) {
        console.info('Server TTS fallback:', error.message);
        if (speechRunRef.current === speechId) {
          releaseServerAudio();
          speakWithBrowserVoice(cleanText, speechId);
        }
      }
    },
    [language, releaseServerAudio, speakWithBrowserVoice, ttsEnabled],
  );

  const handleSend = useCallback(
    async (rawMessage, viaVoice = false) => {
      const nextMessage = rawMessage.trim();
      if (!nextMessage || busy) return;

      stopSpeech();
      const userMessage = { role: 'user', content: nextMessage };
      const nextHistory = [...messages, userMessage];
      setMessages(nextHistory);
      setInput('');
      setBusy(true);
      setVoiceState('thinking');

      const reply = viaVoice
        ? await sendVoiceTranscript({ transcript: nextMessage, history: messages, locale: language })
        : await sendChatMessage({ message: nextMessage, history: messages, locale: language });

      setMessages((current) => [...current, reply]);
      setBusy(false);
      setVoiceState('speaking');
      void speak(reply.content);
    },
    [busy, language, messages, speak, stopSpeech],
  );

  const toggleListening = async () => {
    if (busy || recorder.busy) return;

    if (recorder.recording) {
      const capture = await recorder.stop();
      let spokenText = capture.transcript?.trim() || input.trim();

      if (capture.audioBlob?.size > 1200) {
        setVoiceState('thinking');
        try {
          const result = await transcribeAudio(capture.audioBlob, language);
          spokenText = result.text?.trim() || spokenText;
        } catch (error) {
          console.info('Voice transcription fallback:', error.message);
        }
      }

      recorder.resetTranscript();

      if (!spokenText) {
        setVoiceState('idle');
        setInput('');
        return;
      }

      await handleSend(spokenText, true);
      return;
    }

    stopSpeech();
    setInput('');
    const started = await recorder.start();
    if (!started) setVoiceState('idle');
  };

  return (
    <PageTransition className="space-y-8">
      <SectionHeader eyebrow="Дауыстық ЖИ" title={t('voice.title')}>
        <p>{t('voice.subtitle')}</p>
      </SectionHeader>

      <div className="voice-ritual grid gap-3 p-3 md:grid-cols-3">
        {ritualSteps.map((step) => {
          const Icon = step.icon;
          const active = voiceState === step.key;

          return (
            <div
              key={step.key}
              className={[
                'ritual-step rounded-[1.25rem] border border-ink/10 bg-ink/6 p-4 transition',
                active ? 'ritual-step-active' : '',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl border border-aqua/18 bg-aqua/10 text-aqua">
                  <Icon size={20} />
                </span>
                {active ? <Sparkles className="text-peach" size={18} /> : null}
              </div>
              <p className="mt-4 text-xs font-extrabold uppercase tracking-[0.2em] text-cloud/66">{step.label}</p>
              <p className="mt-2 text-sm leading-6 text-cloud/78">{step.text}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_.92fr]">
        <PremiumCard className="rounded-[1.9rem] p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <StatusPill color={voiceState === 'listening' ? 'aqua' : voiceState === 'speaking' ? 'peach' : 'iris'}>
              {statusText}
            </StatusPill>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-full border border-ink/12 bg-ink/8 px-4 py-2 text-sm font-semibold text-cloud/82">
                <Volume2 size={17} className="text-aqua" />
                <span>{t('voice.tts')}</span>
                <input
                  type="checkbox"
                  checked={ttsEnabled}
                  onChange={(event) => {
                    const nextEnabled = event.target.checked;
                    setTtsEnabled(nextEnabled);
                    if (!nextEnabled) {
                      stopSpeech();
                      setVoiceState('idle');
                    }
                  }}
                  className="h-4 w-4 accent-aqua"
                />
              </label>
              <p className="text-xs font-semibold text-cloud/54">{t('voice.ttsDisclosure')}</p>
            </div>
          </div>

          <div className="relative z-10">
            <EmotionalCore state={voiceState} level={visualLevel} compact immersive className="min-h-[390px] rounded-[1.6rem]" />
            <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-ink/12 bg-ink/38 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-cloud/68 backdrop-blur-xl">
              дауыстық өзек
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={toggleListening}
              disabled={busy || recorder.busy}
              className={[
                'absolute bottom-8 left-1/2 grid h-20 w-20 -translate-x-1/2 place-items-center rounded-full border shadow-premium transition focus-ring disabled:opacity-60',
                recorder.recording
                  ? 'border-peach/55 bg-peach text-ink'
                  : 'border-aqua/45 bg-aqua text-ink hover:scale-105',
              ].join(' ')}
              aria-label="Микрофон"
            >
              {recorder.recording ? <MicOff size={30} /> : <Mic size={30} />}
            </motion.button>
          </div>

          <VoiceLevelBars level={visualLevel} active={voiceState !== 'idle'} />

          {!recorder.supported ? (
            <p className="mt-3 rounded-2xl border border-peach/20 bg-peach/10 px-4 py-3 text-sm text-cloud/68">
              {t('voice.unsupported')}
            </p>
          ) : null}
          {recorder.error ? (
            <p className="mt-3 rounded-2xl border border-peach/20 bg-peach/10 px-4 py-3 text-sm text-cloud/68">
              {recorder.error}
            </p>
          ) : null}

          <div className="mt-5 grid gap-2 md:grid-cols-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="rounded-2xl border border-ink/12 bg-ink/7 px-4 py-3 text-left text-sm leading-6 text-cloud/82 shadow-[0_14px_38px_rgba(0,0,0,.12)] transition hover:-translate-y-0.5 hover:border-aqua/28 hover:bg-ink/10 focus-ring"
              >
                {prompt}
              </button>
            ))}
          </div>
        </PremiumCard>

        <PremiumCard tone="soft" className="rounded-[1.9rem] p-4 sm:p-5">
          <div className="relative z-10 mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-aqua/76">Қолдау чаты</p>
              <p className="mt-1 text-sm text-cloud/76">ЖИ жауаптары сервер арқылы қосылуға дайын</p>
            </div>
            <Radio className="text-aqua" size={21} />
          </div>
          <ChatPanel
            messages={messages}
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onSpeak={speak}
            speechEnabled={ttsEnabled}
            busy={busy}
          />
        </PremiumCard>
      </div>
    </PageTransition>
  );
}
