"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Brain, Award, Activity } from "lucide-react";

export function NeuralSynapseNetwork3D() {
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

    // Neural Nodes
    const nodeCount = 38;
    const nodePositions: THREE.Vector3[] = [];
    const nodeGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xd946ef,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8,
    });

    const nodeMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.6 + Math.random() * 0.7;
      const pos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.8,
        r * Math.cos(phi)
      );
      nodePositions.push(pos);

      const m = new THREE.Mesh(nodeGeom, nodeMat);
      m.position.copy(pos);
      group.add(m);
      nodeMeshes.push(m);
    }

    // Interconnecting Synapses
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.35,
    });

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 1.35) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([
            nodePositions[i],
            nodePositions[j],
          ]);
          const line = new THREE.Line(lineGeo, lineMat);
          group.add(line);
        }
      }
    }

    // Central Core
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      emissive: 0x9333ea,
      emissiveIntensity: 0.6,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0xd946ef, 3, 20);
    purpleLight.position.set(4, 5, 4);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x6366f1, 2.5, 20);
    blueLight.position.set(-4, -4, -3);
    scene.add(blueLight);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      group.rotation.y += delta * 0.3;
      group.rotation.x = Math.sin(time * 0.4) * 0.15;
      coreMesh.rotation.y -= delta * 0.5;

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
      nodeGeom.dispose();
      nodeMat.dispose();
      lineMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] flex items-center justify-center rounded-2xl bg-purple-950/40 border border-purple-500/20 backdrop-blur-xl overflow-hidden shadow-2xl shadow-purple-950/50">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-mono text-purple-400">
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        <span>Comonk Neural Brain · Synapse Telemetry</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 text-xs font-mono text-purple-300">
        <Brain className="w-3.5 h-3.5 text-fuchsia-400" />
        <span>Levels.fyi + Jobscan Engine</span>
      </div>

      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-purple-800/40 text-[11px] font-mono text-slate-300 backdrop-blur-md">
        <div className="flex items-center gap-2 text-purple-300">
          <Award className="w-3.5 h-3.5" />
          <span>Verified Top AI Comp: <strong>₹1.4 Cr (Top 10% Staff AI)</strong></span>
        </div>
        <span className="text-purple-400 text-[10px]">98.4% ATS Match Rate</span>
      </div>
    </div>
  );
}
