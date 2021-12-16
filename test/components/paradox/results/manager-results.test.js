import Component from "components/paradox/results/manager-results";
import ComponentHandler from "support/component-handler";
import {mockOptions, mockProps} from "support/helpers";

jest.mock("components/results/guide", () => (() => (<div className="mock">Guide</div>)));
jest.mock("components/results/personality/recommendation/chart", () => (() => (<div className="mock">Personality Recommendation Chart</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.ManagerResults", () => {
  let component;
  let options;
  let props;

  beforeEach(() => {
    options = {};
    props = mockProps(["getOption", "isReady", "setElement", "translate", "ui"]);
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
