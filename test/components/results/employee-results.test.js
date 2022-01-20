import Component from "components/results/employee-results";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";

jest.mock("components/results/personality/archetype/heading", () => (() => (<div className="mock">Personality Archetype Heading</div>)));
jest.mock("components/results/personality/archetype/skills", () => (() => (<div className="mock">Personality Archetype Skills</div>)));
jest.mock("components/results/personality/archetype/tips", () => (() => (<div className="mock">Personality Archetype Tips</div>)));
jest.mock("components/results/personality/dimension/list", () => (() => (<div className="mock">Personality Dimension List</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("EmployeeResults", () => {
  let component;
  let options;
  let props;

  beforeEach(() => {
    options = {};
    props = mockProps(["getOption", "translate"]);
  });

  describe("allowHeaders", () => {
    beforeEach(() => {
      options = {...options, allowHeaders: true};

      mockOptions(props.getOption, options);
    });

    it("renders component", () => {
      component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
