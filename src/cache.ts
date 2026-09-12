export class Cache {
  private readonly cache: Map<string, unknown>;

  constructor() {
    this.cache = new Map();
  }

  retrieve(key: string): unknown {
    return this.cache.get(key);
  }

  save(key: string, value: unknown): Cache {
    this.cache.set(key, value);

    return this;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  toJSON(): { [key: string]: unknown } {
    const data: { [key: string]: unknown } = {};

    for (const key of Array.from(this.cache.keys())) {
      data[key] = this.cache.get(key);
    }

    return data;
  }
}
