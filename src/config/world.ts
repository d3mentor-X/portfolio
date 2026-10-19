// ============================================================
// WORLD CONFIGURATION
// Everything about the 3D world's layout lives here. Both the
// 3D scene and the minimap read this file, so they always agree.
// Positions are world units (metres) on the ground plane:
//   x runs 0..WORLD.width  (west -> east)
//   z runs 0..WORLD.height (north -> south)
// ============================================================

export interface Rect {
  x: number;
  z: number;
  w: number;
  d: number;
}

export interface AreaDef {
  id: string;
  name: string;
  blurb: string;
  rect: Rect; // minimap fill for discovered areas
  tint: string;
}

export interface MilestoneDef {
  id: string; // must match a project id in src/data/projects.ts
  x: number;
  z: number;
}

export interface ObstacleDef {
  kind: 'pillar' | 'ruin' | 'monolith';
  x: number;
  z: number;
  r: number; // collision radius
}

export interface PropDef {
  kind: 'tree' | 'pine' | 'rock' | 'bush' | 'grass' | 'sign' | 'fern';
  x: number;
  z: number;
  rot?: number; // rotation around Y, radians
  scale?: number; // size multiplier
}

export interface FragmentDef {
  id: string;
  x: number;
  z: number;
  kind: 'skill' | 'personal' | 'project-hint';
  text: string; // content revealed on pickup
}

export interface LandmarkDef {
  id: string;
  x: number;
  z: number;
  label: string;
  text: string; // note shown when activated
}

export const WORLD = {
  width: 170,
  height: 130,
  visuals: {
    fogNear: 30,
    fogFar: 120,
  },
  areas: [
    {
      id: 'hearth',
      name: 'The Hearth',
      blurb: 'A quiet clearing where every path begins.',
      rect: { x: 55, z: 42, w: 60, d: 44 },
      tint: 'rgba(232,228,216,0.08)',
    },
    {
      id: 'echoes',
      name: 'The Ashen Garden',
      blurb: 'Where the first project rests.',
      rect: { x: 8, z: 8, w: 52, d: 42 },
      tint: 'rgba(110,130,110,0.10)',
    },
    {
      id: 'crystal',
      name: 'The Crystal Hollow',
      blurb: 'Low light and quiet machines.',
      rect: { x: 110, z: 8, w: 52, d: 42 },
      tint: 'rgba(100,135,165,0.10)',
    },
    {
      id: 'vault',
      name: 'The Gilded Vault',
      blurb: 'Numbers, history and patient research.',
      rect: { x: 8, z: 78, w: 52, d: 44 },
      tint: 'rgba(160,130,75,0.10)',
    },
    {
      id: 'gallery',
      name: 'The Mirror Gallery',
      blurb: 'Images, seen by another pair of eyes.',
      rect: { x: 110, z: 78, w: 52, d: 44 },
      tint: 'rgba(150,150,160,0.10)',
    },
    {
      id: 'sanctum',
      name: 'The Sanctum',
      blurb: 'A small grove for balance.',
      rect: { x: 66, z: 54, w: 38, d: 24 },
      tint: 'rgba(120,145,120,0.12)',
    },
  ] as AreaDef[],
  milestones: [
    { id: 'echoes-of-the-dead', x: 34, z: 29 },
    { id: 'crystal-core', x: 136, z: 29 },
    { id: 'gold-agent', x: 34, z: 100 },
    { id: 'ai-image-classification', x: 136, z: 100 },
    { id: 'wellness-app', x: 85, z: 66 },
  ] as MilestoneDef[],
  // Solid obstacles the player cannot walk through.
  obstacles: [
    { kind: 'pillar', x: 34, z: 36, r: 0.9 },
    { kind: 'pillar', x: 136, z: 36, r: 0.9 },
    { kind: 'pillar', x: 34, z: 93, r: 0.9 },
    { kind: 'pillar', x: 136, z: 93, r: 0.9 },
    { kind: 'ruin', x: 60, z: 24, r: 2.2 },
    { kind: 'ruin', x: 110, z: 24, r: 2.2 },
    { kind: 'ruin', x: 60, z: 104, r: 2.2 },
    { kind: 'ruin', x: 110, z: 104, r: 2.2 },
    { kind: 'monolith', x: 85, z: 56, r: 1.4 },
  ] as ObstacleDef[],
  // Decorative props: visible scenery, no collision.
  props: [
    // Signposts marking the central crossroads
    { kind: 'sign', x: 78, z: 60, rot: 0.4 },
    { kind: 'sign', x: 92, z: 60, rot: -0.4 },
    // The Ashen Garden
    { kind: 'pine', x: 16, z: 14 },
    { kind: 'pine', x: 24, z: 40 },
    { kind: 'pine', x: 48, z: 12 },
    { kind: 'tree', x: 12, z: 30 },
    { kind: 'tree', x: 44, z: 44 },
    { kind: 'rock', x: 20, z: 22, scale: 1.4 },
    { kind: 'rock', x: 40, z: 18, scale: 0.8 },
    { kind: 'fern', x: 28, z: 24 },
    { kind: 'fern', x: 36, z: 36 },
    { kind: 'grass', x: 24, z: 32 },
    { kind: 'grass', x: 44, z: 24 },
    { kind: 'fern', x: 14, z: 46 },
    // The Crystal Hollow
    { kind: 'rock', x: 118, z: 16, scale: 1.5 },
    { kind: 'rock', x: 146, z: 24, scale: 1.2 },
    { kind: 'rock', x: 126, z: 42, scale: 1 },
    { kind: 'rock', x: 138, z: 12, scale: 1.1 },
    { kind: 'grass', x: 128, z: 20 },
    { kind: 'grass', x: 144, z: 40 },
    { kind: 'fern', x: 122, z: 30 },
    { kind: 'fern', x: 150, z: 14 },
    // The Gilded Vault
    { kind: 'tree', x: 16, z: 84 },
    { kind: 'tree', x: 46, z: 90 },
    { kind: 'tree', x: 24, z: 116 },
    { kind: 'pine', x: 40, z: 106 },
    { kind: 'rock', x: 30, z: 96, scale: 1 },
    { kind: 'fern', x: 20, z: 100 },
    { kind: 'fern', x: 52, z: 112 },
    { kind: 'grass', x: 36, z: 88 },
    // The Mirror Gallery
    { kind: 'pine', x: 118, z: 84 },
    { kind: 'pine', x: 144, z: 92 },
    { kind: 'pine', x: 126, z: 118 },
    { kind: 'rock', x: 136, z: 106, scale: 1.2 },
    { kind: 'fern', x: 122, z: 96 },
    { kind: 'fern', x: 148, z: 112 },
    { kind: 'grass', x: 130, z: 88 },
    // The Sanctum
    { kind: 'tree', x: 70, z: 58 },
    { kind: 'tree', x: 100, z: 58 },
    { kind: 'fern', x: 76, z: 62 },
    { kind: 'fern', x: 94, z: 62 },
    { kind: 'grass', x: 85, z: 74 },
    // Around the Hearth
    { kind: 'bush', x: 62, z: 46 },
    { kind: 'bush', x: 108, z: 46 },
    { kind: 'bush', x: 62, z: 82 },
    { kind: 'bush', x: 108, z: 82 },
    { kind: 'grass', x: 60, z: 60 },
    { kind: 'grass', x: 110, z: 60 },
  ] as PropDef[],
  // Floating collectible fragments that reveal real content.
  fragments: [
    {
      id: 'frag-greeting',
      x: 74,
      z: 68,
      kind: 'personal',
      text: 'Waleed builds games and studies markets — always learning by making.',
    },
    {
      id: 'frag-unity',
      x: 20,
      z: 44,
      kind: 'skill',
      text: 'Skill: Unity & C# — gameplay scripting, UI, animation, sound.',
    },
    {
      id: 'frag-python',
      x: 52,
      z: 96,
      kind: 'skill',
      text: 'Skill: Python — data analysis, backtesting, reporting.',
    },
    {
      id: 'frag-hint-gold',
      x: 100,
      z: 96,
      kind: 'project-hint',
      text: 'Something gilded waits in the south-west of the world…',
    },
    {
      id: 'frag-hint-wellness',
      x: 146,
      z: 44,
      kind: 'project-hint',
      text: 'A path of balance lies at the heart of the world…',
    },
  ] as FragmentDef[],
  // Optional landmarks that can be activated for a short note.
  landmarks: [
    {
      id: 'lm-monolith',
      x: 85,
      z: 50,
      label: 'Ancient monolith',
      text: 'The monolith hums softly. "Every world here was built by hand."',
    },
    {
      id: 'lm-sign',
      x: 85,
      z: 60,
      label: 'Old signpost',
      text: 'Four directions, four projects, one heart at the centre.',
    },
  ] as LandmarkDef[],
};

export const PLAYER_START = { x: 85, z: 82 };

// ------------------------------------------------------------
// HOW TO ADD A MILESTONE
// 1. Add the project to src/data/projects.ts.
// 2. Add an entry to WORLD.milestones above: its project id and
//    x / z coordinates inside the world.
// 3. Optionally add props, obstacles or fragments nearby for
//    interest, but keep the paths between areas clear.
// ------------------------------------------------------------
