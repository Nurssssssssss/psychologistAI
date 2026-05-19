import { motion } from 'framer-motion';

export default function Rendix3DText({ as = 'h2', children, className = '', label }) {
  const Component = motion[as] ?? motion.h2;
  const text = String(children ?? '');

  return (
    <Component
      className={['rendix-css-3d-text', className].join(' ')}
      aria-label={label ?? text}
      initial={{ opacity: 0, y: 18, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      {text.split(' ').map((word, wordIndex, words) => (
        <span key={`${word}-${wordIndex}`} className="rendix-word-3d">
          {Array.from(word).map((char, charIndex) => (
            <span
              key={`${char}-${wordIndex}-${charIndex}`}
              className="rendix-letter-3d"
              data-char={char}
              style={{ '--letter-delay': `${(wordIndex * 5 + charIndex) * 0.045}s` }}
              aria-hidden="true"
            >
              <span className="rendix-letter-depth">{char}</span>
            </span>
          ))}
          {wordIndex < words.length - 1 ? <span className="rendix-space-3d"> </span> : null}
        </span>
      ))}
    </Component>
  );
}
