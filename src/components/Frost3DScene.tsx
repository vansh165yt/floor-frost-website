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
    renderer.toneMappingExposure = 1.35;

    container.appendChild(renderer.domElement);

    // 2. High-Fidelity Studio Lighting for Butterfly Chitin
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keySunLight = new THREE.DirectionalLight(0xffffff, 3.5);
    keySunLight.position.set(12, 18, 14);
    scene.add(keySunLight);

    const rimCyanLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimCyanLight.position.set(-14, -10, 10);
    scene.add(rimCyanLight);

    const fillPinkLight = new THREE.DirectionalLight(0xe879f9, 2.0);
    fillPinkLight.position.set(0, -12, -6);
    scene.add(fillPinkLight);

    // 3. ULTRA-DETAILED 1024x1024 WING TEXTURE (DORSAL BLUE MORPHO WITH NATURAL CHITIN DETAILS)
    const createWingTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.Texture();

      ctx.clearRect(0, 0, 1024, 1024);

      // Base Iridescent Morpho Gradient
      // Radial burst: white core -> radiant electric cyan -> deep royal sapphire -> dark indigo -> velvet black
      const baseGrad = ctx.createRadialGradient(250, 650, 60, 500, 480, 750);
      baseGrad.addColorStop(0, '#f0f9ff');   // Bright frost-white inner glow
      baseGrad.addColorStop(0.15, '#38bdf8'); // Radiant Cyan
      baseGrad.addColorStop(0.42, '#2563eb'); // Royal Blue Morpho
      baseGrad.addColorStop(0.68, '#4f46e5'); // Deep Indigo
      baseGrad.addColorStop(0.85, '#1e1b4b'); // Midnight Navy
      baseGrad.addColorStop(1.0, '#05030a');  // Velvet Black margin

      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Velvet Black Outer Margins (Dark wings tips and scalloped edges)
      const marginGrad = ctx.createLinearGradient(0, 0, 1024, 500);
      marginGrad.addColorStop(0, 'rgba(5, 3, 10, 0.95)');
      marginGrad.addColorStop(0.35, 'transparent');
      marginGrad.addColorStop(0.7, 'transparent');
      marginGrad.addColorStop(1, 'rgba(5, 3, 10, 0.95)');
      ctx.fillStyle = marginGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Top leading edge dark band
      const topBand = ctx.createLinearGradient(0, 0, 0, 220);
      topBand.addColorStop(0, '#05030a');
      topBand.addColorStop(1, 'transparent');
      ctx.fillStyle = topBand;
      ctx.fillRect(0, 0, 1024, 220);

      // Apex Dark Patch
      const apexGrad = ctx.createRadialGradient(880, 160, 10, 880, 160, 320);
      apexGrad.addColorStop(0, '#05030a');
      apexGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = apexGrad;
      ctx.beginPath();
      ctx.arc(880, 160, 320, 0, Math.PI * 2);
      ctx.fill();

      // INTRICATE ANATOMICAL BRANCHING VEINS (Lepidoptera venation network)
      ctx.strokeStyle = '#05030a';
      ctx.lineCap = 'round';
      const rootX = 120, rootY = 700;

      // Primary main veins
      const mainVeins = [
        [880, 120, 480, 280],
        [940, 240, 560, 380],
        [950, 400, 600, 480],
        [880, 580, 580, 580],
        [780, 750, 500, 680],
        [640, 880, 420, 780],
        [460, 940, 320, 840]
      ];

      mainVeins.forEach(([destX, destY, ctrlX, ctrlY], idx) => {
        // Main vein
        ctx.lineWidth = idx === 0 ? 6.5 : 4.0;
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, destX, destY);
        ctx.stroke();

        // Secondary cross veins and branches
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(ctrlX, ctrlY);
        ctx.quadraticCurveTo(ctrlX + 70, ctrlY - 50, destX - 40, destY - 80);
        ctx.stroke();

        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ctrlX + 30, ctrlY);
        ctx.quadraticCurveTo(ctrlX + 90, ctrlY + 40, destX - 20, destY + 40);
        ctx.stroke();
      });

      // Discal Cell (Central closed loop near wing root)
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      ctx.bezierCurveTo(280, 520, 440, 480, 420, 590);
      ctx.bezierCurveTo(400, 660, 260, 680, rootX, rootY);
      ctx.stroke();

      // ========================================================
      // REALISTIC BLACK BUTTERFLY SPOTS (Lepidoptera Maculation)
      // ========================================================

      // 1. CENTRAL DISCAL BLACK SPOTS (Inside discal cell)
      ctx.fillStyle = '#05030a';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 6;

      // Central prominent black spot
      ctx.beginPath();
      ctx.ellipse(340, 580, 26, 18, -0.35, 0, Math.PI * 2);
      ctx.fill();

      // Discal cross-vein black bar
      ctx.beginPath();
      ctx.ellipse(430, 550, 20, 12, -0.5, 0, Math.PI * 2);
      ctx.fill();

      // Sub-basal black dot near wing root
      ctx.beginPath();
      ctx.arc(220, 660, 14, 0, Math.PI * 2);
      ctx.fill();

      // 2. POST-DISCAL ARC OF BOLD BLACK BUTTERFLY SPOTS
      // Distinctive curved series of velvety black spots situated between veins in wing cells
      const blackSpots = [
        { x: 740, y: 250, rx: 25, ry: 18, rot: -0.42 }, // Sub-apical cell
        { x: 720, y: 380, rx: 28, ry: 20, rot: -0.28 }, // Upper radial cell
        { x: 670, y: 510, rx: 32, ry: 22, rot: -0.12 }, // Mid wing cell (Largest boldest spot)
        { x: 610, y: 640, rx: 29, ry: 20, rot: 0.14 },  // Lower-mid cell
        { x: 530, y: 750, rx: 27, ry: 19, rot: 0.28 },  // Hindwing upper scallop
        { x: 430, y: 850, rx: 24, ry: 17, rot: 0.42 },  // Hindwing lower cell
        { x: 330, y: 920, rx: 20, ry: 15, rot: 0.55 }   // Hindwing swallowtail lobe
      ];

      blackSpots.forEach((spot) => {
        // Subtle luminous cyan halo border around each black spot (makes it pop against blue)
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.ellipse(spot.x, spot.y, spot.rx + 2, spot.ry + 2, spot.rot, 0, Math.PI * 2);
        ctx.stroke();

        // Solid velvety jet-black spot core
        ctx.fillStyle = '#05030a';
        ctx.beginPath();
        ctx.ellipse(spot.x, spot.y, spot.rx, spot.ry, spot.rot, 0, Math.PI * 2);
        ctx.fill();

        // Subtle specular highlight on black spot (chitin scale sheen)
        ctx.fillStyle = 'rgba(165, 243, 252, 0.25)';
        ctx.beginPath();
        ctx.arc(spot.x - spot.rx * 0.25, spot.y - spot.ry * 0.25, spot.rx * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. SUBMARGINAL BLACK CHEVRON / LUNULE SPOTS (Arrowhead spots along margin)
      ctx.fillStyle = '#05030a';
      const chevronSpots = [
        [830, 210, 16],
        [810, 330, 18],
        [770, 460, 18],
        [710, 580, 17],
        [640, 700, 16],
        [540, 810, 15]
      ];
      chevronSpots.forEach(([cx, cy, sz]) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, sz, sz * 0.7, -0.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. HINDWING TAIL OCELLI (Prominent eyespots on lower wing with cyan crescents)
      const hindwingOcelli = [
        { x: 620, y: 880, r: 24 },
        { x: 490, y: 940, r: 21 }
      ];
      hindwingOcelli.forEach((ocellus) => {
        // Outer cyan ring
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ocellus.x, ocellus.y, ocellus.r + 2, 0, Math.PI * 2);
        ctx.stroke();

        // Deep black center
        ctx.fillStyle = '#05030a';
        ctx.beginPath();
        ctx.arc(ocellus.x, ocellus.y, ocellus.r, 0, Math.PI * 2);
        ctx.fill();

        // Inner electric cyan crescent
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ocellus.x - ocellus.r * 0.25, ocellus.y - ocellus.r * 0.25, ocellus.r * 0.32, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. DOUBLE ROW OF PEARL-WHITE LUNAR ACCENT SPOTS ALONG MARGIN
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      const outerSpots = [
        [940, 220, 7.5], [920, 340, 8.5], [870, 480, 8.5], [810, 610, 8.0],
        [730, 730, 7.5], [630, 830, 7.0], [510, 900, 6.5], [890, 140, 9.0], [790, 90, 7.5]
      ];
      outerSpots.forEach(([x, y, r]) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Inner row of delicate accent spots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      const innerSpots = [
        [870, 260, 4.5], [850, 360, 5.0], [800, 480, 5.0], [740, 590, 4.5], [660, 700, 4.0]
      ];
      innerSpots.forEach(([x, y, r]) => {
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

    const wingTexture = createWingTexture();

    // 4. UNIFIED SINGLE WING SILHOUETTE GEOMETRY (EXACTLY 1 WING LEFT, 1 WING RIGHT = 2 WINGS TOTAL!)
    // Real complete butterfly wing outline incorporating forewing apex, scalloped margin, and swallowtail hindwing lobe
    const createSingleWingShape = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0); // Root hinge attachment

      // Forewing Leading Edge (Sweeps majestically up and out)
      shape.bezierCurveTo(0.3, 0.6, 0.9, 1.6, 1.5, 2.3);
      shape.bezierCurveTo(1.8, 2.7, 2.3, 2.9, 2.7, 2.8); // Forewing Apex

      // Forewing Outer Margin (Curving down with delicate scallops)
      shape.bezierCurveTo(2.95, 2.5, 3.0, 1.9, 2.7, 1.3);
      shape.bezierCurveTo(2.4, 0.8, 2.1, 0.4, 1.8, 0.15); // Outer notch between wings

      // Hindwing Scalloped Outer Margin (Elegant swallowtail curve)
      shape.bezierCurveTo(2.1, -0.2, 2.3, -0.7, 2.2, -1.3);
      shape.bezierCurveTo(2.1, -1.9, 1.7, -2.4, 1.2, -2.2); // Swallowtail lobe

      // Hindwing Inner Margin (Returning gracefully to body root)
      shape.bezierCurveTo(0.7, -1.9, 0.3, -1.2, 0.1, -0.5);
      shape.bezierCurveTo(0.04, -0.2, 0.01, -0.08, 0, 0);

      return shape;
    };

    const singleWingShape = createSingleWingShape();
    // Subdivided 2D geometry for realistic aerodynamic camber and vertex flexing
    const wingGeo = new THREE.ShapeGeometry(singleWingShape, 24);

    // Compute bounding box and normalize UV coordinates perfectly across the wing
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
      // Perfect UV mapping to texture
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

    // 5. BUTTERFLY BODY & HIERARCHY
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

    // Antennae (2 graceful curved antennae with teardrop club tips)
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

    // Articulated Abdomen (Dynamically curls with climb/descent/turns)
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

    // Overall Butterfly Scale (Sleek, lifelike proportions)
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
