const CACHE_KEY_PREFIX = 'ensou$';
const _cache = {
  _data: {},

  getItem(key: string) {
    return this._data[key];
  },

  setItem(key: string, data: string) {
    this._data[key] = data;

    return this;
  }
};

const storage = sessionStorage || localStorage || _cache;

const getKey = (name: string) => `${CACHE_KEY_PREFIX}${name}`;

export const get = (name: string) => {
  const key = getKey(name);
  const value = storage.getItem(key);

  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (err) {
    console.log('Failed to parse cache!', err);

    return null;
  }
};

export const set = (name: string, data: any) => {
  const key = getKey(name);
  const value = JSON.stringify(data);

  return storage.setItem(key, value);
};
