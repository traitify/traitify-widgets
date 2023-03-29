export default function useResizeMock() {
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
