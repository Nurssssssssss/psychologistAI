const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function buildErrorReply(locale = 'kk', detail = '') {
  const content =
    locale === 'ru'
      ? 'ЖИ қызметі қазір жауап бермей тұр. Сервер іске қосылғанын және құпия кілт енгізілгенін тексеріңіз.'
      : 'ЖИ қызметі қазір жауап бермей тұр. Сервер іске қосылғанын және құпия кілт енгізілгенін тексеріңіз.';

  return {
    role: 'ai',
    content: detail ? `${content}` : content,
    source: 'error',
  };
}

export async function sendChatMessage({ message, history = [], locale = 'kk', mode = 'support' }) {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    return buildErrorReply(locale);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: trimmedMessage,
        history,
        locale,
        mode,
      }),
    });

    if (!response.ok) {
      throw new Error(`service returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.message ?? data.content ?? '';

    if (data.source === 'mock-backend') {
      throw new Error('provider is not configured');
    }

    if (!content.trim()) {
      throw new Error('empty message');
    }

    return {
      role: 'ai',
      content,
      source: data.source ?? 'backend',
    };
  } catch (error) {
    console.info('AI service error:', error.message);
    return buildErrorReply(locale, error.message);
  }
}

export async function sendVoiceTranscript({ transcript, history = [], locale = 'kk' }) {
  return sendChatMessage({
    message: transcript,
    history,
    locale,
    mode: 'voice-support',
  });
}

export async function synthesizeSpeech({ text, locale = 'kk' }) {
  const cleanText = text.trim();
  if (!cleanText) {
    throw new Error('speech text is empty');
  }

  const response = await fetch(`${API_BASE_URL}/api/text-to-speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: cleanText,
      locale,
    }),
  });

  if (!response.ok) {
    throw new Error(`speech synthesis returned ${response.status}`);
  }

  return response.blob();
}

export async function requestCameraAdvice({ signals, locale = 'kk', context = '' }) {
  const face = signals?.face ?? {};
  const fallback =
    locale === 'ru'
      ? 'Я вижу только внешние признаки, не диагноз. Сделайте один медленный выдох, расслабьте челюсть и выберите самый маленький следующий шаг.'
      : 'Мен тек сыртқы белгілерді ғана көремін, бұл диагноз емес. Бір баяу дем шығарып, жақты босатыңыз да, ең кішкентай келесі қадамды таңдаңыз.';

  try {
    const response = await fetch(`${API_BASE_URL}/api/camera-advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale,
        context,
        signals: {
          face: {
            detected: Boolean(face.detected),
            state: face.state,
            moodKey: face.moodKey,
            balance: face.balance,
            smile: Number(face.smile ?? 0).toFixed(2),
            tension: Number(face.tension ?? 0).toFixed(2),
            fatigue: Number(face.fatigue ?? 0).toFixed(2),
          },
          hand: signals?.hand
            ? {
                detected: Boolean(signals.hand.detected),
                gesture: signals.hand.gesture,
                squeeze: Number(signals.hand.squeeze ?? 0).toFixed(2),
              }
            : undefined,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`camera service returned ${response.status}`);
    }

    const data = await response.json();
    return data.message || fallback;
  } catch (error) {
    console.info('Using local camera advice:', error.message);
    return fallback;
  }
}

export async function transcribeAudio(audioBlob, locale = 'kk') {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'teacher-support-audio.webm');
  formData.append('locale', locale);

  const response = await fetch(`${API_BASE_URL}/api/speech-to-text`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`speech service returned ${response.status}`);
  }

  return response.json();
}
