"use client";

import React, { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import type * as THREE from "three";

export type Hero3DGeometry = "icosahedron" | "torusKnot" | "octahedron" | "dodecahedron";

const CORE_POS: [number, number, number] = [2.35, 0.35, -2.6];

function OrbitalRing({
  radius = 1.15,
  tube = 0.009,
  color,
  rotation = [0, 0, 0] as [number, number, number],
  speed = 0.5,
}: {
  radius?: number;
  tube?: number;
  color: string;
  rotation?: [number, number, number];
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const satRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed;
    }
    if (satRef.current) {
      const t = state.clock.getElapsedTime() * speed * 2;
      satRef.current.position.x = CORE_POS[0] + Math.cos(t) * radius;
      satRef.current.position.y = CORE_POS[1] + Math.sin(t) * radius * Math.cos(rotation[0]);
      satRef.current.position.z = CORE_POS[2] + Math.sin(t) * radius * Math.sin(rotation[0]);
    }
  });

  return (
    <>
      <mesh ref={ref} position={CORE_POS} rotation={rotation}>
        <torusGeometry args={[radius, tube, 16, 80]} />
        <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0.65} />
      </mesh>
      <mesh ref={satRef}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </>
  );
}

function Core({
  primary,
  secondary,
  geometry,
}: {
  primary: string;
  secondary: string;
  geometry: Hero3DGeometry;
}) {
  return (
    <Float speed={1.3} rotationIntensity={0.5} floatIntensity={1}>
      <mesh scale={0.62} position={CORE_POS}>
        {geometry === "torusKnot" && <torusKnotGeometry args={[0.85, 0.26, 140, 16]} />}
        {geometry === "octahedron" && <octahedronGeometry args={[1.15, 0]} />}
        {geometry === "dodecahedron" && <dodecahedronGeometry args={[1.05, 0]} />}
        {geometry === "icosahedron" && <icosahedronGeometry args={[1.1, 1]} />}
        <MeshDistortMaterial
          color={primary}
          emissive={primary}
          emissiveIntensity={0.6}
          roughness={0.25}
          metalness={0.2}
          distort={0.25}
          speed={1.6}
          toneMapped={false}
        />
      </mesh>
      <OrbitalRing radius={1.1} tube={0.01} color={primary} rotation={[Math.PI / 2.6, 0.35, 0]} speed={0.45} />
      <OrbitalRing radius={1.42} tube={0.008} color={secondary} rotation={[-Math.PI / 3.4, -0.4, 0]} speed={-0.35} />
    </Float>
  );
}

function Particles({
  color,
  count = 120,
  center = CORE_POS,
  radius = [1.1, 2.2],
  size = 0.026,
  opacity = 0.55,
  spin = 0.025,
}: {
  color: string;
  count?: number;
  center?: [number, number, number];
  radius?: [number, number];
  size?: number;
  opacity?: number;
  spin?: number;
}) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius[0] + Math.random() * (radius[1] - radius[0]);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = center[0] + r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = center[1] + r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = center[2] + r * Math.cos(phi);
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const ref = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * spin;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
        toneMapped={false}
      />
    </Points>
  );
}

function MouseRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x += (pointer.x * 0.35 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Real WebGL hero centerpiece — a distorted geometric "core" plus a slow
 * particle shell, in the site's persona colours. Mounted only in the hero;
 * pointer-events are disabled so it never intercepts clicks. Caller is
 * responsible for skipping this under prefers-reduced-motion (see Hero3D.tsx).
 */
export function Hero3DBackground({
  primary,
  secondary,
  geometry = "icosahedron",
  className = "",
}: {
  primary: string;
  secondary: string;
  geometry?: Hero3DGeometry;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        WebkitMaskImage: "linear-gradient(to left, black 45%, transparent 88%)",
        maskImage: "linear-gradient(to left, black 45%, transparent 88%)",
      }}
      aria-hidden
    >
      <Canvas
        flat
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[4, 4, 5]} intensity={0.9} color={primary} />
        <pointLight position={[0, -2, 3]} intensity={0.5} color={secondary} />
        <Suspense fallback={null}>
          <Core primary={primary} secondary={secondary} geometry={geometry} />
          <Particles color={secondary} count={70} radius={[0.9, 1.5]} size={0.022} opacity={0.6} spin={0.03} />
          <Particles color={primary} count={90} center={[0, 0, -1]} radius={[3, 5.5]} size={0.02} opacity={0.35} spin={0.012} />
        </Suspense>
        <MouseRig />
      </Canvas>
    </div>
  );
}
