export const interestTopics = [
  {
    id: 'systems',
    label: 'Linux & Systems'
  },
  {
    id: 'reverse-engineering',
    label: 'Reverse Engineering'
  },
  {
    id: 'web-api-security',
    label: 'Web & API Security'
  },
  {
    id: 'ctf-development',
    label: 'CTF Development'
  },
  {
    id: 'iot-hardware',
    label: 'IoT & Hardware'
  },
  {
    id: 'technical-education',
    label: 'Technical Education'
  }
] as const;

export const interestTopicIds = [
  'systems',
  'reverse-engineering',
  'web-api-security',
  'ctf-development',
  'iot-hardware',
  'technical-education'
] as const;

export type InterestTopicId = (typeof interestTopicIds)[number];
