import type { HeadingCommandState, HeadingConfig, HeadingContext, HeadingOptionState, HeadingTag } from './types';
import { headingTagToLevel, normalizeHeadingConfig } from './headingPolicy';

function isHeadingAllowed(tag: HeadingTag, config: HeadingConfig, context: HeadingContext): boolean {
  if (tag === 'p') {
    return true;
  }

  const level = headingTagToLevel(tag);
  if (level === null) {
    return false;
  }

  if (config.allowOnlyOneH1 && level === 1 && context.hasExistingH1) {
    return false;
  }

  if (context.previousHeadingLevel === null) {
    return level <= 2;
  }

  return level <= context.previousHeadingLevel + 1;
}

export function computeAllowedHeadings(config: HeadingConfig, context: HeadingContext): HeadingOptionState[] {
  const normalizedConfig = normalizeHeadingConfig(config);

  return normalizedConfig.formatTags.map((tag) => ({
    tag,
    enabled: isHeadingAllowed(tag, normalizedConfig, context)
  }));
}

export function createHeadingCommandState(config: HeadingConfig, context: HeadingContext): HeadingCommandState {
  return {
    allowed: computeAllowedHeadings(config, context)
  };
}
