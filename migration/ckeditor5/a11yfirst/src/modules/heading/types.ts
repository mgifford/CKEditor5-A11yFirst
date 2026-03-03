export type HeadingTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingConfig = {
  formatTags: HeadingTag[];
  allowOnlyOneH1: boolean;
};

export type HeadingContext = {
  previousHeadingLevel: number | null;
  hasExistingH1: boolean;
};

export type HeadingOptionState = {
  tag: HeadingTag;
  enabled: boolean;
};

export type HeadingCommandState = {
  allowed: HeadingOptionState[];
};
