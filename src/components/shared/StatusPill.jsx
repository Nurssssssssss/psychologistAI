export default function StatusPill({ color = 'aqua', children }) {
  const colorMap = {
    aqua: 'border-aqua/30 bg-aqua/12 text-aqua',
    iris: 'border-iris/30 bg-iris/16 text-[#c8c2ff]',
    sage: 'border-sage/30 bg-sage/16 text-[#bfe8ce]',
    peach: 'border-peach/30 bg-peach/16 text-[#ffd4b9]',
  };

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold tracking-[0.03em] shadow-[0_12px_34px_rgba(0,0,0,.16)] backdrop-blur-xl',
        colorMap[color] ?? colorMap.aqua,
      ].join(' ')}
    >
      {children}
    </span>
  );
}
