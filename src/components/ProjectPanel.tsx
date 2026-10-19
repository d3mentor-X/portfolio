import { useEffect, useState } from 'react';
import { ExternalLink, X, Github, Link2 } from 'lucide-react';
import type { Project } from '@/data/projects';

interface Props {
  project: Project;
  onClose: () => void;
  onSave: (edits: { status?: string; repoUrl?: string; demoUrl?: string; summary?: string }) => void;
}

const STATUSES = ['Completed', 'In progress', 'Prototype', 'Planned', 'On hold'];

export function ProjectPanel({ project, onClose, onSave }: Props) {
  const [status, setStatus] = useState(project.status);
  const [repoUrl, setRepoUrl] = useState(project.repoUrl);
  const [demoUrl, setDemoUrl] = useState(project.demoUrl);
  const [summary, setSummary] = useState(project.summary);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setStatus(project.status);
    setRepoUrl(project.repoUrl);
    setDemoUrl(project.demoUrl);
    setSummary(project.summary);
    setEditing(false);
  }, [project]);

  const dirty =
    status !== project.status ||
    repoUrl !== project.repoUrl ||
    demoUrl !== project.demoUrl ||
    summary !== project.summary;

  const safeHref = (u: string) => (u ? (u.startsWith('http') ? u : `https://${u}`) : '');

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[#d5d1c4] bg-[#f5f3ec] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={project.name}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#b4533c]">Project milestone</p>
            <h2 className="mt-1 text-xl font-semibold text-[#33312c]">{project.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#7a7568] transition-colors hover:bg-black/5 hover:text-[#33312c]"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {editing ? (
          <div className="mt-5 space-y-4">
            {project.editableSummary && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-[#6b675c]">Summary</span>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-[#c9c4b4] bg-white px-3 py-2 text-sm text-[#33312c] outline-none focus:border-[#b4533c]"
                  placeholder="Describe the features…"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#6b675c]">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-[#c9c4b4] bg-white px-3 py-2 text-sm text-[#33312c] outline-none focus:border-[#b4533c]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#f5f3ec]">
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#6b675c]">Repository link</span>
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full rounded-lg border border-[#c9c4b4] bg-white px-3 py-2 text-sm text-[#33312c] outline-none focus:border-[#b4533c]"
                placeholder="https://github.com/…"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-[#6b675c]">Demo link</span>
              <input
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="w-full rounded-lg border border-[#c9c4b4] bg-white px-3 py-2 text-sm text-[#33312c] outline-none focus:border-[#b4533c]"
                placeholder="https://…"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setStatus(project.status);
                  setRepoUrl(project.repoUrl);
                  setDemoUrl(project.demoUrl);
                  setSummary(project.summary);
                  setEditing(false);
                }}
                className="rounded-lg px-4 py-2 text-sm text-[#7a7568] hover:text-[#33312c]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSave({ status, repoUrl, demoUrl, summary });
                  setEditing(false);
                }}
                disabled={!dirty}
                className="rounded-lg bg-[#b4533c] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#c96249] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm leading-relaxed text-[#4a473f]">{project.summary}</p>

            {project.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#d5d1c4] bg-white/60 px-3 py-1 text-xs text-[#6b675c]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-[#7a7568]">Status:</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  project.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : project.status === 'Planned'
                      ? 'bg-black/10 text-[#6b675c]'
                      : 'bg-amber-100 text-amber-700'
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {project.repoUrl ? (
                <a
                  href={safeHref(project.repoUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4b4] px-4 py-2 text-sm text-[#33312c] transition-colors hover:border-[#a39d8c]"
                >
                  <Github className="h-4 w-4" /> Repository <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#b5b0a0] px-4 py-2 text-sm text-[#8a857a]">
                  <Link2 className="h-4 w-4" /> Repository link — placeholder
                </span>
              )}
              {project.demoUrl ? (
                <a
                  href={safeHref(project.demoUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#c9c4b4] px-4 py-2 text-sm text-[#33312c] transition-colors hover:border-[#a39d8c]"
                >
                  <ExternalLink className="h-4 w-4" /> Demo <ExternalLink className="h-3 w-3 opacity-50" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-lg border border-dashed border-[#b5b0a0] px-4 py-2 text-sm text-[#8a857a]">
                  <Link2 className="h-4 w-4" /> Demo link — placeholder
                </span>
              )}
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-5 w-full rounded-lg border border-[#c9c4b4] py-2 text-sm font-medium text-[#b4533c] transition-colors hover:bg-black/5"
            >
              Edit status & links
            </button>
          </>
        )}
      </div>
    </div>
  );
}
