"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { ShieldAlert, Radar, Scale } from "lucide-react";

export function CyberShieldRadar3D() {
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

    // 3D Hexagonal Defense Shield
    const shieldGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.2, 6);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0x991b1b,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: false,
    });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.rotation.x = Math.PI / 2;
    group.add(shield);

    // Hexagonal Wireframe Outline
    const wireGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.25, 6);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.rotation.x = Math.PI / 2;
    group.add(wireMesh);

    // Rotating Radar Sweep Line
    const radarGeo = new THREE.PlaneGeometry(0.06, 2.6);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    });
    const radarSweep = new THREE.Mesh(radarGeo, radarMat);
    radarSweep.position.z = 0.2;
    group.add(radarSweep);

    // Concentric Range Rings
    const ring1Geo = new THREE.RingGeometry(0.8, 0.84, 32);
    const ring2Geo = new THREE.RingGeometry(1.3, 1.34, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    const ring2 = new THREE.Mesh(ring2Geo, ringMat);
    ring1.position.z = 0.15;
    ring2.position.z = 0.15;
    group.add(ring1);
    group.add(ring2);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xef4444, 3.5, 20);
    redLight.position.set(4, 5, 4);
    scene.add(redLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2.5, 20);
    blueLight.position.set(-4, -4, -3);
    scene.add(blueLight);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      group.rotation.y += delta * 0.3;
      group.rotation.x = Math.sin(clock.getElapsedTime() * 0.6) * 0.15;
      radarSweep.rotation.z -= delta * 2.5;

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
      shieldGeo.dispose();
      shieldMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      radarGeo.dispose();
      radarMat.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center rounded-2xl bg-red-950/30 border border-red-500/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-red-950/50">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-xs font-mono text-red-400">
        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        <span>Rakshak AI Forcefield · 360° Tactical Radar</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-mono text-red-300">
        <Radar className="w-3.5 h-3.5 text-red-400" />
        <span>BNS 2023 + 1930 Cyber Sentinel</span>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-red-800/40 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2 text-red-300">
          <Scale className="w-3.5 h-3.5" />
          <span>Bharatiya Nyaya Sanhita: <strong>Auto-FIR under BNSS Sec 173</strong></span>
        </div>
        <span className="text-red-400 text-[10px]">Active Threat Defense</span>
      </div>
    </div>
  );
}
