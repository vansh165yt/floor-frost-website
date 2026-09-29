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

    // 1. Scene, Camera & WebGL Renderer
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
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // 2. High-Fidelity Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const keySunLight = new THREE.DirectionalLight(0xffffff, 3.6);
    keySunLight.position.set(12, 18, 14);
    scene.add(keySunLight);

    const rimCyanLight = new THREE.DirectionalLight(0x38bdf8, 2.6);
    rimCyanLight.position.set(-14, -10, 10);
    scene.add(rimCyanLight);

    const fillVioletLight = new THREE.DirectionalLight(0xc084fc, 1.8);
    fillVioletLight.position.set(0, -12, -6);
    scene.add(fillVioletLight);

    // 3. ULTRA-DETAILED 1024x1024 WING TEXTURE (EXACT MATCH TO REFERENCE IMAGE)
    // Features: Vibrant electric cyan center radiating into royal cobalt blue, thick black borders,
    // stained-glass radial veins, discal cell, 3 apex blue streaks, and scalloped white dots!
    const createReferenceWingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      ctx.clearRect(0, 0, 1024, 1024);

      // Base Gradient: White core highlight -> Electric Cyan -> Royal Cobalt -> Deep Navy -> Black
      const baseGrad = ctx.createRadialGradient(240, 640, 40, 520, 500, 720);
      baseGrad.addColorStop(0, '#f0f9ff');   // Core highlight
      baseGrad.addColorStop(0.18, '#00e5ff'); // Electric Vibrant Cyan (Matching reference image!)
      baseGrad.addColorStop(0.42, '#0284c7'); // Bright Blue
      baseGrad.addColorStop(0.68, '#1d4ed8'); // Royal Cobalt Blue
      baseGrad.addColorStop(0.86, '#1e3a8a'); // Deep Navy
      baseGrad.addColorStop(1.0, '#09090b');  // Velvet Black

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Stained-Glass Wing Cells Luminous Highlights
      const cellHighlights = [
        { x: 380, y: 550, rx: 90, ry: 45, rot: -0.35, color: '#38bdf8' },
        { x: 520, y: 440, rx: 110, ry: 40, rot: -0.42, color: '#00e5ff' },
        { x: 620, y: 350, rx: 110, ry: 35, rot: -0.48, color: '#00e5ff' },
        { x: 680, y: 260, rx: 100, ry: 30, rot: -0.52, color: '#38bdf8' },
        { x: 580, y: 580, rx: 95, ry: 38, rot: -0.15, color: '#00e5ff' },
        { x: 540, y: 700, rx: 85, ry: 35, rot: 0.15, color: '#00e5ff' },
        { x: 440, y: 800, rx: 75, ry: 32, rot: 0.40, color: '#38bdf8' },
        { x: 340, y: 860, rx: 65, ry: 30, rot: 0.60, color: '#0284c7' }
      ];

      cellHighlights.forEach(c => {
        const cg = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.rx);
        cg.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
        cg.addColorStop(0.4, c.color);
        cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.rx, c.ry, c.rot, 0, Math.PI * 2);
        ctx.fill();
      });

      // Thick Solid Black Borders (As seen in the reference image)
      // Top leading edge solid black band
      const topBand = ctx.createLinearGradient(0, 0, 0, 200);
      topBand.addColorStop(0, '#09090b');
      topBand.addColorStop(0.75, '#09090b');
      topBand.addColorStop(1, 'transparent');
      ctx.fillStyle = topBand;
      ctx.fillRect(0, 0, 1024, 200);

      // Outer right margin thick black band
      const rightBand = ctx.createLinearGradient(720, 0, 1024, 0);
      rightBand.addColorStop(0, 'transparent');
      rightBand.addColorStop(0.4, 'rgba(9, 9, 11, 0.7)');
      rightBand.addColorStop(0.7, '#09090b');
      rightBand.addColorStop(1, '#09090b');
      ctx.fillStyle = rightBand;
      ctx.fillRect(720, 0, 304, 1024);

      // Bottom hindwing scalloped margin black band
      const bottomBand = ctx.createLinearGradient(0, 750, 0, 1024);
      bottomBand.addColorStop(0, 'transparent');
      bottomBand.addColorStop(0.5, 'rgba(9, 9, 11, 0.85)');
      bottomBand.addColorStop(0.8, '#09090b');
      bottomBand.addColorStop(1, '#09090b');
      ctx.fillStyle = bottomBand;
      ctx.fillRect(0, 750, 1024, 274);

      // Inner root dark shadow
      const rootShadow = ctx.createRadialGradient(80, 680, 20, 80, 680, 180);
      rootShadow.addColorStop(0, '#09090b');
      rootShadow.addColorStop(0.8, 'rgba(9, 9, 11, 0.6)');
      rootShadow.addColorStop(1, 'transparent');
      ctx.fillStyle = rootShadow;
      ctx.fillRect(0, 500, 260, 360);

      // Apex Isolated Glowing Blue Streaks (Exact signature from reference image!)
      ctx.save();
      const apexStreaks = [
        { startX: 840, startY: 85, endX: 950, endY: 150, width: 22, color: '#38bdf8' },
        { startX: 830, startY: 140, endX: 935, endY: 230, width: 20, color: '#00e5ff' },
        { startX: 810, startY: 210, endX: 910, endY: 300, width: 18, color: '#0284c7' }
      ];

      apexStreaks.forEach(s => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(s.startX, s.startY);
        ctx.quadraticCurveTo((s.startX + s.endX) / 2 + 15, (s.startY + s.endY) / 2 - 10, s.endX, s.endY);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = s.width * 0.35;
        ctx.beginPath();
        ctx.moveTo(s.startX + 10, s.startY + 5);
        ctx.quadraticCurveTo((s.startX + s.endX) / 2 + 15, (s.startY + s.endY) / 2 - 10, s.endX - 10, s.endY - 5);
        ctx.stroke();
      });
      ctx.restore();

      // Bold Branching Black Vein Framework (Matching reference image)
      ctx.strokeStyle = '#09090b';
      ctx.lineCap = 'round';
      const rootX = 110, rootY = 660;

      // Discal Cell outline (central oval closed loop near base)
      ctx.lineWidth = 6.0;
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      ctx.bezierCurveTo(240, 520, 380, 480, 410, 560);
      ctx.bezierCurveTo(400, 630, 260, 660, rootX, rootY);
      ctx.stroke();

      // Radiating veins from discal cell to outer margin
      const veins = [
        { startX: 410, startY: 520, ctrlX: 580, ctrlY: 320, endX: 880, endY: 170, w: 5.5 },
        { startX: 410, startY: 550, ctrlX: 630, ctrlY: 410, endX: 930, endY: 280, w: 5.0 },
        { startX: 400, startY: 580, ctrlX: 660, ctrlY: 500, endX: 950, endY: 420, w: 5.0 },
        { startX: 380, startY: 610, ctrlX: 640, ctrlY: 590, endX: 910, endY: 570, w: 4.8 },
        { startX: 300, startY: 650, ctrlX: 580, ctrlY: 670, endX: 860, endY: 700, w: 6.0 },
        { startX: 250, startY: 670, ctrlX: 500, ctrlY: 760, endX: 780, endY: 820, w: 4.8 },
        { startX: 200, startY: 680, ctrlX: 430, ctrlY: 830, endX: 660, endY: 920, w: 4.5 },
        { startX: 160, startY: 690, ctrlX: 330, ctrlY: 870, endX: 500, endY: 970, w: 4.2 },
        { startX: 120, startY: 700, ctrlX: 240, ctrlY: 880, endX: 360, endY: 980, w: 4.0 }
      ];

      veins.forEach(v => {
        ctx.lineWidth = v.w;
        ctx.beginPath();
        ctx.moveTo(v.startX, v.startY);
        ctx.quadraticCurveTo(v.ctrlX, v.ctrlY, v.endX, v.endY);
        ctx.stroke();

        ctx.lineWidth = v.w * 0.6;
        ctx.beginPath();
        ctx.moveTo(v.ctrlX + 60, v.ctrlY + 10);
        ctx.quadraticCurveTo(v.ctrlX + 110, v.ctrlY - 20, v.endX - 10, v.endY - 45);
        ctx.stroke();
      });

      // Scalloped Outer Margin Lunar White Dots (As seen in reference image)
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 8;
      const marginDots = [
        [930, 310, 5], [945, 410, 5], [925, 510, 5.5], [885, 620, 5.5],
        [825, 730, 5], [745, 830, 5], [645, 905, 5], [530, 960, 4.5], [410, 975, 4]
      ];
      marginDots.forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
      return texture;
    };

    const wingTexture = createReferenceWingTexture();

    // 4. UNIFIED SINGLE WING SILHOUETTE (EXACTLY 2 WINGS: 1 LEFT, 1 RIGHT)
    const createSingleWingShape = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);

      // Leading Edge (Sweeps upward to forewing apex)
      shape.bezierCurveTo(0.25, 0.7, 0.8, 1.8, 1.5, 2.5);
      shape.bezierCurveTo(1.8, 2.85, 2.3, 3.05, 2.75, 2.9); // Forewing Apex

      // Forewing Outer Margin (Curving down with subtle scallops)
      shape.bezierCurveTo(3.0, 2.55, 3.05, 1.9, 2.75, 1.3);
      shape.bezierCurveTo(2.45, 0.8, 2.15, 0.4, 1.85, 0.15); // Outer notch between wings

      // Hindwing Outer Margin (Fan-shaped scalloped curve)
      shape.bezierCurveTo(2.15, -0.2, 2.35, -0.7, 2.25, -1.3);
      shape.bezierCurveTo(2.15, -1.9, 1.75, -2.4, 1.25, -2.25); // Hindwing lower lobe

      // Hindwing Inner Margin (Returning to body root)
      shape.bezierCurveTo(0.75, -1.95, 0.35, -1.2, 0.1, -0.5);
      shape.bezierCurveTo(0.04, -0.2, 0.01, -0.08, 0, 0);

      return shape;
    };

    const singleWingShape = createSingleWingShape();
    const wingGeo = new THREE.ShapeGeometry(singleWingShape, 24);

    // Normalize UV coordinates perfectly across the wing geometry
    wingGeo.computeBoundingBox();
    const bb = wingGeo.boundingBox!;
    const sizeX = bb.max.x - bb.min.x;
    const sizeY = bb.max.y - bb.min.y;

    const uvs = wingGeo.attributes.uv;
    const pos = wingGeo.attributes.position;
    const baseZ = new Float32Array(pos.count);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      uvs.setXY(i, (x - bb.min.x) / sizeX, (y - bb.min.y) / sizeY);

      // Natural 3D camber arch across wing chord
      const nx = (x - bb.min.x) / sizeX;
      const ny = (y - bb.min.y) / sizeY;
      const camberZ = 0.22 * Math.sin(nx * Math.PI) * Math.cos(ny * Math.PI * 0.6);
      pos.setZ(i, camberZ);
      baseZ[i] = camberZ;
    }
    uvs.needsUpdate = true;
    pos.needsUpdate = true;
    wingGeo.computeVertexNormals();

    // High-End Chitin Wing Material (Vivid, Solid & Glossy Clearcoat Sheen)
    const wingMat = new THREE.MeshPhysicalMaterial({
      map: wingTexture,
      roughness: 0.24,
      metalness: 0.45,
      clearcoat: 0.95,
      clearcoatRoughness: 0.12,
      emissive: 0x0284c7,
      emissiveIntensity: 0.38,
      side: THREE.DoubleSide
    });

    // 5. BUTTERFLY BODY & HIERARCHY (Matching reference image)
    const butterflyRoot = new THREE.Group();
    scene.add(butterflyRoot);

    // Dynamic Core Cyan Light
    const coreLight = new THREE.PointLight(0x38bdf8, 2.8, 8);
    coreLight.position.set(0, 0, 0.2);
    butterflyRoot.add(coreLight);

    // Velvet Black Body Material with Micro Chitin Sheen
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x09070f,
      roughness: 0.5,
      metalness: 0.6,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.35
    });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.2,
      roughness: 0.05,
      metalness: 0.95
    });

    // Head Group
    const headGroup = new THREE.Group();
    const headGeo = new THREE.SphereGeometry(0.15, 16, 16);
    headGeo.scale(1.0, 1.15, 0.95);
    const head = new THREE.Mesh(headGeo, bodyMat);
    headGroup.add(head);

    // Compound Eyes
    const eyeGeo = new THREE.SphereGeometry(0.05, 14, 14);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.07, 0.05, 0.09);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.07, 0.05, 0.09);
    headGroup.add(rightEye);

    // Curled Spiral Proboscis
    const proboscisCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, -0.05, 0.08),
      new THREE.Vector3(0, -0.16, 0.16),
      new THREE.Vector3(0, -0.12, 0.03),
      new THREE.Vector3(0, -0.06, 0.06)
    );
    const proboscisGeo = new THREE.TubeGeometry(proboscisCurve, 14, 0.009, 6, false);
    const proboscis = new THREE.Mesh(proboscisGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    headGroup.add(proboscis);

    // Antennae (Matching reference: 2 slender black antennae in narrow V-shape)
    const createAntenna = (isLeft: boolean) => {
      const antGroup = new THREE.Group();
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.09 : -0.09, 0.22, 0.16),
        new THREE.Vector3(isLeft ? 0.26 : -0.26, 0.48, 0.28),
        new THREE.Vector3(isLeft ? 0.38 : -0.38, 0.58, 0.24)
      );
      const tubeGeo = new THREE.TubeGeometry(curve, 18, 0.012, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
      antGroup.add(new THREE.Mesh(tubeGeo, tubeMat));

      const tipGeo = new THREE.SphereGeometry(0.035, 10, 10);
      tipGeo.scale(0.8, 1.4, 0.8);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.copy(curve.getPoint(1));
      antGroup.add(tip);

      antGroup.position.set(isLeft ? 0.05 : -0.05, 0.06, 0.04);
      return antGroup;
    };

    headGroup.add(createAntenna(true));
    headGroup.add(createAntenna(false));
    headGroup.position.set(0, 0.40, 0.05);
    butterflyRoot.add(headGroup);

    // Thorax (Stout, velvety center where the 2 wings attach)
    const thoraxGeo = new THREE.SphereGeometry(0.20, 16, 16);
    thoraxGeo.scale(0.85, 1.35, 0.78);
    const thorax = new THREE.Mesh(thoraxGeo, bodyMat);
    thorax.position.set(0, 0.08, 0.02);
    butterflyRoot.add(thorax);

    // 6 Folded Legs beneath thorax
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const createLeg = (isLeft: boolean, yOffset: number) => {
      const legGroup = new THREE.Group();
      const legCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.13 : -0.13, -0.08, -0.06),
        new THREE.Vector3(isLeft ? 0.15 : -0.15, -0.18, -0.12),
        new THREE.Vector3(isLeft ? 0.09 : -0.09, -0.25, -0.08)
      );
      const legGeo = new THREE.TubeGeometry(legCurve, 8, 0.009, 6, false);
      legGroup.add(new THREE.Mesh(legGeo, legMat));
      legGroup.position.set(isLeft ? 0.07 : -0.07, yOffset, -0.04);
      return legGroup;
    };

    [-0.04, 0.06, 0.16].forEach((yOff) => {
      butterflyRoot.add(createLeg(true, yOff));
      butterflyRoot.add(createLeg(false, yOff));
    });

    // Articulated Abdomen (Slender, tapered black needle-like abdomen)
    const abdomenGroup = new THREE.Group();
    const abdomenGeo = new THREE.ConeGeometry(0.13, 0.82, 16);
    abdomenGeo.rotateX(Math.PI);
    abdomenGeo.scale(0.9, 1.0, 0.8);
    const abdomen = new THREE.Mesh(abdomenGeo, bodyMat);
    abdomen.position.set(0, -0.40, 0);
    abdomenGroup.add(abdomen);
    abdomenGroup.position.set(0, -0.04, -0.03);
    butterflyRoot.add(abdomenGroup);

    // ----------------------------------------------------
    // EXACTLY 2 WINGS: LEFT WING HINGE & RIGHT WING HINGE!
    // ----------------------------------------------------
    // 1. LEFT WING (Single unified mesh on left hinge)
    const leftWingHinge = new THREE.Group();
    leftWingHinge.position.set(0.08, 0.06, 0.04);
    const leftWingMesh = new THREE.Mesh(wingGeo, wingMat);
    leftWingHinge.add(leftWingMesh);
    butterflyRoot.add(leftWingHinge);

    // 2. RIGHT WING (Single unified mesh mirrored on right hinge)
    const rightWingHinge = new THREE.Group();
    rightWingHinge.position.set(-0.08, 0.06, 0.04);
    const rightWingContainer = new THREE.Group();
    rightWingContainer.scale.set(-1, 1, 1); // Mirrored along X
    rightWingContainer.add(new THREE.Mesh(wingGeo, wingMat));
    rightWingHinge.add(rightWingContainer);
    butterflyRoot.add(rightWingHinge);

    // Overall Butterfly Scale
    butterflyRoot.scale.set(0.95, 0.95, 0.95);

    // 6. MAGICAL FROST SPARKLE TRAIL PARTICLES
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

    // 7. REALISTIC FLIGHT AERODYNAMICS & SCROLL DYNAMICS
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let prevScrollProgress = 0;
    let scrollVelocity = 0;
    let scrollDirection = 0; // -1 for ascending (up), +1 for descending (down), 0 for hovering

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

    // Calculate Dynamic Flight Path Anchored in Side Rails (Never covers center content)
    const getFlightWaypoints = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const vHalfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const vHalfWidth = vHalfHeight * aspect;

      const rightRailX = Math.min(vHalfWidth - 1.8, Math.max(7.2, vHalfWidth * 0.72));
      const leftRailX = -rightRailX;

      return [
        new THREE.Vector3(rightRailX, 3.8, 0.4),        // 0.0: Top Hero right rail
        new THREE.Vector3(rightRailX - 0.6, 1.2, 0.8),  // 0.2: Gliding down right
        new THREE.Vector3(leftRailX + 0.8, -1.0, 0.2),   // 0.4: Sweeping banking turn to left rail
        new THREE.Vector3(leftRailX, -3.2, 0.6),        // 0.6: About creator left rail
        new THREE.Vector3(rightRailX - 0.5, -4.8, 0.0), // 0.8: Videos section right rail
        new THREE.Vector3(rightRailX, -6.6, -0.4)       // 1.0: Community footer rail
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

    // 8. BIOMECHANICAL FLIGHT SIMULATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let flapPhase = 0;
    let trailIndex = 0;

    // Physics vectors
    const currentPos = new THREE.Vector3(7.5, 3.8, 0);
    const velocity = new THREE.Vector3();
    const targetPos = new THREE.Vector3();

    // Flight attitude
    let currentPitch = 0;
    let currentYaw = 0;
    let currentRoll = 0;
    let turnRate = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Track scroll delta & direction (+1 = user scrolling down, -1 = user scrolling up)
      const scrollDelta = targetScrollProgress - scrollProgress;
      prevScrollProgress = scrollProgress;
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.06;
      scrollVelocity = Math.abs(scrollProgress - prevScrollProgress) * 60;

      if (scrollDelta > 0.005) {
        scrollDirection = 1; // Descending (going down)
      } else if (scrollDelta < -0.005) {
        scrollDirection = -1; // Ascending (going up)
      } else {
        scrollDirection = 0; // Hovering/Resting
      }

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      // Base target along 3D flight trajectory
      const clampedP = Math.min(0.999, Math.max(0.001, scrollProgress));
      const pathPos = flightCurve.getPoint(clampedP);
      const pathTangent = flightCurve.getTangent(clampedP);

      // Organic low-frequency air turbulence (wind eddies)
      const flutterNoiseX = Math.sin(elapsed * 2.2) * 0.24 + Math.cos(elapsed * 3.8) * 0.08;
      const flutterNoiseY = Math.cos(elapsed * 2.7) * 0.20 + Math.sin(elapsed * 4.4) * 0.06;
      const flutterNoiseZ = Math.sin(elapsed * 1.9) * 0.16;

      targetPos.copy(pathPos);
      targetPos.x += flutterNoiseX + mouseX * 0.35;
      targetPos.y += flutterNoiseY - mouseY * 0.25;
      targetPos.z += flutterNoiseZ;

      // Spring-Damper Aerodynamics (Natural inertia and air resistance)
      const springK = 0.042;
      const drag = 0.88;

      velocity.x += (targetPos.x - currentPos.x) * springK;
      velocity.y += (targetPos.y - currentPos.y) * springK;
      velocity.z += (targetPos.z - currentPos.z) * springK;

      velocity.multiplyScalar(drag);
      currentPos.add(velocity);

      // Compute turning rate for asymmetric banking & heading
      turnRate = THREE.MathUtils.clamp(velocity.x * 2.4, -1.0, 1.0);

      // --- DYNAMIC FLAP FREQUENCY BASED ON FLIGHT STATE ---
      // When descending: slower parachute-flutter braking beats
      // When climbing: vigorous, rapid power thrust flaps
      // When resting: gentle, lazy breathing flutter
      let targetFlapFreq = 5.0;
      if (scrollDirection > 0) {
        // Descending
        targetFlapFreq = 4.2 + scrollVelocity * 8.0;
      } else if (scrollDirection < 0) {
        // Ascending
        targetFlapFreq = 8.8 + scrollVelocity * 14.0;
      } else {
        // Hovering
        targetFlapFreq = 4.6 + Math.sin(elapsed * 1.5) * 1.2;
      }

      flapPhase += targetFlapFreq * 0.016;

      // --- AERODYNAMIC LIFT SURGES ON DOWNSTROKE ---
      // Downstroke pushes air down -> body surges up
      // When ascending: high vertical lift pulses (+0.16)
      // When descending: gentle parachute cushion (+0.05)
      const downstrokePower = scrollDirection < 0 ? 0.16 : scrollDirection > 0 ? 0.05 : 0.08;
      const downstrokeLift = Math.max(0, -Math.cos(flapPhase)) * downstrokePower;
      currentPos.y += downstrokeLift;

      butterflyRoot.position.copy(currentPos);

      // --- 2-WING HARMONIC FLAPPING WITH DIHEDRAL & TURNING TORQUE ---
      // In descending flight: wings hold a higher V-shape (dihedral offset) like a parachute
      // In ascending flight: wings flap through a wider downward arc for maximum thrust
      const baseDihedral = scrollDirection > 0 ? 0.38 : scrollDirection < 0 ? -0.1 : 0.12;
      const maxFlapAngle = scrollDirection < 0 ? 0.95 : 0.74;

      // Turning aerodynamics: Outer wing beats with greater amplitude to yaw the body!
      const leftTurnMultiplier = 1.0 + turnRate * 0.35;
      const rightTurnMultiplier = 1.0 - turnRate * 0.35;

      const leftFlap = Math.sin(flapPhase) * maxFlapAngle * leftTurnMultiplier + baseDihedral;
      const rightFlap = Math.sin(flapPhase) * maxFlapAngle * rightTurnMultiplier + baseDihedral;

      // Wing chord twist / angle of attack
      const wingTwist = Math.cos(flapPhase) * 0.14;

      // Apply rotations to EXACTLY 2 WINGS!
      leftWingHinge.rotation.y = leftFlap;
      leftWingHinge.rotation.z = wingTwist;

      rightWingHinge.rotation.y = -rightFlap;
      rightWingHinge.rotation.z = -wingTwist;

      // --- DYNAMIC AEROELASTIC WING DEFORMATION (Flexing / Bending Wingtips) ---
      // During downstroke: wingtips flex upwards due to air resistance!
      // During upstroke: wingtips lag downwards!
      const flexFactor = Math.sin(flapPhase + 0.3) * 0.24;
      const posAttr = wingGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const spanFraction = Math.max(0, x / 2.7);
        posAttr.setZ(i, baseZ[i] + flexFactor * Math.pow(spanFraction, 1.8));
      }
      posAttr.needsUpdate = true;

      // --- REALISTIC TURNING, CLIMBING & DESCENDING ATTITUDE (Pitch, Yaw, Roll) ---
      // 1. PITCH:
      // When climbing (ascending): nose points UP at 35°-45°!
      // When descending: body maintains parachute attitude (nearly level +12° to +18°), floating down like a leaf!
      let targetPitch = 0.12;
      if (scrollDirection < 0 || velocity.y > 0.04) {
        // Climbing up
        targetPitch = 0.68;
      } else if (scrollDirection > 0 || velocity.y < -0.04) {
        // Descending down (parachuting flat, NOT nosediving)
        targetPitch = 0.18 + Math.sin(elapsed * 3.2) * 0.08;
      }

      // 2. YAW & HEADING:
      // Head and body dynamically point along travel direction with smooth dampening
      const targetYaw = Math.atan2(velocity.x + pathTangent.x * 0.45, 1.0) * 0.75 + mouseX * 0.2;

      // 3. ROLL & BANKING:
      // Deep aerodynamic banking into turns (up to 45°-60° on sharp turns)
      const targetRoll = -velocity.x * 2.2 + Math.sin(elapsed * 2.4) * 0.06;

      // Smoothly interpolate attitude
      currentPitch += (targetPitch - currentPitch) * 0.08;
      currentYaw += (targetYaw - currentYaw) * 0.08;
      currentRoll += (targetRoll - currentRoll) * 0.08;

      butterflyRoot.rotation.x = currentPitch;
      butterflyRoot.rotation.y = currentYaw;
      butterflyRoot.rotation.z = currentRoll;

      // Head articulates into turns first
      headGroup.rotation.y = (turnRate * 0.35 - headGroup.rotation.y) * 0.15;
      headGroup.rotation.x = (currentPitch * 0.3 - headGroup.rotation.x) * 0.15;

      // Abdomen dynamic momentum: droops down when climbing, tilts up when parachuting down, swivels on turns
      const targetAbdomenPitch = scrollDirection < 0 ? 0.38 : scrollDirection > 0 ? -0.12 : 0.15;
      const targetAbdomenYaw = -turnRate * 0.45;
      abdomenGroup.rotation.x += (targetAbdomenPitch - abdomenGroup.rotation.x) * 0.1;
      abdomenGroup.rotation.y += (targetAbdomenYaw - abdomenGroup.rotation.y) * 0.1;

      // --- EMIT FROST FAIRY SPARKLES FROM WINGTIPS ---
      if (Math.random() < 0.35 + scrollVelocity * 0.4) {
        trailIndex = (trailIndex + 1) % trailCount;
        const side = Math.random() > 0.5 ? 0.35 : -0.35;
        trailPositions[trailIndex * 3] = currentPos.x + side;
        trailPositions[trailIndex * 3 + 1] = currentPos.y - 0.1;
        trailPositions[trailIndex * 3 + 2] = currentPos.z - 0.08;
      }

      // Drift and dissolve trail
      const trailAttr = trailGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < trailCount; i++) {
        if (trailPositions[i * 3] > -900) {
          trailPositions[i * 3 + 1] -= 0.014;
          trailPositions[i * 3 + 2] -= 0.024;
        }
      }
      trailAttr.needsUpdate = true;

      // Subtle Camera Parallax
      camera.position.x = mouseX * 0.35;
      camera.position.y = -mouseY * 0.35;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose geometries, textures & materials
      [wingGeo, headGeo, eyeGeo, thoraxGeo, abdomenGeo, trailGeo].forEach(g => g.dispose());
      wingTexture.dispose();
      [wingMat, bodyMat, eyeMat, trailMat].forEach(m => m.dispose());

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
