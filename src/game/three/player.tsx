import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WORLD, PLAYER_START } from '@/config/world';
import type { InputState } from '@/game/useGameLoop';

/** Shared live player position, polled by the UI layer for proximity checks. */
export const playerPosition = new THREE.Vector3(PLAYER_START.x, 0, PLAYER_START.z);
export const playerHeading = { value: 0 };

const BASE_SPEED = 7; // m/s
const CAM_HEIGHT = 9;
const CAM_BACK = 11; // camera sits this far south of the player, always
const CAM_POS = new THREE.Vector3();
const CAM_TARGET = new THREE.Vector3();

function readInput(input: InputState, out: THREE.Vector2) {
  let x = (input.right ? 1 : 0) - (input.left ? 1 : 0) + input.joyX;
  let y = (input.down ? 1 : 0) - (input.up ? 1 : 0) + input.joyY;
  const len = Math.hypot(x, y);
  if (len > 1) {
    x /= len;
    y /= len;
  }
  out.set(x, y);
  return len > 0.01;
}

/**
 * Stylized humanoid built from articulated parts: tunic, belt, head with
 * face and hair, scarf, swinging arms and legs. The model faces +z.
 */
function buildHumanoid() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe6b28a, roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x3f2e22, roughness: 0.85 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x3f6c8c, roughness: 0.85 });
  const pantMat = new THREE.MeshStandardMaterial({ color: 0x5a5346, roughness: 0.9 });
  const bootMat = new THREE.MeshStandardMaterial({ color: 0x3a332c, roughness: 0.95 });
  const scarfMat = new THREE.MeshStandardMaterial({ color: 0xb4533c, roughness: 0.8 });

  // legs: swing groups pivoted at the hip
  const legGeo = new THREE.CapsuleGeometry(0.11, 0.55, 4, 8);
  const mkLeg = (side: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.17, 0.9, 0);
    const leg = new THREE.Mesh(legGeo, pantMat);
    leg.position.y = -0.4;
    leg.castShadow = true;
    pivot.add(leg);
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.3), bootMat);
    boot.position.set(0, -0.78, 0.04);
    boot.castShadow = true;
    pivot.add(boot);
    body.add(pivot);
    return pivot;
  };
  const legL = mkLeg(-1);
  const legR = mkLeg(1);

  // torso: blue tunic with a dark belt
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.36, 0.85, 10), shirtMat);
  torso.position.y = 1.42;
  torso.castShadow = true;
  body.add(torso);

  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.09, 10), bootMat);
  belt.position.y = 1.02;
  body.add(belt);

  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 8), shirtMat);
  shoulders.position.y = 1.84;
  shoulders.scale.set(1.25, 0.55, 0.9);
  shoulders.castShadow = true;
  body.add(shoulders);

  // head with hair and eyes (the model faces +z)
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), skinMat);
  head.position.y = 2.18;
  head.scale.set(0.95, 1.02, 0.98);
  head.castShadow = true;
  body.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.275, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
    hairMat
  );
  hair.position.y = 2.19;
  body.add(hair);

  const eyeGeo = new THREE.SphereGeometry(0.032, 8, 6);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x2a2420, roughness: 0.5 });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.09, 2.2, 0.23);
  body.add(eyeL);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.09, 2.2, 0.23);
  body.add(eyeR);

  // deep-red scarf
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.06, 8, 16), scarfMat);
  scarf.position.y = 1.96;
  scarf.rotation.x = Math.PI / 2;
  body.add(scarf);
  const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 0.05), scarfMat);
  scarfTail.position.set(0.16, 1.78, -0.22);
  scarfTail.rotation.z = -0.25;
  body.add(scarfTail);

  // arms: swing groups pivoted at the shoulder, with skin hands
  const armGeo = new THREE.CapsuleGeometry(0.08, 0.48, 4, 8);
  const mkArm = (side: number) => {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.44, 1.8, 0);
    const arm = new THREE.Mesh(armGeo, shirtMat);
    arm.position.y = -0.3;
    arm.castShadow = true;
    pivot.add(arm);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.085, 10, 8), skinMat);
    hand.position.y = -0.62;
    pivot.add(hand);
    body.add(pivot);
    return pivot;
  };
  const armL = mkArm(-1);
  const armR = mkArm(1);

  // attach walk-cycle animation state to the root object
  root.userData.animate = (t: number, moving: boolean, dt: number) => {
    root.userData.phase = (root.userData.phase ?? 0) + dt * (moving ? 9 : 0);
    const p = root.userData.phase ?? 0;
    const swing = Math.sin(p) * (moving ? 0.7 : 0);
    const swingLerp = Math.min(1, dt * 8);
    legL.rotation.x = THREE.MathUtils.lerp(legL.rotation.x, swing, swingLerp);
    legR.rotation.x = THREE.MathUtils.lerp(legR.rotation.x, -swing, swingLerp);
    armL.rotation.x = THREE.MathUtils.lerp(armL.rotation.x, -swing * 0.8, swingLerp);
    armR.rotation.x = THREE.MathUtils.lerp(armR.rotation.x, swing * 0.8, swingLerp);
    body.position.y = Math.abs(Math.sin(p)) * (moving ? 0.05 : 0);
    // gentle idle breathing
    torso.scale.y = 1 + Math.sin(t * 2) * 0.01;
  };

  return root;
}

export function Player({ input, paused }: { input: InputState; paused: boolean }) {
  const humanoid = useMemo(buildHumanoid, []);
  const pos = useMemo(() => new THREE.Vector3(PLAYER_START.x, 0, PLAYER_START.z), []);
  const inputVec = useMemo(() => new THREE.Vector2(), []);
  const facing = useRef(0);
  const camInit = useRef(false);

  const obstacleSpheres = useMemo(
    () => WORLD.obstacles.map((o) => ({ x: o.x, z: o.z, r: o.r })),
    [],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    let moving = false;

    if (!paused) {
      moving = readInput(input, inputVec);
      if (moving) {
        // camera-relative: the camera looks north from the south, so W/Up
        // moves away from the camera (north, -z), D/Right moves +x.
        const stepX = inputVec.x * BASE_SPEED * dt;
        const stepZ = inputVec.y * BASE_SPEED * dt;

        // axis-separated collision so we slide along obstacles
        const blocked = (nx: number, nz: number) => {
          for (const o of obstacleSpheres) {
            if (Math.hypot(nx - o.x, nz - o.z) < o.r + 0.45) return true;
          }
          return nx < 2.5 || nx > WORLD.width - 2.5 || nz < 2.5 || nz > WORLD.height - 2.5;
        };

        const tx = pos.x + stepX;
        if (!blocked(tx, pos.z)) pos.x = tx;
        const tz = pos.z + stepZ;
        if (!blocked(pos.x, tz)) pos.z = tz;

        // face walking direction
        const target = Math.atan2(stepX, stepZ);
        let diff = target - facing.current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        facing.current += diff * Math.min(1, dt * 10);
      }
    }

    humanoid.userData.animate(state.clock.elapsedTime, moving, dt);
    humanoid.rotation.y = facing.current;
    humanoid.position.copy(pos);
    playerPosition.copy(pos);
    playerHeading.value = facing.current;

    // fixed follow camera: hovers south of the player, always framing them
    const camera = state.camera;
    CAM_POS.set(pos.x, CAM_HEIGHT, pos.z + CAM_BACK);
    if (!camInit.current) {
      camera.position.copy(CAM_POS);
      camInit.current = true;
    }
    camera.position.lerp(CAM_POS, Math.min(1, dt * 4));
    CAM_TARGET.set(pos.x, 1.5, pos.z);
    camera.lookAt(CAM_TARGET);
  });

  return <primitive object={humanoid} />;
}
