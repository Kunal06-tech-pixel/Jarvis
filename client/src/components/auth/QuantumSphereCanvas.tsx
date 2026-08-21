import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface QuantumSphereCanvasProps {
  className?: string;
  cameraDistance?: number;
  particleCount?: number;
}

export default function QuantumSphereCanvas({
  className = 'w-full h-full',
  cameraDistance = 18,
  particleCount = 200,
}: QuantumSphereCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 1024;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = isMobile ? cameraDistance * 1.15 : cameraDistance;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Glowing Inner Icosahedron (Neural Nucleus)
    const innerGeo = new THREE.IcosahedronGeometry(isMobile ? 3.8 : 4.2, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: isMobile ? 0.45 : 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 2. Dual Gyroscopic Orbital Torus Rings
    const torusRadius = isMobile ? 5.6 : 6.2;
    const torusGeo = new THREE.TorusGeometry(torusRadius, 0.08, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: isMobile ? 0.7 : 0.6,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    coreGroup.add(torusMesh);

    const torusGeo2 = new THREE.TorusGeometry(torusRadius * 1.1, 0.06, 16, 100);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: isMobile ? 0.55 : 0.45,
    });
    const torusMesh2 = new THREE.Mesh(torusGeo2, torusMat2);
    torusMesh2.rotation.y = Math.PI / 4;
    coreGroup.add(torusMesh2);

    // 3. Ambient Star Dust / Constellation Particles
    const count = isMobile ? Math.floor(particleCount * 0.75) : particleCount;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const radius = (isMobile ? 5.5 : 7) + Math.random() * (isMobile ? 5 : 6);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: isMobile ? 0.35 : 0.28,
      transparent: true,
      opacity: isMobile ? 0.85 : 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particleSystem);

    // Mouse / Touch Interaction Parallax
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.4;
      targetRotationX = -y * 0.3;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = x * 0.3;
        targetRotationX = -y * 0.2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animateScene = () => {
      animationFrameId = requestAnimationFrame(animateScene);
      const elapsedTime = clock.getElapsedTime();

      // Smooth multi-axis rotations
      innerMesh.rotation.y = elapsedTime * 0.18;
      innerMesh.rotation.x = elapsedTime * 0.12;

      torusMesh.rotation.z = elapsedTime * 0.25;
      torusMesh2.rotation.x = elapsedTime * -0.2;

      particleSystem.rotation.y = elapsedTime * 0.05;

      // Soft harmonic breathing on mobile
      const breath = 1 + Math.sin(elapsedTime * 1.5) * 0.03;
      coreGroup.scale.set(breath, breath, breath);

      // Spring towards target
      coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animateScene();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.position.z = w < 1024 ? cameraDistance * 1.15 : cameraDistance;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      torusGeo2.dispose();
      torusMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [cameraDistance, particleCount]);

  return <div ref={mountRef} className={className} />;
}
