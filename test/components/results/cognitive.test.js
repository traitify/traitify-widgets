import Component from "components/results/cognitive";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";

describe("Results.Cognitive", () => {
  let component;

  useContainer();

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
