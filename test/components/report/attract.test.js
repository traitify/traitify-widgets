import Component from "components/report/attract";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";

jest.mock("components/results/personality/base/details", () => (() => <div className="mock">Personality Base Details</div>));
jest.mock("components/results/personality/base/heading", () => (() => <div className="mock">Personality Base Heading</div>));
jest.mock("components/results/personality/trait/list", () => (() => <div className="mock">Personality Traits</div>));
jest.mock("components/results/personality/type/list", () => (() => <div className="mock">Personality Types</div>));

describe("Report.Attract", () => {
  let component;

  useContainer();

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
