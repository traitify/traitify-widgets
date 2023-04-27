import Component from "components/report/employee";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";

jest.mock("components/results/personality/archetype/heading", () => (() => <div className="mock">Personality Archetype Heading</div>));
jest.mock("components/results/personality/archetype/skills", () => (() => <div className="mock">Personality Archetype Skills</div>));
jest.mock("components/results/personality/archetype/tips", () => (() => <div className="mock">Personality Archetype Tips</div>));
jest.mock("components/results/personality/dimension/list", () => (() => <div className="mock">Personality Dimension List</div>));

describe("Report.Employee", () => {
  let component;

  useContainer();

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
