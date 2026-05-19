const particles = Array.from({ length: 46 }, (_, index) => {
  const column = index % 11;
  const row = Math.floor(index / 11);

  return {
    id: index,
    left: `${7 + column * 8.7 + ((row * 2.9) % 5)}%`,
    top: `${9 + row * 17 + ((column * 3.4) % 9)}%`,
    size: `${2 + (index % 5)}px`,
    delay: `${index * -0.37}s`,
    duration: `${8 + (index % 7) * 1.6}s`,
    opacity: 0.16 + (index % 6) * 0.055,
  };
});

export default function AmbientBackground() {
  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="aurora-layer aurora-layer-one" />
      <div className="aurora-layer aurora-layer-two" />
      <div className="aurora-layer aurora-layer-three" />
      <div className="ambient-light-beam ambient-light-beam-left" />
      <div className="ambient-light-beam ambient-light-beam-right" />
      <div className="ambient-depth-grid" />
      <div className="ambient-particles">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="ambient-particle"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              opacity: particle.opacity,
            }}
          />
        ))}
      </div>
      <div className="ambient-noise" />
      <div className="ambient-vignette" />
    </div>
  );
}
