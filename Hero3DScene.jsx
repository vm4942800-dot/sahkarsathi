import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Hero3DFallback from './Hero3DFallback';

/**
 * Robust WebGL feature detection
 */
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function Hero3DScene() {
  const containerRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    let isVisible = true;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.2, 8.8);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setHasWebGL(false);
      setIsLoading(false);
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // --- 2. Lighting System ---
    // Warm ambient base
    const ambientLight = new THREE.AmbientLight(0xf4f3ef, 1.5);
    scene.add(ambientLight);

    // Main Sunlight Key Light (Casting Soft Shadows)
    const sunLight = new THREE.DirectionalLight(0xfffaec, 2.4);
    sunLight.position.set(7, 11, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    // Teal Fill Light (Opposite side for rich chromatic contrast)
    const fillLight = new THREE.DirectionalLight(0x4f9d92, 1.2);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    // Warm Golden Interior Hearth Light
    const hearthLight = new THREE.PointLight(0xd9b978, 3.0, 7);
    hearthLight.position.set(0, 0.35, 0.3);
    scene.add(hearthLight);

    // Subtle Emerald Rim Light
    const rimLight = new THREE.DirectionalLight(0x5d9b78, 0.8);
    rimLight.position.set(0, -5, -4);
    scene.add(rimLight);

    // --- 3. Master World Group ---
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // --- 4. Premium PBR Materials ---
    const concreteSlateMat = new THREE.MeshStandardMaterial({
      color: 0x202b2b,
      roughness: 0.38,
      metalness: 0.12,
    });

    const warmStuccoMat = new THREE.MeshStandardMaterial({
      color: 0xe9ece8,
      roughness: 0.55,
      metalness: 0.04,
    });

    const cedarWoodMat = new THREE.MeshStandardMaterial({
      color: 0xd9b978,
      roughness: 0.35,
      metalness: 0.08,
    });

    const tealAccentMat = new THREE.MeshStandardMaterial({
      color: 0x4f9d92,
      roughness: 0.25,
      metalness: 0.25,
    });

    const emeraldAccentMat = new THREE.MeshStandardMaterial({
      color: 0x5d9b78,
      roughness: 0.3,
      metalness: 0.2,
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd9b978,
      roughness: 0.18,
      metalness: 0.8,
      emissive: 0x4a3a14,
      emissiveIntensity: 0.25,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.88,
      opacity: 0.85,
      transparent: true,
      roughness: 0.06,
      ior: 1.5,
      reflectivity: 0.6,
    });

    // --- 5. Architectural Modern House Structure ---
    const houseGroup = new THREE.Group();
    worldGroup.add(houseGroup);

    // Stepped Landscaped Plinth / Base
    const plinthBaseGeo = new THREE.CylinderGeometry(2.7, 2.85, 0.24, 36);
    const plinthBase = new THREE.Mesh(plinthBaseGeo, concreteSlateMat);
    plinthBase.position.y = -1.15;
    plinthBase.receiveShadow = true;
    houseGroup.add(plinthBase);

    // Outer Paved Ring (Cooperative boundary track)
    const trackGeo = new THREE.TorusGeometry(3.05, 0.025, 16, 64);
    const trackMat = new THREE.MeshBasicMaterial({ color: 0x4f9d92, transparent: true, opacity: 0.5 });
    const trackMesh = new THREE.Mesh(trackGeo, trackMat);
    trackMesh.rotation.x = Math.PI / 2;
    trackMesh.position.y = -1.2;
    houseGroup.add(trackMesh);

    // Flagstone Entrance Path
    for (let i = 0; i < 4; i++) {
      const stoneGeo = new THREE.BoxGeometry(0.55, 0.04, 0.22);
      const stone = new THREE.Mesh(stoneGeo, warmStuccoMat);
      stone.position.set(-0.2, -1.01, 1.2 + i * 0.32);
      stone.receiveShadow = true;
      houseGroup.add(stone);
    }

    // Ground Floor Living Volume (Warm stucco pavilion)
    const groundFloorGeo = new THREE.BoxGeometry(2.2, 1.15, 1.85);
    const groundFloor = new THREE.Mesh(groundFloorGeo, warmStuccoMat);
    groundFloor.position.set(-0.25, -0.42, 0);
    groundFloor.castShadow = true;
    groundFloor.receiveShadow = true;
    houseGroup.add(groundFloor);

    // Panoramic Salon Glass Window (Reflective)
    const frontWindowGeo = new THREE.BoxGeometry(1.55, 0.82, 0.06);
    const frontWindow = new THREE.Mesh(frontWindowGeo, glassMat);
    frontWindow.position.set(-0.25, -0.42, 0.94);
    houseGroup.add(frontWindow);

    // Cedar Wood Entrance Portal & Vertical Louvers
    const portalGeo = new THREE.BoxGeometry(0.38, 1.18, 0.18);
    const portal = new THREE.Mesh(portalGeo, cedarWoodMat);
    portal.position.set(0.72, -0.4, 0.94);
    portal.castShadow = true;
    houseGroup.add(portal);

    // 4 Architectural Cedar Slats (Sun louvers)
    for (let i = 0; i < 4; i++) {
      const slatGeo = new THREE.BoxGeometry(0.04, 0.85, 0.12);
      const slat = new THREE.Mesh(slatGeo, cedarWoodMat);
      slat.position.set(-0.85 + i * 0.18, -0.42, 0.96);
      slat.castShadow = true;
      houseGroup.add(slat);
    }

    // Upper Floor Cantilever (Modern charcoal slate master volume)
    const upperFloorGeo = new THREE.BoxGeometry(2.0, 1.08, 1.75);
    const upperFloor = new THREE.Mesh(upperFloorGeo, concreteSlateMat);
    upperFloor.position.set(0.32, 0.7, 0.12);
    upperFloor.castShadow = true;
    upperFloor.receiveShadow = true;
    houseGroup.add(upperFloor);

    // Cantilever Balcony Terrace Railing (Glass)
    const terraceRailingGeo = new THREE.BoxGeometry(1.75, 0.42, 0.04);
    const terraceRailing = new THREE.Mesh(terraceRailingGeo, glassMat);
    terraceRailing.position.set(0.32, 0.48, 1.02);
    houseGroup.add(terraceRailing);

    // Upper Panoramic Window
    const upperWindowGeo = new THREE.BoxGeometry(1.65, 0.65, 0.05);
    const upperWindow = new THREE.Mesh(upperWindowGeo, glassMat);
    upperWindow.position.set(0.32, 0.72, 1.0);
    houseGroup.add(upperWindow);

    // Architectural Slanted Roof Pavilion (SahkarSathi Iconic Pitch)
    const roofGeo = new THREE.ConeGeometry(1.68, 0.9, 4);
    const roof = new THREE.Mesh(roofGeo, tealAccentMat);
    roof.position.set(0.32, 1.65, 0.12);
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    houseGroup.add(roof);

    // Golden Community Keystone Spire
    const spireGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8);
    const spire = new THREE.Mesh(spireGeo, goldAccentMat);
    spire.position.set(0.32, 2.18, 0.12);
    houseGroup.add(spire);

    // Landscaped Planter Box with Miniature Green Shrubs
    const planterGeo = new THREE.BoxGeometry(0.85, 0.28, 0.38);
    const planter = new THREE.Mesh(planterGeo, emeraldAccentMat);
    planter.position.set(-1.18, -0.88, 1.15);
    planter.castShadow = true;
    houseGroup.add(planter);

    for (let i = 0; i < 3; i++) {
      const shrubGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const shrub = new THREE.Mesh(shrubGeo, emeraldAccentMat);
      shrub.position.set(-1.42 + i * 0.24, -0.68, 1.15);
      houseGroup.add(shrub);
    }

    // --- 6. The Three Cooperative Ecosystem Actors & Beziers ---
    // Actor 1: Customer Node (Entrance walkway, Soft Teal)
    const customerGroup = new THREE.Group();
    const customerSphere = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), tealAccentMat);
    customerSphere.castShadow = true;
    customerGroup.add(customerSphere);
    const customerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.02, 12, 32),
      new THREE.MeshBasicMaterial({ color: 0x4f9d92, transparent: true, opacity: 0.6 })
    );
    customerRing.rotation.x = Math.PI / 2;
    customerGroup.add(customerRing);
    customerGroup.position.set(-2.2, -0.35, 1.4);
    worldGroup.add(customerGroup);

    // Actor 2: Verified Worker Node (Flank workshop, Emerald)
    const workerGroup = new THREE.Group();
    const workerSphere = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), emeraldAccentMat);
    workerSphere.castShadow = true;
    workerGroup.add(workerSphere);
    const workerRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.02, 12, 32),
      new THREE.MeshBasicMaterial({ color: 0x5d9b78, transparent: true, opacity: 0.6 })
    );
    workerRing.rotation.x = Math.PI / 2;
    workerGroup.add(workerRing);
    workerGroup.position.set(2.35, -0.3, 1.25);
    worldGroup.add(workerGroup);

    // Actor 3: Regional Supervisor Node (Elevated guardian, Warm Gold)
    const supervisorGroup = new THREE.Group();
    const supervisorSphere = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), goldAccentMat);
    supervisorSphere.castShadow = true;
    supervisorGroup.add(supervisorSphere);
    const supervisorBeacon = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.025, 12, 32),
      new THREE.MeshBasicMaterial({ color: 0xd9b978, transparent: true, opacity: 0.7 })
    );
    supervisorBeacon.rotation.x = Math.PI / 2;
    supervisorGroup.add(supervisorBeacon);
    supervisorGroup.position.set(0, 2.3, -1.35);
    worldGroup.add(supervisorGroup);

    // Dynamic Curved Connection Lines (Glowing cooperative arcs)
    const createConnectionArc = (startVec, endVec, colorHex) => {
      const midVec = new THREE.Vector3(
        (startVec.x + endVec.x) * 0.5,
        Math.max(startVec.y, endVec.y) + 0.65,
        (startVec.z + endVec.z) * 0.5
      );
      const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
      const points = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.45,
        linewidth: 1.5,
      });
      return new THREE.Line(lineGeo, lineMat);
    };

    const arcHomeCustomer = createConnectionArc(customerGroup.position, new THREE.Vector3(-0.25, -0.4, 0.5), 0x4f9d92);
    const arcHomeWorker = createConnectionArc(workerGroup.position, new THREE.Vector3(0.5, -0.2, 0.5), 0x5d9b78);
    const arcHomeSupervisor = createConnectionArc(supervisorGroup.position, new THREE.Vector3(0.32, 1.6, 0.12), 0xd9b978);
    worldGroup.add(arcHomeCustomer);
    worldGroup.add(arcHomeWorker);
    worldGroup.add(arcHomeSupervisor);

    // --- 7. Floating Supporting Craft & Trust Tokens ---
    const floatingTokens = [];

    // Verification Shield Token (Floating top left)
    const shieldGroup = new THREE.Group();
    const shieldGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 6);
    const shieldMesh = new THREE.Mesh(shieldGeo, goldAccentMat);
    shieldMesh.rotation.x = Math.PI / 2;
    shieldGroup.add(shieldMesh);
    // 3D checkmark tick
    const tickArm1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, 0.04), concreteSlateMat);
    tickArm1.position.set(-0.05, -0.04, 0.06);
    tickArm1.rotation.z = -Math.PI / 4;
    const tickArm2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.28, 0.04), concreteSlateMat);
    tickArm2.position.set(0.06, 0.02, 0.06);
    tickArm2.rotation.z = Math.PI / 4;
    shieldGroup.add(tickArm1);
    shieldGroup.add(tickArm2);
    shieldGroup.position.set(-2.4, 1.45, 0.7);
    worldGroup.add(shieldGroup);
    floatingTokens.push({ obj: shieldGroup, speed: 1.2, radius: 0.16, offset: 0 });

    // Worker Precision Tool Token (Hex gear & level bar, top right)
    const toolGroup = new THREE.Group();
    const toolGear = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.07, 12, 6), tealAccentMat);
    toolGroup.add(toolGear);
    const toolLevel = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.52, 0.08), cedarWoodMat);
    toolGroup.add(toolLevel);
    toolGroup.position.set(2.5, 1.2, 0.9);
    worldGroup.add(toolGroup);
    floatingTokens.push({ obj: toolGroup, speed: 1.4, radius: 0.18, offset: 1.6 });

    // Geometric Floating Accent Crystals
    const crystals = [
      { geo: new THREE.IcosahedronGeometry(0.18, 0), mat: tealAccentMat, pos: [-2.1, -1.05, -0.8], speed: 1.1, offset: 0.9 },
      { geo: new THREE.OctahedronGeometry(0.2, 0), mat: goldAccentMat, pos: [2.15, 2.05, -1.1], speed: 1.3, offset: 2.5 },
      { geo: new THREE.BoxGeometry(0.22, 0.22, 0.22), mat: emeraldAccentMat, pos: [-1.45, 2.3, 0.85], speed: 1.25, offset: 0.6 },
    ];

    crystals.forEach((c) => {
      const mesh = new THREE.Mesh(c.geo, c.mat);
      mesh.position.set(...c.pos);
      worldGroup.add(mesh);
      floatingTokens.push({ obj: mesh, speed: c.speed, radius: 0.14, offset: c.offset });
    });

    // --- 8. Ambient Sparkle Dust / Starfield ---
    const particleCount = 55;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8.5;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6.5 + 0.6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x4f9d92,
      size: 0.055,
      transparent: true,
      opacity: 0.55,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- 9. Smooth Interaction System (Drag, Hover & Parallax) ---
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let targetRotationX = 0.12;
    let targetRotationY = 0.35;
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      previousPointerX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      previousPointerY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const rect = container.getBoundingClientRect();
      mouseX = (clientX - rect.left) / rect.width - 0.5;
      mouseY = (clientY - rect.top) / rect.height - 0.5;

      if (isDragging) {
        const deltaX = clientX - previousPointerX;
        const deltaY = clientY - previousPointerY;
        targetRotationY += deltaX * 0.007;
        targetRotationX += deltaY * 0.007;
        previousPointerX = clientX;
        previousPointerY = clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Responsive Canvas Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause rendering when scrolled offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // --- 10. Animation Loop ---
    const clock = new THREE.Clock();
    setIsLoading(false);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Gentle vertical floating of the modern residence
      houseGroup.position.y = Math.sin(elapsedTime * 0.85) * 0.09;

      // Pulse actor rings
      customerRing.scale.setScalar(1 + Math.sin(elapsedTime * 2.0) * 0.06);
      workerRing.scale.setScalar(1 + Math.sin(elapsedTime * 2.2 + 1) * 0.06);
      supervisorBeacon.scale.setScalar(1 + Math.sin(elapsedTime * 1.8 + 2) * 0.08);

      // Actor node floating
      customerGroup.position.y = -0.35 + Math.sin(elapsedTime * 1.1) * 0.06;
      workerGroup.position.y = -0.3 + Math.sin(elapsedTime * 1.25 + 1.2) * 0.07;
      supervisorGroup.position.y = 2.3 + Math.sin(elapsedTime * 0.95 + 2.1) * 0.08;

      // Floating craft tokens & crystals
      floatingTokens.forEach((t) => {
        t.obj.position.y += Math.sin(elapsedTime * t.speed + t.offset) * 0.0016;
        t.obj.rotation.x += 0.006;
        t.obj.rotation.y += 0.009;
      });

      // Ambient particle drift
      particleSystem.rotation.y = elapsedTime * 0.025;

      // Damped Lerp for Rotation
      const parallaxTargetY = targetRotationY + (isDragging ? 0 : mouseX * 0.45);
      const parallaxTargetX = targetRotationX + (isDragging ? 0 : mouseY * 0.22);
      const scrollTilt = Math.min(scrollY * 0.00035, 0.22);

      worldGroup.rotation.y += (parallaxTargetY + Math.sin(elapsedTime * 0.3) * 0.06 - worldGroup.rotation.y) * 0.05;
      worldGroup.rotation.x += (parallaxTargetX + scrollTilt - worldGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // --- 11. Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });
    };
  }, []);

  if (!hasWebGL) {
    return <Hero3DFallback />;
  }

  return (
    <div className="relative w-full aspect-square max-w-[580px] mx-auto select-none flex items-center justify-center">
      {/* Background Soft Ambient Light */}
      <div className="absolute inset-0 bg-radial from-brand-teal/20 via-brand-emerald/10 to-transparent rounded-full filter blur-3xl -z-10 pointer-events-none" />

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing transition-opacity duration-700"
        style={{ opacity: isLoading ? 0 : 1 }}
      />

      {/* Interactive Micro Ecosystem Indicators */}
      <div className="absolute bottom-2 left-3 sm:left-4 px-3.5 py-2 rounded-xl glass-card text-brand-primary text-xs font-medium shadow-premium border border-white/80 flex items-center gap-2 pointer-events-none">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald animate-pulse" />
        <span className="font-semibold text-brand-primary">Cooperative Habitat Model</span>
      </div>

      <div className="absolute top-3 right-3 sm:right-4 px-3 py-1.5 rounded-full bg-brand-surface/90 border border-brand-border text-[11px] font-semibold text-brand-secondary shadow-xs pointer-events-none">
        Drag to inspect
      </div>

      {/* Live Active Legend Tag */}
      <div className="absolute -bottom-2 right-4 hidden sm:flex items-center gap-3 text-[10px] text-brand-secondary/80 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-brand-border">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-teal" /> Customer
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-emerald" /> Worker
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-gold" /> Supervisor
        </span>
      </div>
    </div>
  );
}
