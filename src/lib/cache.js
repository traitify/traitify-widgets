export default class Cache {
  constructor({namespace, storage} = {}) {
    this.namespace = namespace;
    this.storage = storage || sessionStorage;
  }
  clear = () => {
    try {
      return this.storage.clear();
    } catch { return null; }
  };
  getKey = (name) => [this.namespace, name].filter(Boolean).join("-");
  get = (_key, {fallback = null} = {}) => {
    const key = this.getKey(_key);

    try {
      const data = this.storage.getItem(key);
      if(data) {
        const {expiresAt, value} = JSON.parse(data);
        if(!expiresAt || expiresAt >= Date.now()) { return value; }

        this.storage.removeItem(key);
      }
    } catch { return fallback; }

    if(fallback != null) { this.set(_key, fallback); }

    return fallback;
  };
  remove = (_key) => {
    const key = this.getKey(_key);

    try {
      return this.storage.removeItem(key);
    } catch { return null; }
  };
  set = (_key, value, options = {}) => {
    const key = this.getKey(_key);

    try {
      const data = {value};
      if(options.expiresAt) { data.expiresAt = options.expiresAt; }
      if(options.expiresIn) { data.expiresAt = Date.now() + options.expiresIn * 1000; }

      return this.storage.setItem(key, JSON.stringify(data));
    } catch { return null; }
  };
}
