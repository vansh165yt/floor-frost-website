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

    // 1. Scene, Camera & High-Performance Renderer
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
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Realistic Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keySunLight = new THREE.DirectionalLight(0xe0f2fe, 3.2);
    keySunLight.position.set(12, 16, 14);
    scene.add(keySunLight);

    const rimVioletLight = new THREE.DirectionalLight(0xc084fc, 2.2);
    rimVioletLight.position.set(-14, -10, 8);
    scene.add(rimVioletLight);

    // 3. PHOTOREALISTIC PROCEDURAL TEXTURES (DORSAL & VENTRAL)
    // Real butterflies have stunning electric iridescent blue on TOP (dorsal),
    // and earthy camouflage brown with circular owl eyespots (ocelli) on the UNDERSIDE (ventral)!

    // --- Dorsal Forewing (Top Metallic Blue Morpho) ---
    const createDorsalForewingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      ctx.clearRect(0, 0, 1024, 1024);

      // Wing silhouette
      ctx.beginPath();
      ctx.moveTo(90, 880);
      ctx.bezierCurveTo(160, 480, 360, 120, 840, 70); // Leading edge
      ctx.bezierCurveTo(960, 70, 990, 180, 960, 330); // Apex
      ctx.bezierCurveTo(910, 530, 800, 740, 600, 840); // Outer scalloped margin
      ctx.bezierCurveTo(420, 890, 220, 890, 90, 880);
      ctx.closePath();

      // Sunburst electric iridescent cyan to deep cobalt gradient
      const grad = ctx.createRadialGradient(260, 700, 80, 560, 460, 780);
      grad.addColorStop(0, '#e0f2fe');   // Frost-white core
      grad.addColorStop(0.18, '#38bdf8'); // Radiant Cyan
      grad.addColorStop(0.48, '#2563eb'); // Royal Blue Morpho
      grad.addColorStop(0.72, '#4f46e5'); // Deep Indigo
      grad.addColorStop(0.88, '#1e1b4b'); // Midnight Navy
      grad.addColorStop(1.0, '#05030a');  // Velvet Black edge
      ctx.fillStyle = grad;
      ctx.fill();

      // Velvet black margin & apex
      ctx.save();
      ctx.clip();
      ctx.lineWidth = 85;
      ctx.strokeStyle = '#05030a';
      ctx.stroke();

      const apexGrad = ctx.createRadialGradient(880, 160, 10, 880, 160, 260);
      apexGrad.addColorStop(0, '#05030a');
      apexGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = apexGrad;
      ctx.beginPath();
      ctx.arc(880, 160, 260, 0, Math.PI * 2);
      ctx.fill();

      // Branching Veins
      ctx.strokeStyle = 'rgba(8, 6, 18, 0.78)';
      ctx.lineCap = 'round';
      const rootX = 130, rootY = 850;
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

        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(ctrlX, ctrlY);
        ctx.quadraticCurveTo(ctrlX + 60, ctrlY - 40, destX - 45, destY - 70);
        ctx.stroke();
      });

      // White lunar spots
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

    // --- Ventral Forewing (Underside Earthy Camouflage with Eyespots) ---
    const createVentralForewingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      ctx.clearRect(0, 0, 1024, 1024);

      // Wing silhouette
      ctx.beginPath();
      ctx.moveTo(90, 880);
      ctx.bezierCurveTo(160, 480, 360, 120, 840, 70);
      ctx.bezierCurveTo(960, 70, 990, 180, 960, 330);
      ctx.bezierCurveTo(910, 530, 800, 740, 600, 840);
      ctx.bezierCurveTo(420, 890, 220, 890, 90, 880);
      ctx.closePath();

      // Earthy chocolate brown with warm ochre & sepia bands
      const grad = ctx.createLinearGradient(150, 800, 850, 200);
      grad.addColorStop(0, '#3f2e1e');
      grad.addColorStop(0.3, '#5c4028');
      grad.addColorStop(0.6, '#785333');
      grad.addColorStop(0.85, '#4a3320');
      grad.addColorStop(1.0, '#26180d');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.save();
      ctx.clip();

      // Wavy beige bands across underside
      ctx.strokeStyle = '#d7c4a3';
      ctx.lineWidth = 14;
      ctx.globalAlpha = 0.55;
      for (let offset = 200; offset <= 700; offset += 90) {
        ctx.beginPath();
        ctx.moveTo(offset - 100, 880);
        ctx.bezierCurveTo(offset + 50, 600, offset + 150, 400, offset + 250, 150);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // Realistic Concentric Owl Eyespots (Ocelli)
      const drawEyespot = (x: number, y: number, radius: number) => {
        // Outer dark brown ring
        ctx.fillStyle = '#1c120a';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Golden yellow ring
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
        ctx.fill();

        // Inner black pupil
        ctx.fillStyle = '#0a0a0e';
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Cyan/white crescent glint
        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(x - radius * 0.12, y - radius * 0.12, radius * 0.18, 0, Math.PI * 2);
        ctx.fill();
      };

      drawEyespot(780, 360, 42);
      drawEyespot(700, 520, 34);

      // Subtle border dots
      ctx.fillStyle = '#fef08a';
      [880, 800, 720, 640].forEach((py, i) => {
        ctx.beginPath();
        ctx.arc(930 - i * 35, py, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // --- Dorsal Hindwing (Top Scalloped Wing) ---
    const createDorsalHindwingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      ctx.clearRect(0, 0, 1024, 1024);

      ctx.beginPath();
      ctx.moveTo(270, 130);
      ctx.bezierCurveTo(480, 110, 740, 170, 890, 290);
      ctx.bezierCurveTo(950, 430, 930, 640, 810, 790);
      ctx.bezierCurveTo(750, 870, 690, 970, 590, 990);
      ctx.bezierCurveTo(490, 970, 430, 890, 390, 790);
      ctx.bezierCurveTo(310, 630, 230, 390, 270, 130);
      ctx.closePath();

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

      ctx.lineWidth = 75;
      ctx.strokeStyle = '#05030a';
      ctx.stroke();

      ctx.strokeStyle = 'rgba(8, 6, 18, 0.75)';
      const rootX = 310, rootY = 230;
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

    // --- Ventral Hindwing (Underside Camouflage with 3 Ocelli) ---
    const createVentralHindwingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      ctx.clearRect(0, 0, 1024, 1024);

      ctx.beginPath();
      ctx.moveTo(270, 130);
      ctx.bezierCurveTo(480, 110, 740, 170, 890, 290);
      ctx.bezierCurveTo(950, 430, 930, 640, 810, 790);
      ctx.bezierCurveTo(750, 870, 690, 970, 590, 990);
      ctx.bezierCurveTo(490, 970, 430, 890, 390, 790);
      ctx.bezierCurveTo(310, 630, 230, 390, 270, 130);
      ctx.closePath();

      const grad = ctx.createRadialGradient(450, 400, 80, 550, 550, 650);
      grad.addColorStop(0, '#4a3525');
      grad.addColorStop(0.4, '#6b4d36');
      grad.addColorStop(0.75, '#453020');
      grad.addColorStop(1.0, '#23160c');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.save();
      ctx.clip();

      // Banded wavy lines
      ctx.strokeStyle = '#d7c4a3';
      ctx.lineWidth = 12;
      ctx.globalAlpha = 0.5;
      for (let offset = 260; offset <= 750; offset += 90) {
        ctx.beginPath();
        ctx.moveTo(offset - 100, 900);
        ctx.bezierCurveTo(offset, 650, offset + 80, 420, offset + 120, 150);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;

      // 3 Owl Eyespots along margin
      const drawEyespot = (x: number, y: number, r: number) => {
        ctx.fillStyle = '#1c120a';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.78, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0a0a0e';
        ctx.beginPath();
        ctx.arc(x, y, r * 0.52, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#67e8f9';
        ctx.beginPath();
        ctx.arc(x - r * 0.12, y - r * 0.12, r * 0.18, 0, Math.PI * 2);
        ctx.fill();
      };

      drawEyespot(750, 450, 36);
      drawEyespot(680, 630, 44);
      drawEyespot(540, 800, 32);

      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const dorsalForeTex = createDorsalForewingTexture();
    const ventralForeTex = createVentralForewingTexture();
    const dorsalHindTex = createDorsalHindwingTexture();
    const ventralHindTex = createVentralHindwingTexture();

    // 4. SUBDIVIDED 3D WING MESHES (With Aeroelastic Camber & Flexibility)
    const createWingGeometry = (width: number, height: number, camber: number) => {
      const geo = new THREE.PlaneGeometry(width, height, 18, 18);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const nx = (x + width / 2) / width;
        const ny = (y + height / 2) / height;
        const z = camber * Math.sin(nx * Math.PI) * Math.cos(ny * Math.PI * 0.5);
        pos.setZ(i, z);
      }
      geo.computeVertexNormals();
      return geo;
    };

    const forewingGeo = createWingGeometry(2.2, 2.4, 0.24);
    forewingGeo.translate(1.05, 0.95, 0);

    const hindwingGeo = createWingGeometry(1.6, 1.8, 0.18);
    hindwingGeo.translate(0.72, -0.65, -0.04);

    // Save base vertex positions for dynamic aeroelastic wing flexing
    const foreBaseZ = new Float32Array(forewingGeo.attributes.position.count);
    for (let i = 0; i < foreBaseZ.length; i++) foreBaseZ[i] = forewingGeo.attributes.position.getZ(i);

    const hindBaseZ = new Float32Array(hindwingGeo.attributes.position.count);
    for (let i = 0; i < hindBaseZ.length; i++) hindBaseZ[i] = hindwingGeo.attributes.position.getZ(i);

    // Materials: Dorsal (Front) & Ventral (Back)
    const createWingMaterial = (texture: THREE.Texture, isVentral: boolean = false) => {
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.04,
        roughness: isVentral ? 0.45 : 0.22,
        metalness: isVentral ? 0.15 : 0.35,
        clearcoat: isVentral ? 0.3 : 0.85,
        clearcoatRoughness: 0.18,
        emissive: isVentral ? 0x1c120a : 0x0284c7,
        emissiveIntensity: isVentral ? 0.15 : 0.35,
        side: THREE.DoubleSide
      });
    };

    const dorsalForeMat = createWingMaterial(dorsalForeTex, false);
    const ventralForeMat = createWingMaterial(ventralForeTex, true);
    const dorsalHindMat = createWingMaterial(dorsalHindTex, false);
    const ventralHindMat = createWingMaterial(ventralHindTex, true);

    // Assembly function for dual-sided wing (Top blue, Bottom brown eyespot)
    const createDualSidedWing = (geo: THREE.BufferGeometry, dorsalMat: THREE.Material, ventralMat: THREE.Material) => {
      const group = new THREE.Group();
      const dorsalMesh = new THREE.Mesh(geo, dorsalMat);
      dorsalMesh.position.z = 0.004; // Slight forward offset for top face
      group.add(dorsalMesh);

      const ventralMesh = new THREE.Mesh(geo, ventralMat);
      ventralMesh.position.z = -0.004;
      ventralMesh.rotation.y = Math.PI; // Invert to face underside
      group.add(ventralMesh);

      return group;
    };

    // 5. BUTTERFLY HIERARCHY & DETAILED ANATOMY
    const butterflyRoot = new THREE.Group();
    scene.add(butterflyRoot);

    // Dynamic Core Light
    const coreLight = new THREE.PointLight(0x38bdf8, 2.4, 7);
    coreLight.position.set(0, 0, 0.15);
    butterflyRoot.add(coreLight);

    // Velvet body material
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0c0a14,
      roughness: 0.55,
      metalness: 0.5,
      emissive: 0x1e1b4b,
      emissiveIntensity: 0.4
    });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.1,
      roughness: 0.08,
      metalness: 0.95
    });

    // Head
    const headGroup = new THREE.Group();
    const headGeo = new THREE.SphereGeometry(0.14, 16, 16);
    headGeo.scale(1.0, 1.15, 0.95);
    const head = new THREE.Mesh(headGeo, bodyMat);
    headGroup.add(head);

    // Compound Eyes
    const eyeGeo = new THREE.SphereGeometry(0.048, 14, 14);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.065, 0.04, 0.08);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.065, 0.04, 0.08);
    headGroup.add(rightEye);

    // Curled Spiral Proboscis
    const proboscisCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, -0.05, 0.08),
      new THREE.Vector3(0, -0.16, 0.15),
      new THREE.Vector3(0, -0.12, 0.02),
      new THREE.Vector3(0, -0.06, 0.05)
    );
    const proboscisGeo = new THREE.TubeGeometry(proboscisCurve, 14, 0.008, 6, false);
    const proboscisMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const proboscis = new THREE.Mesh(proboscisGeo, proboscisMat);
    headGroup.add(proboscis);

    // Antennae (Segmented stalks with club tips)
    const createAntenna = (isLeft: boolean) => {
      const antGroup = new THREE.Group();
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.08 : -0.08, 0.20, 0.14),
        new THREE.Vector3(isLeft ? 0.24 : -0.24, 0.44, 0.26),
        new THREE.Vector3(isLeft ? 0.35 : -0.35, 0.54, 0.22)
      );
      const tubeGeo = new THREE.TubeGeometry(curve, 18, 0.011, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35 });
      antGroup.add(new THREE.Mesh(tubeGeo, tubeMat));

      const tipGeo = new THREE.SphereGeometry(0.032, 10, 10);
      tipGeo.scale(0.8, 1.4, 0.8);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.copy(curve.getPoint(1));
      antGroup.add(tip);

      antGroup.position.set(isLeft ? 0.045 : -0.045, 0.06, 0.04);
      return antGroup;
    };

    headGroup.add(createAntenna(true));
    headGroup.add(createAntenna(false));
    headGroup.position.set(0, 0.38, 0.05);
    butterflyRoot.add(headGroup);

    // Thorax
    const thoraxGeo = new THREE.SphereGeometry(0.19, 16, 16);
    thoraxGeo.scale(0.85, 1.3, 0.75);
    const thorax = new THREE.Mesh(thoraxGeo, bodyMat);
    thorax.position.set(0, 0.08, 0.02);
    butterflyRoot.add(thorax);

    // 6 Folded Insect Legs under thorax
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const createLeg = (isLeft: boolean, yOffset: number) => {
      const legGroup = new THREE.Group();
      const legCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.12 : -0.12, -0.08, -0.06),
        new THREE.Vector3(isLeft ? 0.14 : -0.14, -0.18, -0.12),
        new THREE.Vector3(isLeft ? 0.08 : -0.08, -0.24, -0.08)
      );
      const legGeo = new THREE.TubeGeometry(legCurve, 8, 0.009, 6, false);
      legGroup.add(new THREE.Mesh(legGeo, legMat));
      legGroup.position.set(isLeft ? 0.06 : -0.06, yOffset, -0.04);
      return legGroup;
    };

    [-0.04, 0.06, 0.16].forEach((yOff) => {
      butterflyRoot.add(createLeg(true, yOff));
      butterflyRoot.add(createLeg(false, yOff));
    });

    // Articulated Segmented Abdomen
    const abdomenGroup = new THREE.Group();
    const abdomenGeo = new THREE.ConeGeometry(0.13, 0.78, 16);
    abdomenGeo.rotateX(Math.PI);
    abdomenGeo.scale(0.9, 1.0, 0.8);
    const abdomen = new THREE.Mesh(abdomenGeo, bodyMat);
    abdomen.position.set(0, -0.38, 0);
    abdomenGroup.add(abdomen);
    abdomenGroup.position.set(0, -0.04, -0.03);
    butterflyRoot.add(abdomenGroup);

    // 4-WING INDEPENDENT HINGES
    // Left Forewing
    const leftForewingHinge = new THREE.Group();
    leftForewingHinge.position.set(0.06, 0.16, 0.05);
    leftForewingHinge.add(createDualSidedWing(forewingGeo, dorsalForeMat, ventralForeMat));
    butterflyRoot.add(leftForewingHinge);

    // Left Hindwing
    const leftHindwingHinge = new THREE.Group();
    leftHindwingHinge.position.set(0.05, -0.04, 0.02);
    leftHindwingHinge.add(createDualSidedWing(hindwingGeo, dorsalHindMat, ventralHindMat));
    butterflyRoot.add(leftHindwingHinge);

    // Right Forewing (Mirrored along X)
    const rightForewingHinge = new THREE.Group();
    rightForewingHinge.position.set(-0.06, 0.16, 0.05);
    const rightForeContainer = new THREE.Group();
    rightForeContainer.scale.set(-1, 1, 1);
    rightForeContainer.add(createDualSidedWing(forewingGeo, dorsalForeMat, ventralForeMat));
    rightForewingHinge.add(rightForeContainer);
    butterflyRoot.add(rightForewingHinge);

    // Right Hindwing (Mirrored along X)
    const rightHindwingHinge = new THREE.Group();
    rightHindwingHinge.position.set(-0.05, -0.04, 0.02);
    const rightHindContainer = new THREE.Group();
    rightHindContainer.scale.set(-1, 1, 1);
    rightHindContainer.add(createDualSidedWing(hindwingGeo, dorsalHindMat, ventralHindMat));
    rightHindwingHinge.add(rightHindContainer);
    butterflyRoot.add(rightHindwingHinge);

    // Overall Butterfly Scale
    butterflyRoot.scale.set(0.92, 0.92, 0.92);

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

    // 7. REALISTIC FLIGHT PHYSICS ENGINE
    // State variables
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let prevScrollProgress = 0;
    let scrollVelocity = 0;
    let scrollDirection = 0; // -1 for ascending (up), +1 for descending (down), 0 for resting

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

    // Calculate Dynamic Flight Path Anchored Safely in Side Rails
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
        scrollDirection = 1; // Descending
      } else if (scrollDelta < -0.005) {
        scrollDirection = -1; // Ascending
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

      // Low Reynolds Number Organic Air Turbulences
      const flutterNoiseX = Math.sin(elapsed * 2.2) * 0.24 + Math.cos(elapsed * 3.8) * 0.08;
      const flutterNoiseY = Math.cos(elapsed * 2.7) * 0.20 + Math.sin(elapsed * 4.4) * 0.06;
      const flutterNoiseZ = Math.sin(elapsed * 1.9) * 0.16;

      targetPos.copy(pathPos);
      targetPos.x += flutterNoiseX + mouseX * 0.35;
      targetPos.y += flutterNoiseY - mouseY * 0.25;
      targetPos.z += flutterNoiseZ;

      // Spring-Damper Aerodynamics (Fluid Momentum)
      const springK = 0.042;
      const drag = 0.88;

      velocity.x += (targetPos.x - currentPos.x) * springK;
      velocity.y += (targetPos.y - currentPos.y) * springK;
      velocity.z += (targetPos.z - currentPos.z) * springK;

      velocity.multiplyScalar(drag);
      currentPos.add(velocity);

      // Compute horizontal turning rate for asymmetric banking & heading
      const prevTurnRate = turnRate;
      turnRate = THREE.MathUtils.clamp(velocity.x * 2.4, -1.0, 1.0);

      // --- DYNAMIC FLAP FREQUENCY BASED ON STATE ---
      // When descending: slower, flutter-braking parachute flaps
      // When climbing / ascending: vigorous, rapid power flaps
      // When resting: slow, gentle breathing flutter
      let targetFlapFreq = 5.0;
      if (scrollDirection > 0) {
        // Descending
        targetFlapFreq = 4.2 + scrollVelocity * 8.0;
      } else if (scrollDirection < 0) {
        // Ascending
        targetFlapFreq = 8.5 + scrollVelocity * 14.0;
      } else {
        // Hovering
        targetFlapFreq = 4.5 + Math.sin(elapsed * 1.5) * 1.2;
      }

      flapPhase += targetFlapFreq * 0.016;

      // --- VERTICAL AERODYNAMIC LIFT SURGES ---
      // Downstroke pushes air down -> body surges up
      // When ascending: high lift surges
      // When descending: subtle fluttering parachute cushion
      const downstrokePower = scrollDirection < 0 ? 0.16 : scrollDirection > 0 ? 0.05 : 0.08;
      const downstrokeLift = Math.max(0, -Math.cos(flapPhase)) * downstrokePower;
      currentPos.y += downstrokeLift;

      butterflyRoot.position.copy(currentPos);

      // --- ASYMMETRIC 4-WING HARMONIC FLAPPING WITH DIHEDRAL ---
      // In descending flight: wings hold a higher V-shape (dihedral offset) like a parachute
      // In ascending flight: wings flap through a wider downward arc for maximum thrust
      const baseDihedral = scrollDirection > 0 ? 0.35 : scrollDirection < 0 ? -0.1 : 0.12;
      const maxForewingAngle = scrollDirection < 0 ? 0.95 : 0.72;

      // Turning aerodynamics: Outer wing beats with greater amplitude to yaw the body!
      const leftTurnMultiplier = 1.0 + turnRate * 0.35;
      const rightTurnMultiplier = 1.0 - turnRate * 0.35;

      const leftForeFlap = Math.sin(flapPhase) * maxForewingAngle * leftTurnMultiplier + baseDihedral;
      const rightForeFlap = Math.sin(flapPhase) * maxForewingAngle * rightTurnMultiplier + baseDihedral;

      // Hindwings follow with natural 0.28 rad phase lag!
      const leftHindFlap = Math.sin(flapPhase - 0.28) * (maxForewingAngle * 0.88) * leftTurnMultiplier + baseDihedral * 0.8;
      const rightHindFlap = Math.sin(flapPhase - 0.28) * (maxForewingAngle * 0.88) * rightTurnMultiplier + baseDihedral * 0.8;

      // Wing chord twist / angle of attack
      const forewingTwist = Math.cos(flapPhase) * 0.14;

      // Apply wing rotations
      leftForewingHinge.rotation.y = leftForeFlap;
      leftForewingHinge.rotation.z = forewingTwist;
      leftHindwingHinge.rotation.y = leftHindFlap;

      rightForewingHinge.rotation.y = -rightForeFlap;
      rightForewingHinge.rotation.z = -forewingTwist;
      rightHindwingHinge.rotation.y = -rightHindFlap;

      // --- DYNAMIC AEROELASTIC WING DEFORMATION (Flexing / Bending Wingtips) ---
      // During downstroke: wingtips flex upwards due to air resistance!
      // During upstroke: wingtips lag downwards!
      const flexFactor = Math.sin(flapPhase + 0.3) * 0.22;
      const forePos = forewingGeo.attributes.position;
      for (let i = 0; i < forePos.count; i++) {
        const x = forePos.getX(i);
        const spanFraction = Math.max(0, x / 2.2); // Greater flexing towards wingtips
        forePos.setZ(i, foreBaseZ[i] + flexFactor * Math.pow(spanFraction, 1.8));
      }
      forePos.needsUpdate = true;

      const hindPos = hindwingGeo.attributes.position;
      for (let i = 0; i < hindPos.count; i++) {
        const x = hindPos.getX(i);
        const spanFraction = Math.max(0, x / 1.6);
        hindPos.setZ(i, hindBaseZ[i] + flexFactor * 0.7 * Math.pow(spanFraction, 1.8));
      }
      hindPos.needsUpdate = true;

      // --- REALISTIC TURNING, CLIMBING & DESCENDING ATTITUDE (Pitch, Yaw, Roll) ---
      // 1. PITCH:
      // When climbing (ascending): nose points UP at 35°-45°!
      // When descending: body maintains parachute attitude (nearly level +10° to +15°), floating down!
      let targetPitch = 0.12;
      if (scrollDirection < 0 || velocity.y > 0.04) {
        // Climbing up
        targetPitch = 0.65;
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

      // HEAD STEERS FIRST INTO TURNS
      headGroup.rotation.y = (turnRate * 0.35 - headGroup.rotation.y) * 0.15;
      headGroup.rotation.x = (currentPitch * 0.3 - headGroup.rotation.x) * 0.15;

      // ABDOMEN DYNAMIC MOMENTUM
      // When climbing: abdomen droops downwards
      // When descending: abdomen tilts up to balance parachute glide
      // When turning: centrifugal sway towards outside of the turn
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
      const posAttr = trailGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < trailCount; i++) {
        if (trailPositions[i * 3] > -900) {
          trailPositions[i * 3 + 1] -= 0.014;
          trailPositions[i * 3 + 2] -= 0.024;
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

    // 9. Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose geometries, textures & materials
      [forewingGeo, hindwingGeo, headGeo, eyeGeo, thoraxGeo, abdomenGeo, trailGeo].forEach(g => g.dispose());
      [dorsalForeTex, ventralForeTex, dorsalHindTex, ventralHindTex].forEach(t => t.dispose());
      [dorsalForeMat, ventralForeMat, dorsalHindMat, ventralHindMat, bodyMat, eyeMat, trailMat].forEach(m => m.dispose());

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
