import Component from "components/results/cognitive-results";
import ComponentHandler from "support/component-handler";

describe("CognitiveResults", () => {
  it("renders components", () => {
    const component = new ComponentHandler(<Component />);

    expect(component.tree).toMatchSnapshot();
  });
});
