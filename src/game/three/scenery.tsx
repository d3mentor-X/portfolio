import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD, type PropDef } from '@/config/world';

/* ---------------- Terrain and paths ---------------- */

export function Ground() {
  return (
    <mesh receiveShadow rotation-x={-Math.PI / 2} position={[WORLD.width / 2, 0, WORLD.height / 2]}>
      <planeGeometry args={[WORLD.width, WORLD.height]} />
      <meshStandardMaterial color="#8b8f80" roughness={1} />
    </mesh>
  );
}

/** Two crossing dirt paths through the middle of the world. */
export function Paths() {
  const cx = WORLD.width / 2;
  const cz = WORLD.height / 2;
  const mat = <meshStandardMaterial color="#aaa394" roughness={1} />;
  return (
    <group>
      {/* north-south path */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[cx, 0.02, cz]}>
        <planeGeometry args={[6, WORLD.height - 16]} />
        {mat}
      </mesh>
      {/* east-west path */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[cx, 0.025, cz]}>
        <planeGeometry args={[WORLD.width - 16, 6]} />
        {mat}
      </mesh>
    </group>
  );
}

/* ---------------- Scatter props (instanced per kind) ---------------- */

function useScatterPositions(seed: number, count: number, margin = 6) {
  return useMemo(() => {
    // deterministic pseudo-random scatter, avoiding the path cross area
    const positions: [number, number, number, number][] = [];
    let s = seed;
    const rand = () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
    let attempts = 0;
    while (positions.length < count && attempts < count * 10) {
      attempts++;
      const x = margin + rand() * (WORLD.width - margin * 2);
      const z = margin + rand() * (WORLD.height - margin * 2);
      // keep off the path lanes and the player's start
      const nearNS = Math.abs(x - WORLD.width / 2) < 5;
      const nearEW = Math.abs(z - WORLD.height / 2) < 5;
      const nearStart = Math.hypot(x - PLAYER_X, z - PLAYER_Z) < 5;
      if (nearNS || nearEW || nearStart) continue;
      positions.push([x, 0, z, rand() * Math.PI * 2]);
    }
    return positions;
  }, [seed, count, margin]);
}

const cz0 = WORLD.height / 2;
const PLAYER_X = 85;
const PLAYER_Z = 82;

type InstancedProps = { children: (m: number) => React.ReactNode; positions: [number, number, number, number][] };

function Instances({ positions, children }: InstancedProps) {
  const ref = useRef<THREE.Group>(null);
  return (
    <group ref={ref}>
      {positions.map(([x, y, z, r], i) => (
        <group key={i} position={[x, y, z]} rotation-y={r}>
          {children(i)}
        </group>
      ))}
    </group>
  );
}

function Tree({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh castShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.18, 0.3, 2.4, 6]} />
        <meshStandardMaterial color="#6d6357" roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 3, 0]}>
        <icosahedronGeometry args={[1.6, 0]} />
        <meshStandardMaterial color="#5c7a52" roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[0.5, 4.1, 0.2]}>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial color="#68895c" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function Pine({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh castShadow position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.14, 0.22, 1.6, 6]} />
        <meshStandardMaterial color="#382e26" roughness={1} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} castShadow position={[0, 1.9 + i * 1.1, 0]}>
          <coneGeometry args={[1.3 - i * 0.35, 1.6, 7]} />
          <meshStandardMaterial color={['#4d6b46', '#567a4e', '#5f8855'][i]} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Rock({ scale = 1 }: { scale?: number }) {
  return (
    <mesh castShadow receiveShadow position={[0, 0.45 * scale, 0]} scale={scale} rotation={[0.3, 0.5, 0.2]}>
      <dodecahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial color="#7d7d86" roughness={1} flatShading />
    </mesh>
  );
}

function Bush() {
  return (
    <group>
      <mesh castShadow position={[0, 0.4, 0]}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#55744c" roughness={1} flatShading />
      </mesh>
      <mesh castShadow position={[0.4, 0.3, 0.2]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color="#5f8155" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

function GrassTuft() {
  const blades = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        x: Math.sin(i * 2.4) * 0.18,
        z: Math.cos(i * 2.4) * 0.18,
        rot: i * 1.3,
        h: 0.35 + (i % 3) * 0.12,
      })),
    [],
  );
  return (
    <group>
      {blades.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, b.z]} rotation={[0.2, b.rot, 0.15]}>
          <coneGeometry args={[0.035, b.h, 4]} />
          <meshStandardMaterial color="#6f8560" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Fern() {
  const fronds = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        rot: (i / 6) * Math.PI * 2,
        tilt: -0.6,
      })),
    [],
  );
  return (
    <group position={[0, 0.05, 0]}>
      {fronds.map((f, i) => (
        <mesh key={i} position={[Math.cos(f.rot) * 0.12, 0.25, Math.sin(f.rot) * 0.12]} rotation={[f.tilt * Math.sin(f.rot), f.rot, f.tilt * Math.cos(f.rot)]}>
          <boxGeometry args={[0.06, 0.55, 0.16]} />
          <meshStandardMaterial color="#5f7a55" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function Signpost({ rot = 0 }: { rot?: number }) {
  return (
    <group rotation-y={rot}>
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 2, 6]} />
        <meshStandardMaterial color="#7a6c5c" roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 1.7, 0.05]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[1.1, 0.3, 0.06]} />
        <meshStandardMaterial color="#93836f" roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 1.3, -0.05]} rotation={[-0.15, Math.PI, 0]}>
        <boxGeometry args={[0.9, 0.26, 0.06]} />
        <meshStandardMaterial color="#877766" roughness={1} />
      </mesh>
    </group>
  );
}

/** Renders one prop of the given kind. */
export function Prop({ def }: { def: PropDef }) {
  switch (def.kind) {
    case 'tree':
      return <Tree scale={def.scale ?? 1} />;
    case 'pine':
      return <Pine scale={def.scale ?? 1} />;
    case 'rock':
      return <Rock scale={def.scale ?? 1} />;
    case 'bush':
      return <Bush />;
    case 'grass':
      return <GrassTuft />;
    case 'fern':
      return <Fern />;
    case 'sign':
      return <Signpost rot={def.rot ?? 0} />;
    default:
      return null;
  }
}

/* ---------------- Landmark structures ---------------- */

/** Stone ruin: broken pillars and rubble. */
export function Ruin({ scale = 1 }: { scale?: number }) {
  return (
    <group scale={scale}>
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[2.2, 2.4, 0.3, 12]} />
        <meshStandardMaterial color="#8d8d98" roughness={1} />
      </mesh>
      <mesh castShadow position={[-1.1, 1.4, -0.6]}>
        <cylinderGeometry args={[0.28, 0.34, 2.8, 8]} />
        <meshStandardMaterial color="#a3a3ae" roughness={1} />
      </mesh>
      <mesh castShadow position={[1.2, 0.9, 0.5]} rotation={[0.4, 0.2, 0.9]}>
        <cylinderGeometry args={[0.26, 0.3, 1.8, 8]} />
        <meshStandardMaterial color="#9898a2" roughness={1} />
      </mesh>
      <mesh castShadow position={[0.2, 0.4, 1.2]} rotation={[0.2, 0.8, 0.3]}>
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial color="#90909a" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

/** Tall glowing monolith with a red rune accent. */
export function Monolith() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.6 + Math.sin(clock.elapsedTime * 1.5) * 0.3;
    }
  });
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 3, 0]}>
        <boxGeometry args={[1.4, 6, 0.9]} />
        <meshStandardMaterial color="#6b6b76" roughness={0.9} />
      </mesh>
      {/* rune strip */}
      <mesh ref={ref} position={[0, 3, 0.46]}>
        <boxGeometry args={[0.22, 4, 0.02]} />
        <meshStandardMaterial color="#7a2a24" emissive="#c0453a" emissiveIntensity={0.6} />
      </mesh>
      <pointLight position={[0, 3.4, 1.2]} color="#c0453a" intensity={6} distance={9} />
    </group>
  );
}

/** Lantern post at a milestone: glowing marker visible from afar. */
export function LanternPost({ discovered }: { discovered: boolean }) {
  const glow = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (glow.current && !discovered) {
      glow.current.intensity = 8 + Math.sin(clock.elapsedTime * 2.4) * 3;
    }
  });
  return (
    <group>
      <mesh castShadow position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 3.2, 6]} />
        <meshStandardMaterial color="#b08a86" roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 3.4, 0]}>
        <boxGeometry args={[0.45, 0.55, 0.45]} />
        <meshStandardMaterial
          color={discovered ? '#8a2f28' : '#c8b690'}
          emissive={discovered ? '#c0453a' : '#8a8a96'}
          emissiveIntensity={discovered ? 1.4 : 0.8}
        />
      </mesh>
      {/* roof cap */}
      <mesh castShadow position={[0, 3.8, 0]}>
        <coneGeometry args={[0.4, 0.3, 4]} />
        <meshStandardMaterial color="#55555e" roughness={1} />
      </mesh>
      <pointLight
        ref={glow}
        position={[0, 3.4, 0]}
        color={discovered ? '#c0453a' : '#e8e4d8'}
        intensity={discovered ? 14 : 10}
        distance={16}
      />
      {/* ground light pool */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <circleGeometry args={[1.8, 24]} />
        <meshBasicMaterial
          color={discovered ? '#9c5045' : '#e9e3d2'}
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  );
}
