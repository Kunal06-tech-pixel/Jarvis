import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface NodeData {
  id: string;
  name: string;
  type: 'task' | 'event' | 'reminder';
  color: number;
}

interface ProductivityConstellation3DProps {
  pendingTasks: number;
  upcomingEvents: number;
  activeReminders: number;
}

export default function ProductivityConstellation3D({
  pendingTasks,
  upcomingEvents,
  activeReminders,
}: ProductivityConstellation3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = 240;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2, 7);
    camera.lookAt(0, 0, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 3. Central Anchor Nucleus
    const nucleusGeo = new THREE.OctahedronGeometry(0.7, 2);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x0284c7,
      emissiveIntensity: 0.7,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    scene.add(nucleus);

    // 4. Create Interactive Orbiting Data Nodes
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const nodeObjects: { mesh: THREE.Mesh; data: NodeData; angle: number; radius: number; speed: number; yOffset: number }[] = [];

    // Helper to add nodes
    const addNodes = (count: number, type: 'task' | 'event' | 'reminder', color: number, baseRadius: number) => {
      const displayCount = Math.min(Math.max(count, 1), 6);
      for (let i = 0; i < displayCount; i++) {
        const geo = type === 'task' ? new THREE.BoxGeometry(0.28, 0.28, 0.28) : type === 'event' ? new THREE.SphereGeometry(0.2, 16, 16) : new THREE.TetrahedronGeometry(0.25);
        const mat = new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.6,
          roughness: 0.2,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData = {
          name: `${type.toUpperCase()} #${i + 1}`,
          type: type,
        };

        const angle = (i / displayCount) * Math.PI * 2 + Math.random() * 0.5;
        const radius = baseRadius + (Math.random() - 0.5) * 0.4;
        const speed = (0.008 + (Math.random() * 0.006)) * (baseRadius % 2 === 0 ? 1 : -1);
        const yOffset = (Math.random() - 0.5) * 1.2;

        nodesGroup.add(mesh);
        nodeObjects.push({
          mesh,
          data: { id: `${type}-${i}`, name: `${type.toUpperCase()} #${i + 1}`, type, color },
          angle,
          radius,
          speed,
          yOffset,
        });
      }
    };

    addNodes(pendingTasks, 'task', 0x38bdf8, 2.2); // Cyan Tasks
    addNodes(upcomingEvents, 'event', 0x2563eb, 3.2); // Blue Events
    addNodes(activeReminders, 'reminder', 0xef4444, 4.0); // Red Reminders

    // 5. Connective Synapse Line Lattice
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
    });
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);

    // 6. Lights
    const pLight = new THREE.PointLight(0x38bdf8, 2.5, 10);
    pLight.position.set(0, 3, 3);
    scene.add(pLight);

    const aLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(aLight);

    // 7. Raycaster for Mouse Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
    };

    container.addEventListener('mousemove', handlePointerMove);

    // 8. Dynamic Render Loop with Visibility Check
    let animationFrameId: number;
    let isTabVisible = !document.hidden;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startTime = performance.now();

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

      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      if (!prefersReducedMotion) {
        nucleus.rotation.y += 0.005;
        nucleus.rotation.x += 0.002;

        const linePositions: number[] = [];

        nodeObjects.forEach((node) => {
          node.angle += node.speed;
          const x = Math.cos(node.angle) * node.radius;
          const z = Math.sin(node.angle) * node.radius;
          const y = node.yOffset + Math.sin(elapsed * 2 + node.angle) * 0.2;

          node.mesh.position.set(x, y, z);
          node.mesh.rotation.y += 0.02;
          node.mesh.rotation.x += 0.01;

          // Line to center nucleus
          linePositions.push(0, 0, 0);
          linePositions.push(x, y, z);
        });

        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      }

      // Raycasting check
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeObjects.map((n) => n.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        setHoveredNode(hit.userData.name || 'Active Node');
        hit.scale.set(1.4, 1.4, 1.4);
      } else {
        setHoveredNode(null);
        nodeObjects.forEach((n) => n.mesh.scale.set(1, 1, 1));
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 400;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };

    window.addEventListener('resize', handleResize);

    // 10. Defensive Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      container.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      nucleusGeo.dispose();
      nucleusMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      nodeObjects.forEach((n) => {
        n.mesh.geometry.dispose();
        (n.mesh.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, [pendingTasks, upcomingEvents, activeReminders]);

  return (
    <div className="relative w-full rounded-2xl bg-[#0D111A] border border-white/[0.08] p-4 overflow-hidden shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-electric-cyan" />
          <h4 className="text-xs font-bold tracking-wider text-white uppercase">3D Productivity Constellation</h4>
        </div>
        <div className="text-[11px] text-slate-300 font-mono">
          {hoveredNode ? <span className="text-electric-cyan font-bold">{hoveredNode}</span> : 'Hover node to inspect'}
        </div>
      </div>

      <div ref={containerRef} className="w-full h-[240px] flex items-center justify-center cursor-grab" />
      
      <div className="flex items-center justify-center gap-6 mt-1 text-[11px] text-slate-300 font-medium">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#38BDF8]" /> Tasks ({pendingTasks})</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2563EB]" /> Events ({upcomingEvents})</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Reminders ({activeReminders})</span>
      </div>
    </div>
  );
}
