import { createToolbarState, type ToolbarState } from '../../core/toolbarState';
import type { HeadingCommandState, HeadingTag } from './types';

export type HeadingToolbarItem = {
  tag: HeadingTag;
  state: ToolbarState;
};

export function buildHeadingToolbarState(input: {
  commandState: HeadingCommandState;
  selectedTag: HeadingTag | null;
  expanded: boolean;
}): HeadingToolbarItem[] {
  return input.commandState.allowed.map((option) => ({
    tag: option.tag,
    state: createToolbarState({
      selected: input.selectedTag === option.tag,
      disabled: !option.enabled,
      expanded: input.expanded
    })
  }));
}
