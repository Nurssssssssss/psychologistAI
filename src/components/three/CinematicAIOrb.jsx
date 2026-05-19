/* eslint-disable react/no-unknown-property */
import { Float, Sparkles } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  MathUtils,
  ShaderMaterial,
} from 'three';

const ORB_STATES = {
  idle: {
    core: '#8EC5FF',
    glow: '#55DDE0',
    accent: '#F5F8FF',
    warmth: '#F0B38A',
    breath: 0.72,
    energy: 0.18,
  },
  listening: {
    core: '#55DDE0',
    glow: '#8EC5FF',
    accent: '#FFFFFF',
    warmth: '#B8DDFF',
    breath: 1.18,
    energy: 0.64,
  },
  thinking: {
    core: '#7C6DF2',
    glow: '#55DDE0',
    accent: '#DDE7F6',
    warmth: '#8EC5FF',
    breath: 0.92,
    energy: 0.42,
  },
  speaking: {
    core: '#F0B38A',
    glow: '#7C6DF2',
    accent: '#F5F8FF',
    warmth: '#55DDE0',
    breath: 1.28,
    energy: 0.78,
  },
  calming: {
    core: '#87C4A3',
    glow: '#55DDE0',
    accent: '#F5F8FF',
    warmth: '#D7F4E5',
    breath: 0.56,
    energy: 0.22,
  },
  calm: {
    core: '#55DDE0',
    glow: '#8EC5FF',
    accent: '#F5F8FF',
    warmth: '#D7F4E5',
    breath: 0.62,
    energy: 0.24,
  },
  stress: {
    core: '#F0B38A',
    glow: '#FFB86B',
    accent: '#FFF2E3',
    warmth: '#E86C4D',
    breath: 1.16,
    energy: 0.78,
  },
  anxious: {
    core: '#7C6DF2',
    glow: '#9D8CFF',
    accent: '#DDE7F6',
    warmth: '#55DDE0',
    breath: 0.98,
    energy: 0.54,
  },
  happy: {
    core: '#55DDE0',
    glow: '#B8F7FF',
    accent: '#FFFFFF',
    warmth: '#8EC5FF',
    breath: 1.02,
    energy: 0.64,
  },
  tired: {
    core: '#C7A990',
    glow: '#8EC5FF',
    accent: '#F5E8DA',
    warmth: '#A98778',
    breath: 0.48,
    energy: 0.18,
  },
};

function clampLevel(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function createOrbMaterial(config) {
  return new ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uAudio: { value: 0 },
      uColorA: { value: new Color(config.core) },
      uColorB: { value: new Color(config.glow) },
      uColorC: { value: new Color(config.warmth) },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uAudio;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying float vPulse;

      void main() {
        vNormal = normalize(normalMatrix * normal);

        float waveA = sin(position.y * 4.2 + uTime * 1.18);
        float waveB = sin(position.x * 3.1 - uTime * 0.82);
        float waveC = sin((position.x + position.z) * 5.4 + uTime * 1.7);
        float pulse = (waveA + waveB + waveC) / 3.0;
        float audioPush = uAudio * 0.18;
        vec3 displaced = position + normal * (pulse * 0.045 + audioPush);

        vPulse = pulse;
        vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uAudio;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform vec3 uColorC;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;
      varying float vPulse;

      void main() {
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
        float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormal)), 0.0), 2.4);
        float emotionalMix = smoothstep(-0.7, 0.9, vPulse + sin(uTime * 0.45) * 0.24);
        vec3 calmBody = mix(uColorA, uColorB, emotionalMix);
        vec3 warmEdge = mix(calmBody, uColorC, fresnel * (0.45 + uAudio * 0.38));
        float alpha = 0.88 + fresnel * 0.12;

        gl_FragColor = vec4(warmEdge + fresnel * 0.44, alpha);
      }
    `,
  });
}

function ParticleField({ config, level }) {
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const geometry = useMemo(() => {
    const positions = [];
    const colors = [];
    const sizes = [];
    const palette = [new Color(config.accent), new Color(config.glow), new Color(config.core)];

    for (let index = 0; index < 180; index += 1) {
      const angle = index * 2.39996;
      const radius = 1.75 + (index % 31) * 0.035;
      const y = ((index % 37) / 37 - 0.5) * 1.35;
      positions.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);

      const color = palette[index % palette.length];
      colors.push(color.r, color.g, color.b);
      sizes.push(0.02 + (index % 7) * 0.004);
    }

    const nextGeometry = new BufferGeometry();
    nextGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    nextGeometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    nextGeometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    return nextGeometry;
  }, [config.accent, config.core, config.glow]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        uniforms: {
          uOpacity: { value: 0.42 },
          uSize: { value: 24 },
        },
        vertexShader: `
          attribute vec3 color;
          attribute float size;
          uniform float uSize;
          varying vec3 vColor;

          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * uSize * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          uniform float uOpacity;

          void main() {
            float distanceFromCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = smoothstep(0.5, 0.08, distanceFromCenter) * uOpacity;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
      }),
    [],
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    pointsRef.current.rotation.y = time * (0.045 + level * 0.08);
    pointsRef.current.rotation.x = Math.sin(time * 0.18) * 0.12;
    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = 0.36 + level * 0.24;
      materialRef.current.uniforms.uSize.value = 22 + level * 12;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
}

function EnergyRing({ index, config, level }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const time = clock.getElapsedTime();
    const base = 1.18 + index * 0.18;
    const breath = Math.sin(time * (0.72 + index * 0.14) + index) * 0.045;
    const targetScale = base + breath + level * (0.22 + index * 0.035);

    ref.current.scale.setScalar(MathUtils.lerp(ref.current.scale.x, targetScale, 0.09));
    ref.current.rotation.z += 0.0018 + index * 0.0008 + level * 0.004;
    ref.current.material.opacity = MathUtils.lerp(
      ref.current.material.opacity,
      0.11 + level * 0.24 - index * 0.012,
      0.08,
    );
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2.08, 0, index * 0.38]}>
      <torusGeometry args={[1.14 + index * 0.18, 0.006, 10, 220]} />
      <meshBasicMaterial
        color={index % 2 ? config.accent : config.glow}
        transparent
        opacity={0.14}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function AmbientLightRig({ config, level }) {
  const cyanRef = useRef(null);
  const warmRef = useRef(null);
  const violetRef = useRef(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const shimmer = Math.sin(time * 0.82) * 0.5 + 0.5;

    if (cyanRef.current) cyanRef.current.intensity = MathUtils.lerp(cyanRef.current.intensity, 9 + level * 18, 0.06);
    if (warmRef.current) warmRef.current.intensity = MathUtils.lerp(warmRef.current.intensity, 5 + shimmer * 4 + level * 9, 0.06);
    if (violetRef.current) violetRef.current.intensity = MathUtils.lerp(violetRef.current.intensity, 5 + level * 12, 0.06);
  });

  return (
    <>
      <ambientLight intensity={0.86} />
      <pointLight ref={cyanRef} position={[-3.5, 2.6, 3.2]} color={config.glow} intensity={12} />
      <pointLight ref={warmRef} position={[3.2, -2.1, 2.7]} color={config.warmth} intensity={7} />
      <pointLight ref={violetRef} position={[1.4, 2.7, 3.6]} color={config.core} intensity={7} />
    </>
  );
}

function OrbScene({ state = 'idle', audioLevel = 0 }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const shellRef = useRef(null);
  const haloRef = useRef(null);
  const materialRef = useRef(null);
  const smoothedLevel = useRef(0);
  const config = ORB_STATES[state] ?? ORB_STATES.idle;
  const activeLevel = clampLevel(audioLevel);

  const material = useMemo(() => createOrbMaterial(config), [config]);
  materialRef.current = material;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    smoothedLevel.current = MathUtils.lerp(smoothedLevel.current, activeLevel, 0.075);
    const level = smoothedLevel.current;
    const breath = Math.sin(time * config.breath) * 0.045;
    const calmPulse = Math.sin(time * 0.32) * 0.025;
    const scale = 1 + breath + calmPulse + level * (0.18 + config.energy * 0.12);

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uAudio.value = level;
      materialRef.current.uniforms.uColorA.value.lerp(new Color(config.core), 0.08);
      materialRef.current.uniforms.uColorB.value.lerp(new Color(config.glow), 0.08);
      materialRef.current.uniforms.uColorC.value.lerp(new Color(config.warmth), 0.08);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0018 + level * 0.006;
      groupRef.current.rotation.x = Math.sin(time * 0.28) * 0.08;
    }

    if (coreRef.current) {
      coreRef.current.scale.setScalar(MathUtils.lerp(coreRef.current.scale.x, scale, 0.08));
      coreRef.current.rotation.z += 0.002 + level * 0.009;
    }

    if (shellRef.current) {
      shellRef.current.scale.setScalar(MathUtils.lerp(shellRef.current.scale.x, 1.22 + level * 0.2, 0.07));
      shellRef.current.material.opacity = MathUtils.lerp(shellRef.current.material.opacity, 0.14 + level * 0.18, 0.07);
    }

    if (haloRef.current) {
      haloRef.current.scale.setScalar(MathUtils.lerp(haloRef.current.scale.x, 1.68 + level * 0.24, 0.06));
      haloRef.current.material.opacity = MathUtils.lerp(haloRef.current.material.opacity, 0.08 + level * 0.16, 0.06);
    }
  });

  return (
    <>
      <AmbientLightRig config={config} level={activeLevel} />
      <group ref={groupRef}>
        <Float speed={1.35} rotationIntensity={0.18} floatIntensity={0.42}>
          <mesh ref={coreRef}>
            <icosahedronGeometry args={[1.08, 64]} />
            <primitive object={material} attach="material" />
          </mesh>
          <mesh ref={shellRef}>
            <sphereGeometry args={[1.14, 64, 64]} />
            <meshBasicMaterial
              color={config.glow}
              transparent
              opacity={0.16}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={haloRef}>
            <sphereGeometry args={[1.22, 64, 64]} />
            <meshBasicMaterial
              color={config.core}
              transparent
              opacity={0.08}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </Float>

        {[0, 1, 2, 3, 4].map((item) => (
          <EnergyRing key={item} index={item} config={config} level={activeLevel} />
        ))}
        <ParticleField config={config} level={activeLevel} />
        <Sparkles
          count={72}
          color={config.accent}
          scale={[5.8, 3.1, 3.1]}
          size={1.85 + activeLevel * 1.2}
          speed={0.28 + activeLevel * 0.9}
          opacity={0.36 + activeLevel * 0.24}
        />
      </group>
    </>
  );
}

export default function CinematicAIOrb({
  state = 'idle',
  audioLevel = 0,
  level,
  compact = false,
  immersive = false,
  frameless = false,
  className = '',
}) {
  const activeLevel = clampLevel(level ?? audioLevel);

  return (
    <div
      className={[
        'emotional-core relative isolate overflow-hidden rounded-[2rem]',
        immersive ? 'emotional-core-immersive' : '',
        frameless ? 'emotional-core-frameless' : '',
        compact ? 'h-[300px] sm:h-[370px]' : 'h-[460px] sm:h-[560px] lg:h-[660px]',
        className,
      ].join(' ')}
      style={{ '--orb-level': activeLevel }}
    >
      <div className="emotional-core-aura" />
      <div className="emotional-core-ring emotional-core-ring-one" />
      <div className="emotional-core-ring emotional-core-ring-two" />
      <div
        className="emotional-core-wave"
        style={{ opacity: 0.28 + activeLevel * 0.38, transform: `translate(-50%, -50%) scale(${0.86 + activeLevel * 0.24})` }}
      />
      <Canvas
        camera={{ position: [0, 0, 5.25], fov: 35 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
      >
        <OrbScene state={state} audioLevel={activeLevel} />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-10 bottom-8 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
    </div>
  );
}
