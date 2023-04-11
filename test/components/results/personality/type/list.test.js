import Component from "components/results/personality/type/list";
import ComponentHandler from "support/component-handler";
import {useAssessment} from "support/container/http";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/type-based.json";

jest.mock("components/results/personality/type/chart", () => (() => <div className="mock">Chart</div>));

describe("PersonalityTypeChart", () => {
  let component;

  useContainer();
  useAssessment(assessment);

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTypes.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTypes.updated",
        undefined
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
