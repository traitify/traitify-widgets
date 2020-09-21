import {Component} from "components/results/cognitive-results";
import ComponentHandler from "support/component-handler";

jest.mock("lib/with-traitify");

describe("CognitiveResults", () => {
  it("renders components", () => {
    const props = {translate: jest.fn().mockName("translate").mockImplementation((value) => value)};
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
