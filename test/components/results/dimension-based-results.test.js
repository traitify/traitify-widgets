import Component from "components/results/dimension-based-results";
import ComponentHandler from "support/component-handler";

jest.mock("lib/with-traitify");
jest.mock("components/results/dimension-based-results/radar", ()=>(()=>(<div className="mock">Radar</div>)));
jest.mock("components/results/dimension-based-results/personality-types", ()=>(()=>(<div className="mock">Personality Types</div>)));
jest.mock("components/results/dimension-based-results/personality-heading", ()=>(()=>(<div className="mock">Personality Heading</div>)));
jest.mock("components/results/dimension-based-results/personality-details", ()=>(()=>(<div className="mock">Personality Details</div>)));
jest.mock("components/results/dimension-based-results/dimensions", ()=>(()=>(<div className="mock">Dimensions</div>)));
jest.mock("components/results/dimension-based-results/personality-traits", ()=>(()=>(<div className="mock">Personality Traits</div>)));

describe("DimensionBasedResults", ()=>{
  it("renders results", ()=>{
    const component = new ComponentHandler(<Component />);

    expect(component.tree).toMatchSnapshot();
  });
});
