export abstract class Exchange {
  protected name: string = null;

  getName(): string { return name; }
  abstract supportedOperations(): Array<string>;
}
