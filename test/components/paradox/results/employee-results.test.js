import Component from "components/paradox/results/employee-results";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";

jest.mock("components/results/personality/archetype/heading", () => (() => (<div className="mock">Personality Archetype Heading</div>)));
jest.mock("components/results/personality/archetype/skills", () => (() => (<div className="mock">Personality Archetype Skills</div>)));
jest.mock("components/results/personality/archetype/tips", () => (() => (<div className="mock">Personality Archetype Tips</div>)));
jest.mock("components/results/personality/dimension/list", () => (() => (<div className="mock">Personality Dimension List</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.EmployeeResults", () => {
  let props;

  beforeEach(() => {
    props = {
      getOption: jest.fn().mockName("getOption"),
      translate: jest.fn().mockName("translate").mockImplementation((value, options = {}) => `${value}, ${options}`)
    };
  });

  describe("allowHeaders", () => {
    beforeEach(() => {
      mockOptions(props.getOption, {allowHeaders: true});
    });

    it("renders component", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
