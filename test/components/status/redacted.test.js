import Component from "components/status/redacted";
import ComponentHandler from "support/component-handler";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";

describe("Redacted", () => {
  let component;

  useContainer();

  it("renders message", async() => {
    mockOption("showHelp", false);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders help button", async() => {
    mockOption("showHelp", true);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
