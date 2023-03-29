export default class Cache {
  clear = () => {
    try {
      return sessionStorage.clear();
    } catch(error) { return null; }
  };
  get = (key) => {
    try {
      const data = sessionStorage.getItem(key);

      return data ? JSON.parse(data) : null;
    } catch(error) { return null; }
  };
  set = (key, data) => {
    try {
      return sessionStorage.setItem(key, JSON.stringify(data));
    } catch(error) { return null; }
  };
}
