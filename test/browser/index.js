import { h, render, rerender } from "preact";
import { route } from "preact-router";
import Default from "components/default";
import "style";

/*global sinon,expect*/

describe("", () => {
  let scratch;

  before( () => {
    scratch = document.createElement("div");
    (document.body || document.documentElement).appendChild(scratch);
  });

  beforeEach( () => {
    scratch.innerHTML = "";
  });

  after( () => {
    scratch.parentNode.removeChild(scratch);
    scratch = null;
  });


  describe("routing", () => {
    it("should render the homepage", () => {
      options = {
        
      }
      render(<Default {...options} />, scratch);

      expect(scratch.innerHTML).to.contain("Home");
    });
  });
});
