import {render} from "preact";
import Default from "components/default";
import Traitify from "lib/traitify";

let elements;
const createElement = ()=>{
  const element = document.createElement("div");
  elements.push(element);
  document.body.appendChild(element);

  return element;
};

describe("UI", ()=>{
  beforeAll(()=>{
    elements = [];
  });

  beforeEach(()=>{
    elements.forEach((element)=>{
      element.innerHTML = "";
    });
  });

  afterAll(()=>{
    elements.forEach((element)=>{
      element.parentNode.removeChild(element);
    });
    elements = [];
  });

  describe("component", ()=>{
    it("should render the component", ()=>{
      const componentElement = createElement();
      const widgetElement = createElement();
      const traitify = new Traitify;

      render(<Default traitify={traitify} />, componentElement);
      traitify.ui.component().target(widgetElement).render();

      expect(componentElement.innerHTML).toEqual(widgetElement.innerHTML);
    });
  });
});
