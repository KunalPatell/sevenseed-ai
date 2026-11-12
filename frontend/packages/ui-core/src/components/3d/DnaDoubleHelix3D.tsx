"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { HeartPulse, ShieldAlert, Sparkles } from "lucide-react";

export function DnaDoubleHelix3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // DNA Double Helix Base Pairs
    const pairsCount = 28;
    const radius = 1.3;
    const heightSpan = 4.5;
    const turns = 2.5;

    const ballGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const strand1Mat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.8,
    });
    const strand2Mat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xfb7185,
      emissiveIntensity: 0.8,
    });
    const rungMat = new THREE.LineBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.6,
    });

    for (let i = 0; i < pairsCount; i++) {
      const t = (i / pairsCount) * Math.PI * 2 * turns;
      const y = (i / pairsCount - 0.5) * heightSpan;

      const x1 = Math.cos(t) * radius;
      const z1 = Math.sin(t) * radius;

      const x2 = Math.cos(t + Math.PI) * radius;
      const z2 = Math.sin(t + Math.PI) * radius;

      const ball1 = new THREE.Mesh(ballGeo, strand1Mat);
      ball1.position.set(x1, y, z1);
      group.add(ball1);

      const ball2 = new THREE.Mesh(ballGeo, strand2Mat);
      ball2.position.set(x2, y, z2);
      group.add(ball2);

      const rungGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x1, y, z1),
        new THREE.Vector3(x2, y, z2),
      ]);
      const rung = new THREE.Line(rungGeo, rungMat);
      group.add(rung);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const tealLight = new THREE.PointLight(0x14b8a6, 3, 20);
    tealLight.position.set(4, 5, 4);
    scene.add(tealLight);

    const roseLight = new THREE.PointLight(0xf43f5e, 2.5, 20);
    roseLight.position.set(-4, -4, -3);
    scene.add(roseLight);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      group.rotation.y += delta * 0.6;
      group.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      scene.remove(group);
      ballGeo.dispose();
      strand1Mat.dispose();
      strand2Mat.dispose();
      rungMat.dispose();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center rounded-2xl bg-teal-950/40 border border-teal-500/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-teal-950/50">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-xs font-mono text-teal-400">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        <span>Decode Forest DNA Helix · Molecular Bio-Telemetry</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-mono text-teal-300">
        <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
        <span>1mg + Jan Aushadhi Core</span>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-teal-800/40 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2 text-teal-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PMBJP Generic Equivalent Savings: <strong>Up to 90% (Jan Aushadhi)</strong></span>
        </div>
        <span className="text-rose-400 text-[10px]">Zero Drug Interactions</span>
      </div>
    </div>
  );
}
