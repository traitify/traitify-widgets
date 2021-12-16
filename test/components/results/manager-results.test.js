import Component from "components/results/manager-results";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";

jest.mock("components/results/guide", () => (() => (<div className="mock">Guide</div>)));
jest.mock("components/results/personality/recommendation/chart", () => (() => (<div className="mock">Personality Recommendation Chart</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("ManagerResults", () => {
  let component;
  let options;
  let props;

  beforeEach(() => {
    options = {};
    props = {
      getOption: jest.fn().mockName("getOption"),
      followBenchmark: jest.fn().mockName("followBenchmark"),
      followGuide: jest.fn().mockName("followGuide"),
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      translate: jest.fn().mockName("translate").mockImplementation((value, _options = {}) => `${value}, ${_options}`),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
    };
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
