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
Mocks.setup();

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

  it("Preact should render the Default Component", () => {
    let options = Factories.Props.Main();

    render(<Default {...options} />, scratch);

    expect(scratch.innerHTML).to.contain("Not Me");
  });

  it("Traitify should render the Default Component", (done) => {
    let test = Traitify.ui.assessmentId("test");
    test.target(scratch);
    test.on("slidedeck.initialized", ()=>{
      expect(scratch.innerHTML).to.contain("Not Me");
      done();
    });
    test.render();
  });

  it("Click Me", (done) => {
    let test = Traitify.ui.assessmentId("test");
    test.target(scratch);
    test.on("slidedeck.me", ()=>{
      expect(true).to.eql(true);
      done();
    });

    test.on("slidedeck.initialized", ()=>{
      let me = scratch.querySelector(".traitify--slidedeck--me");
      simulateEvent.simulate(me, 'click');
    });

    test.render();
  });

  it("Click Not Me", (done) => {
    let test = Traitify.ui.assessmentId("test");
    test.target(scratch);
    test.on("slidedeck.notMe", ()=>{
      expect(true).to.eql(true);
      done();
    });

    test.on("slidedeck.initialized", ()=>{
      let me = scratch.querySelector(".traitify--slidedeck--notMe");
      simulateEvent.simulate(me, 'click');
    });

    test.render();
  });

  it("Click Not Me", (done) => {
    let test = Traitify.ui.assessmentId("test");
    test.target(scratch);
    test.on("slidedeck.notMe", ()=>{
      expect(true).to.eql(true);
      done();
    });

    test.on("slidedeck.initialized", ()=>{
      let me = scratch.querySelector(".traitify--slidedeck--notMe");
      simulateEvent.simulate(me, 'click');
    });

    test.render();
  });

  it("Answer Slide", (done) => {
    let test = Traitify.ui.assessmentId("test");
    test.target(scratch);
    test.on("slidedeck.answerslide", ()=>{
      expect(true).to.eql(true);
      done();
    });

    test.on("slidedeck.initialized", ()=>{
      let me = scratch.querySelector(".traitify--slidedeck--me");
      simulateEvent.simulate(me, 'click');
    });

    test.render();
  });
});
