class StorageMock {
  constructor() { this.store = {}; }
  clear() { this.store = {}; }
  getItem(key) { return this.store[key] || null; }
  setItem(key, value) { this.store[key] = String(value); }
  removeItem(key) { delete this.store[key]; }
}

export default function useStorage() {
  let originalLocalStorage;
  let originalSessionStorage;

  beforeAll(() => {
    originalLocalStorage = global.localStorage;
    originalLocalStorage = global.sessionStorage;

    global.localStorage ||= new StorageMock();
    global.sessionStorage ||= new StorageMock();
  });

  afterEach(() => {
    global.localStorage.clear();
    global.sessionStorage.clear();
  });

  afterAll(() => {
    global.localStorage = originalLocalStorage;
    global.sessionStorage = originalSessionStorage;
  });
}
