function capitalizeSegment(segment: string): string {
  const match = segment.match(/^([^a-zA-Z]*)([a-zA-Z])(.*)$/);
  if (!match) return segment;
  const [, prefix, first, rest] = match;
  return prefix + first.toUpperCase() + rest.toLowerCase();
}

/** 고객사명: 단어별 첫 글자 대문자, 나머지 소문자 (하이픈·마침표 구분 유지) */
export function formatClientName(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) =>
      word
        .split(/([.-])/)
        .map((part) => (part === '.' || part === '-' ? part : capitalizeSegment(part)))
        .join(''),
    )
    .join(' ');
}
