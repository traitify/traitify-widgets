export default class Cache {
  constructor({namespace} = {}) {
    this.namespace = namespace;
  }
  clear = () => {
    try {
      return sessionStorage.clear();
    } catch(error) { return null; }
  };
  getKey = (name) => [this.namespace, name].filter(Boolean).join("-");
  get = (_key) => {
    const key = this.getKey(_key);

    try {
      const data = sessionStorage.getItem(key);
      if(!data) { return data; }

      const {expiresAt, value} = JSON.parse(data);
      if(!expiresAt) { return value; }
      if(expiresAt >= Date.now()) { return value; }

      sessionStorage.removeItem(key);

      return null;
    } catch(error) { return null; }
  };
  remove = (_key) => {
    const key = this.getKey(_key);

    try {
      return sessionStorage.removeItem(key);
    } catch(error) { return null; }
  };
  set = (_key, value, options = {}) => {
    const key = this.getKey(_key);

    try {
      const data = {value};
      if(options.expiresAt) { data.expiresAt = options.expiresAt; }
      if(options.expiresIn) { data.expiresAt = Date.now() + options.expiresIn * 1000; }

      return sessionStorage.setItem(key, JSON.stringify(data));
    } catch(error) { return null; }
  };
}
