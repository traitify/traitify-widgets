import {Component} from "components/slide-deck";
import ComponentHandler from "support/component-handler";

jest.mock("components/slide-deck/cognitive", () => (() => (<div className="mock">Cognitive</div>)));
jest.mock("components/slide-deck/personality", () => (() => (<div className="mock">Personality</div>)));
jest.mock("lib/with-traitify");

describe("SlideDeck", () => {
  let props;

  beforeEach(() => {
    props = {
      getOption: jest.fn().mockName("getOption"),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
      }
    };
  });

  it("renders cognitive", () => {
    props.getOption.mockReturnValue("cognitive");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders personality", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
