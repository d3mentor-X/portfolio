import { useCallback, useEffect, useRef, useState } from 'react';
import { Map as MapIcon, Settings, Compass, Volume2, VolumeX, X } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { TitleScreen } from '@/components/TitleScreen';
import { TouchControls } from '@/components/TouchControls';
import { ProjectPanel } from '@/components/ProjectPanel';
import { MapOverlay } from '@/components/MapOverlay';
import { PauseMenu } from '@/components/PauseMenu';
import { ProjectList } from '@/components/ProjectList';
import { Minimap } from '@/components/Minimap';
import { World3D } from '@/game/three/World3D';
import { playerPosition, playerHeading } from '@/game/three/player';
import { createInput } from '@/game/useGameLoop';
import { AmbientAudio } from '@/game/audio';
import { usePersistentState } from '@/hooks/usePersistentState';
import { getMergedProject, type ProjectEdits } from '@/data/projects';
import { WORLD } from '@/config/world';

type Screen = 'title' | 'world' | 'projects';

interface Toast {
  id: number;
  text: string;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [sound, setSound] = usePersistentState('whs.sound', true);
  const [reducedMotion, setReducedMotion] = usePersistentState('whs.reducedMotion', false);
  const [edits, setEdits] = usePersistentState<Record<string, ProjectEdits>>('whs.edits', {});
  const [discovered, setDiscovered] = usePersistentState<string[]>('whs.discovered', []);
  const [collectedFragments, setCollectedFragments] = usePersistentState<string[]>('whs.fragments', []);
  const [activatedLandmarks, setActivatedLandmarks] = usePersistentState<string[]>('whs.landmarks', []);

  const [showMap, setShowMap] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [near, setNear] = useState<string | null>(null);
  const [showIntro, setShowIntro] = usePersistentState('whs.introSeen', false);

  const inputRef = useRef(createInput());
  const audioRef = useRef<AmbientAudio | null>(null);
  const toastId = useRef(0);

  const inWorld = screen === 'world' && !showMap && !showPause && !openProject;

  // Poll the live player position for proximity, discovery and pickups
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!inWorld) return;
      const px = playerPosition.x;
      const pz = playerPosition.z;

      let found: string | null = null;
      let best = Infinity;
      const check = (id: string, x: number, z: number, radius: number) => {
        const d = Math.hypot(px - x, pz - z);
        if (d < radius && d < best) {
          best = d;
          found = id;
        }
      };
      for (const m of WORLD.milestones) check(m.id, m.x, m.z, 3.2);
      for (const f of WORLD.fragments) {
        if (!collectedFragments.includes(f.id)) check(f.id, f.x, f.z, 1.6);
      }
      for (const l of WORLD.landmarks) {
        if (!activatedLandmarks.includes(l.id)) check(l.id, l.x, l.z, 2.2);
      }

      if (found !== near) {
        setNear(found);
        const hit = found;
        if (hit) {
          if (WORLD.milestones.some((m) => m.id === hit)) {
            if (!discovered.includes(hit)) {
              setDiscovered((d) => [...d, hit]);
              const name = getMergedProject(hit, edits)?.name ?? 'a project';
              pushToast(`Milestone discovered: ${name}`);
            }
          } else if (WORLD.fragments.some((f) => f.id === hit)) {
            setCollectedFragments((c) => [...c, hit]);
            const frag = WORLD.fragments.find((f) => f.id === hit);
            if (frag) pushToast(frag.text);
          } else if (WORLD.landmarks.some((l) => l.id === hit)) {
            setActivatedLandmarks((a) => [...a, hit]);
            const lm = WORLD.landmarks.find((l) => l.id === hit);
            if (lm) pushToast(lm.text);
          }
        }
      }
    }, 120);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inWorld, collectedFragments, activatedLandmarks, discovered, near, edits]);

  const pushToast = (text: string) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  };

  // audio
  useEffect(() => {
    if (!audioRef.current) audioRef.current = new AmbientAudio();
    if (screen === 'world') audioRef.current.start();
    audioRef.current.setMuted(!sound);
  }, [screen, sound]);

  // keyboard
  useEffect(() => {
    const setKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase();
      const input = inputRef.current;
      let handled = true;
      if (k === 'w' || k === 'arrowup') input.up = down;
      else if (k === 's' || k === 'arrowdown') input.down = down;
      else if (k === 'a' || k === 'arrowleft') input.left = down;
      else if (k === 'd' || k === 'arrowright') input.right = down;
      else handled = false;
      if (handled) e.preventDefault();
    };
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'escape') {
        if (openProject) setOpenProject(null);
        else if (showMap) setShowMap(false);
        else setShowPause((p) => !p);
        e.preventDefault();
      } else if (k === 'm') {
        if (screen === 'world') setShowMap((p) => !p);
        e.preventDefault();
      } else {
        setKey(e, true);
      }
    };
    const onUp = (e: KeyboardEvent) => setKey(e, false);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [screen, showMap, openProject]);

  const nearLabel = near
    ? getMergedProject(near, edits)?.name ??
      WORLD.landmarks.find((l) => l.id === near)?.label ??
      'A memory fragment'
    : null;

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-[#e8e6df] text-[#33312c] select-none"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* 3D world */}
      <div className={screen === 'projects' ? 'hidden' : 'absolute inset-0'}>
        <Canvas shadows camera={{ fov: 55, position: [85, 6.5, 93], near: 0.5, far: 220 }} dpr={[1, 2]}>
          <World3D
            input={inputRef.current}
            paused={!inWorld}
            reducedMotion={reducedMotion}
            discovered={new Set(discovered)}
            collectedFragments={new Set(collectedFragments)}
            activatedLandmarks={new Set(activatedLandmarks)}
          />
        </Canvas>
      </div>

      {/* Title screen */}
      {screen === 'title' && (
        <TitleScreen
          onStart={() => {
            setScreen('world');
            if (!showIntro) setShowIntro(true);
          }}
          onSkipToProjects={() => setScreen('projects')}
          reducedMotion={reducedMotion}
        />
      )}

      {/* HUD (world only) */}
      {screen === 'world' && (
        <>
          {/* Top-right buttons */}
          <div className="absolute right-4 top-4 z-10 flex gap-2">
            <button
              onClick={() => setShowMap(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#33312c]/20 bg-white/70 text-[#33312c] backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Open map"
              title="Map (M)"
            >
              <MapIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowPause(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#33312c]/20 bg-white/70 text-[#33312c] backdrop-blur-sm transition-colors hover:bg-white"
              aria-label="Open settings"
              title="Menu (Esc)"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          {/* Minimap */}
          <Minimap
            discovered={new Set(discovered)}
            collectedFragments={new Set(collectedFragments)}
            expanded={mapExpanded}
            onToggleExpanded={() => setMapExpanded((v) => !v)}
          />

          {/* Bottom-left hint + mute */}
          <div className="absolute bottom-4 left-4 z-10 hidden items-center gap-3 sm:flex">
            <div className="flex items-center gap-2 rounded-lg border border-[#33312c]/15 bg-white/70 px-3 py-1.5 text-xs text-[#6b675c] backdrop-blur-sm">
              <Compass className="h-3.5 w-3.5" />
              <span>
                <kbd className="rounded border border-[#33312c]/25 px-1">WASD</kbd> move ·{' '}
                <kbd className="rounded border border-[#33312c]/25 px-1">M</kbd> map
              </span>
            </div>
            <button
              onClick={() => setSound(!sound)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#33312c]/15 bg-white/70 text-[#6b675c] backdrop-blur-sm transition-colors hover:text-[#33312c]"
              aria-label={sound ? 'Mute ambient sound' : 'Unmute ambient sound'}
            >
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>

          {/* Interaction prompt */}
          {near && !openProject && (
            <div className="pointer-events-none absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[#b4533c]/50 bg-white/85 px-5 py-2 text-sm text-[#8a3a2c] backdrop-blur-sm sm:bottom-20">
              {nearLabel}
            </div>
          )}

          {/* Touch controls */}
          {inWorld && <TouchControls input={inputRef.current} />}

          {/* Toasts */}
          <div className="pointer-events-none absolute left-1/2 top-16 z-20 w-full max-w-sm -translate-x-1/2 space-y-2 px-4">
            {toasts.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-[#b4533c]/40 bg-white/85 px-4 py-2.5 text-sm text-[#4a473f] shadow-sm backdrop-blur-sm"
              >
                {t.text}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Overlays */}
      {showMap && screen === 'world' && (
        <MapOverlay
          discovered={new Set(discovered)}
          collectedFragments={new Set(collectedFragments)}
          onClose={() => setShowMap(false)}
        />
      )}
      {showPause && screen === 'world' && (
        <PauseMenu
          onClose={() => setShowPause(false)}
          onOpenMap={() => {
            setShowPause(false);
            setShowMap(true);
          }}
          onOpenProjects={() => {
            setShowPause(false);
            setScreen('projects');
          }}
          sound={sound}
          onToggleSound={() => setSound(!sound)}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        />
      )}
      {openProject && screen === 'world' && (
        <ProjectPanel
          project={getMergedProject(openProject, edits)!}
          onClose={() => setOpenProject(null)}
          onSave={(e) => setEdits((prev) => ({ ...prev, [openProject]: e }))}
        />
      )}

      {/* Project list screen */}
      {screen === 'projects' && <ProjectList onBack={() => setScreen('world')} discovered={new Set(discovered)} />}
    </div>
  );
}
