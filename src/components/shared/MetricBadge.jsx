export default function MetricBadge({ label, value, icon: Icon, tone = 'aqua' }) {
  const toneClass = {
    aqua: 'from-aqua/22 to-skyglass/10 text-aqua border-aqua/18',
    iris: 'from-iris/24 to-aqua/8 text-[#d7d2ff] border-iris/22',
    peach: 'from-peach/22 to-aqua/8 text-[#ffd9c3] border-peach/20',
    sage: 'from-sage/22 to-aqua/8 text-[#cbf0d8] border-sage/20',
  }[tone] ?? 'from-aqua/22 to-skyglass/10 text-aqua border-aqua/18';

  return (
    <div className={`rounded-[1.15rem] border bg-gradient-to-br p-4 shadow-[0_20px_50px_rgba(0,0,0,.16)] ${toneClass}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-cloud/68">{label}</p>
        {Icon ? <Icon size={17} /> : null}
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}
