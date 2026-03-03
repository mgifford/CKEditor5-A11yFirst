export type ToolbarState = {
  selected: boolean;
  disabled: boolean;
  expanded: boolean;
  ariaPressed?: 'true' | 'false';
  ariaExpanded?: 'true' | 'false';
};

export function createToolbarState(input: {
  selected?: boolean;
  disabled?: boolean;
  expanded?: boolean;
}): ToolbarState {
  const selected = Boolean(input.selected);
  const disabled = Boolean(input.disabled);
  const expanded = Boolean(input.expanded);

  return {
    selected,
    disabled,
    expanded,
    ariaPressed: selected ? 'true' : 'false',
    ariaExpanded: expanded ? 'true' : 'false'
  };
}
