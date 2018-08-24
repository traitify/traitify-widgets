import {render} from "preact";
import {Component} from "components/results";
import {createElement, domHooks} from "support/dom";

jest.mock("lib/with-traitify");
jest.mock("components/results/dimension-based-results", ()=>(()=>(<div className="mock">Dimension Based</div>)));
jest.mock("components/results/type-based-results", ()=>(()=>(<div className="mock">Type Based</div>)));

describe("Results", ()=>{
  const traitify = {ui: {trigger: jest.fn().mockName("trigger")}};

  domHooks();

  beforeEach(()=>{
    traitify.ui.trigger.mockClear();
  });

  it("renders dimension based results", ()=>{
    const assessment = {assessment_type: "DIMENSION_BASED"};
    const element = createElement();
    render(<Component assessment={assessment} isReady={()=>(true)} traitify={traitify} />, element);

    expect(element.innerHTML).toEqual("<div class=\"mock\">Dimension Based</div>");
  });

  it("renders type based results", ()=>{
    const assessment = {assessment_type: "TYPE_BASED"};
    const element = createElement();
    render(<Component assessment={assessment} isReady={()=>(true)} traitify={traitify} />, element);

    expect(element.innerHTML).toEqual("<div class=\"mock\">Type Based</div>");
  });

  it("renders nothing if not ready", ()=>{
    const element = createElement();
    render(<Component isReady={()=>(false)} traitify={traitify} />, element);

    expect(element.innerHTML).toEqual("");
  });

  it("triggers initialization callback", ()=>{
    render(<Component isReady={()=>(false)} traitify={traitify} />, createElement());

    expect(traitify.ui.trigger.mock.calls[0][0]).toBe("Results.initialized");
  });
});
