"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PETAL_COLORS = ["#f7efe4", "#ffe6d9", "#d4f4f4", "#ffffff"];
const CORE_COLOR = "#26a8a8";
const ACCENT_COLOR = "#ff8a5b";

function ParticleField() {
  const count = 60;
  const mesh = useRef<THREE.Points>(null);
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6;
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.015 + Math.random() * 0.025;
    }
    return [pos, sz];
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#7dd9d9"
        size={0.04}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function Petal({
  angle,
  tilt,
  radius,
  y,
  color,
  scale = 1,
}: {
  angle: number;
  tilt: number;
  radius: number;
  y: number;
  color: string;
  scale?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  return (
    <mesh
      ref={mesh}
      position={[Math.sin(angle) * radius, y, Math.cos(angle) * radius]}
      rotation={[tilt, angle, 0]}
      scale={[0.45 * scale, 1.35 * scale, 0.1 * scale]}
    >
      <coneGeometry args={[1, 2, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={0.35}
        metalness={0.15}
        transparent
        opacity={0.92}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LotusGroup() {
  const group = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y += delta * 0.12;
    group.current.position.y = Math.sin(t * 0.6) * 0.08;

    targetRotation.current.x = mouse.y * 0.12;
    targetRotation.current.y = mouse.x * 0.12;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotation.current.x,
      delta * 2
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -targetRotation.current.y * 0.5,
      delta * 2
    );
  });

  const innerPetals = useMemo(() => {
    const petals = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      petals.push(
        <Petal
          key={`inner-${i}`}
          angle={angle}
          tilt={0.35}
          radius={0.55}
          y={0.15}
          color={PETAL_COLORS[i % PETAL_COLORS.length]}
          scale={0.85}
        />
      );
    }
    return petals;
  }, []);

  const outerPetals = useMemo(() => {
    const petals = [];
    const count = 9;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + 0.35;
      petals.push(
        <Petal
          key={`outer-${i}`}
          angle={angle}
          tilt={0.75}
          radius={1.05}
          y={-0.1}
          color={PETAL_COLORS[(i + 2) % PETAL_COLORS.length]}
          scale={1.15}
        />
      );
    }
    return petals;
  }, []);

  return (
    <group ref={group}>
      {outerPetals}
      {innerPetals}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={CORE_COLOR}
          emissive={CORE_COLOR}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, 0]} scale={[1, 1, 1]}>
        <torusGeometry args={[0.42, 0.015, 16, 64]} />
        <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function Scene() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 0.3, 3.6);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={1.4} color="#fff5ef" />
      <pointLight position={[-4, -2, 3]} intensity={0.8} color="#7dd9d9" />
      <ParticleField />
      <LotusGroup />
    </>
  );
}

export default function LotusScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 45, near: 0.1, far: 20 }}
      style={{ background: "transparent" }}
    >
      <Scene />
    </Canvas>
  );
}
