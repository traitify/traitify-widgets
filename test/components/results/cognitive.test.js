import Component from "components/results/cognitive";
import ComponentHandler from "support/component-handler";

describe("Results.Cognitive", () => {
  let component;

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
