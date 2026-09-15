/**
 * Sevenseed Platform — Universal 3D WebGL Render & 3D Animation Engine
 * Handcrafted interactive 3D WebGL scenes for all 8 Sevenseed startup platforms:
 * 1. Sevenseed Hub: Quantum Studio Multiverse Core
 * 2. Sevenforce: 7-Agent Cybernetic Neural Nexus
 * 3. Comonk AI: 3D Career Neural Synapse & ATS Constellation
 * 4. AVPU: 3D Celestial Knowledge Astrolabe & Knowledge Orb
 * 5. Decode Forest Pharmacy: 3D Bio-Molecular DNA Double Helix
 * 6. Breakdown Factor: 3D Structural Inspection Tesseract & Laser Scanner
 * 7. AVP Charitable Trust: 3D Golden Eco-Globe & Relief Beacon
 * 8. AVP Emart: 3D Holographic Shopping Prism & Deals Radar
 */

(function () {
  'use strict';

  // 1. Ensure Three.js is loaded
  function loadThree(callback) {
    if (typeof THREE !== 'undefined') {
      callback();
      return;
    }
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = function () {
      callback();
    };
    document.head.appendChild(script);
  }

  // 2. Identify Current Platform
  function detectPlatform() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('/sevenforce') !== -1) return 'sevenforce';
    if (path.indexOf('/comonk') !== -1) return 'comonk';
    if (path.indexOf('/avpu') !== -1) return 'avpu';
    if (path.indexOf('/pharmacy') !== -1 || path.indexOf('/decode-forest-pharmacy') !== -1) return 'pharmacy';
    if (path.indexOf('/breakdown') !== -1 || path.indexOf('/breakdown-factor') !== -1) return 'breakdown';
    if (path.indexOf('/trust') !== -1 || path.indexOf('/avp-charitable-trust') !== -1) return 'trust';
    if (path.indexOf('/avp-emart') !== -1) return 'avp-emart';
    return 'sevenseed';
  }

  // 3. Setup Canvas in Hero Section
  function getOrCreateCanvas() {
    var hero = document.querySelector('.hero, header, .hero-content, main');
    if (!hero) hero = document.body;

    var existing = hero.querySelector('canvas.webgl-hero-canvas, #particles, canvas');
    if (existing && !existing.classList.contains('used-by-engine')) {
      existing.classList.add('webgl-hero-canvas', 'used-by-engine');
      existing.style.position = 'absolute';
      existing.style.inset = '0';
      existing.style.width = '100%';
      existing.style.height = '100%';
      existing.style.pointerEvents = 'none';
      existing.style.zIndex = '0';
      return existing;
    }

    var canvas = document.createElement('canvas');
    canvas.className = 'webgl-hero-canvas used-by-engine';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.9';

    if (hero.firstChild) {
      hero.insertBefore(canvas, hero.firstChild);
    } else {
      hero.appendChild(canvas);
    }

    var heroStyle = window.getComputedStyle(hero);
    if (heroStyle.position === 'static') {
      hero.style.position = 'relative';
    }
    return canvas;
  }

  // 4. Initialize 3D Perspective Tilt on Cards
  function init3DTilt() {
    var cards = document.querySelectorAll(
      '.svc-card, .glow-card, .about-card, .proc-step, .metric, .pillar, .dock-tab, .workstation-hud, article, .tcard'
    );

    cards.forEach(function (card) {
      var rect = null;
      var raf = null;

      function updateRect() {
        rect = card.getBoundingClientRect();
      }

      card.addEventListener('mouseenter', function () {
        updateRect();
        card.style.transition = 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.15s ease';
      });

      card.addEventListener('mousemove', function (e) {
        if (!rect) updateRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        dx = Math.max(-1, Math.min(1, dx));
        dy = Math.max(-1, Math.min(1, dy));

        var rx = -dy * 10;
        var ry = dx * 10;
        var mx = ((e.clientX - rect.left) / rect.width) * 100;
        var my = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--mx', mx.toFixed(1) + '%');
        card.style.setProperty('--my', my.toFixed(1) + '%');

        if (!raf) {
          raf = requestAnimationFrame(function () {
            card.style.transform =
              'perspective(900px) rotateX(' +
              rx.toFixed(2) +
              'deg) rotateY(' +
              ry.toFixed(2) +
              'deg) translateY(-5px) scale3d(1.015, 1.015, 1.015)';
            raf = null;
          });
        }
      });

      card.addEventListener('mouseleave', function () {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = null;
        }
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease';
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
        rect = null;
      });
    });
  }

  // 5. Text Scramble Animation on Hero Titles
  function initTextScramble() {
    var titleEl = document.querySelector('.hero-title, h1');
    if (!titleEl || titleEl.dataset.scrambleInit) return;
    titleEl.dataset.scrambleInit = 'true';

    var targetText = titleEl.innerText;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]';
    var iteration = 0;

    var interval = setInterval(function () {
      titleEl.innerHTML = targetText
        .split('')
        .map(function (letter, index) {
          if (letter === ' ' || letter === '\n') return letter;
          if (index < iteration) return targetText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= targetText.length) {
        clearInterval(interval);
        titleEl.innerText = targetText;
      }
      iteration += 1.5;
    }, 28);
  }

  // 6. Main 3D Engine Initialization
  function initWebGLScene() {
    var platform = detectPlatform();
    var canvas = getOrCreateCanvas();
    if (!canvas) return;

    var container = canvas.parentElement || document.body;
    var width = container.clientWidth || window.innerWidth;
    var height = Math.max(container.clientHeight || window.innerHeight, 500);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    var renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var group = new THREE.Group();
    scene.add(group);

    // Desktop vs mobile positioning
    var isDesktop = window.innerWidth > 960;
    var defaultPos = isDesktop ? new THREE.Vector3(2.5, 0.2, -1.0) : new THREE.Vector3(0, 1.0, -2.0);
    group.position.copy(defaultPos);

    // Dynamic Lighting
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    var dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    var dirLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Mouse Interaction
    var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    window.addEventListener('mousemove', function (e) {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Resize Handling
    window.addEventListener('resize', function () {
      var w = container.clientWidth || window.innerWidth;
      var h = Math.max(container.clientHeight || window.innerHeight, 500);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      isDesktop = window.innerWidth > 960;
      group.position.copy(isDesktop ? new THREE.Vector3(2.5, 0.2, -1.0) : new THREE.Vector3(0, 1.0, -2.0));
    });

    // Cosmic Starfield Particle Layer
    var starGeom = new THREE.BufferGeometry();
    var starCount = 380;
    var starPos = new Float32Array(starCount * 3);
    for (var i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 28;
      starPos[i + 1] = (Math.random() - 0.5) * 28;
      starPos[i + 2] = (Math.random() - 0.5) * 20 - 4;
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    var starMat = new THREE.PointsMaterial({
      size: 0.055,
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    var starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // BUILD SPECIFIC 3D RENDER PER PLATFORM
    var animHooks = [];

    switch (platform) {
      // ─────────────────────────────────────────────────────────────
      // 1. SEVENSEED HUB: Quantum Multiverse Core with 8 Venture Orbits
      // ─────────────────────────────────────────────────────────────
      case 'sevenseed':
        (function buildQuantumMultiverse() {
          var coreGeom = new THREE.IcosahedronGeometry(1.3, 1);
          var coreMat = new THREE.MeshStandardMaterial({
            color: 0x6366f1,
            metalness: 0.7,
            roughness: 0.2,
            emissive: 0x4338ca,
            emissiveIntensity: 0.45,
            wireframe: false,
          });
          var core = new THREE.Mesh(coreGeom, coreMat);
          group.add(core);

          var wireMat = new THREE.MeshBasicMaterial({
            color: 0xa5b4fc,
            wireframe: true,
            transparent: true,
            opacity: 0.45,
          });
          var wireCore = new THREE.Mesh(coreGeom.clone(), wireMat);
          wireCore.scale.setScalar(1.04);
          group.add(wireCore);

          // 3 Concentric Gimbal Rings
          var ringMat = new THREE.MeshBasicMaterial({
            color: 0x818cf8,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide,
          });
          var ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.02, 16, 80), ringMat);
          var ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.015, 16, 80), ringMat);
          var ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.012, 16, 80), ringMat);
          ring1.rotation.x = Math.PI / 3;
          ring2.rotation.y = Math.PI / 4;
          ring3.rotation.z = Math.PI / 6;
          group.add(ring1);
          group.add(ring2);
          group.add(ring3);

          // 8 Venture Satellite Orbs (Colored per venture)
          var ventureColors = [0x06b6d4, 0x60a5fa, 0x3b82f6, 0x10b981, 0xf59e0b, 0xf43f5e, 0xf97316, 0x8b5cf6];
          var satellites = [];
          for (var v = 0; v < 8; v++) {
            var satGeom = new THREE.SphereGeometry(0.12, 16, 16);
            var satMat = new THREE.MeshStandardMaterial({
              color: ventureColors[v],
              emissive: ventureColors[v],
              emissiveIntensity: 0.8,
            });
            var satMesh = new THREE.Mesh(satGeom, satMat);
            group.add(satMesh);
            satellites.push({
              mesh: satMesh,
              angle: (v * Math.PI * 2) / 8,
              radius: 2.2 + (v % 3) * 0.35,
              speed: 0.5 + (v % 4) * 0.15,
              tilt: ((v - 4) * Math.PI) / 8,
            });
          }

          animHooks.push(function (delta, time) {
            core.rotation.y += delta * 0.45;
            core.rotation.x += delta * 0.25;
            wireCore.rotation.y -= delta * 0.3;
            ring1.rotation.z += delta * 0.35;
            ring2.rotation.x += delta * 0.25;
            ring3.rotation.y -= delta * 0.2;

            satellites.forEach(function (sat) {
              sat.angle += delta * sat.speed;
              var x = Math.cos(sat.angle) * sat.radius;
              var z = Math.sin(sat.angle) * sat.radius;
              var y = Math.sin(sat.angle * 2 + sat.tilt) * 0.45;
              sat.mesh.position.set(x, y, z);
            });
          });
        })();
        break;

      // ─────────────────────────────────────────────────────────────
      // 2. SEVENFORCE: 7-Agent Cybernetic Neural Nexus
      // ─────────────────────────────────────────────────────────────
      case 'sevenforce':
        (function buildSevenforceNexus() {
          // Central Command Core (Dodecahedron with pulsing cyan glow)
          var coreGeom = new THREE.DodecahedronGeometry(1.2, 0);
          var coreMat = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            metalness: 0.85,
            roughness: 0.25,
            emissive: 0x0891b2,
            emissiveIntensity: 0.6,
          });
          var core = new THREE.Mesh(coreGeom, coreMat);
          group.add(core);

          var wireMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9, wireframe: true });
          var wire = new THREE.Mesh(coreGeom.clone(), wireMat);
          wire.scale.setScalar(1.06);
          group.add(wire);

          // 7 Autonomous Agent Nodes with laser lines
          var agentColors = [0x67e8f9, 0xf59e0b, 0x10b981, 0x8b5cf6, 0xf43f5e, 0x3b82f6, 0x6366f1];
          var agentNodes = [];
          var lineMat = new THREE.LineBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
          });

          for (var a = 0; a < 7; a++) {
            var nodeGeom = new THREE.OctahedronGeometry(0.16, 0);
            var nodeMat = new THREE.MeshStandardMaterial({
              color: agentColors[a],
              emissive: agentColors[a],
              emissiveIntensity: 0.85,
            });
            var node = new THREE.Mesh(nodeGeom, nodeMat);
            group.add(node);

            // Dynamic Laser Beam connecting to core
            var beamGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]);
            var beam = new THREE.Line(beamGeom, lineMat);
            group.add(beam);

            agentNodes.push({
              mesh: node,
              beam: beam,
              angle: (a * Math.PI * 2) / 7,
              dist: 2.3 + (a % 2) * 0.4,
              speed: 0.55 - a * 0.04,
              heightPhase: a * 0.9,
            });
          }

          // Cybernetic Coordinate Ring
          var ringGeom = new THREE.TorusGeometry(2.6, 0.02, 16, 90);
          var ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.5 });
          var cyberRing = new THREE.Mesh(ringGeom, ringMat);
          cyberRing.rotation.x = Math.PI / 2.3;
          group.add(cyberRing);

          animHooks.push(function (delta, time) {
            core.rotation.y += delta * 0.5;
            wire.rotation.y -= delta * 0.4;
            cyberRing.rotation.z += delta * 0.3;

            agentNodes.forEach(function (agent) {
              agent.angle += delta * agent.speed;
              var x = Math.cos(agent.angle) * agent.dist;
              var z = Math.sin(agent.angle) * agent.dist;
              var y = Math.sin(time * 1.5 + agent.heightPhase) * 0.4;
              agent.mesh.position.set(x, y, z);
              agent.mesh.rotation.y += delta * 1.5;

              var posAttr = agent.beam.geometry.attributes.position;
              posAttr.setXYZ(1, x, y, z);
              posAttr.needsUpdate = true;
            });
          });
        })();
        break;

      // ─────────────────────────────────────────────────────────────
      // 3. COMONK AI: 3D Career Neural Synapse & ATS Constellation
      // ─────────────────────────────────────────────────────────────
      case 'comonk':
        (function buildComonkSynapse() {
          // Central Synapse Core
          var coreGeom = new THREE.IcosahedronGeometry(1.25, 2);
          var coreMat = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x1d4ed8,
            emissiveIntensity: 0.5,
          });
          var core = new THREE.Mesh(coreGeom, coreMat);
          group.add(core);

          // Synapse Node Constellation Network (Skills & Match weights)
          var nodeCount = 28;
          var nodes = [];
          var nodePositions = [];
          var nodeGeom = new THREE.SphereGeometry(0.065, 12, 12);
          var nodeMat = new THREE.MeshStandardMaterial({
            color: 0x60a5fa,
            emissive: 0x93c5fd,
            emissiveIntensity: 0.9,
          });

          for (var n = 0; n < nodeCount; n++) {
            var mesh = new THREE.Mesh(nodeGeom, nodeMat);
            var phi = Math.acos(-1 + (2 * n) / nodeCount);
            var theta = Math.sqrt(nodeCount * Math.PI) * phi;
            var r = 2.1 + (Math.random() - 0.5) * 0.6;
            mesh.position.set(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
            group.add(mesh);
            nodes.push(mesh);
            nodePositions.push(mesh.position);
          }

          // Synaptic Connections Line Network
          var linePoints = [];
          for (var i = 0; i < nodeCount; i++) {
            for (var j = i + 1; j < nodeCount; j++) {
              if (nodePositions[i].distanceTo(nodePositions[j]) < 1.3) {
                linePoints.push(nodePositions[i]);
                linePoints.push(nodePositions[j]);
              }
            }
          }
          var lineGeom = new THREE.BufferGeometry().setFromPoints(linePoints);
          var lineMat = new THREE.LineBasicMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
          });
          var lines = new THREE.LineSegments(lineGeom, lineMat);
          group.add(lines);

          // Holographic Rotating ATS Score Ring
          var ringGeom = new THREE.TorusGeometry(2.4, 0.02, 16, 90);
          var ringMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.6 });
          var atsRing = new THREE.Mesh(ringGeom, ringMat);
          atsRing.rotation.x = Math.PI / 3;
          group.add(atsRing);

          animHooks.push(function (delta, time) {
            core.rotation.y += delta * 0.35;
            core.rotation.x += delta * 0.2;
            lines.rotation.y += delta * 0.25;
            atsRing.rotation.z -= delta * 0.4;
            var scale = 1.0 + Math.sin(time * 2.5) * 0.04;
            core.scale.set(scale, scale, scale);
          });
        })();
        break;

      // ─────────────────────────────────────────────────────────────
      // 4. AVPU: 3D Celestial Knowledge Astrolabe & Orb
      // ─────────────────────────────────────────────────────────────
      case 'avpu':
        (function buildAvpuAstrolabe() {
          // Planetary Knowledge Sphere
          var sphereGeom = new THREE.SphereGeometry(1.2, 32, 32);
          var sphereMat = new THREE.MeshStandardMaterial({
            color: 0x1e3a8a,
            metalness: 0.6,
            roughness: 0.3,
            emissive: 0x1d4ed8,
            emissiveIntensity: 0.5,
          });
          var sphere = new THREE.Mesh(sphereGeom, sphereMat);
          group.add(sphere);

          // Wireframe Meridian Lines
          var wireMat = new THREE.MeshBasicMaterial({
            color: 0xfbbf24,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
          });
          var wire = new THREE.Mesh(new THREE.SphereGeometry(1.24, 18, 18), wireMat);
          group.add(wire);

          // 3 Golden Astrolabe Gimbal Rings
          var goldMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0xd97706,
            emissiveIntensity: 0.35,
            side: THREE.DoubleSide,
          });
          var ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.03, 16, 100), goldMat);
          var ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.024, 16, 100), goldMat);
          var ring3 = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.02, 16, 100), goldMat);
          ring1.rotation.x = Math.PI / 3;
          ring2.rotation.y = Math.PI / 4;
          ring3.rotation.z = Math.PI / 6;
          group.add(ring1);
          group.add(ring2);
          group.add(ring3);

          // Knowledge Faculty Cluster Particles
          var facultyColors = [0xf59e0b, 0x60a5fa, 0x34d399, 0xa78bfa];
          var facultyOrbs = [];
          for (var f = 0; f < 6; f++) {
            var fMesh = new THREE.Mesh(
              new THREE.DodecahedronGeometry(0.14, 0),
              new THREE.MeshStandardMaterial({
                color: facultyColors[f % facultyColors.length],
                emissive: facultyColors[f % facultyColors.length],
                emissiveIntensity: 0.8,
              })
            );
            group.add(fMesh);
            facultyOrbs.push({
              mesh: fMesh,
              angle: (f * Math.PI * 2) / 6,
              dist: 2.1 + (f % 2) * 0.4,
              speed: 0.45 + f * 0.05,
            });
          }

          animHooks.push(function (delta, time) {
            sphere.rotation.y += delta * 0.3;
            wire.rotation.y -= delta * 0.2;
            ring1.rotation.z += delta * 0.4;
            ring2.rotation.x += delta * 0.3;
            ring3.rotation.y -= delta * 0.25;

            facultyOrbs.forEach(function (orb) {
              orb.angle += delta * orb.speed;
              orb.mesh.position.set(Math.cos(orb.angle) * orb.dist, Math.sin(orb.angle * 1.5) * 0.5, Math.sin(orb.angle) * orb.dist);
              orb.mesh.rotation.y += delta * 2;
            });
          });
        })();
        break;

      // ─────────────────────────────────────────────────────────────
      // 5. DECODE FOREST PHARMACY: 3D Bio-Molecular DNA Double Helix
      // ─────────────────────────────────────────────────────────────
      case 'pharmacy':
        (function buildPharmacyDna() {
          var helixGroup = new THREE.Group();
          group.add(helixGroup);

          var pairCount = 28;
          var height = 5.2;
          var radius = 1.1;
          var strandMat1 = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x059669,
            emissiveIntensity: 0.7,
            metalness: 0.5,
          });
          var strandMat2 = new THREE.MeshStandardMaterial({
            color: 0x34d399,
            emissive: 0x10b981,
            emissiveIntensity: 0.8,
            metalness: 0.5,
          });
          var barMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.65 });

          var nodeSpheres = [];

          for (var p = 0; p < pairCount; p++) {
            var t = (p / pairCount) * Math.PI * 4;
            var y = (p / pairCount) * height - height / 2;
            var x1 = Math.cos(t) * radius;
            var z1 = Math.sin(t) * radius;
            var x2 = Math.cos(t + Math.PI) * radius;
            var z2 = Math.sin(t + Math.PI) * radius;

            // Sphere 1
            var s1 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), strandMat1);
            s1.position.set(x1, y, z1);
            helixGroup.add(s1);
            nodeSpheres.push(s1);

            // Sphere 2
            var s2 = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 14), strandMat2);
            s2.position.set(x2, y, z2);
            helixGroup.add(s2);
            nodeSpheres.push(s2);

            // Connecting Nucleotide Rung
            var barGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1, y, z1), new THREE.Vector3(x2, y, z2)]);
            var bar = new THREE.Line(barGeom, barMat);
            helixGroup.add(bar);
          }

          // Orbiting Bio-Molecules / Capsules
          var bioMolecules = [];
          for (var m = 0; m < 5; m++) {
            var mol = new THREE.Mesh(
              new THREE.IcosahedronGeometry(0.18, 0),
              new THREE.MeshStandardMaterial({
                color: 0x059669,
                emissive: 0x34d399,
                emissiveIntensity: 0.9,
                wireframe: true,
              })
            );
            group.add(mol);
            bioMolecules.push({
              mesh: mol,
              angle: (m * Math.PI * 2) / 5,
              dist: 2.2 + (m % 2) * 0.4,
              speed: 0.4 + m * 0.1,
              yOffset: (m - 2) * 0.6,
            });
          }

          helixGroup.rotation.z = -Math.PI / 10;

          animHooks.push(function (delta, time) {
            helixGroup.rotation.y += delta * 0.65;

            // ECG Heartbeat pulse effect through DNA nodes
            var pulse = Math.pow(Math.sin(time * 3), 16) * 0.2;
            nodeSpheres.forEach(function (s) {
              s.scale.setScalar(1.0 + pulse);
            });

            bioMolecules.forEach(function (bm) {
              bm.angle += delta * bm.speed;
              bm.mesh.position.set(
                Math.cos(bm.angle) * bm.dist,
                bm.yOffset + Math.sin(time * 2 + bm.angle) * 0.2,
                Math.sin(bm.angle) * bm.dist
              );
              bm.mesh.rotation.x += delta;
              bm.mesh.rotation.y += delta * 1.5;
            });
          });
        })();
        break;

      // ─────────────────────────────────────────────────────────────
      // 6. BREAKDOWN FACTOR: 3D Structural Inspection Tesseract & Scanner
      // ─────────────────────────────────────────────────────────────
      case 'breakdown':
        (function buildBreakdownTesseract() {
          // Heavy Wireframe Structural Cube Scaffold
          var boxGeom = new THREE.BoxGeometry(2.2, 2.2, 2.2);
          var boxMat = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.9,
            roughness: 0.1,
            wireframe: true,
          });
          var outerBox = new THREE.Mesh(boxGeom, boxMat);
          group.add(outerBox);

          // Inner Tesseract Structural Core
          var innerGeom = new THREE.OctahedronGeometry(1.1, 0);
          var innerMat = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.7,
            metalness: 0.8,
            roughness: 0.2,
          });
          var innerCore = new THREE.Mesh(innerGeom, innerMat);
          group.add(innerCore);

          // Vertical Laser Scanner Plane (Passing up & down)
          var scanPlaneGeom = new THREE.PlaneGeometry(2.8, 2.8);
          var scanPlaneMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
          });
          var scanPlane = new THREE.Mesh(scanPlaneGeom, scanPlaneMat);
          scanPlane.rotation.x = Math.PI / 2;
          group.add(scanPlane);

          // Structural Inspection Joint Spheres with defect tags
          var jointSpheres = [];
          var corners = [
            [-1.1, -1.1, -1.1],
            [1.1, -1.1, -1.1],
            [-1.1, 1.1, -1.1],
            [1.1, 1.1, -1.1],
            [-1.1, -1.1, 1.1],
            [1.1, -1.1, 1.1],
            [-1.1, 1.1, 1.1],
            [1.1, 1.1, 1.1],
          ];
          corners.forEach(function (c, idx) {
            var jGeom = new THREE.SphereGeometry(0.08, 12, 12);
            var jMat = new THREE.MeshStandardMaterial({
              color: idx === 2 || idx === 5 ? 0xef4444 : 0x22c55e, // Highlight defect joints in red
              emissive: idx === 2 || idx === 5 ? 0xef4444 : 0x22c55e,
              emissiveIntensity: 0.9,
            });
            var jMesh = new THREE.Mesh(jGeom, jMat);
            jMesh.position.set(c[0], c[1], c[2]);
            outerBox.add(jMesh);
            jointSpheres.push(jMesh);
          });

          animHooks.push(function (delta, time) {
            outerBox.rotation.y += delta * 0.4;
            outerBox.rotation.x += delta * 0.2;
            innerCore.rotation.y -= delta * 0.6;
            innerCore.rotation.z += delta * 0.3;

            // Laser scanner passes up and down through the tesseract
            scanPlane.position.y = Math.sin(time * 2.0) * 1.3;

            // Defect joints pulse warning
            jointSpheres.forEach(function (j, i) {
              if (i === 2 || i === 5) {
                var p = 1.0 + Math.sin(time * 6) * 0.35;
                j.scale.set(p, p, p);
              }
            });
          });
        })();
        break;

      // ─────────────────────────────────────────────────────────────
      // 7. AVP CHARITABLE TRUST: 3D Golden Eco-Globe & Relief Beacons
      // ─────────────────────────────────────────────────────────────
      case 'trust':
        (function buildTrustGlobe() {
          // Warm Golden Earth Core
          var globeGeom = new THREE.SphereGeometry(1.35, 32, 32);
          var globeMat = new THREE.MeshStandardMaterial({
            color: 0x9f1239,
            metalness: 0.7,
            roughness: 0.3,
            emissive: 0x881337,
            emissiveIntensity: 0.55,
          });
          var globe = new THREE.Mesh(globeGeom, globeMat);
          group.add(globe);

          // Continent / Golden Wireframe Shell
          var wireMat = new THREE.MeshBasicMaterial({
            color: 0xfb7185,
            wireframe: true,
            transparent: true,
            opacity: 0.4,
          });
          var wireGlobe = new THREE.Mesh(new THREE.SphereGeometry(1.38, 24, 24), wireMat);
          group.add(wireGlobe);

          // Glowing Sunburst Relief Rings
          var ringMat = new THREE.MeshBasicMaterial({
            color: 0xf43f5e,
            transparent: true,
            opacity: 0.55,
            side: THREE.DoubleSide,
          });
          var ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.02, 16, 90), ringMat);
          var ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.015, 16, 90), ringMat);
          ring1.rotation.x = Math.PI / 2.5;
          ring2.rotation.y = Math.PI / 3;
          group.add(ring1);
          group.add(ring2);

          // 6 Relief Beacon Nodes on the globe surface
          var beaconSpheres = [];
          for (var b = 0; b < 6; b++) {
            var phi = Math.acos(-1 + (2 * b) / 6);
            var theta = Math.sqrt(6 * Math.PI) * phi;
            var r = 1.4;
            var bm = new THREE.Mesh(
              new THREE.SphereGeometry(0.11, 14, 14),
              new THREE.MeshStandardMaterial({
                color: 0xfde047,
                emissive: 0xeab308,
                emissiveIntensity: 0.95,
              })
            );
            bm.position.set(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
            globe.add(bm);
            beaconSpheres.push(bm);
          }

          animHooks.push(function (delta, time) {
            globe.rotation.y += delta * 0.35;
            wireGlobe.rotation.y += delta * 0.35;
            ring1.rotation.z += delta * 0.3;
            ring2.rotation.x -= delta * 0.25;

            // Beacon pulse
            var pulse = 1.0 + Math.sin(time * 3.5) * 0.25;
            beaconSpheres.forEach(function (bm) {
              bm.scale.set(pulse, pulse, pulse);
            });
          });
        })();
        break;

      // ─────────────────────────────────────────────────────────────
      // 8. AVP EMART: 3D Holographic Shopping Prism & Deals Radar
      // ─────────────────────────────────────────────────────────────
      case 'avp-emart':
        (function buildEmartPrism() {
          // Central Metallic Torus Knot Price Oracle
          var coreGeom = new THREE.TorusKnotGeometry(0.95, 0.28, 128, 20);
          var coreMat = new THREE.MeshStandardMaterial({
            color: 0xf97316,
            metalness: 0.85,
            roughness: 0.2,
            emissive: 0xc2410c,
            emissiveIntensity: 0.55,
          });
          var core = new THREE.Mesh(coreGeom, coreMat);
          group.add(core);

          // Wireframe Prismatic Aura
          var wireMat = new THREE.MeshBasicMaterial({ color: 0xfdba74, wireframe: true, transparent: true, opacity: 0.35 });
          var wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), wireMat);
          group.add(wire);

          // 4 Orbital Brand Platform Satellites (Amazon, Flipkart, Reliance, Snapdeal)
          var storeColors = [0xff9900, 0x2874f0, 0xe11900, 0xe40046];
          var storeNodes = [];
          for (var s = 0; s < 4; s++) {
            var sMesh = new THREE.Mesh(
              new THREE.BoxGeometry(0.24, 0.24, 0.24),
              new THREE.MeshStandardMaterial({
                color: storeColors[s],
                emissive: storeColors[s],
                emissiveIntensity: 0.85,
              })
            );
            group.add(sMesh);
            storeNodes.push({
              mesh: sMesh,
              angle: (s * Math.PI * 2) / 4,
              dist: 2.3,
              speed: 0.6,
            });
          }

          // Concentric Deals Radar Scan Rings
          var radarGeom = new THREE.RingGeometry(1.8, 2.5, 48);
          var radarMat = new THREE.MeshBasicMaterial({
            color: 0xf97316,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
          });
          var radar = new THREE.Mesh(radarGeom, radarMat);
          radar.rotation.x = Math.PI / 2.2;
          group.add(radar);

          animHooks.push(function (delta, time) {
            core.rotation.x += delta * 0.45;
            core.rotation.y += delta * 0.6;
            wire.rotation.y -= delta * 0.25;
            radar.rotation.z += delta * 0.8;

            storeNodes.forEach(function (sn) {
              sn.angle += delta * sn.speed;
              sn.mesh.position.set(Math.cos(sn.angle) * sn.dist, Math.sin(sn.angle * 2) * 0.4, Math.sin(sn.angle) * sn.dist);
              sn.mesh.rotation.y += delta * 2.0;
              sn.mesh.rotation.x += delta * 1.2;
            });
          });
        })();
        break;
    }

    // Main Render Loop with Smooth Camera Mouse Parallax
    var clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      var delta = clock.getDelta();
      var time = clock.getElapsedTime();

      // Smooth mouse parallax lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      camera.position.x = mouse.x * 0.7;
      camera.position.y = mouse.y * 0.5;
      camera.lookAt(0, 0, 0);

      // Starfield subtle rotation
      starField.rotation.y += delta * 0.02;
      starField.rotation.x += delta * 0.01;

      // Platform specific animations
      animHooks.forEach(function (fn) {
        fn(delta, time);
      });

      renderer.render(scene, camera);
    }
    animate();
  }

  // Auto-init on page load
  function init() {
    loadThree(function () {
      initWebGLScene();
    });
    init3DTilt();
    initTextScramble();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
