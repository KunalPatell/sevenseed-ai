"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function NeuralSynapse3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // ── Three.js Scene Setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    camera.position.z = 240;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.replaceChildren(renderer.domElement);

    // ── Particles & Connecting Lines Lattice ──
    const PARTICLE_COUNT = 110;
    const CONNECT_DISTANCE = 52;
    const BOUNDS = { x: 180, y: 120, z: 120 };

    interface Particle3D {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      colorIndex: number;
    }

    const particles: Particle3D[] = [];
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isGold = Math.random() > 0.72;
      particles.push({
        x: (Math.random() - 0.5) * BOUNDS.x * 2,
        y: (Math.random() - 0.5) * BOUNDS.y * 2,
        z: (Math.random() - 0.5) * BOUNDS.z * 2,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        vz: (Math.random() - 0.5) * 0.28,
        colorIndex: isGold ? 1 : 0,
      });

      positions[i * 3] = particles[i].x;
      positions[i * 3 + 1] = particles[i].y;
      positions[i * 3 + 2] = particles[i].z;

      // Cyan: (0.62, 0.85, 1.0) | Gold: (0.81, 0.68, 0.43)
      if (isGold) {
        colors[i * 3] = 0.81;
        colors[i * 3 + 1] = 0.68;
        colors[i * 3 + 2] = 0.43;
      } else {
        colors[i * 3] = 0.62;
        colors[i * 3 + 1] = 0.85;
        colors[i * 3 + 2] = 1.0;
      }
    }

    // Points Geometry
    const pointsGeom = new THREE.BufferGeometry();
    pointsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pointsGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 2.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const pointCloud = new THREE.Points(pointsGeom, pointsMat);
    scene.add(pointCloud);

    // Dynamic Connecting Lines Buffer
    const MAX_LINES = 450;
    const linePositions = new Float32Array(MAX_LINES * 2 * 3);
    const lineColors = new Float32Array(MAX_LINES * 2 * 3);

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeom.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const lineSegments = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lineSegments);

    // Mouse & Scroll Parallax
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetCameraX = nx * 35;
      targetCameraY = ny * 25;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ── Animation Loop ──
    let animId: number;
    let isVisible = true;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    });
    observer.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      // Parallax camera lerp
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Update particle positions
      const posAttr = pointsGeom.getAttribute("position") as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Bounce at boundaries
        if (p.x < -BOUNDS.x || p.x > BOUNDS.x) p.vx *= -1;
        if (p.y < -BOUNDS.y || p.y > BOUNDS.y) p.vy *= -1;
        if (p.z < -BOUNDS.z || p.z > BOUNDS.z) p.vz *= -1;

        posArray[i * 3] = p.x;
        posArray[i * 3 + 1] = p.y;
        posArray[i * 3 + 2] = p.z;
      }
      posAttr.needsUpdate = true;

      // Recompute connections in 3D
      let lineIndex = 0;
      const lPosAttr = lineGeom.getAttribute("position") as THREE.BufferAttribute;
      const lColAttr = lineGeom.getAttribute("color") as THREE.BufferAttribute;
      const lPos = lPosAttr.array as Float32Array;
      const lCol = lColAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT; j++) {
          if (lineIndex >= MAX_LINES) break;

          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dz = particles[i].z - particles[j].z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < CONNECT_DISTANCE) {
            const alpha = 1 - dist / CONNECT_DISTANCE;
            const idx1 = lineIndex * 6;
            const idx2 = idx1 + 3;

            lPos[idx1] = particles[i].x;
            lPos[idx1 + 1] = particles[i].y;
            lPos[idx1 + 2] = particles[i].z;

            lPos[idx2] = particles[j].x;
            lPos[idx2 + 1] = particles[j].y;
            lPos[idx2 + 2] = particles[j].z;

            // Gradient line colors
            const c1 = particles[i].colorIndex === 1 ? 0.81 : 0.62;
            const c2 = particles[j].colorIndex === 1 ? 0.81 : 0.62;

            lCol[idx1] = c1 * alpha;
            lCol[idx1 + 1] = 0.85 * alpha;
            lCol[idx1 + 2] = 1.0 * alpha;

            lCol[idx2] = c2 * alpha;
            lCol[idx2 + 1] = 0.85 * alpha;
            lCol[idx2 + 2] = 1.0 * alpha;

            lineIndex++;
          }
        }
      }

      lineGeom.setDrawRange(0, lineIndex * 2);
      lPosAttr.needsUpdate = true;
      lColAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();
      container.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-45 overflow-hidden"
    />
  );
}
