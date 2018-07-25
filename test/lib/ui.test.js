import {render} from "preact";
import {createElement, domHooks} from "support/dom";
import Default from "components/default";
import Traitify from "support/traitify";

describe("UI", ()=>{
  domHooks();

  describe("component", ()=>{
    it("should render the component", ()=>{
      const componentElement = createElement();
      const widgetElement = createElement();
      const traitify = new Traitify();

      traitify.ui.options.disableAirbrake = true;
      traitify.ui.component().target(widgetElement).render();
      render(<Default traitify={traitify} />, componentElement);

      expect(componentElement.innerHTML).toEqual(widgetElement.innerHTML);
    });
  });
});
