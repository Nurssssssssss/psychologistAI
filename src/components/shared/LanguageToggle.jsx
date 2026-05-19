import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

const languageLabels = {
  kk: 'ҚАЗ',
  ru: 'ОРЫС',
};

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex h-11 items-center gap-1 rounded-full border border-ink/12 bg-ink/8 p-1 text-xs font-bold text-cloud/78">
      <Languages size={16} className="ml-2 text-aqua" />
      {['kk', 'ru'].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          className={[
            'h-8 rounded-full px-3 uppercase transition focus-ring',
            language === item ? 'bg-white text-ink shadow-calm' : 'hover:bg-ink/10 hover:text-white',
          ].join(' ')}
        >
          {languageLabels[item]}
        </button>
      ))}
    </div>
  );
}
