import type { HeadingConfig, HeadingTag } from './types';

const VALID_TAGS: HeadingTag[] = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

function normalizeTag(value: string): HeadingTag | null {
  const normalized = value.trim().toLowerCase() as HeadingTag;
  return VALID_TAGS.includes(normalized) ? normalized : null;
}

export function parseFormatTags(formatTags: string | null | undefined): HeadingTag[] {
  const raw = (formatTags ?? '').trim();

  if (!raw) {
    return ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  }

  const tags = raw
    .split(';')
    .map((item) => normalizeTag(item))
    .filter((value): value is HeadingTag => value !== null);

  const unique = Array.from(new Set(tags));

  if (!unique.length) {
    return ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  }

  return unique;
}

export function parseHeadingConfig(input: {
  format_tags?: string;
  allow_only_one_h1?: boolean;
}): HeadingConfig {
  return {
    formatTags: parseFormatTags(input.format_tags),
    allowOnlyOneH1: Boolean(input.allow_only_one_h1)
  };
}
