import type { HeadingConfig, HeadingTag } from './types';

export function headingTagToLevel(tag: HeadingTag): number | null {
  if (tag === 'p') {
    return null;
  }

  return Number(tag.slice(1));
}

export function ensureContiguousHeadings(formatTags: HeadingTag[]): HeadingTag[] {
  const hasParagraph = formatTags.includes('p');
  const levels = formatTags
    .map(headingTagToLevel)
    .filter((level): level is number => level !== null)
    .sort((left, right) => left - right);

  if (!levels.length) {
    return hasParagraph ? ['p'] : [];
  }

  const min = levels[0];
  const max = levels[levels.length - 1];

  const contiguous: HeadingTag[] = [];
  if (hasParagraph) {
    contiguous.push('p');
  }

  for (let level = min; level <= max; level += 1) {
    contiguous.push(`h${level}` as HeadingTag);
  }

  return contiguous;
}

export function normalizeHeadingConfig(config: HeadingConfig): HeadingConfig {
  return {
    ...config,
    formatTags: ensureContiguousHeadings(config.formatTags)
  };
}
