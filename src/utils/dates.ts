export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}
