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
    // 3. ULTRA-DETAILED 2048x2048 WING TEXTURE (EXACT MATCH TO REFERENCE IMAGE)
    // Features: 100% Jet Black borders & spots, radiant electric cyan cells, apex blue marks, and amber scalloped dots
    const createReferenceWingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      ctx.clearRect(0, 0, 2048, 2048);

      // 1. BASE BLUE RADIANCE (Pure Vibrant Cyan & Royal Azure)
      // High-contrast, crystal-clear blue field
      const baseGrad = ctx.createRadialGradient(480, 1260, 60, 1040, 1000, 1440);
      baseGrad.addColorStop(0, '#f0fdff');    // White-hot radiant core
      baseGrad.addColorStop(0.12, '#38bdf8'); // Sky bright cyan
      baseGrad.addColorStop(0.32, '#00e5ff'); // Electric vibrant cyan
      baseGrad.addColorStop(0.58, '#0284c7'); // Rich azure blue
      baseGrad.addColorStop(0.80, '#0369a1'); // Royal sapphire blue
      baseGrad.addColorStop(0.96, '#075985'); // Deep ocean blue
      baseGrad.addColorStop(1.0, '#000000');  // Transitions directly into pitch black

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, 2048, 2048);

      // Subtle Violet/Indigo hue near wing base (As seen in real Blue Morpho reference)
      const rootViolet = ctx.createRadialGradient(160, 1360, 30, 260, 1360, 380);
      rootViolet.addColorStop(0, 'rgba(49, 46, 129, 0.7)');
      rootViolet.addColorStop(0.6, 'rgba(30, 58, 138, 0.4)');
      rootViolet.addColorStop(1, 'transparent');
      ctx.fillStyle = rootViolet;
      ctx.fillRect(0, 900, 600, 900);

      // 2. STAINED-GLASS WING CELLS LUMINOUS IRIDESCENT CUSHIONS
      const cellHighlights = [
        { x: 760, y: 1100, rx: 180, ry: 90, rot: -0.35, color: '#38bdf8' },
        { x: 1040, y: 880, rx: 220, ry: 80, rot: -0.42, color: '#00e5ff' },
        { x: 1240, y: 700, rx: 220, ry: 70, rot: -0.48, color: '#00e5ff' },
        { x: 1360, y: 520, rx: 200, ry: 60, rot: -0.52, color: '#38bdf8' },
        { x: 1160, y: 1160, rx: 190, ry: 75, rot: -0.15, color: '#00e5ff' },
        { x: 1080, y: 1400, rx: 170, ry: 70, rot: 0.15, color: '#00e5ff' },
        { x: 880, y: 1600, rx: 150, ry: 65, rot: 0.40, color: '#38bdf8' },
        { x: 680, y: 1720, rx: 130, ry: 60, rot: 0.60, color: '#0284c7' }
      ];

      cellHighlights.forEach(c => {
        const cg = ctx.createRadialGradient(c.x, c.y, 15, c.x, c.y, c.rx);
        cg.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
        cg.addColorStop(0.4, c.color);
        cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.rx, c.ry, c.rot, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. 100% PURE JET-BLACK (#000000) SOLID PERIMETER BORDERS
      // Costal Margin (Top edge solid pitch-black)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(2048, 0);
      ctx.lineTo(2048, 420);
      ctx.bezierCurveTo(1500, 360, 900, 310, 0, 340);
      ctx.closePath();
      ctx.fill();

      // Large Forewing Apex Pitch-Black Triangle (x: 1300 -> 2048, y: 0 -> 900)
      ctx.beginPath();
      ctx.moveTo(1250, 0);
      ctx.lineTo(2048, 0);
      ctx.lineTo(2048, 920);
      ctx.bezierCurveTo(1800, 850, 1500, 550, 1250, 0);
      ctx.closePath();
      ctx.fill();

      // Outer Forewing & Hindwing Right Margin (Solid Jet Black)
      ctx.beginPath();
      ctx.moveTo(1480, 850);
      ctx.lineTo(2048, 850);
      ctx.lineTo(2048, 2048);
      ctx.lineTo(1350, 2048);
      ctx.bezierCurveTo(1450, 1700, 1520, 1300, 1480, 850);
      ctx.closePath();
      ctx.fill();

      // Hindwing Bottom & Scalloped Margin (Solid Jet Black)
      ctx.beginPath();
      ctx.moveTo(0, 1650);
      ctx.bezierCurveTo(500, 1550, 1000, 1680, 1400, 1950);
      ctx.lineTo(1400, 2048);
      ctx.lineTo(0, 2048);
      ctx.closePath();
      ctx.fill();

      // Inner Root Pitch Black Shadow
      ctx.beginPath();
      ctx.ellipse(120, 1360, 160, 320, 0, 0, Math.PI * 2);
      ctx.fill();

      // 4. DISTINCT BLACK SPOTS & TRANSVERSE BARS (Exact reference feature!)
      // Bar/Spot 1: Jutting from costal margin into discal cell
      ctx.beginPath();
      ctx.moveTo(760, 260);
      ctx.bezierCurveTo(800, 380, 820, 480, 810, 540);
      ctx.bezierCurveTo(770, 520, 750, 420, 720, 280);
      ctx.closePath();
      ctx.fill();

      // Bar/Spot 2: Middle forewing black spot/bar
      ctx.beginPath();
      ctx.moveTo(1060, 290);
      ctx.bezierCurveTo(1110, 420, 1130, 530, 1120, 600);
      ctx.bezierCurveTo(1070, 580, 1050, 460, 1020, 310);
      ctx.closePath();
      ctx.fill();

      // Bar/Spot 3: Outer forewing black wedge
      ctx.beginPath();
      ctx.moveTo(1320, 350);
      ctx.bezierCurveTo(1370, 490, 1380, 620, 1360, 680);
      ctx.bezierCurveTo(1320, 660, 1300, 520, 1270, 370);
      ctx.closePath();
      ctx.fill();

      // Triangular Black Wedges/Spots along the outer margin between cells
      const blackMarginWedges = [
        { x1: 1980, y1: 750, x2: 1720, y2: 800, x3: 1940, y3: 860 },
        { x1: 1940, y1: 940, x2: 1680, y2: 990, x3: 1900, y3: 1050 },
        { x1: 1880, y1: 1130, x2: 1630, y2: 1180, x3: 1840, y3: 1240 },
        { x1: 1800, y1: 1320, x2: 1540, y2: 1370, x3: 1750, y3: 1430 },
        { x1: 1700, y1: 1500, x2: 1430, y2: 1540, x3: 1630, y3: 1610 },
        { x1: 1560, y1: 1680, x2: 1300, y2: 1710, x3: 1480, y3: 1780 },
        { x1: 1380, y1: 1820, x2: 1140, y2: 1830, x3: 1280, y3: 1910 },
        { x1: 1150, y1: 1910, x2: 920, y2: 1890, x3: 1040, y3: 1980 }
      ];
      blackMarginWedges.forEach(w => {
        ctx.beginPath();
        ctx.moveTo(w.x1, w.y1);
        ctx.lineTo(w.x2, w.y2);
        ctx.lineTo(w.x3, w.y3);
        ctx.closePath();
        ctx.fill();
      });

      // 5. APEX SIGNATURE CYAN-BLUE STREAKS (Trapped inside the black triangle!)
      ctx.save();
      const apexStreaks = [
        { startX: 1680, startY: 170, endX: 1910, endY: 290, width: 44, color: '#38bdf8' },
        { startX: 1660, startY: 280, endX: 1870, endY: 450, width: 40, color: '#00e5ff' },
        { startX: 1620, startY: 410, endX: 1820, endY: 590, width: 36, color: '#0284c7' }
      ];

      apexStreaks.forEach(s => {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.startX, s.startY);
        ctx.quadraticCurveTo((s.startX + s.endX) / 2 + 25, (s.startY + s.endY) / 2 - 20, s.endX, s.endY);
        ctx.stroke();

        // Bright white-cyan core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = s.width * 0.4;
        ctx.beginPath();
        ctx.moveTo(s.startX + 20, s.startY + 10);
        ctx.quadraticCurveTo((s.startX + s.endX) / 2 + 25, (s.startY + s.endY) / 2 - 20, s.endX - 20, s.endY - 10);
        ctx.stroke();
      });
      ctx.restore();

      // 6. 100% PURE JET-BLACK VEIN ARCHITECTURE (#000000)
      ctx.strokeStyle = '#000000';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const rootX = 220, rootY = 1320;

      // Discal Cell Central Closed Loop
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      ctx.bezierCurveTo(480, 1040, 760, 960, 820, 1120);
      ctx.bezierCurveTo(800, 1260, 520, 1320, rootX, rootY);
      ctx.stroke();

      // Central Discal Cell Inner Dark Spot
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(540, 1140, 32, 22, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Bold Radiating Veins from discal cell to outer margin
      const veins = [
        { startX: 820, startY: 1040, ctrlX: 1160, ctrlY: 640, endX: 1760, endY: 340, w: 12 },
        { startX: 820, startY: 1100, ctrlX: 1260, ctrlY: 820, endX: 1860, endY: 560, w: 11 },
        { startX: 800, startY: 1160, ctrlX: 1320, ctrlY: 1000, endX: 1900, endY: 840, w: 10 },
        { startX: 760, startY: 1220, ctrlX: 1280, ctrlY: 1180, endX: 1820, endY: 1140, w: 10 },
        { startX: 600, startY: 1300, ctrlX: 1160, ctrlY: 1340, endX: 1720, endY: 1400, w: 12 },
        { startX: 500, startY: 1340, ctrlX: 1000, ctrlY: 1520, endX: 1560, endY: 1640, w: 10 },
        { startX: 400, startY: 1360, ctrlX: 860, ctrlY: 1660, endX: 1320, endY: 1840, w: 9 },
        { startX: 320, startY: 1380, ctrlX: 660, ctrlY: 1740, endX: 1000, endY: 1940, w: 8.5 },
        { startX: 240, startY: 1400, ctrlX: 480, ctrlY: 1760, endX: 720, endY: 1960, w: 8 }
      ];

      veins.forEach(v => {
        ctx.lineWidth = v.w;
        ctx.beginPath();
        ctx.moveTo(v.startX, v.startY);
        ctx.quadraticCurveTo(v.ctrlX, v.ctrlY, v.endX, v.endY);
        ctx.stroke();

        // Secondary Vein Branch
        ctx.lineWidth = v.w * 0.65;
        ctx.beginPath();
        ctx.moveTo(v.ctrlX + 100, v.ctrlY + 20);
        ctx.quadraticCurveTo(v.ctrlX + 220, v.ctrlY - 40, v.endX - 20, v.endY - 90);
        ctx.stroke();
      });

      // 7. HINDWING SCALLOPED MARGIN AMBER-ORANGE & WHITE SPOTS (Exact reference feature!)
      // Distinct row of lunar spots along the black scalloped border
      const amberMarginSpots = [
        [1860, 680, 11], [1880, 880, 12], [1840, 1080, 12], [1760, 1280, 12],
        [1640, 1480, 13], [1480, 1660, 13], [1280, 1800, 12], [1040, 1900, 11],
        [780, 1960, 10], [540, 1980, 9]
      ];

      amberMarginSpots.forEach(([x, y, r]) => {
        // Outer Orange-Amber Halo
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Bright Yellow-Orange middle
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // White lunar core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      });

      // Forewing Outer Margin White Micro-Dots
      ctx.fillStyle = '#ffffff';
      const forewingDots = [
        [1990, 620, 6], [1980, 720, 6], [1950, 820, 5.5], [1910, 920, 5.5]
      ];
      forewingDots.forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
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

    // High-End Chitin Wing Material:
    // Pure Black stays 100% Pitch-Black by setting emissive to 0x000000 & metalness to 0.0!
    const wingMat = new THREE.MeshPhysicalMaterial({
      map: wingTexture,
      roughness: 0.36,
      metalness: 0.0,
      clearcoat: 0.45,
      clearcoatRoughness: 0.18,
      emissive: 0x000000,
      emissiveIntensity: 0.0,
      side: THREE.DoubleSide
    });

    // 5. BUTTERFLY BODY & HIERARCHY (Matching reference image)
    const butterflyRoot = new THREE.Group();
    scene.add(butterflyRoot);

    // Soft neutral fill light (Does NOT wash out black colors into blue)
    const coreLight = new THREE.PointLight(0xffffff, 0.4, 6);
    coreLight.position.set(0, 0, 0.2);
    butterflyRoot.add(coreLight);

    // Deep Pitch Charcoal Black Body Material
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x070709,
      roughness: 0.6,
      metalness: 0.1,
      emissive: 0x000000,
      emissiveIntensity: 0.0
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
