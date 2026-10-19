import { X } from 'lucide-react';
import { WORLD } from '@/config/world';
import { playerPosition } from '@/game/three/player';

interface Props {
  discovered: Set<string>;
  collectedFragments: Set<string>;
  onClose: () => void;
}

const W = 300;

export function MapOverlay({ discovered, collectedFragments, onClose }: Props) {
  const scale = W / WORLD.width;
  const H = WORLD.height * scale;
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[#d5d1c4] bg-[#f5f3ec] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="World map"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#33312c]">World map</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#7a7568] hover:bg-black/5 hover:text-[#33312c]"
            aria-label="Close map"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div
          className="relative rounded-lg border border-[#d5d1c4] bg-[#dcd9cc]"
          style={{ width: W, height: H, margin: '0 auto' }}
        >
          {WORLD.areas.map((a) => (
            <div
              key={a.id}
              className="absolute rounded-sm border border-white/10"
              style={{
                left: a.rect.x * scale,
                top: a.rect.z * scale,
                width: a.rect.w * scale,
                height: a.rect.d * scale,
                background: discovered.has(a.id) ? 'rgba(255,255,255,0.55)' : 'transparent',
              }}
              title={discovered.has(a.id) ? a.name : 'Unknown area'}
            />
          ))}
          {/* paths */}
          <div
            className="absolute bg-[#8a857a]/60"
            style={{ left: (WORLD.width / 2) * scale - 1.5, top: 8 * scale, width: 3, height: (WORLD.height - 16) * scale }}
          />
          <div
            className="absolute bg-[#8a857a]/60"
            style={{ left: 8 * scale, top: (WORLD.height / 2) * scale - 1.5, width: (WORLD.width - 16) * scale, height: 3 }}
          />
          {WORLD.fragments.map((f) =>
            collectedFragments.has(f.id) ? null : (
              <div
                key={f.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ left: f.x * scale, top: f.z * scale, width: 5, height: 5, background: '#c9a86a' }}
                title="Memory fragment"
              />
            ),
          )}
          {WORLD.milestones.map((m) => (
            <div
              key={m.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: m.x * scale,
                top: m.z * scale,
                width: 7,
                height: 7,
                background: discovered.has(m.id) ? '#e0786e' : 'transparent',
                border: discovered.has(m.id) ? 'none' : '1.5px solid #8a8a92',
              }}
              title={discovered.has(m.id) ? 'Discovered milestone' : 'Undiscovered milestone'}
            />
          ))}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#f5f3ec] bg-[#b4533c]"
            style={{ left: playerPosition.x * scale, top: playerPosition.z * scale, width: 10, height: 10 }}
            title="You"
          />
        </div>
        <p className="mt-3 text-center text-xs text-[#7a7568]">
          {discovered.size} of {WORLD.milestones.length} milestones discovered ·{' '}
          {collectedFragments.size} of {WORLD.fragments.length} fragments found
        </p>
      </div>
    </div>
  );
}
