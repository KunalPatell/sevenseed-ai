"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Network, BookOpen, Compass } from "lucide-react";

export function KnowledgeOctahedron3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<string>("Knowledge DAG");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Inner Glowing Octahedron
    const octGeo = new THREE.OctahedronGeometry(1.5, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    group.add(octMesh);

    // Outer Wireframe Cage
    const wireGeo = new THREE.OctahedronGeometry(1.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    group.add(wireMesh);

    // Orbiting Satellite Nodes (representing reference sites)
    const nodes = [
      { name: "Knowledge DAG (learn-anything)", color: 0x38bdf8, radius: 2.8, speed: 0.7, tilt: 0.3 },
      { name: "In-Browser Code Lab (freeCodeCamp)", color: 0x10b981, radius: 3.2, speed: 0.5, tilt: -0.4 },
      { name: "Gamified Streak (Duolingo)", color: 0xf59e0b, radius: 3.6, speed: 0.6, tilt: 0.6 },
      { name: "Laws of UX (lawsofux.com)", color: 0xa855f7, radius: 4.0, speed: 0.4, tilt: -0.2 },
      { name: "100-Day Challenge (100daysai)", color: 0x06b6d4, radius: 4.3, speed: 0.35, tilt: 0.5 },
      { name: "Mental Models (fs.blog)", color: 0xec4899, radius: 4.6, speed: 0.3, tilt: -0.5 },
    ];

    const satelliteMeshes = nodes.map((n) => {
      const g = new THREE.SphereGeometry(0.16, 16, 16);
      const m = new THREE.MeshStandardMaterial({
        color: n.color,
        emissive: n.color,
        emissiveIntensity: 0.9,
      });
      const mesh = new THREE.Mesh(g, m);
      scene.add(mesh);

      // Ring Orbit Line
      const ringGeo = new THREE.RingGeometry(n.radius - 0.02, n.radius + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: n.color,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + n.tilt;
      scene.add(ring);

      return { mesh, data: n, angle: Math.random() * Math.PI * 2 };
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 3, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x6366f1, 2.5, 20);
    pointLight2.position.set(-5, -5, -3);
    scene.add(pointLight2);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      octMesh.rotation.y += delta * 0.4;
      octMesh.rotation.x += delta * 0.2;
      wireMesh.rotation.y -= delta * 0.3;
      wireMesh.rotation.z += delta * 0.15;

      satelliteMeshes.forEach((s) => {
        s.angle += delta * s.data.speed;
        const x = Math.cos(s.angle) * s.data.radius;
        const z = Math.sin(s.angle) * s.data.radius;
        const y = Math.sin(s.angle) * s.data.tilt * 1.5;
        s.mesh.position.set(x, y, z);
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
      satelliteMeshes.forEach((s) => {
        scene.remove(s.mesh);
        s.mesh.geometry.dispose();
      });
      scene.remove(group);
      octGeo.dispose();
      octMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center rounded-2xl bg-slate-950/60 border border-sky-500/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-sky-950/50">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-500/30 text-xs font-mono text-sky-400">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        <span>AVPU Knowledge Octahedron · 60 FPS WebGL</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-mono text-slate-400">
        <Network className="w-3.5 h-3.5 text-sky-400" />
        <span>8 Orbital Learning Hubs</span>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2 text-sky-300">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum Node: <strong>learn-anything + FreeCodeCamp + Duolingo</strong></span>
        </div>
        <span className="text-slate-500 text-[10px]">360° Real-time PBR Shader</span>
      </div>
    </div>
  );
}
