# Waleed Hasnain Shah — Portfolio World

A playable, open-world portfolio. Visitors walk a dark, atmospheric world and
discover each project at a glowing lantern.

## Run the app

```bash
npm install
npm run dev
```

Open the preview URL. Use `npm run build` to produce a production build.

## Controls

- **WASD / Arrow keys** — move
- **E / Enter / click a lantern** — open a project
- **M** — world map
- **Esc** — pause & settings (sound, reduced motion)
- **Touch devices** — on-screen joystick and interact button

Discovered milestones, settings, and any edits you make to statuses and links
are saved in the browser (localStorage) on that device.

## Where to edit content

| What | File |
| --- | --- |
| Name, intro, skills, contact details | `src/data/profile.ts` |
| Project names, summaries, technologies, default statuses, links | `src/data/projects.ts` |
| Future ideas (not shown as built) | `PLANNED` array in `src/data/projects.ts` |
| World size, area names/labels/colors, milestone positions, obstacles | `src/config/world.ts` |

Everything visible on the title screen and panels comes from these three files —
no need to touch components.

## How to add a project

1. Open `src/data/projects.ts` and add an entry to the `PROJECTS` array
   (or `PLANNED` if it is not built yet).
2. Open `src/config/world.ts` and add an entry to `WORLD.milestones` with the
   new project's `id` and `x` / `y` coordinates.
3. Optionally add obstacles in `WORLD.obstacles` nearby for visual interest —
   but keep straight walking paths clear.

## Editing statuses and links at runtime

Open any project panel and choose **Edit status & links**. Changes are saved
locally and shown everywhere (panel + project list), overriding the defaults in
`src/data/projects.ts` only on that device. To change them for everyone, edit
the defaults in the data file.

## Placeholders

Links, summaries or contact details left as `''` are shown as clearly labeled
placeholders (e.g. "Repository link — placeholder") instead of broken links.

## Accessibility

- Reduced motion stops lantern pulses, fog drift and character bobbing.
- Ambient sound can be muted in the pause menu or with the speaker button.
- A "Skip to project list" button on the title screen opens a standard,
  non-game project page.
