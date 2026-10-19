// ============================================================
// PROFILE — edit your name, introduction, skills and contacts.
// Anything left as '' shows a labelled placeholder in the app.
// ============================================================

export interface Settings {
  sound: boolean;
  reducedMotion: boolean;
}

export const PROFILE = {
  name: 'Waleed Hasnain Shah',
  title: 'Portfolio',
  // Short introduction shown on the title screen and project list.
  intro:
    'An explorable portfolio. Walk the paths, find the lanterns, and discover each project where it stands.',
  skills: [
    'Unity',
    'C#',
    'Python',
    'Game design',
    'UI / UX',
    'Sound design',
  ],
  contact: {
    email: '', // e.g. 'you@example.com'
    github: '', // e.g. 'https://github.com/your-name'
    linkedin: '', // e.g. 'https://linkedin.com/in/your-name'
  },
};
