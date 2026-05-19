/* eslint-disable react/no-unknown-property */
import { Float, Sparkles, Text } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function LogoText({ text }) {
  const groupRef = useRef(null);
  const textRef = useRef(null);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.4) * 0.3;
      groupRef.current.rotation.x = Math.cos(time * 0.3) * 0.15;
      groupRef.current.rotation.z = Math.sin(time * 0.24) * 0.035;
    }

    if (textRef.current?.material) {
      textRef.current.material.emissiveIntensity = 0.82 + Math.sin(time * 2) * 0.38;
    }
  });

  return (
    <group ref={groupRef}>
      <Text
        ref={textRef}
        fontSize={1.02}
        color="#ffffff"
        maxWidth={10}
        lineHeight={1}
        letterSpacing={0.08}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {text}
        <meshStandardMaterial
          color="#ff8a86"
          metalness={0.9}
          roughness={0.1}
          emissive="#ff1717"
          emissiveIntensity={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </Text>

      <pointLight position={[0, -0.5, 1]} intensity={2} color="#ff3333" />
      <pointLight position={[0, 0.5, -1]} intensity={1} color="#ffffff" />
    </group>
  );
}

export default function RendixLogoTitle3D({ text = 'RENDIX', className = '' }) {
  return (
    <div className={['rendix-logo-title-stage', className].join(' ')} aria-label={text}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1.2, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ff3333" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <LogoText text={text} />
        </Float>

        <Sparkles count={80} scale={6} size={3} speed={0.5} opacity={0.6} color="#ff3300" />
      </Canvas>
    </div>
  );
}
