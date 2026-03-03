import type { HeadingCommandState, HeadingConfig, HeadingContext, HeadingTag } from './types';
import { createHeadingCommandState } from './allowedHeadings';

export class A11yHeadingCommand {
  private readonly config: HeadingConfig;
  private state: HeadingCommandState;

  public constructor(config: HeadingConfig) {
    this.config = config;
    this.state = { allowed: [] };
  }

  public refresh(context: HeadingContext): HeadingCommandState {
    this.state = createHeadingCommandState(this.config, context);
    return this.state;
  }

  public isEnabled(tag: HeadingTag): boolean {
    const option = this.state.allowed.find((item) => item.tag === tag);
    return Boolean(option?.enabled);
  }

  public getState(): HeadingCommandState {
    return this.state;
  }
}
