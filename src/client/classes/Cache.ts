export default class Cache<T> {
  private entries: { [key: string]: T } = {};
  private name: string;
  private operation;

  constructor(name: string, operation: (key: string) => Promise<T>) {
    this.name = name;
    this.operation = operation;
  }

  public load(): void {
    const storageEntries = localStorage.getItem(this.name);
    if (storageEntries) {
      const entries = JSON.parse(storageEntries) as [string, T][];
      Object.assign(this.entries, Object.fromEntries(entries));
    }
  }

  public async get(key: string): Promise<T> {
    if (!(key in this.entries)) {
      this.entries[key] = await this.operation(key);
      this.updateStorage();
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
    this.updateStorage();
  }

  private updateStorage(): void {
    const entries = Object.entries(this.entries);
    localStorage.setItem(this.name, JSON.stringify(entries));
  }
}
