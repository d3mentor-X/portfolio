import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { PROFILE } from '@/data/profile';
import { PROJECTS, PLANNED } from '@/data/projects';

interface Props {
  onBack: () => void;
  discovered: Set<string>;
}

export function ProjectList({ onBack, discovered }: Props) {
  const safeHref = (u: string) => (u ? (u.startsWith('http') ? u : `https://${u}`) : '');
  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-[#e8e6df]">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <button
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#b4533c] transition-colors hover:text-[#c96249]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to world
        </button>

        <h1 className="text-2xl font-semibold text-[#33312c]">{PROFILE.name}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6b675c]">{PROFILE.intro}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {PROFILE.skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-[#d5d1c4] bg-white/60 px-3 py-1 text-xs text-[#6b675c]"
            >
              {s}
            </span>
          ))}
        </div>

        <h2 className="mt-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b4533c]">
          Projects
        </h2>
        <div className="mt-4 space-y-4">
          {PROJECTS.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-[#d5d1c4] bg-[#f5f3ec] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-[#33312c]">{p.name}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : p.status === 'Planned'
                        ? 'bg-black/10 text-[#6b675c]'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {p.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#4a473f]">{p.summary}</p>
              {p.technologies.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[#d5d1c4] bg-white/60 px-2.5 py-0.5 text-xs text-[#6b675c]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {p.repoUrl ? (
                  <a
                    href={safeHref(p.repoUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#b4533c] hover:text-[#c96249]"
                  >
                    <Github className="h-4 w-4" /> Repository
                  </a>
                ) : (
                  <span className="text-[#8a857a]">Repository link — placeholder</span>
                )}
                {p.demoUrl && (
                  <a
                    href={safeHref(p.demoUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#b4533c] hover:text-[#c96249]"
                  >
                    <ExternalLink className="h-4 w-4" /> Demo
                  </a>
                )}
              </div>
              <p className="mt-3 text-xs text-[#8a857a]">
                {discovered.has(p.id) ? 'Found in the world' : 'Not yet found in the world'}
              </p>
            </article>
          ))}
        </div>

        <h2 className="mt-10 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#7a7568]">
          Planned
        </h2>
        <div className="mt-4 space-y-3">
          {PLANNED.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-dashed border-[#b5b0a0] bg-white/40 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-medium text-[#4a473f]">{p.name}</h3>
                <span className="rounded-full bg-black/10 px-3 py-1 text-xs text-[#6b675c]">
                  {p.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#7a7568]">{p.summary}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 border-t border-[#d5d1c4] pt-6 text-sm text-[#7a7568]">
          <p className="font-medium text-[#4a473f]">Contact</p>
          {PROFILE.contact.email ? (
            <a href={`mailto:${PROFILE.contact.email}`} className="text-[#b4533c] hover:text-[#c96249]">
              {PROFILE.contact.email}
            </a>
          ) : (
            <p>Email — placeholder</p>
          )}
          <div className="mt-2 flex gap-4">
            {PROFILE.contact.github && (
              <a
                href={safeHref(PROFILE.contact.github)}
                target="_blank"
                rel="noreferrer"
                className="text-[#b4533c] hover:text-[#c96249]"
              >
                GitHub
              </a>
            )}
            {PROFILE.contact.linkedin && (
              <a
                href={safeHref(PROFILE.contact.linkedin)}
                target="_blank"
                rel="noreferrer"
                className="text-[#b4533c] hover:text-[#c96249]"
              >
                LinkedIn
              </a>
            )}
            {!PROFILE.contact.github && !PROFILE.contact.linkedin && <p>Links — placeholders</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
