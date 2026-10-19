import { ArrowRight, Gamepad2, List, Smartphone } from 'lucide-react';
import { PROFILE } from '@/data/profile';

interface Props {
  onStart: () => void;
  onSkipToProjects: () => void;
  reducedMotion: boolean;
}

export function TitleScreen({ onStart, onSkipToProjects, reducedMotion }: Props) {
  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#e8e6df]"
      style={{
        backgroundImage:
          'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(180,83,60,0.10), transparent 60%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(63,108,140,0.08), transparent 70%)',
      }}
    >
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-12 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#b4533c]/40 bg-white shadow-[0_0_40px_rgba(180,83,60,0.20)]">
          <Gamepad2 className="h-8 w-8 text-[#b4533c]" strokeWidth={1.5} />
        </div>
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#7a7568]">{PROFILE.title}</p>
        <h1 className="text-3xl font-semibold leading-tight text-[#33312c] sm:text-4xl">
          {PROFILE.name}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#6b675c]">{PROFILE.intro}</p>

        <div className="mt-8 w-full rounded-2xl border border-[#d5d1c4] bg-white/70 p-5 text-left backdrop-blur-sm">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#b4533c]">
            Controls
          </p>
          <ul className="space-y-2 text-sm text-[#4a473f]">
            <li className="flex items-center gap-3">
              <kbd className="rounded border border-[#c9c4b4] bg-white px-2 py-0.5 text-xs">WASD</kbd>
              or
              <kbd className="rounded border border-[#c9c4b4] bg-white px-2 py-0.5 text-xs">Arrows</kbd>
              <span className="text-[#7a7568]">to move</span>
            </li>
            <li className="flex items-center gap-3">
              <kbd className="rounded border border-[#c9c4b4] bg-white px-2 py-0.5 text-xs">E</kbd>
              <span className="text-[#7a7568]">or click a glowing lantern to interact</span>
            </li>
            <li className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-[#7a7568]" />
              <span className="text-[#7a7568]">on touch screens: joystick and button</span>
            </li>
            <li className="flex items-center gap-3">
              <kbd className="rounded border border-[#c9c4b4] bg-white px-2 py-0.5 text-xs">M</kbd>
              <span className="text-[#7a7568]">map ·</span>
              <kbd className="rounded border border-[#c9c4b4] bg-white px-2 py-0.5 text-xs">Esc</kbd>
              <span className="text-[#7a7568]">pause menu</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#b4533c] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-[#b4533c]/30 transition-all hover:bg-[#c96249] hover:shadow-[#b4533c]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a08f]"
          >
            {reducedMotion ? 'Begin' : 'Begin exploring'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={onSkipToProjects}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#c9c4b4] px-8 py-3 text-sm font-medium text-[#4a473f] transition-colors hover:border-[#a39d8c] hover:text-[#33312c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e0a08f]"
          >
            <List className="h-4 w-4" />
            Skip to project list
          </button>
        </div>
        <p className="mt-6 text-xs text-[#8a857a]">Discovered milestones are saved on this device.</p>
      </div>
    </div>
  );
}
