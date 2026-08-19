const storageStub = {
  clear: () => {},
  getItem: () => null,
  removeItem: () => {},
  setItem: () => {}
};

if(typeof sessionStorage === "undefined") { global.sessionStorage = storageStub; }
