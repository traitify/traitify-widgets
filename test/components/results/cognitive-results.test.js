import {Component} from "components/results/cognitive-results";
import ComponentHandler from "support/component-handler";
import {mockProps} from "support/helpers";

jest.mock("lib/with-traitify");

describe("CognitiveResults", () => {
  let component;
  let props;

  beforeEach(() => {
    props = mockProps(["translate"]);
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
