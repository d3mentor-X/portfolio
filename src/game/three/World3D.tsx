import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD, type FragmentDef, type LandmarkDef } from '@/config/world';
import { Ground, Paths, Prop, Ruin, Monolith, LanternPost } from './scenery';
import { Player } from './player';
import type { InputState } from '@/game/useGameLoop';

/** Slow-drifting dust motes for atmosphere. */
function Dust({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = Math.random() * WORLD.width;
      arr[i * 3 + 1] = 0.5 + Math.random() * 6;
      arr[i * 3 + 2] = Math.random() * WORLD.height;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current && !reducedMotion) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.y = t * 0.005;
      ref.current.position.y = Math.sin(t * 0.2) * 0.4;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#cfc9b8"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function MilestoneLantern({
  x,
  z,
  discovered,
}: {
  x: number;
  z: number;
  discovered: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current && !discovered) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.5;
      const s = 1 + Math.sin(clock.elapsedTime * 2) * 0.05;
      ringRef.current.scale.setScalar(s);
    }
  });
  return (
    <group position={[x, 0, z]}>
      <LanternPost discovered={discovered} />
      {/* rotating rune ring when undiscovered */}
      {!discovered && (
        <mesh ref={ringRef} rotation-x={-Math.PI / 2} position={[0, 0.06, 0]}>
          <ringGeometry args={[2.2, 2.45, 48]} />
          <meshBasicMaterial color="#c0453a" transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* gentle beacon glow */}
      <mesh position={[0, 3.4, 0]}>
        <sphereGeometry args={[0.12, 12, 8]} />
        <meshBasicMaterial color="#f0d9d4" />
      </mesh>
    </group>
  );
}

function FragmentOrb({
  def,
  collected,
  reducedMotion,
}: {
  def: FragmentDef;
  collected: boolean;
  reducedMotion: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current && !collected && !reducedMotion) {
      ref.current.position.y = 1.2 + Math.sin(clock.elapsedTime * 2 + def.x) * 0.15;
      ref.current.rotation.y = clock.elapsedTime * 1.2;
    }
  });
  if (collected) return null;
  return (
    <group position={[def.x, 0, def.z]}>
      <mesh ref={ref}>
        <octahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color="#d9c8a8"
          emissive="#c9a86a"
          emissiveIntensity={0.8}
          roughness={0.5}
        />
      </mesh>
      <pointLight position={[0, 1.2, 0]} color="#c9a86a" intensity={4} distance={6} />
    </group>
  );
}

/** Activatable landmark: a stone pedestal with a glowing sigil. */
function LandmarkPedestal({
  def,
  activated,
}: {
  def: LandmarkDef;
  activated: boolean;
}) {
  const sigil = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (sigil.current && activated) {
      (sigil.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.6 + Math.sin(clock.elapsedTime * 3) * 0.6;
    }
  });
  return (
    <group position={[def.x, 0, def.z]}>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.55, 0.7, 0.8, 8]} />
        <meshStandardMaterial color="#3f3f46" roughness={1} flatShading />
      </mesh>
      <mesh ref={sigil} position={[0, 0.85, 0]}>
        <torusGeometry args={[0.28, 0.04, 8, 24]} />
        <meshStandardMaterial
          color={activated ? '#c0453a' : '#55555e'}
          emissive={activated ? '#c0453a' : '#333338'}
          emissiveIntensity={activated ? 1.6 : 0.15}
        />
      </mesh>
    </group>
  );
}

export function World3D({
  input,
  paused,
  reducedMotion,
  discovered,
  collectedFragments,
  activatedLandmarks,
}: {
  input: InputState;
  paused: boolean;
  reducedMotion: boolean;
  discovered: Set<string>;
  collectedFragments: Set<string>;
  activatedLandmarks: Set<string>;
}) {
  return (
    <>
      <fog attach="fog" args={['#cfd6da', WORLD.visuals.fogNear, WORLD.visuals.fogFar]} />
      <color attach="background" args={['#cfd6da']} />

      {/* Moonlight key light with shadows */}
      <directionalLight
        castShadow
        position={[40, 60, 20]}
        intensity={1.5}
        color="#fff2dd"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-camera-far={160}
      />
      {/* Soft bounce from the sky and ground */}
      <hemisphereLight intensity={0.9} color="#e8eef4" groundColor="#b0a894" />
      {/* Faint warm rim from the horizon */}
      <directionalLight position={[-50, 15, -70]} intensity={0.3} color="#d98a70" />

      <Ground />
      <Paths />
      <Dust count={90} reducedMotion={reducedMotion} />

      {/* Milestone lanterns */}
      {WORLD.milestones.map((m) => (
        <MilestoneLantern
          key={m.id}
          x={m.x}
          z={m.z}
          discovered={discovered.has(m.id)}
        />
      ))}

      {/* Collectible fragments */}
      {WORLD.fragments.map((f) => (
        <FragmentOrb key={f.id} def={f} collected={collectedFragments.has(f.id)} reducedMotion={reducedMotion} />
      ))}

      {/* Activatable landmarks */}
      {WORLD.landmarks.map((l) => (
        <LandmarkPedestal key={l.id} def={l} activated={activatedLandmarks.has(l.id)} />
      ))}

      {/* Stone ruins */}
      {[[60, 24], [110, 24], [60, 104], [110, 104]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Ruin />
        </group>
      ))}

      {/* Monolith landmark structure */}
      <group position={[85, 0, 56]}>
        <Monolith />
      </group>

      {/* Scatter props */}
      {WORLD.props.map((def, i) => (
        <group key={i} position={[def.x, 0, def.z]} rotation-y={def.rot ?? 0}>
          <Prop def={def} />
        </group>
      ))}

      <Player input={input} paused={paused} reducedMotion={reducedMotion} />
    </>
  );
}
