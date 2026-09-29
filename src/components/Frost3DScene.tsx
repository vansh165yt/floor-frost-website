'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Frost3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Enable on desktop / large screens >= 1024px
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

    // 1. Scene, Camera & Renderer
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
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pinkLight = new THREE.DirectionalLight(0xd946ef, 3.0);
    pinkLight.position.set(10, 12, 10);
    scene.add(pinkLight);

    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 3.0);
    cyanLight.position.set(-10, -8, 8);
    scene.add(cyanLight);

    // 3. BUTTERFLY 3D MODEL HIERARCHY
    const butterflyRoot = new THREE.Group();
    scene.add(butterflyRoot);

    // Center Core Glow Light (Moves with butterfly)
    const butterflyLight = new THREE.PointLight(0x22d3ee, 2.5, 8);
    butterflyRoot.add(butterflyLight);

    // --- BODY (Head, Thorax, Abdomen, Antennae) ---
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2
    });

    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0x00f5ff
    });

    // Thorax
    const thoraxGeo = new THREE.SphereGeometry(0.2, 16, 16);
    thoraxGeo.scale(0.8, 1.2, 0.7);
    const thorax = new THREE.Mesh(thoraxGeo, bodyMat);
    butterflyRoot.add(thorax);

    // Head
    const headGeo = new THREE.SphereGeometry(0.15, 14, 14);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 0.32, 0.05);
    butterflyRoot.add(head);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(0.07, 0.36, 0.14);
    butterflyRoot.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(-0.07, 0.36, 0.14);
    butterflyRoot.add(rightEye);

    // Abdomen (Tapered)
    const abdomenGeo = new THREE.ConeGeometry(0.14, 0.8, 14);
    abdomenGeo.rotateX(Math.PI);
    const abdomen = new THREE.Mesh(abdomenGeo, bodyMat);
    abdomen.position.set(0, -0.52, 0);
    butterflyRoot.add(abdomen);

    // Antennae (Delicate curved lines with glowing tips)
    const createAntenna = (isLeft: boolean) => {
      const group = new THREE.Group();
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? 0.1 : -0.1, 0.2, 0.1),
        new THREE.Vector3(isLeft ? 0.22 : -0.22, 0.45, 0.2),
        new THREE.Vector3(isLeft ? 0.3 : -0.3, 0.55, 0.15)
      );
      const points = curve.getPoints(12);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85
      });
      const antennaLine = new THREE.Line(lineGeo, lineMat);
      group.add(antennaLine);

      // Glowing tip
      const tipGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.copy(points[points.length - 1]);
      group.add(tip);

      group.position.set(0, 0.36, 0.08);
      return group;
    };

    butterflyRoot.add(createAntenna(true));
    butterflyRoot.add(createAntenna(false));

    // --- WINGS CREATION (Dual-wing procedural shape) ---
    const createWingShape = () => {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);

      // Forewing (Upper large graceful wing)
      shape.bezierCurveTo(0.2, 0.5, 0.7, 1.2, 1.2, 1.8);
      shape.bezierCurveTo(1.6, 2.3, 2.1, 2.5, 2.4, 2.3);
      shape.bezierCurveTo(2.7, 2.0, 2.6, 1.4, 2.2, 0.8);
      shape.bezierCurveTo(1.8, 0.3, 1.3, 0.05, 0.8, -0.05);

      // Hindwing (Lower scalloped wing)
      shape.bezierCurveTo(1.2, -0.3, 1.6, -0.7, 1.7, -1.3);
      shape.bezierCurveTo(1.7, -1.9, 1.2, -2.3, 0.8, -2.1);
      shape.bezierCurveTo(0.4, -1.8, 0.2, -1.2, 0.1, -0.6);
      shape.bezierCurveTo(0.05, -0.3, 0.02, -0.1, 0, 0);

      return shape;
    };

    const wingShape = createWingShape();
    const wingGeo = new THREE.ShapeGeometry(wingShape);

    // Glowing Holographic Frost Wing Material (Translucent with neon rim)
    const wingMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0xa855f7,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.3,
      transmission: 0.55,
      thickness: 0.6,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

    // Glowing Wing Edge Lines
    const wingEdgesGeo = new THREE.EdgesGeometry(wingGeo);
    const wingEdgesMat = new THREE.LineBasicMaterial({
      color: 0xe879f9,
      transparent: true,
      opacity: 0.9,
      linewidth: 2
    });

    // Wing Veins (Delicate internal structural lines)
    const createWingVeins = () => {
      const group = new THREE.Group();
      const veinMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.7
      });

      const veins = [
        [new THREE.Vector3(0, 0, 0.01), new THREE.Vector3(1.1, 0.8, 0.01), new THREE.Vector3(2.3, 2.2, 0.01)],
        [new THREE.Vector3(0, 0, 0.01), new THREE.Vector3(1.0, 0.3, 0.01), new THREE.Vector3(2.1, 0.9, 0.01)],
        [new THREE.Vector3(0, 0, 0.01), new THREE.Vector3(0.6, -0.4, 0.01), new THREE.Vector3(1.5, -1.4, 0.01)],
        [new THREE.Vector3(0, 0, 0.01), new THREE.Vector3(0.3, -0.5, 0.01), new THREE.Vector3(0.8, -1.9, 0.01)]
      ];

      veins.forEach((pts) => {
        const curve = new THREE.CatmullRomCurve3(pts);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(10));
        group.add(new THREE.Line(geo, veinMat));
      });

      return group;
    };

    // Left Wing Assembly (Pivots around Y axis)
    const leftWingHinge = new THREE.Group();
    leftWingHinge.position.set(0.06, 0.05, 0.02);

    const leftWingMesh = new THREE.Mesh(wingGeo, wingMat);
    leftWingHinge.add(leftWingMesh);
    leftWingHinge.add(new THREE.LineSegments(wingEdgesGeo, wingEdgesMat));
    leftWingHinge.add(createWingVeins());
    butterflyRoot.add(leftWingHinge);

    // Right Wing Assembly (Mirrored X, Pivots around Y axis)
    const rightWingHinge = new THREE.Group();
    rightWingHinge.position.set(-0.06, 0.05, 0.02);

    const rightWingContainer = new THREE.Group();
    rightWingContainer.scale.set(-1, 1, 1);
    rightWingContainer.add(new THREE.Mesh(wingGeo, wingMat));
    rightWingContainer.add(new THREE.LineSegments(wingEdgesGeo, wingEdgesMat));
    rightWingContainer.add(createWingVeins());

    rightWingHinge.add(rightWingContainer);
    butterflyRoot.add(rightWingHinge);

    // Initial Scale of Butterfly
    butterflyRoot.scale.set(0.85, 0.85, 0.85);

    // 4. MAGICAL FAIRY DUST / FROST TRAIL PARTICLES
    const trailCount = 55;
    const trailPositions = new Float32Array(trailCount * 3);
    const trailOpacities = new Float32Array(trailCount);
    const trailLife = new Float32Array(trailCount);

    for (let i = 0; i < trailCount; i++) {
      trailPositions[i * 3] = 0;
      trailPositions[i * 3 + 1] = 0;
      trailPositions[i * 3 + 2] = -20;
      trailLife[i] = Math.random();
    }

    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

    const trailMat = new THREE.PointsMaterial({
      color: 0xa5f3fc,
      size: 0.16,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });

    const trailPoints = new THREE.Points(trailGeo, trailMat);
    scene.add(trailPoints);

    // 5. Scroll & Mouse Tracking
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let lastScrollProgress = 0;
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

    // Dynamic flight curve calculation based on viewport bounds
    const getFlightPath = () => {
      const aspect = window.innerWidth / window.innerHeight;
      const vHalfHeight = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const vHalfWidth = vHalfHeight * aspect;

      // Safe outer rail positions (never enters central content area)
      const rightRailX = Math.min(vHalfWidth - 1.8, Math.max(7.0, vHalfWidth * 0.72));
      const leftRailX = -rightRailX;

      // Smooth 3D Spline Path across the website as user scrolls
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(rightRailX, 3.8, 0.5),           // 0.0: Top Hero right rail
        new THREE.Vector3(rightRailX - 0.5, 1.2, 1.0),     // 0.2: Gliding down right
        new THREE.Vector3(leftRailX + 0.8, -1.0, 0.2),      // 0.4: Banking towards left rail
        new THREE.Vector3(leftRailX, -3.2, 0.8),           // 0.6: About creator left rail
        new THREE.Vector3(rightRailX - 0.4, -4.8, 0.0),    // 0.8: Videos section right rail
        new THREE.Vector3(rightRailX, -6.5, -0.4)          // 1.0: Community footer rail
      ]);
    };

    let flightCurve = getFlightPath();

    const onResize = () => {
      if (!checkIsDesktop()) {
        setIsDesktop(false);
        return;
      }
      setIsDesktop(true);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      flightCurve = getFlightPath();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    // 6. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let flapPhase = 0;
    let trailIndex = 0;

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth scroll lerp
      const prevScroll = scrollProgress;
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.07;
      scrollVelocity = Math.abs(scrollProgress - prevScroll) * 50;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Calculate position along 3D flight path
      const clampedProgress = Math.min(0.999, Math.max(0.001, scrollProgress));
      const pathPoint = flightCurve.getPoint(clampedProgress);
      const pathTangent = flightCurve.getTangent(clampedProgress);

      // Natural hovering & mouse parallax influence
      const hoverY = Math.sin(elapsed * 2.8) * 0.18;
      const hoverX = Math.cos(elapsed * 2.2) * 0.12;

      butterflyRoot.position.x = pathPoint.x + hoverX + mouseX * 0.4;
      butterflyRoot.position.y = pathPoint.y + hoverY - mouseY * 0.3;
      butterflyRoot.position.z = pathPoint.z;

      // Dynamic Banking & Flight Rotation
      // Butterfly points forward along its travel tangent and banks on turns
      const targetPitch = Math.atan2(pathTangent.y, Math.sqrt(pathTangent.x * pathTangent.x + pathTangent.z * pathTangent.z)) * 0.45;
      const targetRoll = -pathTangent.x * 0.5 + Math.sin(elapsed * 2.0) * 0.08;
      const targetYaw = Math.atan2(pathTangent.x, pathTangent.z) * 0.3 + mouseX * 0.2;

      butterflyRoot.rotation.x = targetPitch + 0.15;
      butterflyRoot.rotation.y = targetYaw;
      butterflyRoot.rotation.z = targetRoll;

      // DYNAMIC WING FLAPPING
      // Flaps faster when scrolling, flutters gently when resting
      const flapFrequency = 6.0 + scrollVelocity * 14.0;
      flapPhase += flapFrequency * 0.016;

      const flapAmplitude = 0.65 + Math.min(0.35, scrollVelocity * 0.4);
      const flapAngle = Math.sin(flapPhase) * flapAmplitude;

      // Left wing flap
      leftWingHinge.rotation.y = flapAngle;
      leftWingHinge.rotation.z = Math.sin(flapPhase) * 0.08;

      // Right wing flap (symmetrical mirror)
      rightWingHinge.rotation.y = -flapAngle;
      rightWingHinge.rotation.z = -Math.sin(flapPhase) * 0.08;

      // SPARKLE / FROST TRAIL EMISSION
      if (Math.random() < 0.4 + scrollVelocity * 0.5) {
        trailIndex = (trailIndex + 1) % trailCount;
        const offsetLeft = Math.random() > 0.5;
        trailPositions[trailIndex * 3] = butterflyRoot.position.x + (offsetLeft ? -0.4 : 0.4);
        trailPositions[trailIndex * 3 + 1] = butterflyRoot.position.y - 0.2;
        trailPositions[trailIndex * 3 + 2] = butterflyRoot.position.z - 0.1;
      }

      // Drift and fade trail particles
      const posAttr = trailGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < trailCount; i++) {
        if (trailPositions[i * 3 + 2] > -15) {
          trailPositions[i * 3 + 1] -= 0.018; // Gently sink
          trailPositions[i * 3 + 2] -= 0.03;  // Drift backwards
        }
      }
      posAttr.needsUpdate = true;

      // Camera subtle parallax
      camera.position.x = mouseX * 0.3;
      camera.position.y = -mouseY * 0.3;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 7. Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);

      // Cleanup geometries and materials
      [thoraxGeo, headGeo, eyeGeo, abdomenGeo, wingGeo, wingEdgesGeo, trailGeo].forEach(g => g.dispose());
      [bodyMat, eyeMat, wingMat, wingEdgesMat, trailMat].forEach(m => m.dispose());

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
