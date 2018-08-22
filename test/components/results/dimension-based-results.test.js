import renderJSON from "preact-render-to-json";
import Component from "components/results/dimension-based-results";
import {createElement, domHooks} from "support/dom";

jest.mock("lib/with-traitify");
jest.mock("components/results/dimension-based-results/radar", ()=>(()=>(<div className="mock">Radar</div>)));
jest.mock("components/results/dimension-based-results/personality-types", ()=>(()=>(<div className="mock">Personality Types</div>)));
jest.mock("components/results/dimension-based-results/personality-heading", ()=>(()=>(<div className="mock">Personality Heading</div>)));
jest.mock("components/results/dimension-based-results/personality-details", ()=>(()=>(<div className="mock">Personality Details</div>)));
jest.mock("components/results/dimension-based-results/dimensions", ()=>(()=>(<div className="mock">Dimensions</div>)));
jest.mock("components/results/dimension-based-results/personality-traits", ()=>(()=>(<div className="mock">Personality Traits</div>)));

describe("DimensionBasedResults", ()=>{
  domHooks();

  it("renders results", ()=>{
    const tree = renderJSON(<Component />, createElement());

    expect(tree).toMatchSnapshot();
  });
});
