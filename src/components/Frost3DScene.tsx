'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Frost3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only render on desktop / laptop screens (width >= 1024px)
    const checkIsDesktop = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      const isTouchOnly = 'ontouchstart' in window && window.innerWidth < 1024;
      return isLargeScreen && !isTouchOnly;
    };

    if (!checkIsDesktop()) {
      setIsDesktop(false);
      return;
    }

    setIsDesktop(true);

    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup for Realistic Chitin Sheen
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xe0f2fe, 3.0);
    sunLight.position.set(12, 16, 12);
    scene.add(sunLight);

    const rimPinkLight = new THREE.DirectionalLight(0xd946ef, 2.5);
    rimPinkLight.position.set(-12, -10, 8);
    scene.add(rimPinkLight);

    // 3. PROCEDURAL REALISTIC BUTTERFLY WING TEXTURES
    // Forewing: Photorealistic Blue Morpho with deep electric cyan, indigo edges, white lunar spots & delicate veins
    const createForewingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      ctx.clearRect(0, 0, 1024, 1024);

      // Wing silhouette
      ctx.beginPath();
      ctx.moveTo(90, 880); // Attachment root
      ctx.bezierCurveTo(160, 480, 360, 120, 840, 70); // Leading edge
      ctx.bezierCurveTo(960, 70, 990, 180, 960, 330); // Wing apex
      ctx.bezierCurveTo(910, 530, 800, 740, 600, 840); // Scalloped outer margin
      ctx.bezierCurveTo(420, 890, 220, 890, 90, 880); // Trailing edge back to base
      ctx.closePath();

      // Iridescent Radial Color Gradient
      const grad = ctx.createRadialGradient(260, 700, 80, 560, 460, 780);
      grad.addColorStop(0, '#e0f2fe');   // Bright frost-white inner core
      grad.addColorStop(0.18, '#38bdf8'); // Radiant Cyan
      grad.addColorStop(0.48, '#2563eb'); // Royal Blue Morpho
      grad.addColorStop(0.72, '#4f46e5'); // Deep Indigo
      grad.addColorStop(0.88, '#1e1b4b'); // Midnight Navy
      grad.addColorStop(1.0, '#05030a');  // Velvet Black margin

      ctx.fillStyle = grad;
      ctx.fill();

      // Outer Dark Velvet Border
      ctx.save();
      ctx.clip();

      ctx.lineWidth = 85;
      ctx.strokeStyle = '#05030a';
      ctx.stroke();

      // Wing Apex Dark Velvet Patch
      const apexGrad = ctx.createRadialGradient(880, 160, 10, 880, 160, 260);
      apexGrad.addColorStop(0, '#05030a');
      apexGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = apexGrad;
      ctx.beginPath();
      ctx.arc(880, 160, 260, 0, Math.PI * 2);
      ctx.fill();

      // Organic Branching Wing Veins
      ctx.strokeStyle = 'rgba(8, 6, 18, 0.78)';
      ctx.lineCap = 'round';
      const rootX = 130;
      const rootY = 850;
      const veins = [
        [810, 130, 520, 340],
        [910, 250, 620, 460],
        [930, 410, 640, 560],
        [870, 580, 600, 680],
        [770, 720, 510, 750],
        [630, 810, 410, 820]
      ];

      veins.forEach(([destX, destY, ctrlX, ctrlY], idx) => {
        ctx.lineWidth = idx === 0 ? 5.0 : 3.2;
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, destX, destY);
        ctx.stroke();

        // Secondary sub-branch
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ctrlX, ctrlY);
        ctx.quadraticCurveTo(ctrlX + 60, ctrlY - 40, destX - 45, destY - 70);
        ctx.stroke();
      });

      // Delicate Pearl-White Lunar Accent Dots along margin
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      const dots = [
        [935, 240, 6.5], [910, 360, 7.5], [860, 480, 7.5], [800, 600, 7], [720, 700, 6], [885, 150, 8], [775, 105, 6.5]
      ];
      dots.forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // Hindwing: Scalloped lower wing with swallowtail curves & luminous ring patterns
    const createHindwingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      ctx.clearRect(0, 0, 1024, 1024);

      // Scalloped Hindwing Silhouette
      ctx.beginPath();
      ctx.moveTo(270, 130);
      ctx.bezierCurveTo(480, 110, 740, 170, 890, 290);
      ctx.bezierCurveTo(950, 430, 930, 640, 810, 790);
      ctx.bezierCurveTo(750, 870, 690, 970, 590, 990); // Scalloped tail lobe
      ctx.bezierCurveTo(490, 970, 430, 890, 390, 790);
      ctx.bezierCurveTo(310, 630, 230, 390, 270, 130);
      ctx.closePath();

      // Gradient
      const grad = ctx.createRadialGradient(420, 360, 60, 540, 540, 660);
      grad.addColorStop(0, '#bae6fd');
      grad.addColorStop(0.25, '#0284c7');
      grad.addColorStop(0.55, '#4338ca');
      grad.addColorStop(0.85, '#1e1b4b');
      grad.addColorStop(1.0, '#05030a');

      ctx.fillStyle = grad;
      ctx.fill();

      ctx.save();
      ctx.clip();

      // Velvet border
      ctx.lineWidth = 75;
      ctx.strokeStyle = '#05030a';
      ctx.stroke();

      // Hindwing Veins
      ctx.strokeStyle = 'rgba(8, 6, 18, 0.75)';
      const rootX = 310;
      const rootY = 230;
      const hindVeins = [
        [830, 370, 630, 270],
        [850, 530, 650, 430],
        [770, 730, 610, 590],
        [590, 950, 490, 690],
        [430, 810, 370, 610]
      ];
      hindVeins.forEach(([destX, destY, ctrlX, ctrlY]) => {
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, destX, destY);
        ctx.stroke();
      });

      // White lunar spots
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 7;
      const dots = [
        [870, 390, 5.5], [860, 490, 6.5], [810, 630, 6.5], [730, 750, 6.5], [580, 890, 5.5], [430, 760, 5]
      ];
      dots.forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const forewingTexture = createForewingTexture();
    const hindwingTexture = createHindwingTexture();

    // 4. CURVED 3D WING GEOMETRY (Natural aerodynamic camber, not flat 2D)
    const createCurvedWingGeo = (width: number, height: number, camber: number) => {
      const geo = new THREE.PlaneGeometry(width, height, 16, 16);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const nx = (x + width / 2) / width;
        const ny = (y + height / 2) / height;
        // Natural curved arch across wing chord and span
        const z = camber * Math.sin(nx * Math.PI) * Math.cos(ny * Math.PI * 0.5);
        pos.setZ(i, z);
      }
      geo.computeVertexNormals();
      return geo;
    };

    // Forewing & Hindwing geometries (offset so origin (0,0) is at body hinge)
    const forewingGeo = createCurvedWingGeo(2.2, 2.4, 0.22);
    forewingGeo.translate(1.05, 0.95, 0);

    const hindwingGeo = createCurvedWingGeo(1.6, 1.8, 0.16);
    hindwingGeo.translate(0.72, -0.65, -0.04);

    // Realistic Translucent Chitin Wing Materials with Clearcoat Sheen
    const forewingMat = new THREE.MeshPhysicalMaterial({
      map: forewingTexture,
      transparent: true,
      alphaTest: 0.04,
      roughness: 0.22,
      metalness: 0.35,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });

    const hindwingMat = new THREE.MeshPhysicalMaterial({
      map: hindwingTexture,
      transparent: true,
      alphaTest: 0.04,
      roughness: 0.22,
      metalness: 0.35,
      clearcoat: 0.85,
      clearcoatRoughness: 0.18,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });

    // 5. BUTTERFLY HIERARCHY & 4-WING ARTICULATION
    const butterflyRoot = new THREE.Group();
    scene.add(butterflyRoot);

    // Internal Glow Light (radiates soft cyan light from body onto wings)
    const coreLight = new THREE.PointLight(0x38bdf8, 2.2, 7);
    coreLight.position.set(0, 0, 0.1);
    butterflyRoot.add(coreLight);

    // Segmented Velvet Body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a14,
      roughness: 0.45,
      metalness: 0.6,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.4
    });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.0,
      roughness: 0.1,
      metalness: 0.9
    });

    // Head
    const headGeo = new THREE.SphereGeometry(0.14, 16, 16);
    headGeo.scale(1.0, 1.1, 0.9);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 0.36, 0.05);
    butterflyRoot.add(head);

    // Compound Eyes
    const eyeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.065, 0.40, 0.11);
    butterflyRoot.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.065, 0.40, 0.11);
    butterflyRoot.add(rightEye);

    // Thorax (Wings anchor here)
    const thoraxGeo = new THREE.SphereGeometry(0.18, 16, 16);
    thoraxGeo.scale(0.85, 1.25, 0.75);
    const thorax = new THREE.Mesh(thoraxGeo, bodyMat);
    thorax.position.set(0, 0.08, 0.02);
    butterflyRoot.add(thorax);

    // Segmented Abdomen (Gently curved cone)
    const abdomenGeo = new THREE.ConeGeometry(0.12, 0.75, 16);
    abdomenGeo.rotateX(Math.PI);
    abdomenGeo.scale(0.9, 1.0, 0.8);
    const abdomen = new THREE.Mesh(abdomenGeo, bodyMat);
    abdomen.position.set(0, -0.42, -0.04);
    abdomen.rotation.x = 0.15; // Natural downward curve
    butterflyRoot.add(abdomen);

    // Antennae (Curved tubes with club tips)
    const createAntenna = (isLeft: boolean) => {
      const group = new THREE.Group();
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.08 : -0.08, 0.18, 0.12),
        new THREE.Vector3(isLeft ? 0.22 : -0.22, 0.42, 0.24),
        new THREE.Vector3(isLeft ? 0.32 : -0.32, 0.52, 0.20)
      );
      const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.012, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
      const stalk = new THREE.Mesh(tubeGeo, tubeMat);
      group.add(stalk);

      // Club tip
      const tipGeo = new THREE.SphereGeometry(0.028, 8, 8);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.copy(curve.getPoint(1));
      group.add(tip);

      group.position.set(isLeft ? 0.04 : -0.04, 0.42, 0.08);
      return group;
    };

    butterflyRoot.add(createAntenna(true));
    butterflyRoot.add(createAntenna(false));

    // 4-WING INDEPENDENT HINGES (True biomechanics with phase lag)
    // Left Forewing
    const leftForewingHinge = new THREE.Group();
    leftForewingHinge.position.set(0.06, 0.16, 0.05);
    const leftForewingMesh = new THREE.Mesh(forewingGeo, forewingMat);
    leftForewingHinge.add(leftForewingMesh);
    butterflyRoot.add(leftForewingHinge);

    // Left Hindwing
    const leftHindwingHinge = new THREE.Group();
    leftHindwingHinge.position.set(0.05, -0.04, 0.02);
    const leftHindwingMesh = new THREE.Mesh(hindwingGeo, hindwingMat);
    leftHindwingHinge.add(leftHindwingMesh);
    butterflyRoot.add(leftHindwingHinge);

    // Right Forewing (Mirrored along X)
    const rightForewingHinge = new THREE.Group();
    rightForewingHinge.position.set(-0.06, 0.16, 0.05);
    const rightForewingContainer = new THREE.Group();
    rightForewingContainer.scale.set(-1, 1, 1);
    rightForewingContainer.add(new THREE.Mesh(forewingGeo, forewingMat));
    rightForewingHinge.add(rightForewingContainer);
    butterflyRoot.add(rightForewingHinge);

    // Right Hindwing (Mirrored along X)
    const rightHindwingHinge = new THREE.Group();
    rightHindwingHinge.position.set(-0.05, -0.04, 0.02);
    const rightHindwingContainer = new THREE.Group();
    rightHindwingContainer.scale.set(-1, 1, 1);
    rightHindwingContainer.add(new THREE.Mesh(hindwingGeo, hindwingMat));
    rightHindwingHinge.add(rightHindwingContainer);
    butterflyRoot.add(rightHindwingHinge);

    // Scaled to elegant, lifelike size
    butterflyRoot.scale.set(0.9, 0.9, 0.9);

    // 6. MAGICAL FROST SPARKLE TRAIL
    const trailCount = 50;
    const trailPositions = new Float32Array(trailCount * 3);
    for (let i = 0; i < trailCount * 3; i++) trailPositions[i] = -999;

    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

    const trailMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.15,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const trailPoints = new THREE.Points(trailGeo, trailMat);
    scene.add(trailPoints);

    // 7. REALISTIC BIOMECHANICAL FLIGHT AERODYNAMICS & SCROLL DYNAMICS
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let prevScrollProgress = 0;
    let scrollVelocity = 0;

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onScroll = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    // Calculate Dynamic Flight Path Anchored in Side Rails
    const getFlightWaypoints = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const vHalfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const vHalfWidth = vHalfHeight * aspect;

      // Safe rail coordinates (comfortably away from central 1280px / 896px containers)
      const rightRailX = Math.min(vHalfWidth - 1.8, Math.max(7.2, vHalfWidth * 0.72));
      const leftRailX = -rightRailX;

      return [
        new THREE.Vector3(rightRailX, 3.8, 0.4),         // 0.0: Top Hero right rail
        new THREE.Vector3(rightRailX - 0.6, 1.2, 0.8),   // 0.2: Gliding down right
        new THREE.Vector3(leftRailX + 0.8, -1.0, 0.2),    // 0.4: Sweeping banking turn to left rail
        new THREE.Vector3(leftRailX, -3.2, 0.6),         // 0.6: About creator left rail
        new THREE.Vector3(rightRailX - 0.5, -4.8, 0.0),  // 0.8: Videos section right rail
        new THREE.Vector3(rightRailX, -6.6, -0.4)        // 1.0: Community footer rail
      ];
    };

    let flightCurve = new THREE.CatmullRomCurve3(getFlightWaypoints());

    const onResize = () => {
      if (!checkIsDesktop()) {
        setIsDesktop(false);
        return;
      }
      setIsDesktop(true);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      flightCurve = new THREE.CatmullRomCurve3(getFlightWaypoints());
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    // 8. PHYSICS SIMULATION LOOP (Inertia, Flap Lift, Air Drag, Banking)
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let flapPhase = 0;
    let trailIndex = 0;

    // Current physics state
    const currentPos = new THREE.Vector3(7.5, 3.8, 0);
    const velocity = new THREE.Vector3();
    const targetPos = new THREE.Vector3();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth scroll tracking with velocity
      prevScrollProgress = scrollProgress;
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;
      scrollVelocity = Math.abs(scrollProgress - prevScrollProgress) * 60;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Base target along 3D flight path
      const clampedP = Math.min(0.999, Math.max(0.001, scrollProgress));
      const pathPos = flightCurve.getPoint(clampedP);
      const pathTangent = flightCurve.getTangent(clampedP);

      // Natural Organic Wind Turbulence & Harmonic Hover
      // Real butterflies have micro-aerodynamic fluctuations
      const flutterNoiseX = Math.sin(elapsed * 2.1) * 0.22 + Math.cos(elapsed * 3.7) * 0.08;
      const flutterNoiseY = Math.cos(elapsed * 2.6) * 0.20 + Math.sin(elapsed * 4.3) * 0.06;
      const flutterNoiseZ = Math.sin(elapsed * 1.8) * 0.15;

      targetPos.copy(pathPos);
      targetPos.x += flutterNoiseX + mouseX * 0.35;
      targetPos.y += flutterNoiseY - mouseY * 0.25;
      targetPos.z += flutterNoiseZ;

      // SPRING-DAMPER AERODYNAMIC DRONE PHYSICS (Smooth inertia & momentum)
      const springK = 0.045;
      const drag = 0.88;

      velocity.x += (targetPos.x - currentPos.x) * springK;
      velocity.y += (targetPos.y - currentPos.y) * springK;
      velocity.z += (targetPos.z - currentPos.z) * springK;

      velocity.multiplyScalar(drag);
      currentPos.add(velocity);

      // DYNAMIC WING BEAT FREQUENCY (Flaps vigorously on scroll, lazy flutter on rest)
      const baseFrequency = 5.2;
      const flapFrequency = baseFrequency + Math.min(10.0, scrollVelocity * 16.0);
      flapPhase += flapFrequency * 0.016;

      // Biomechanical Downstroke Lift Reaction
      // On downstroke, air is pushed down -> body bobs UP!
      const downstrokeLift = Math.max(0, -Math.cos(flapPhase)) * 0.09;
      currentPos.y += downstrokeLift;

      butterflyRoot.position.copy(currentPos);

      // 4-WING ASYMMETRIC HARMONIC FLAPPING
      // Forewings lead, Hindwings follow with natural 0.28 rad phase lag!
      const maxForewingAngle = 0.72 + Math.min(0.35, scrollVelocity * 0.5);
      const forewingFlap = Math.sin(flapPhase) * maxForewingAngle;
      const hindwingFlap = Math.sin(flapPhase - 0.28) * (maxForewingAngle * 0.88);

      // Wing feathering / aero twist on Z axis
      const forewingTwist = Math.cos(flapPhase) * 0.12;

      // Left wings
      leftForewingHinge.rotation.y = forewingFlap;
      leftForewingHinge.rotation.z = forewingTwist;
      leftHindwingHinge.rotation.y = hindwingFlap;

      // Right wings (symmetrical mirror)
      rightForewingHinge.rotation.y = -forewingFlap;
      rightForewingHinge.rotation.z = -forewingTwist;
      rightHindwingHinge.rotation.y = -hindwingFlap;

      // NATURAL FLIGHT ROTATION & BANKING
      // Butterfly points along travel direction and rolls into turns
      const speedHoriz = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
      const targetPitch = Math.atan2(velocity.y + pathTangent.y * 0.3, Math.max(0.01, speedHoriz)) * 0.45;
      const targetYaw = Math.atan2(velocity.x + pathTangent.x * 0.4, 1.0) * 0.6 + mouseX * 0.2;
      const targetRoll = -velocity.x * 1.4 + Math.sin(elapsed * 2.2) * 0.06;

      butterflyRoot.rotation.x += (targetPitch + 0.12 - downstrokeLift * 1.5 - butterflyRoot.rotation.x) * 0.08;
      butterflyRoot.rotation.y += (targetYaw - butterflyRoot.rotation.y) * 0.08;
      butterflyRoot.rotation.z += (targetRoll - butterflyRoot.rotation.z) * 0.08;

      // Abdomen subtle inertial sway
      abdomen.rotation.x = 0.15 - velocity.y * 0.4;
      abdomen.rotation.y = -velocity.x * 0.3;

      // EMIT FROST SPARKLE TRAIL FROM WINGTIPS
      if (Math.random() < 0.35 + scrollVelocity * 0.4) {
        trailIndex = (trailIndex + 1) % trailCount;
        const side = Math.random() > 0.5 ? 0.35 : -0.35;
        trailPositions[trailIndex * 3] = currentPos.x + side;
        trailPositions[trailIndex * 3 + 1] = currentPos.y - 0.1;
        trailPositions[trailIndex * 3 + 2] = currentPos.z - 0.08;
      }

      // Drift and dissolve trail
      const posAttr = trailGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < trailCount; i++) {
        if (trailPositions[i * 3] > -900) {
          trailPositions[i * 3 + 1] -= 0.014; // Sinks gently
          trailPositions[i * 3 + 2] -= 0.024; // Drifts backwards
        }
      }
      posAttr.needsUpdate = true;

      // Subtle Camera Parallax
      camera.position.x = mouseX * 0.35;
      camera.position.y = -mouseY * 0.35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose geometries, textures & materials
      [forewingGeo, hindwingGeo, headGeo, eyeGeo, thoraxGeo, abdomenGeo, trailGeo].forEach(g => g.dispose());
      [forewingTexture, hindwingTexture].forEach(t => t.dispose());
      [forewingMat, hindwingMat, bodyMat, eyeMat, trailMat].forEach(m => m.dispose());

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-10 hidden lg:block overflow-hidden transition-opacity duration-1000"
      style={{
        opacity: isDesktop ? 1 : 0,
        display: isDesktop ? 'block' : 'none'
      }}
    />
  );
}
