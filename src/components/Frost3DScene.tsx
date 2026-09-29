'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Frost3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Strict PC / Desktop detection: screen width >= 1024px and not mobile touch
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

    // 1. Scene, Camera, Renderer Setup
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
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const primaryLight = new THREE.DirectionalLight(0xd946ef, 3.5); // Neon Pink/Purple
    primaryLight.position.set(12, 15, 10);
    scene.add(primaryLight);

    const secondaryLight = new THREE.DirectionalLight(0x06b6d4, 3.5); // Neon Cyan
    secondaryLight.position.set(-12, -10, 8);
    scene.add(secondaryLight);

    const backRimLight = new THREE.PointLight(0xa855f7, 4, 30); // Deep Purple backlight
    backRimLight.position.set(0, 0, -5);
    scene.add(backRimLight);

    // 3. 3D MODEL 1: THE FROST TESSERACT (Minecraft Cyber Core)
    const cubeGroup = new THREE.Group();

    // Outer translucent Ice Cube
    const cubeGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const cubeMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x083344,
      emissiveIntensity: 0.4,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 1.5,
      transparent: true,
      opacity: 0.85,
      wireframe: false
    });
    const outerCube = new THREE.Mesh(cubeGeo, cubeMat);
    cubeGroup.add(outerCube);

    // Outer glowing Wireframe edges
    const wireGeo = new THREE.EdgesGeometry(cubeGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    cubeGroup.add(wireframe);

    // Inner Glowing Core (Octahedron inside cube)
    const innerGeo = new THREE.OctahedronGeometry(1.0, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xf43f5e,
      emissiveIntensity: 1.5,
      metalness: 0.8,
      roughness: 0.2
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    cubeGroup.add(innerCore);

    // Initial position of Model 1 (Right margin)
    cubeGroup.position.set(9.5, 3.5, 0);
    scene.add(cubeGroup);

    // 4. 3D MODEL 2: THE FROST DIAMOND SHARD (Geodesic Ice Crystal)
    const diamondGroup = new THREE.Group();

    const diamondGeo = new THREE.IcosahedronGeometry(1.8, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x581c87,
      emissiveIntensity: 0.6,
      metalness: 0.85,
      roughness: 0.15,
      flatShading: true
    });
    const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
    diamondGroup.add(diamondMesh);

    // Diamond wireframe accent ring
    const diamondWireGeo = new THREE.EdgesGeometry(diamondGeo);
    const diamondWireMat = new THREE.LineBasicMaterial({
      color: 0xe879f9,
      transparent: true,
      opacity: 0.7
    });
    const diamondWire = new THREE.LineSegments(diamondWireGeo, diamondWireMat);
    diamondGroup.add(diamondWire);

    // Orbiting micro satellite shards around the diamond
    const shardGeo = new THREE.TetrahedronGeometry(0.35, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      emissiveIntensity: 1.2
    });

    const shards: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      diamondGroup.add(shard);
      shards.push(shard);
    }

    // Initial position of Model 2 (Left margin)
    diamondGroup.position.set(-9.5, -4, 0);
    scene.add(diamondGroup);

    // 5. 3D MODEL 3: THE CYBER TORUS KNOT (Holographic Reactor Ring)
    const knotGroup = new THREE.Group();

    const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.42, 90, 16, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0x831843,
      emissiveIntensity: 0.7,
      metalness: 0.7,
      roughness: 0.2
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    knotGroup.add(knotMesh);

    // Initial position of Model 3 (Right margin lower)
    knotGroup.position.set(9.0, -11, 0);
    scene.add(knotGroup);

    // 6. 3D AMBIENT FROST PARTICLES (Floating Star Dust)
    const particleCount = 85;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 35;     // X: across viewport
      particlePositions[i + 1] = (Math.random() - 0.5) * 35; // Y: across viewport
      particlePositions[i + 2] = (Math.random() - 0.5) * 15; // Z: depth
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xa5f3fc,
      size: 0.16,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Interactive State tracking (Scroll & Mouse Parallax)
    let scrollProgress = 0;
    let targetScrollProgress = 0;

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

    const onResize = () => {
      if (!checkIsDesktop()) {
        setIsDesktop(false);
        return;
      }
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    // 8. Animation & Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Smooth Lerp for scroll & mouse movement
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Model 1: Frost Tesseract Animations
      // As scroll proceeds, the cube descends smoothly down the right rail, rotating dynamically
      const cubeBaseY = 4.5 - scrollProgress * 14;
      cubeGroup.position.y = cubeBaseY + Math.sin(elapsed * 1.5) * 0.35 + mouseY * 0.4;
      cubeGroup.position.x = 9.2 + Math.cos(elapsed * 1.2) * 0.25 + mouseX * 0.5;

      cubeGroup.rotation.x = elapsed * 0.4 + scrollProgress * Math.PI * 4;
      cubeGroup.rotation.y = elapsed * 0.6 + scrollProgress * Math.PI * 3;
      innerCore.rotation.x = -elapsed * 1.2;
      innerCore.rotation.y = elapsed * 1.4;

      // Model 2: Frost Diamond Shard Animations
      // Floats on the left margin, ascends and tumbles with scroll
      const diamondBaseY = -6.5 + scrollProgress * 12;
      diamondGroup.position.y = diamondBaseY + Math.cos(elapsed * 1.4) * 0.4 - mouseY * 0.4;
      diamondGroup.position.x = -9.2 + Math.sin(elapsed * 1.1) * 0.25 + mouseX * 0.4;

      diamondGroup.rotation.y = elapsed * 0.5 + scrollProgress * Math.PI * 3;
      diamondGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.2 + scrollProgress * Math.PI * 2;

      // Orbiting micro shards
      shards.forEach((shard, idx) => {
        const angle = elapsed * 2.2 + idx * ((Math.PI * 2) / 3);
        const radius = 2.4;
        shard.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.2) * 0.8, Math.sin(angle) * radius);
        shard.rotation.x += 0.04;
        shard.rotation.y += 0.06;
      });

      // Model 3: Cyber Torus Knot Animations
      // Sweeps into view lower in the page near videos/community sections
      const knotBaseY = -12 + scrollProgress * 16;
      knotGroup.position.y = knotBaseY + Math.sin(elapsed * 1.6) * 0.35;
      knotGroup.position.x = 8.8 + Math.cos(elapsed * 1.3) * 0.3 - mouseX * 0.4;

      knotGroup.rotation.x = elapsed * 0.6 + scrollProgress * Math.PI * 3;
      knotGroup.rotation.y = elapsed * 0.8 + scrollProgress * Math.PI * 4;

      // Ambient Particles gentle drift
      particles.rotation.y = elapsed * 0.04 + scrollProgress * 0.5;
      particles.rotation.x = Math.sin(elapsed * 0.05) * 0.1;

      // Dynamic Camera Parallax based on mouse
      camera.position.x = mouseX * 0.6;
      camera.position.y = -mouseY * 0.6;
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

      // Dispose Geometries and Materials to prevent memory leaks
      [cubeGeo, wireGeo, innerGeo, diamondGeo, diamondWireGeo, shardGeo, knotGeo, particleGeo].forEach(g => g.dispose());
      [cubeMat, wireMat, innerMat, diamondMat, diamondWireMat, shardMat, knotMat, particleMat].forEach(m => m.dispose());

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
      className="fixed inset-0 pointer-events-none z-20 hidden lg:block overflow-hidden transition-opacity duration-1000"
      style={{
        opacity: isDesktop ? 1 : 0,
        display: isDesktop ? 'block' : 'none'
      }}
    />
  );
}
