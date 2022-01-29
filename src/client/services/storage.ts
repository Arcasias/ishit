import { useState } from "@odoo/owl";

interface StorageManagerOptions<T> {
  parse?: (value: string) => T;
  serialize?: (value: T) => string;
}

interface StorageManager<T = any> {
  clear(): void;
  get(key: string, defaultValue: T | null): T | null;
  has(key: string): boolean;
  keys(): string[];
  load(): [string, T][];
  remove(key: string): boolean;
  set(key: string, value: T): T;
  subscribe(): void;
}

export const useStorage = (storageManager: StorageManager) =>
  storageManager.subscribe();

export const makeStorageManager = <T>(
  key: string,
  options: StorageManagerOptions<T> = {}
): StorageManager<T> => {
  const re = new RegExp(`^${key}:(.*)$`);
  const entries: { [key: string]: T } = {};
  const getKey: (key: string) => string = (k) => `${key}:${k}`;
  const findKey: (key: string) => RegExpMatchArray | null = (k) => k.match(re);
  const parse = options.parse || ((v: any) => v);
  const serialize = options.serialize || ((v: any) => v);

  return {
    clear() {
      for (const key in entries) {
        this.remove(key);
      }
    },
    get(key, defaultValue = null) {
      if (this.has(key)) {
        return entries[key];
      } else if (defaultValue !== null) {
        return this.set(key, defaultValue);
      } else {
        return null;
      }
    },
    has: (key) => key in entries,
    keys: () => Object.keys(entries),
    load() {
      for (const [key, value] of Object.entries(localStorage)) {
        const match = findKey(key);
        if (match) entries[match[1]] = parse!(value);
      }
      return Object.entries(entries);
    },
    remove(key) {
      if (this.has(key)) {
        localStorage.removeItem(getKey(key));
        delete entries[key];
        return true;
      } else {
        return false;
      }
    },
    set(key, value) {
      entries[key] = value;
      localStorage.setItem(getKey(key), serialize!(value));
      return value;
    },
    subscribe: () => useState(entries),
  };
};
