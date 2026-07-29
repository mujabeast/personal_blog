export const siteConfig = {
  title: 'Mujahid Iskandar',
  shortTitle: 'MI / FIELD NOTES',
  subtitle: 'Cybersecurity student, builder and community leader',
  description:
    'A cybersecurity student documenting the process of learning systems, building projects, teaching beginners and growing a university security community.',
  author: 'Mujahid Iskandar',
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
