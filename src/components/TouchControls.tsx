import { useRef } from 'react';
import { Hand } from 'lucide-react';
import type { InputState } from '@/game/useGameLoop';

interface Props {
  input: InputState;
}

/** On-screen joystick plus interact button for touch devices. */
export function TouchControls({ input }: Props) {
  const padRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const activeId = useRef<number | null>(null);

  const setDir = (dx: number, dy: number) => {
    input.joyX = dx;
    input.joyY = dy;
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(calc(-50% + ${dx * 28}px), calc(-50% + ${dy * 28}px))`;
    }
  };

  const handle = (e: React.PointerEvent) => {
    const pad = padRef.current;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = (e.clientX - cx) / (rect.width / 2);
    let dy = (e.clientY - cy) / (rect.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > 1) {
      dx /= len;
      dy /= len;
    }
    if (len < 0.15) setDir(0, 0);
    else setDir(dx, dy);
  };

  const end = () => {
    activeId.current = null;
    setDir(0, 0);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-5 sm:hidden">
      <div
        ref={padRef}
        className="pointer-events-auto relative h-28 w-28 touch-none rounded-full border border-[#33312c]/25 bg-white/50 backdrop-blur-sm"
        onPointerDown={(e) => {
          activeId.current = e.pointerId;
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          handle(e);
        }}
        onPointerMove={(e) => {
          if (activeId.current === e.pointerId) handle(e);
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div
          ref={knobRef}
          className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#33312c]/30 transition-transform duration-75"
        />
      </div>
    </div>
  );
}
