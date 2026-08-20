import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function SpatialConstellationBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 640;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 40;

    // 2. WebGL Renderer (low power, unclamped antialias disabled for background)
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 3. Stars / Constellation Points (scaled down for performance)
    const starCount = isMobile ? 100 : 200;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSpeeds = new Float32Array(starCount);

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 120;
      starPositions[i + 1] = (Math.random() - 0.5) * 80;
      starPositions[i + 2] = (Math.random() - 0.5) * 60;
      starSpeeds[i / 3] = 0.015 + Math.random() * 0.03;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: isMobile ? 0.7 : 0.85,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 4. Mouse Parallax coordinates
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      mouseX = (e.clientX - window.innerWidth / 2) * 0.006;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.006;
    };

    if (!prefersReducedMotion && !isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    // 5. Render Loop with Visibility Check
    let animationFrameId: number;
    let isTabVisible = !document.hidden;

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animate = () => {
      if (!isTabVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        // Smooth camera interpolation toward mouse position
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        camera.position.x = targetX * 1.2;
        camera.position.y = -targetY * 1.2;
        camera.lookAt(0, 0, 0);

        // Slow ambient star drift
        const positions = starGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < starCount; i++) {
          const i3 = i * 3;
          positions[i3 + 2] += starSpeeds[i];
          if (positions[i3 + 2] > 30) {
            positions[i3 + 2] = -30;
          }
        }
        starGeometry.attributes.position.needsUpdate = true;

        // Slow rotation
        starField.rotation.y += 0.0002;
        starField.rotation.x += 0.00008;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Defensive Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden" 
      aria-hidden="true" 
    />
  );
}

