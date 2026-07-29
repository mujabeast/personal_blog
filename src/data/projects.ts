import type { InterestTopicId } from './interests';

export type ProjectStatus = 'Active' | 'Completed' | 'Learning project' | 'Archived' | 'Private';

export interface Project {
  number: string;
  title: string;
  status: ProjectStatus;
  period: string;
  description: string;
  details: string[];
  tags: string[];
  graphTopics?: InterestTopicId[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    number: 'P-01',
    title: 'NTU Rewind',
    status: 'Completed',
    period: 'March–April 2026',
    description: 'An OSINT CTF challenge built around NTU history using public archival and location-based sources.',
    details: [
      'An early milestone in moving from solving challenges to designing them.',
      'The public summary deliberately leaves out the complete solution.'
    ],
    tags: ['OSINT', 'CTF', 'challenge creation'],
    graphTopics: ['ctf-development'],
    featured: true
  },
  {
    number: 'P-02',
    title: 'IoT & physical security challenge development',
    status: 'Active',
    period: '2026',
    description: 'Exploring a PTZ CCTV-based challenge and the interaction between device control, APIs and physical systems.',
    details: [
      'Uses isolated environments and avoids publishing device credentials or private network details.',
      'A practical lesson in designing for safety, repeatability and hardware reliability.'
    ],
    tags: ['IoT', 'APIs', 'physical security'],
    graphTopics: ['iot-hardware'],
    featured: true
  },
  {
    number: 'P-03',
    title: 'Personal electronic badge',
    status: 'Learning project',
    period: 'In development',
    description: 'An ESP32-S3 direction with an OLED display, rechargeable power and Wi-Fi and Bluetooth exploration.',
    details: [
      'A route into custom PCB design and constrained embedded systems.',
      'The public description focuses only on the technical learning.'
    ],
    tags: ['ESP32-S3', 'embedded', 'PCB'],
    graphTopics: ['iot-hardware'],
    featured: true
  },
  {
    number: 'P-04',
    title: 'Cybersecurity community programmes',
    status: 'Active',
    period: '2025–present',
    description: 'Beginner workshops, CTF education and challenge creation supporting NTU’s cybersecurity community.',
    details: [
      'Designed to give beginners a safe, practical entry point.',
      'Internal participant, sponsor and university details remain private.'
    ],
    tags: ['teaching', 'leadership', 'community'],
    graphTopics: ['technical-education'],
    featured: true
  }
];
