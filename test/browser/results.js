import { h, render, rerender } from "preact";
import Default from "../../src/components/default";
let Traitify = require("traitify").default;
Traitify.ui = require("traitify-ui").default;
window.Traitify = Traitify;
require("polyfills");
import Factories from "../support/factories";
import Mocks from "../support/mocks";
import simulateEvent from "simulate-event";

Mocks.Traitify = Traitify;

/*global sinon,expect*/

describe("", () => {
  let scratch;

  before(() => {
    scratch = document.createElement("div");
    (document.body || document.documentElement).appendChild(scratch);
    Mocks.mock("slides");
  });

  beforeEach(() => {
    scratch.innerHTML = "";
  });

  after(() => {
    scratch.parentNode.removeChild(scratch);
    scratch = null;
  });

  it("Answer Slide", (done) => {
    Mocks.mock();
    let test = Traitify.ui.assessmentId("test");
    test.target(scratch);

    test.render();
  });
});
