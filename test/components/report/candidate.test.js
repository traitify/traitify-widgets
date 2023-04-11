import Component from "components/report/candidate";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";

jest.mock("components/results/personality/archetype/heading", () => (() => <div className="mock">Personality Archetype Heading</div>));
jest.mock("components/results/personality/archetype/tips", () => (() => <div className="mock">Personality Archetype Tips</div>));
jest.mock("components/results/personality/dimension/list", () => (() => <div className="mock">Personality Dimension List</div>));
jest.mock("components/results/personality/trait/list", () => (() => <div className="mock">Personality Traits</div>));

describe("Report.Candidate", () => {
  let component;

  useContainer();

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
