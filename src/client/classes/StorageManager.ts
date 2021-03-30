interface StorageManagerOptions<T> {
  parse?: (value: string) => T;
  serialize?: (value: T) => string;
}

export class StorageManager<T> {
  private entries: { [key: string]: T } = {};
  private getKey: (key: string) => string;
  private findKey: (key: string) => RegExpMatchArray | null;

  private parse: (value: string) => T;
  private serialize: (value: T) => string;

  constructor(
    key: string,
    { parse, serialize }: StorageManagerOptions<T> = {}
  ) {
    const re = new RegExp(`^${key}:(.*)$`);
    this.getKey = (k) => `${key}:${k}`;
    this.findKey = (k) => k.match(re);

    this.parse = parse || ((v: any) => v);
    this.serialize = serialize || ((v: any) => v);
  }

  public clear(): void {
    for (const key in this.entries) {
      this.remove(key);
    }
  }

  public get(key: string): T | null {
    return this.has(key) ? this.entries[key] : null;
  }

  public has(key: string): boolean {
    return key in this.entries;
  }

  public keys(): string[] {
    return Object.keys(this.entries);
  }

  public load(): [string, T][] {
    for (const [key, value] of Object.entries(localStorage)) {
      const match = this.findKey(key);
      if (match) this.entries[match[1]] = this.parse(value);
    }
    return Object.entries(this.entries);
  }

  public remove(key: string): boolean {
    if (this.has(key)) {
      localStorage.removeItem(this.getKey(key));
      delete this.entries[key];
      return true;
    } else {
      return false;
    }
  }

  public set(key: string, value: T): T {
    this.entries[key] = value;
    localStorage.setItem(this.getKey(key), this.serialize(value));
    return value;
  }
}
