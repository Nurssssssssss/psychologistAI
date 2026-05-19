export default function MiniChart({ data, height = 150 }) {
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item) => (
        <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-2">
          <div
            className="min-h-4 rounded-t-2xl border border-ink/12 shadow-[0_18px_42px_rgba(0,0,0,.18)] transition hover:-translate-y-1 hover:saturate-150"
            style={{
              height: `${item.value}%`,
              background: `linear-gradient(180deg, ${item.color}, rgba(255,255,255,.08))`,
            }}
            title={`${item.label}: ${item.value}%`}
          />
          <span className="text-center text-xs font-bold text-cloud/68">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
