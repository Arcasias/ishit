import { useState } from "@odoo/owl";

interface Cache<T = any> {
  load(initialValues: [string, T][] | null): void;
  get(key: string): Promise<T>;
  getKeys(): string[];
  invalidate(key: string | null): void;
  subscribe(): void;
}

export const useCache = (cache: Cache) => cache.subscribe();

export const makeCache = <T>(
  operation: (key: string) => Promise<T>
): Cache<T> => {
  const entries: { [key: string]: T } = {};
  return {
    load(initialValues) {
      if (initialValues) {
        Object.assign(entries, Object.fromEntries(initialValues));
      }
    },
    async get(key) {
      if (!(key in entries)) {
        entries[key] = await operation(key);
      }
      return entries[key];
    },
    getKeys: () => Object.keys(entries),
    invalidate(key = null) {
      const keys = key === null ? this.getKeys() : [key];
      for (const key of keys) {
        delete entries[key];
      }
    },
    subscribe: () => useState(entries),
  };
};
