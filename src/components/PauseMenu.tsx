import { X, Volume2, VolumeX, List, Accessibility, Map } from 'lucide-react';

interface Props {
  onClose: () => void;
  onOpenMap: () => void;
  onOpenProjects: () => void;
  sound: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export function PauseMenu({
  onClose,
  onOpenMap,
  onOpenProjects,
  sound,
  onToggleSound,
  reducedMotion,
  onToggleReducedMotion,
}: Props) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-[#d5d1c4] bg-[#f5f3ec] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Pause menu"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#33312c]">Paused</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#7a7568] hover:bg-black/5 hover:text-[#33312c]"
            aria-label="Resume"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="mb-3 w-full rounded-lg bg-[#b4533c] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#c96249]"
        >
          Return to exploration
        </button>
        <button
          onClick={onOpenMap}
          className="mb-3 flex w-full items-center gap-2 rounded-lg border border-[#c9c4b4] py-2.5 text-sm text-[#4a473f] transition-colors hover:bg-black/5"
        >
          <Map className="h-4 w-4" /> World map
        </button>
        <button
          onClick={onOpenProjects}
          className="mb-5 flex w-full items-center gap-2 rounded-lg border border-[#c9c4b4] py-2.5 text-sm text-[#4a473f] transition-colors hover:bg-black/5"
        >
          <List className="h-4 w-4" /> Project list
        </button>

        <div className="space-y-2 border-t border-[#d5d1c4] pt-4">
          <button
            onClick={onToggleSound}
            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-[#4a473f] hover:bg-black/5"
            aria-pressed={sound}
          >
            <span className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" /> Ambient sound
            </span>
            <span className={sound ? 'text-emerald-600' : 'text-[#8a857a]'}>
              {sound ? 'On' : 'Muted'}
            </span>
          </button>
          <button
            onClick={onToggleReducedMotion}
            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm text-[#4a473f] hover:bg-black/5"
            aria-pressed={reducedMotion}
          >
            <span className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" /> Reduced motion
              <VolumeX className="h-3 w-3 opacity-0" />
            </span>
            <span className={reducedMotion ? 'text-emerald-600' : 'text-[#8a857a]'}>
              {reducedMotion ? 'On' : 'Off'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
