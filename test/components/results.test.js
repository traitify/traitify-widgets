import {Component} from "components/results";
import ComponentHandler from "support/component-handler";

jest.mock("lib/with-traitify");
jest.mock("components/results/dimension-based-results", ()=>(()=>(<div className="mock">Dimension Based</div>)));
jest.mock("components/results/type-based-results", ()=>(()=>(<div className="mock">Type Based</div>)));

describe("Results", ()=>{
  const traitify = {ui: {trigger: jest.fn().mockName("trigger")}};

  beforeEach(()=>{
    traitify.ui.trigger.mockClear();
  });

  it("renders dimension based results", ()=>{
    const assessment = {assessment_type: "DIMENSION_BASED"};
    const component = new ComponentHandler(
      <Component assessment={assessment} isReady={()=>(true)} traitify={traitify} />
    );

    expect(component.tree).toMatchSnapshot();
  });

  it("renders type based results", ()=>{
    const assessment = {assessment_type: "TYPE_BASED"};
    const component = new ComponentHandler(
      <Component assessment={assessment} isReady={()=>(true)} traitify={traitify} />
    );

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", ()=>{
    const component = new ComponentHandler(<Component isReady={()=>(false)} traitify={traitify} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("triggers initialization callback", ()=>{
    new ComponentHandler(<Component isReady={()=>(false)} traitify={traitify} />);

    expect(traitify.ui.trigger.mock.calls[0][0]).toBe("Results.initialized");
  });

  it("triggers update callback", ()=>{
    const component = new ComponentHandler(<Component isReady={()=>(false)} traitify={traitify} />);
    component.updateProps();

    expect(traitify.ui.trigger.mock.calls[1][0]).toBe("Results.updated");
  });
});
