import { h, render, rerender } from "preact";
import Default from "../../src/components/default";
window.Traitify = require("traitify").default;
window.Traitify.ui = require("traitify-ui").default;
require("polyfills");
import Factories from "../support/factories";

/*global sinon,expect*/

describe("", () => {
  let scratch;

  before(() => {
    scratch = document.createElement("div");
    (document.body || document.documentElement).appendChild(scratch);
  });

  beforeEach(() => {
    scratch.innerHTML = "";
  });

  after(() => {
    scratch.parentNode.removeChild(scratch);
    scratch = null;
  });

  describe("Default Renders", () => {
    it("should render the Default Component", () => {
      let options = Factories.Props.Main();

      render(<Default {...options} />, scratch);

      expect(scratch.innerHTML).to.contain("Not Me");
    });
  });
});
