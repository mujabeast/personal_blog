export const interestTopics = [
  {
    id: 'systems',
    label: 'Linux & systems'
  },
  {
    id: 'reverse-engineering',
    label: 'Reverse engineering'
  },
  {
    id: 'web-api-security',
    label: 'Web & API security'
  },
  {
    id: 'ctf-development',
    label: 'CTF development'
  },
  {
    id: 'iot-hardware',
    label: 'IoT & hardware'
  },
  {
    id: 'technical-education',
    label: 'Technical education'
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
