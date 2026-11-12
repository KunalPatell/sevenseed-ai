"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Terminal, Cpu, Zap, Activity } from "lucide-react";

export function AutonomousDevinOrb3D() {
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

    // Central Glowing Reactor
    const coreGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Inner Gyro Ring
    const ring1Geo = new THREE.TorusGeometry(1.5, 0.06, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.8,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    group.add(ring1);

    // Middle Gyro Ring
    const ring2Geo = new THREE.TorusGeometry(2.0, 0.08, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    group.add(ring2);

    // Outer Heavy Carbon Ring
    const ring3Geo = new THREE.TorusGeometry(2.5, 0.1, 16, 64);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      metalness: 0.9,
      roughness: 0.3,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    group.add(ring3);

    // Floating Devin Swarm Agent Satellites
    const agentNames = ["Maya (Marketing)", "Kabir (Devin)", "Ananya (Sales)", "Rohan (QA)"];
    const agentMeshes = agentNames.map((name, idx) => {
      const g = new THREE.DodecahedronGeometry(0.18);
      const m = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.8,
      });
      const mesh = new THREE.Mesh(g, m);
      scene.add(mesh);
      return { mesh, angle: (idx * Math.PI) / 2, radius: 3.2 };
    });

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 3.5, 20);
    amberLight.position.set(4, 5, 4);
    scene.add(amberLight);

    const warmLight = new THREE.PointLight(0xd97706, 2, 20);
    warmLight.position.set(-4, -4, -3);
    scene.add(warmLight);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gyro counter-rotations
      ring1.rotation.x += delta * 0.8;
      ring1.rotation.y += delta * 0.4;

      ring2.rotation.y += delta * 0.6;
      ring2.rotation.z -= delta * 0.5;

      ring3.rotation.x -= delta * 0.4;
      ring3.rotation.z += delta * 0.3;

      coreMesh.rotation.y += delta * 0.2;

      agentMeshes.forEach((a, i) => {
        a.angle += delta * (0.4 + i * 0.1);
        a.mesh.position.x = Math.cos(a.angle) * a.radius;
        a.mesh.position.z = Math.sin(a.angle) * a.radius;
        a.mesh.position.y = Math.sin(time * 2 + i) * 0.5;
        a.mesh.rotation.y += delta * 2;
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
      agentMeshes.forEach((a) => {
        scene.remove(a.mesh);
        a.mesh.geometry.dispose();
      });
      scene.remove(group);
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      ring1Mat.dispose();
      ring2Mat.dispose();
      ring3Mat.dispose();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center rounded-2xl bg-amber-950/40 border border-amber-500/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-amber-950/50">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-xs font-mono text-amber-400">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span>Sevenforce Autonomous AI Core · Gyroscope Reactor</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-mono text-amber-300">
        <Cpu className="w-3.5 h-3.5 text-amber-400" />
        <span>LangGraph + Devin OS</span>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-800/40 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2 text-amber-300">
          <Terminal className="w-3.5 h-3.5" />
          <span>Swarm Cluster Status: <strong>7 Devin Agents Online (450k Tasks/Day)</strong></span>
        </div>
        <span className="text-amber-500 text-[10px]">LangGraph Cyclic State OK</span>
      </div>
    </div>
  );
}
