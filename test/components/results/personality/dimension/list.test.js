import Component from "components/results/personality/dimension/list";
import ComponentHandler from "support/component-handler";
import {mockAssessment, useAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("components/results/personality/dimension/chart", () => (() => (<div className="mock">PersonalityDimensionChart</div>)));
jest.mock("components/results/personality/dimension/details", () => (() => (<div className="mock">PersonalityDimensionDetails</div>)));

describe("PersonalityDimensionList", () => {
  let component;

  useContainer();
  useAssessment(assessment);

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityDimensions.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityDimensions.updated",
        undefined
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with headers", async() => {
    mockOption("showHeaders", true);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["PersonalityDimensionDetails", "PersonalityDimensionChart"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders chart if details disabled", async() => {
    mockOption("disabledComponents", ["PersonalityDimensionDetails"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders details if chart disabled", async() => {
    mockOption("disabledComponents", ["PersonalityDimensionChart"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
