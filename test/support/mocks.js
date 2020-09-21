export function useResizeMock() {
  let originalResizeTo;

  beforeAll(() => {
    originalResizeTo = window.resizeTo;

    window.resizeTo = function resizeTo(width, height) {
      Object.assign(this, {
        innerWidth: width,
        innerHeight: height,
        outerWidth: width,
        outerHeight: height
      }).dispatchEvent(new this.Event("resize"));
    };
  });

  afterAll(() => {
    window.resizeTo = originalResizeTo;
  });
}

export function useWindowMock(key) {
  let original;

  beforeEach(() => {
    original = window[key];

    window[key] = jest.fn().mockName(key);
  });

  afterEach(() => {
    window[key] = original;
  });
}
