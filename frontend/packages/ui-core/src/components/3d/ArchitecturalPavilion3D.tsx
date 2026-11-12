"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { HardHat, Ruler, ShieldCheck } from "lucide-react";

export function ArchitecturalPavilion3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.5, 6.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Foundation Grid
    const gridHelper = new THREE.GridHelper(4.5, 12, 0xf59e0b, 0x334155);
    gridHelper.position.y = -1.5;
    group.add(gridHelper);

    // Multi-tier Structural Columns and Slabs
    const levels = 3;
    const colGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8);
    const colMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
      metalness: 0.8,
    });
    const slabGeo = new THREE.BoxGeometry(2.4, 0.08, 2.4);
    const slabMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85,
    });

    for (let lvl = 0; lvl < levels; lvl++) {
      const y = -1.5 + lvl * 1.1;

      // 4 Columns
      const offsets = [
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ];
      offsets.forEach(([ox, oz]) => {
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(ox, y + 0.5, oz);
        group.add(col);
      });

      // Floor Slab
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, y + 1.0, 0);
      group.add(slab);
    }

    // Laser Leveler Plane
    const laserGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    });
    const laserPlane = new THREE.Mesh(laserGeo, laserMat);
    laserPlane.rotation.x = Math.PI / 2;
    group.add(laserPlane);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 3, 20);
    amberLight.position.set(5, 5, 5);
    scene.add(amberLight);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      group.rotation.y += delta * 0.35;
      laserPlane.position.y = Math.sin(time * 2) * 1.2;

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
      gridHelper.dispose();
      colGeo.dispose();
      colMat.dispose();
      slabGeo.dispose();
      slabMat.dispose();
      laserGeo.dispose();
      laserMat.dispose();
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
        <span>Breakdown Factor Civil BIM · DSR 2023 Mesh</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-mono text-amber-300">
        <Ruler className="w-3.5 h-3.5 text-amber-400" />
        <span>CPWD Schedule of Rates</span>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-800/40 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2 text-amber-300">
          <HardHat className="w-3.5 h-3.5" />
          <span>Statutory Takeoff: <strong>15% Profit + 18% GST Auto-Audit</strong></span>
        </div>
        <span className="text-amber-500 text-[10px]">Laser Leveling 0.02mm</span>
      </div>
    </div>
  );
}
