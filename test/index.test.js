import Http from "lib/http";
import I18n from "lib/i18n";
import Listener from "lib/listener";

jest.mock("components", () => ({
  Default: () => <div className="mock">Default</div>
}));

describe("Traitify", () => {
  let traitify;

  beforeEach(() => {
    traitify = require("index"); // eslint-disable-line global-require
  });

  it("has Components", () => {
    expect(traitify.Components).toEqual(expect.any(Object));
  });

  it("has GraphQL", () => {
    expect(traitify.GraphQL).toEqual(expect.any(Object));
  });

  it("has http", () => {
    expect(traitify.http).toEqual(expect.any(Http));
  });

  it("has i18n", () => {
    expect(traitify.i18n).toEqual(expect.any(I18n));
  });

  it("has listener", () => {
    expect(traitify.listener).toEqual(expect.any(Listener));
  });
});
