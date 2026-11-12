"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Heart, CheckCircle2, ShieldCheck } from "lucide-react";

export function GoldenImpactSphere3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Golden Core Sphere
    const sphereGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    group.add(sphere);

    // Outer Emerald Wireframe Halo
    const haloGeo = new THREE.IcosahedronGeometry(1.7, 2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    group.add(halo);

    // Radiating Concentric Ripple Rings
    const rippleGeo = new THREE.RingGeometry(2.0, 2.06, 64);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ripple1 = new THREE.Mesh(rippleGeo, rippleMat);
    ripple1.rotation.x = Math.PI / 2;
    scene.add(ripple1);

    const ripple2 = ripple1.clone();
    ripple2.rotation.x = Math.PI / 3;
    scene.add(ripple2);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xf59e0b, 3, 20);
    goldLight.position.set(4, 5, 4);
    scene.add(goldLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 2.5, 20);
    emeraldLight.position.set(-4, -4, -3);
    scene.add(emeraldLight);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      group.rotation.y += delta * 0.4;
      halo.rotation.x -= delta * 0.3;

      // Pulsing ripples scale
      const s1 = 1 + (Math.sin(time * 1.5) * 0.2);
      ripple1.scale.set(s1, s1, s1);

      const s2 = 1 + (Math.cos(time * 1.5) * 0.2);
      ripple2.scale.set(s2, s2, s2);

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
      scene.remove(ripple1);
      scene.remove(ripple2);
      sphereGeo.dispose();
      sphereMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      rippleGeo.dispose();
      rippleMat.dispose();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center rounded-2xl bg-amber-950/30 border border-amber-500/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-amber-950/50">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-xs font-mono text-amber-400">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>AVP Trust Golden Impact Sphere · 100% Ledger</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-mono text-amber-300">
        <Heart className="w-3.5 h-3.5 text-amber-400" />
        <span>Section 80G Form 10BE Verified</span>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-800/40 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2 text-amber-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Charity Navigator 4-Star: <strong>88.4% Direct Program Allocation</strong></span>
        </div>
        <span className="text-emerald-400 text-[10px]">Zero Intermediary Leakage</span>
      </div>
    </div>
  );
}
