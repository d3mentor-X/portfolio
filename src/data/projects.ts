// ============================================================
// PROJECT CONTENT
// To add a project: add it to PROJECTS (built work) or PLANNED
// (ideas not yet built), then add a milestone for it in
// src/config/world.ts. Leave a link as '' to show a placeholder.
// ============================================================

export interface Project {
  id: string;
  name: string;
  summary: string;
  technologies: string[];
  status: string;
  repoUrl: string;
  demoUrl: string;
  /** Show an editable summary field (used for projects with details still to fill in). */
  editableSummary?: boolean;
}

export interface ProjectEdits {
  status?: string;
  repoUrl?: string;
  demoUrl?: string;
  summary?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'echoes-of-the-dead',
    name: 'Echoes of the Dead',
    summary:
      'A Unity 3D zombie survival game. Work included C# scripts, zombie movement and spawning, shooting, coins and kill counters, portals, level progression, medicine pickups, missions, UI, animation, and sound.',
    technologies: ['Unity', 'C#', 'UI', 'Animation', 'Sound'],
    status: 'Completed',
    repoUrl: '', // add repository link
    demoUrl: '', // add demo / build link
  },
  {
    id: 'crystal-core',
    name: 'Crystal Core',
    summary:
      'A Unity game prototype featuring drones, colored crystal rings, sequence-based targets, and synthesized sound effects.',
    technologies: ['Unity', 'C#', 'Audio synthesis'],
    status: 'Prototype',
    repoUrl: '', // add repository link
    demoUrl: '', // add demo link
  },
  {
    id: 'gold-agent',
    name: 'Gold Agent',
    summary:
      'A Python-based gold market research and backtesting project with a parameterized strategy, historical data, simulated trades, and research reports. Research only — not financial advice.',
    technologies: ['Python', 'Data analysis', 'Backtesting', 'Reporting'],
    status: 'Completed',
    repoUrl: '', // add repository link
    demoUrl: '', // add report link
  },
  {
    id: 'ai-image-classification',
    name: 'AI Image Classification',
    summary:
      'A Python app that uses Gemini to analyze images.',
    technologies: ['Python', 'Gemini API'],
    status: 'In progress',
    repoUrl: '', // add repository link
    demoUrl: '', // add demo link
  },
  {
    id: 'wellness-app',
    name: 'Wellness app',
    summary:
      'A wellness and fitness tracking project. Feature summary coming soon.',
    technologies: ['Wellness', 'Fitness tracking'],
    status: 'In progress',
    repoUrl: '', // add repository link
    demoUrl: '', // add demo link
    editableSummary: true,
  },
];

/** Future ideas — not presented as built work. */
export const PLANNED: Project[] = [
  {
    id: 'planned-ecommerce',
    name: 'E-commerce platform',
    summary: 'A planned online store project. Details to be confirmed.',
    technologies: [],
    status: 'Planned',
    repoUrl: '',
    demoUrl: '',
  },
  {
    id: 'planned-saas',
    name: 'SaaS projects',
    summary: 'Planned software-as-a-service ideas. Details to be confirmed.',
    technologies: [],
    status: 'Planned',
    repoUrl: '',
    demoUrl: '',
  },
];

export function getProjectById(id: string): Project | undefined {
  return [...PROJECTS, ...PLANNED].find((p) => p.id === id);
}

/** Merge a project with locally saved edits (status / links / summary). */
export function getMergedProject(
  id: string,
  edits: Record<string, ProjectEdits>,
): Project | undefined {
  const base = getProjectById(id);
  if (!base) return undefined;
  const e = edits[id] ?? {};
  return {
    ...base,
    status: e.status ?? base.status,
    repoUrl: e.repoUrl ?? base.repoUrl,
    demoUrl: e.demoUrl ?? base.demoUrl,
    summary: e.summary ?? base.summary,
  };
}
