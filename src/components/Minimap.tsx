import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { WORLD } from '@/config/world';
import { playerPosition, playerHeading } from '@/game/three/player';

interface Props {
  discovered: Set<string>;
  collectedFragments: Set<string>;
  expanded: boolean;
  onToggleExpanded: () => void;
}

/**
 * Live minimap. Reads the same WORLD config as the 3D scene, so it always
 * mirrors the real layout: areas, paths, milestones and fragments.
 */
export function Minimap({ discovered, collectedFragments, expanded, onToggleExpanded }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = (canvas.clientWidth * WORLD.height) / WORLD.width;
      if (canvas.width !== w * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const sx = w / WORLD.width;
      const sz = h / WORLD.height;

      // backdrop
      ctx.fillStyle = '#f0eee6';
      ctx.fillRect(0, 0, w, h);

      // areas
      for (const a of WORLD.areas) {
        ctx.fillStyle = discovered.has(a.id) ? 'rgba(255,255,255,0.8)' : 'rgba(120,115,100,0.08)';
        ctx.fillRect(a.rect.x * sx, a.rect.z * sz, a.rect.w * sx, a.rect.d * sz);
      }

      // paths (cross lanes)
      ctx.strokeStyle = 'rgba(120,115,100,0.5)';
      ctx.lineWidth = Math.max(2, 6 * sx);
      ctx.beginPath();
      ctx.moveTo((WORLD.width / 2) * sx, 8 * sz);
      ctx.lineTo((WORLD.width / 2) * sx, (WORLD.height - 8) * sz);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(8 * sx, (WORLD.height / 2) * sz);
      ctx.lineTo((WORLD.width - 8) * sx, (WORLD.height / 2) * sz);
      ctx.stroke();

      // fragments (uncollected only, faint)
      for (const f of WORLD.fragments) {
        if (collectedFragments.has(f.id)) continue;
        ctx.fillStyle = 'rgba(180,83,60,0.9)';
        ctx.beginPath();
        ctx.arc(f.x * sx, f.z * sz, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // milestones
      for (const m of WORLD.milestones) {
        ctx.beginPath();
        ctx.arc(m.x * sx, m.z * sz, 3.5, 0, Math.PI * 2);
        if (discovered.has(m.id)) {
          ctx.fillStyle = '#c96249';
          ctx.fill();
        } else {
          ctx.strokeStyle = '#8a857a';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // player arrow (position + heading)
      const pxp = playerPosition.x * sx;
      const pzp = playerPosition.z * sz;
      // heading: 3D yaw where 0 faces +z (south on map). Map: x right, z down.
      const dirX = Math.sin(playerHeading.value);
      const dirZ = Math.cos(playerHeading.value);
      ctx.save();
      ctx.translate(pxp, pzp);
      ctx.rotate(Math.atan2(dirX, dirZ));
      ctx.fillStyle = '#b4533c';
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4.5, 5);
      ctx.lineTo(0, 2.5);
      ctx.lineTo(-4.5, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [discovered, collectedFragments]);

  const size = expanded ? 'w-64' : 'w-32';

  return (
    <div className="absolute bottom-4 right-4 z-10 sm:bottom-16">
      <div
        className={`relative overflow-hidden rounded-xl border border-white/15 bg-black/50 shadow-lg backdrop-blur-sm transition-all ${size}`}
      >
        <canvas ref={canvasRef} className="block w-full" />
        <button
          onClick={onToggleExpanded}
          className="absolute right-1 top-1 rounded-md bg-black/50 p-1 text-[#a0a09c] transition-colors hover:text-[#e8e4d8]"
          aria-label={expanded ? 'Shrink minimap' : 'Expand minimap'}
        >
          {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
