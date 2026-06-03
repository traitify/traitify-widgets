export default class Listener {
  constructor() {
    this.callbacks = {};
    this.current = {};
  }
  clear = (_key) => {
    const key = _key && _key.toLowerCase();

    if(key) {
      delete this.callbacks[key];
      delete this.current[key];
    } else {
      this.callbacks = {};
      this.current = {};
    }
  };
  off = (_key, callback) => {
    const key = _key.toLowerCase();

    this.callbacks[key] = this.callbacks[key] || [];
    this.callbacks[key] = this.callbacks[key].filter((_callback) => (_callback !== callback));

    if(this.callbacks[key].length === 0) { delete this.callbacks[key]; }
  };
  on = (_key, callback) => {
    const key = _key.toLowerCase();
    const value = this.value(key);

    this.callbacks[key] = this.callbacks[key] || [];
    this.callbacks[key].push(callback);

    if(value !== undefined) { callback(value); }

    return () => this.off(key, callback);
  };
  trigger = (_key, value) => {
    const key = _key.toLowerCase();

    if(this.callbacks[key]) { this.callbacks[key].forEach((callback) => callback(value)); }
    if(this.callbacks.all) { this.callbacks.all.forEach((callback) => callback(key, value)); }

    this.current[key] = value;
  };
  value = (_key) => this.current[_key.toLowerCase()];
}
