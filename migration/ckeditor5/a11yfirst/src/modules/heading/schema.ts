import type { HeadingTag } from './types';

export type HeadingSchemaDescriptor = {
  allowedTags: HeadingTag[];
  allowsParagraph: boolean;
};

export function createHeadingSchemaDescriptor(allowedTags: HeadingTag[]): HeadingSchemaDescriptor {
  return {
    allowedTags,
    allowsParagraph: allowedTags.includes('p')
  };
}
