export const siteConfig = {
  title: 'Mujahid Y.I',
  shortTitle: 'MYI / Notes',
  subtitle: 'Cybersecurity notes, projects, and learning records',
  description:
    'Notes and project records covering cybersecurity, computer systems, CTF development, IoT, hardware security, and technical education.',
  author: 'Mujahid Y.I',
  university: 'Nanyang Technological University',
  course: 'Information Engineering and Media',
  locale: 'en_SG',
  social: {
    github: 'https://github.com/mujabeast',
    linkedin: 'https://www.linkedin.com/in/mujahid-yang-iskandar-b2a5b5210/',
    email: 'mujahid002@e.ntu.edu.sg'
  }
} as const;

export const categoryLabels = {
  journey: 'Journey',
  writeups: 'Write-ups',
  learning: 'Learning Notes',
  projects: 'Projects',
  experiences: 'Experiences'
} as const;

export const categories = Object.keys(categoryLabels) as (keyof typeof categoryLabels)[];
