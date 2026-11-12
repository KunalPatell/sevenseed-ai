"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { SlidersHorizontal, TrendingDown, ShieldCheck, Zap } from "lucide-react";

export function CommerceDiamondPrism3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.0, 7.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Faceted Diamond / Cone Geometry
    const prismGeo = new THREE.ConeGeometry(1.6, 2.4, 6);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x047857,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.2,
      transmission: 0.8,
      thickness: 1.2,
      ior: 2.2, // Diamond refractive index
      wireframe: false,
    });
    const prismMesh = new THREE.Mesh(prismGeo, prismMat);
    prismMesh.rotation.x = Math.PI;
    group.add(prismMesh);

    // Wireframe Cage
    const wireGeo = new THREE.ConeGeometry(1.8, 2.6, 6);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.rotation.x = Math.PI;
    group.add(wireMesh);

    // Oscillating Laser Scanner Line
    const laserGeo = new THREE.RingGeometry(2.0, 2.05, 32);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.rotation.x = Math.PI / 2;
    scene.add(laserMesh);

    // Floating Merchant Nodes (Smartprix, BuyHatke, Xerve, Amazon, Flipkart)
    const merchants = [
      { name: "Smartprix", color: 0x10b981, r: 2.7, s: 0.6 },
      { name: "BuyHatke", color: 0x06b6d4, r: 3.1, s: 0.45 },
      { name: "Xerve Coupons", color: 0xf59e0b, r: 3.5, s: 0.35 },
      { name: "Amazon IN", color: 0x3b82f6, r: 3.9, s: 0.5 },
    ];

    const merchantMeshes = merchants.map((m) => {
      const g = new THREE.BoxGeometry(0.22, 0.22, 0.22);
      const mat = new THREE.MeshStandardMaterial({
        color: m.color,
        emissive: m.color,
        emissiveIntensity: 0.8,
      });
      const mesh = new THREE.Mesh(g, mat);
      scene.add(mesh);
      return { mesh, data: m, angle: Math.random() * Math.PI * 2 };
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3, 20);
    emeraldLight.position.set(4, 5, 4);
    scene.add(emeraldLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 2.5, 20);
    cyanLight.position.set(-4, -4, -3);
    scene.add(cyanLight);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      prismMesh.rotation.y += delta * 0.5;
      wireMesh.rotation.y -= delta * 0.3;

      // Laser scanner vertical oscillation
      laserMesh.position.y = Math.sin(time * 2.5) * 1.5;

      merchantMeshes.forEach((m) => {
        m.angle += delta * m.data.s;
        m.mesh.position.x = Math.cos(m.angle) * m.data.r;
        m.mesh.position.z = Math.sin(m.angle) * m.data.r;
        m.mesh.position.y = Math.sin(time + m.angle) * 0.4;
        m.mesh.rotation.x += delta;
        m.mesh.rotation.y += delta;
      });

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
      merchantMeshes.forEach((m) => {
        scene.remove(m.mesh);
        m.mesh.geometry.dispose();
      });
      scene.remove(laserMesh);
      scene.remove(group);
      prismGeo.dispose();
      prismMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      laserGeo.dispose();
      laserMat.dispose();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center rounded-2xl bg-emerald-950/40 border border-emerald-500/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-emerald-950/50">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-mono text-emerald-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>AVP E-Mart Prism Core · Hardware Laser Scanner</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-mono text-emerald-300">
        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
        <span>Smartprix + BuyHatke Engine</span>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-emerald-800/40 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2 text-emerald-300">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Spec Diagnostic Score: <strong>94/100 (Smartprix Algorithm)</strong></span>
        </div>
        <span className="text-emerald-500 text-[10px]">10-Min Flash Dispatch</span>
      </div>
    </div>
  );
}
