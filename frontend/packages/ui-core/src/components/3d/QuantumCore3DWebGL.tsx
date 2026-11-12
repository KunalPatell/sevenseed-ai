"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Sparkles, Compass, Eye, Shield, Activity, RefreshCw, Zap, Cpu } from "lucide-react";

export type CoreGeometry = "icosahedron" | "torusknot" | "tesseract" | "helix" | "octahedron";
export type ShadingStyle = "crystal" | "wireframe" | "synapse";

interface SatelliteNode {
  name: string;
  color: string;
  orbitRadius: number;
  speed: number;
  tilt: number;
  phase: number;
  mesh?: THREE.Mesh;
}

const SATELLITES_DATA: Omit<SatelliteNode, "mesh">[] = [
  { name: "LangGraph", color: "#9ed8ff", orbitRadius: 2.7, speed: 0.65, tilt: 0.28, phase: 0 },
  { name: "YOLOv8", color: "#cfae6e", orbitRadius: 3.1, speed: 0.48, tilt: -0.35, phase: 0.9 },
  { name: "ChromaDB", color: "#60a5fa", orbitRadius: 3.4, speed: 0.38, tilt: 0.52, phase: 1.8 },
  { name: "FastAPI", color: "#34d399", orbitRadius: 3.8, speed: 0.32, tilt: -0.22, phase: 2.7 },
  { name: "n8n", color: "#f59e0b", orbitRadius: 4.1, speed: 0.25, tilt: 0.41, phase: 3.6 },
  { name: "Groq", color: "#f43f5e", orbitRadius: 4.4, speed: 0.22, tilt: -0.48, phase: 4.5 },
  { name: "PyTorch", color: "#ec4899", orbitRadius: 4.7, speed: 0.18, tilt: 0.15, phase: 5.4 },
];

export function QuantumCore3DWebGL() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<CoreGeometry>("icosahedron");
  const [shading, setShading] = useState<ShadingStyle>("crystal");
  const [fps, setFps] = useState(60);
  const [activeSatellite, setActiveSatellite] = useState<string | null>(null);
  const [synapseCount, setSynapseCount] = useState(72);
  const [isHovered, setIsHovered] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const coreGroupRef = useRef<THREE.Group | null>(null);
  const innerMeshRef = useRef<THREE.Mesh | null>(null);
  const wireMeshRef = useRef<THREE.LineSegments | null>(null);
  const pulseRingsRef = useRef<THREE.Mesh[]>([]);
  const satellitesRef = useRef<{ mesh: THREE.Mesh; halo: THREE.Mesh; data: typeof SATELLITES_DATA[0] }[]>([]);
  const shockwavesRef = useRef<{ mesh: THREE.Mesh; life: number }[]>([]);
  const pulseIntensity = useRef(0);

  // Mouse & Orbit state
  const mousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0.2, y: 0.3 });
  const currentRotation = useRef({ x: 0.2, y: 0.3 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const isVisible = useRef(true);

  // Energy shockwave trigger
  const triggerPulse = useCallback(() => {
    pulseIntensity.current = 1.0;
    if (!sceneRef.current) return;

    const ringGeom = new THREE.RingGeometry(0.5, 0.65, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x9ed8ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const shockRing = new THREE.Mesh(ringGeom, ringMat);
    shockRing.rotation.x = Math.PI / 2;
    sceneRef.current.add(shockRing);
    shockwavesRef.current.push({ mesh: shockRing, life: 1.0 });
  }, []);

  // Helper to build 3D geometry
  const createCoreGeometry = useCallback((type: CoreGeometry) => {
    switch (type) {
      case "icosahedron":
        return new THREE.IcosahedronGeometry(1.4, 1);
      case "torusknot":
        return new THREE.TorusKnotGeometry(0.95, 0.32, 100, 16, 2, 3);
      case "tesseract":
        return new THREE.BoxGeometry(1.6, 1.6, 1.6);
      case "helix":
        return new THREE.CylinderGeometry(0.8, 0.8, 2.4, 16, 8, true);
      case "octahedron":
        return new THREE.OctahedronGeometry(1.4, 0);
      default:
        return new THREE.IcosahedronGeometry(1.4, 1);
    }
  }, []);

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.2);

    // High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x9ed8ff, 3.5, 20);
    cyanLight.position.set(3, 4, 5);
    scene.add(cyanLight);

    const amberLight = new THREE.PointLight(0xcfae6e, 3.0, 20);
    amberLight.position.set(-4, -2, 4);
    scene.add(amberLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 2.0, 15);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    // Root Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);
    coreGroupRef.current = coreGroup;

    // ── Build Initial Core Mesh ──
    const geom = createCoreGeometry(geometry);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a1424,
      emissive: 0x1d3d63,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92,
      wireframe: shading === "wireframe",
    });
    const innerMesh = new THREE.Mesh(geom, innerMat);
    coreGroup.add(innerMesh);
    innerMeshRef.current = innerMesh;

    // Outer Wireframe Cage
    const wireGeom = new THREE.WireframeGeometry(geom);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x9ed8ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
    coreGroup.add(wireMesh);
    wireMeshRef.current = wireMesh;

    // ── Concentric 3D Counter-Rotating Orbital Rings ──
    pulseRingsRef.current = [];
    const ringConfigs = [
      { radius: 2.15, tube: 0.016, rot: [0.5, 0.2, 0], color: 0x9ed8ff },
      { radius: 2.45, tube: 0.018, rot: [-0.4, 0.8, 0.3], color: 0xcfae6e },
      { radius: 2.75, tube: 0.014, rot: [0.9, -0.3, 0.6], color: 0x38bdf8 },
    ];

    ringConfigs.forEach((cfg) => {
      const ringGeom = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      coreGroup.add(ringMesh);
      pulseRingsRef.current.push(ringMesh);
    });

    // ── 7 Orbiting AI Satellites ──
    satellitesRef.current = [];
    SATELLITES_DATA.forEach((sat) => {
      const satGroup = new THREE.Group();

      const satGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: sat.color,
        emissive: sat.color,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.8,
      });
      const satMesh = new THREE.Mesh(satGeom, satMat);

      // Halo ring around satellite
      const haloGeom = new THREE.RingGeometry(0.18, 0.22, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: sat.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeom, haloMat);
      haloMesh.rotation.x = Math.PI / 2;

      satGroup.add(satMesh);
      satGroup.add(haloMesh);
      scene.add(satGroup);

      satellitesRef.current.push({
        mesh: satGroup as unknown as THREE.Mesh,
        halo: haloMesh,
        data: sat,
      });
    });

    // ── Stellar Cosmic Dust Field ──
    const starCount = 360;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 2.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const isGold = Math.random() > 0.65;
      starColors[i * 3] = isGold ? 0.81 : 0.62;
      starColors[i * 3 + 1] = isGold ? 0.68 : 0.85;
      starColors[i * 3 + 2] = isGold ? 0.43 : 1.0;
    }

    const starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeom.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // ── Viewport Optimization: Pause when out of screen ──
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible.current = e.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // ── Animation Loop ──
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);

      if (!isVisible.current) return;

      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // FPS tracking
      frameCount++;
      if (time - fpsTimer >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsTimer = time;
      }

      // Smooth rotation lerp
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.07;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.07;

      if (coreGroupRef.current) {
        const autoSpin = isHovered ? 0.45 : 0.25;
        coreGroupRef.current.rotation.y += dt * autoSpin;
        coreGroupRef.current.rotation.x = currentRotation.current.x;
        coreGroupRef.current.rotation.z = currentRotation.current.y * 0.4;
      }

      // Pulse decay & breathing scale
      if (pulseIntensity.current > 0) {
        pulseIntensity.current = Math.max(0, pulseIntensity.current - dt * 1.5);
      }
      const breathe = 1 + Math.sin(time * 0.002) * 0.03 + pulseIntensity.current * 0.18;
      if (innerMeshRef.current) {
        innerMeshRef.current.scale.set(breathe, breathe, breathe);
      }
      if (wireMeshRef.current) {
        const wireScale = breathe * 1.05;
        wireMeshRef.current.scale.set(wireScale, wireScale, wireScale);
      }

      // Counter-rotate orbital rings
      pulseRingsRef.current.forEach((ring, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        ring.rotation.z += dt * (0.35 + idx * 0.12) * dir;
      });

      // Update 7 Orbiting Satellites in 3D
      satellitesRef.current.forEach(({ mesh, halo, data }) => {
        const t = time * 0.001 * data.speed + data.phase;
        const x = Math.cos(t) * data.orbitRadius;
        const z = Math.sin(t) * data.orbitRadius;
        const y = Math.sin(t * 1.5) * (data.orbitRadius * data.tilt);

        mesh.position.set(x, y, z);
        halo.rotation.z += dt * 1.2;
      });

      // Update shockwaves
      for (let i = shockwavesRef.current.length - 1; i >= 0; i--) {
        const sw = shockwavesRef.current[i];
        sw.life -= dt * 1.6;
        const scale = 1 + (1 - sw.life) * 4.5;
        sw.mesh.scale.set(scale, scale, scale);
        (sw.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, sw.life * 0.85);

        if (sw.life <= 0) {
          scene.remove(sw.mesh);
          sw.mesh.geometry.dispose();
          (sw.mesh.material as THREE.Material).dispose();
          shockwavesRef.current.splice(i, 1);
        }
      }

      // Slow drift star field
      starField.rotation.y += dt * 0.04;

      // Parallax Camera motion
      camera.position.x += (mousePos.current.x * 1.2 - camera.position.x) * 0.05;
      camera.position.y += (-mousePos.current.y * 1.0 + 1.2 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();
      container.replaceChildren();
    };
  }, [createCoreGeometry]);

  // Update Geometry dynamically without rebuilding scene
  useEffect(() => {
    if (!coreGroupRef.current || !sceneRef.current) return;

    const newGeom = createCoreGeometry(geometry);

    if (innerMeshRef.current) {
      innerMeshRef.current.geometry.dispose();
      innerMeshRef.current.geometry = newGeom;
    }

    if (wireMeshRef.current) {
      wireMeshRef.current.geometry.dispose();
      wireMeshRef.current.geometry = new THREE.WireframeGeometry(newGeom);
    }

    // Update estimated synapse edge count
    const edgeCounts: Record<CoreGeometry, number> = {
      icosahedron: 30,
      torusknot: 120,
      tesseract: 32,
      helix: 64,
      octahedron: 12,
    };
    setSynapseCount(edgeCounts[geometry] || 48);
  }, [geometry, createCoreGeometry]);

  // Update Shading Style
  useEffect(() => {
    if (!innerMeshRef.current || !wireMeshRef.current) return;

    const mat = innerMeshRef.current.material as THREE.MeshPhysicalMaterial;
    const wireMat = wireMeshRef.current.material as THREE.LineBasicMaterial;

    if (shading === "wireframe") {
      mat.wireframe = true;
      mat.opacity = 0.4;
      wireMat.opacity = 0.85;
    } else if (shading === "synapse") {
      mat.wireframe = false;
      mat.emissive.setHex(0x38bdf8);
      mat.emissiveIntensity = 1.4;
      mat.opacity = 0.75;
      wireMat.opacity = 0.9;
    } else {
      // crystal mode
      mat.wireframe = false;
      mat.emissive.setHex(0x1d3d63);
      mat.emissiveIntensity = 0.8;
      mat.opacity = 0.92;
      wireMat.opacity = 0.65;
    }
  }, [shading]);

  // Mouse drag orbit controls & hover parallax
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = mountRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePos.current = { x: nx, y: ny };

    if (isDragging.current) {
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      targetRotation.current.y += dx * 0.012;
      targetRotation.current.x += dy * 0.012;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      className="relative w-full aspect-square max-w-[460px] mx-auto select-none group"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDragging.current = false;
        mousePos.current = { x: 0, y: 0 };
      }}
      onClick={triggerPulse}
    >
      {/* Outer Holographic Ambient Glow Aura */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#9ed8ff]/15 via-[#cfae6e]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Frame Container */}
      <div className="absolute inset-1 sm:inset-2 rounded-3xl border border-white/10 bg-[#07090e]/75 backdrop-blur-xl p-3 flex flex-col justify-between overflow-hidden shadow-[0_0_60px_rgba(158,216,255,0.12)]">
        
        {/* Top HUD Telemetry Ribbon */}
        <div className="flex items-center justify-between z-10 px-2 py-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono font-bold text-white/90 uppercase tracking-widest flex items-center gap-1.5">
              3D QUANTUM CORE <Sparkles className="h-2.5 w-2.5 text-[#cfae6e]" />
            </span>
          </div>

          <div className="flex items-center gap-2 text-[9px] font-mono text-[#9ed8ff]">
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-bold">
              {fps} FPS
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              HARDWARE WEBGL
            </span>
          </div>
        </div>

        {/* Real-time WebGL 3D Mount Container */}
        <div className="relative flex-1 w-full flex items-center justify-center cursor-grab active:cursor-grabbing">
          <div ref={mountRef} className="w-full h-full block" />

          {/* Interactive Click/Drag Prompt */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            <span className="text-[9px] font-mono px-3 py-1 rounded-full bg-black/85 border border-[#9ed8ff]/50 text-[#9ed8ff] uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(158,216,255,0.3)]">
              ✦ Drag to Orbit • Click to Pulse ✦
            </span>
          </div>
        </div>

        {/* Bottom Switchers: Geometries & Shading Styles */}
        <div className="z-10 flex flex-col gap-2 px-2 pt-2 border-t border-white/5">
          {/* Geometry Selector */}
          <div className="flex flex-wrap items-center justify-between gap-1">
            <div className="flex flex-wrap gap-1">
              {(
                [
                  { id: "icosahedron", label: "Seed" },
                  { id: "torusknot", label: "Torus Knot" },
                  { id: "tesseract", label: "Tesseract" },
                  { id: "helix", label: "DNA Helix" },
                  { id: "octahedron", label: "Crystal" },
                ] as const
              ).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setGeometry(g.id);
                    triggerPulse();
                  }}
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-md border transition-all ${
                    geometry === g.id
                      ? "bg-[#9ed8ff]/25 border-[#9ed8ff] text-white shadow-[0_0_10px_rgba(158,216,255,0.4)] font-bold"
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:text-white hover:border-white/20"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="text-[9px] font-mono text-[#cfae6e] hidden sm:block">
              {synapseCount} Edges
            </div>
          </div>

          {/* Shading Style & Satellite Nodes Indicator */}
          <div className="flex items-center justify-between gap-1 text-[8.5px] font-mono">
            <div className="flex items-center gap-1">
              <span className="text-white/40 uppercase">Mode:</span>
              {(
                [
                  { id: "crystal", label: "Crystal Core" },
                  { id: "wireframe", label: "Wireframe" },
                  { id: "synapse", label: "Deep Synapse" },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShading(s.id);
                  }}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    shading === s.id
                      ? "text-[#9ed8ff] font-bold bg-white/5"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-1 text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9ed8ff] animate-ping" />
              <span>7 Satellites Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
