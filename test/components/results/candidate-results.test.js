import Component from "components/results/candidate-results";
import ComponentHandler from "support/component-handler";

jest.mock("components/guide", () => (() => (<div className="mock">Guide</div>)));
jest.mock("components/results/candidate-results/personality-archetype", () => (() => (<div className="mock">Personality Archetype</div>)));
jest.mock("components/results/candidate-results/personality-details", () => (() => (<div className="mock">Personality Details</div>)));
jest.mock("components/results/candidate-results/personality-dimensions", () => (() => (<div className="mock">Personality Dimensions</div>)));
jest.mock("components/results/dimension-based-results/personality-traits", () => (() => (<div className="mock">Personality Traits</div>)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("CandidateResults", () => {
  let props;

  beforeEach(() => {
    props = {
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      options: {},
      translate: jest.fn().mockName("translate").mockImplementation((value, options = {}) => `${value}, ${options}`),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
    };
  });

  it("renders results in firstPerson", () => {
    props.options.perspective = "firstPerson";
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders results in thirdPerson", () => {
    props.options.perspective = "thirdPerson";
    props.followGuide = jest.fn().mockName("followGuide").mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
