export default class Cache<T> {
  private entries: { [key: string]: T } = {};
  private operation;

  constructor(operation: (key: string) => Promise<T>) {
    this.operation = operation;
  }

  public load(initialValues: [string, T][] | null): void {
    if (initialValues) {
      Object.assign(this.entries, Object.fromEntries(initialValues));
    }
  }

  public async get(key: string): Promise<T> {
    if (!(key in this.entries)) {
      this.entries[key] = await this.operation(key);
    }
    return this.entries[key];
  }

  public getKeys(): string[] {
    return Object.keys(this.entries);
  }

  public invalidate(key: string | null = null): void {
    if (key === null) {
      this.entries = {};
    } else {
      delete this.entries[key];
    }
  }
}
