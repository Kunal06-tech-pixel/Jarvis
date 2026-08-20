import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface QuantumVoiceCore3DProps {
  isRecording: boolean;
  isProcessing: boolean;
  audioStream?: MediaStream | null;
}

export default function QuantumVoiceCore3D({
  isRecording,
  isProcessing,
  audioStream,
}: QuantumVoiceCore3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioDataRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Set up real-time audio analysis with defensive cleanup
  useEffect(() => {
    if (isRecording && audioStream) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.8;

        const source = ctx.createMediaStreamSource(audioStream);
        source.connect(analyser);

        audioContextRef.current = ctx;
        analyserRef.current = analyser;
        audioDataRef.current = new Uint8Array(analyser.frequencyBinCount);
        sourceRef.current = source;
      } catch (err) {
        console.warn('Web Audio analyzer initialization warning:', err);
      }
    } else {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      audioDataRef.current = null;
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [isRecording, audioStream]);

  // Set up Three.js WebGL Scene with performance and reduced motion awareness
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 640;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || (isMobile ? 280 : 360);
    const height = container.clientHeight || (isMobile ? 280 : 360);

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // 2. WebGL Renderer with Alpha & Antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 3. Central Holographic Core (Wireframe + Translucent Inner Sphere)
    // 3 subdivisions on mobile (reduced geometry load), 4 on desktop
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, isMobile ? 3 : 4);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x2563eb,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Inner Glowing Singularity Core
    const innerGeometry = new THREE.SphereGeometry(1.1, isMobile ? 20 : 32, isMobile ? 20 : 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerMesh);

    // 4. Orbital Flux Rings (Gyroscopic 3D Rings)
    const ringCount = isMobile ? 2 : 3;
    const rings: THREE.Line[] = [];
    for (let i = 0; i < ringCount; i++) {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = isMobile ? 60 : 90;
      const radius = 2.2 + i * 0.35;
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      ringGeo.setFromPoints(points);

      const ringMat = new THREE.LineBasicMaterial({
        color: i === 0 ? 0x38bdf8 : i === 1 ? 0x2563eb : 0x0ea5e9,
        transparent: true,
        opacity: 0.5 - i * 0.12,
      });

      const ringLine = new THREE.Line(ringGeo, ringMat);
      ringLine.rotation.x = (i * Math.PI) / 3;
      ringLine.rotation.y = (i * Math.PI) / 4;
      scene.add(ringLine);
      rings.push(ringLine);
    }

    // 5. Quantum Particle Cloud (Scaled for mobile vs desktop)
    const particleCount = isMobile ? 80 : 160;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOriginals = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 2.0 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      particlePositions[i] = x;
      particlePositions[i + 1] = y;
      particlePositions[i + 2] = z;
      particleOriginals[i] = x;
      particleOriginals[i + 1] = y;
      particleOriginals[i + 2] = z;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: isMobile ? 0.04 : 0.055,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Ambient Point Light for metallic reflection
    const pointLight = new THREE.PointLight(0x38bdf8, 2, 50);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    scene.add(ambientLight);

    // Cache original core mesh vertex positions for vertex displacement
    const corePosAttr = coreGeometry.attributes.position;
    const origCorePositions = corePosAttr.array.slice() as Float32Array;

    // 7. Render Loop with Visibility Awareness and High-Precision Time
    let animationFrameId: number;
    let isTabVisible = !document.hidden;
    const startTime = performance.now();

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        animateScene();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const animateScene = () => {
      if (!isTabVisible) return;
      animationFrameId = requestAnimationFrame(animateScene);

      const now = performance.now();
      const elapsedTime = (now - startTime) * 0.001;

      // Real-time audio frequency analysis
      let audioAverage = 0;
      if (analyserRef.current && audioDataRef.current && isRecording) {
        analyserRef.current.getByteFrequencyData(audioDataRef.current as any);
        let sum = 0;
        for (let i = 0; i < audioDataRef.current.length; i++) {
          sum += audioDataRef.current[i];
        }
        audioAverage = sum / audioDataRef.current.length / 255;
      }

      const audioBoost = isRecording ? audioAverage * 1.8 : 0;

      // 1. Rotation dynamics
      const baseRotationSpeed = prefersReducedMotion 
        ? 0 
        : isRecording 
        ? 0.03 
        : isProcessing 
        ? 0.06 
        : 0.008;

      coreMesh.rotation.y += baseRotationSpeed;
      coreMesh.rotation.x += baseRotationSpeed * 0.6;

      // 2. Pulse inner core scale
      const pulseScale = prefersReducedMotion 
        ? 1.0 
        : isRecording 
        ? 1.0 + Math.sin(elapsedTime * 8) * 0.1 + audioAverage * 0.35
        : isProcessing 
        ? 1.0 + Math.sin(elapsedTime * 12) * 0.15 
        : 1.0 + Math.sin(elapsedTime * 2) * 0.04;
      innerMesh.scale.set(pulseScale, pulseScale, pulseScale);

      // 3. Vertex deformation on icosahedron core based on audio & noise
      if (!prefersReducedMotion) {
        const positions = corePosAttr.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          const ox = origCorePositions[i];
          const oy = origCorePositions[i + 1];
          const oz = origCorePositions[i + 2];

          const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
          const normalX = ox / len;
          const normalY = oy / len;
          const normalZ = oz / len;

          const wave = Math.sin(ox * 3 + elapsedTime * 4) * Math.cos(oy * 3 + elapsedTime * 4) * audioBoost;
          const displacement = 1.0 + wave * 0.3;

          positions[i] = normalX * (1.6 * displacement);
          positions[i + 1] = normalY * (1.6 * displacement);
          positions[i + 2] = normalZ * (1.6 * displacement);
        }
        corePosAttr.needsUpdate = true;

        // Rotate flux rings
        rings.forEach((ring, idx) => {
          const dir = idx % 2 === 0 ? 1 : -1;
          ring.rotation.x += 0.008 * dir * (isProcessing ? 3 : 1);
          ring.rotation.y += 0.012 * dir * (isProcessing ? 3 : 1);
          ring.rotation.z += 0.005 * dir;
        });

        // Animate Quantum Particles
        const particlePos = particleGeometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          const angle = elapsedTime * 0.5 + i;
          const speed = (isRecording ? 1.8 : isProcessing ? 2.5 : 0.6);
          particlePos[i] = particleOriginals[i] * Math.cos(angle * speed * 0.2) - particleOriginals[i + 2] * Math.sin(angle * speed * 0.2);
          particlePos[i + 1] = particleOriginals[i + 1] + Math.sin(elapsedTime * 2 + i) * (0.05 + audioBoost * 0.15);
          particlePos[i + 2] = particleOriginals[i] * Math.sin(angle * speed * 0.2) + particleOriginals[i + 2] * Math.cos(angle * speed * 0.2);
        }
        particleGeometry.attributes.position.needsUpdate = true;
      }

      // Dynamic color shift based on state
      if (isRecording) {
        coreMaterial.emissive.setHex(0xef4444);
        coreMaterial.color.setHex(0xf87171);
        innerMaterial.color.setHex(0xef4444);
        pointLight.color.setHex(0xef4444);
      } else if (isProcessing) {
        coreMaterial.emissive.setHex(0x2563eb);
        coreMaterial.color.setHex(0x38bdf8);
        innerMaterial.color.setHex(0x38bdf8);
        pointLight.color.setHex(0x38bdf8);
      } else {
        coreMaterial.emissive.setHex(0x0284c7);
        coreMaterial.color.setHex(0x2563eb);
        innerMaterial.color.setHex(0x38bdf8);
        pointLight.color.setHex(0x38bdf8);
      }

      renderer.render(scene, camera);
    };

    animateScene();

    // 8. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || (isMobile ? 280 : 360);
      const newH = container.clientHeight || (isMobile ? 280 : 360);
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 9. Defensive Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      rings.forEach(r => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [isRecording, isProcessing]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center pointer-events-none select-none"
      style={{ touchAction: 'none' }}
    />
  );
}
