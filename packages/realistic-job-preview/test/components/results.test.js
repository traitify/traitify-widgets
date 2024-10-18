import mutable from "traitify/lib/common/object/mutable";
import Component from "components/results";
import {getCacheKey} from "lib/hooks/use-cache-key";
import ComponentHandler from "support/component-handler";
import _assessment from "support/data/assessment.json";
import useContainer from "support/hooks/use-container";

describe("Results", () => {
  let assessment;
  let cacheKey;
  let component;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    assessment.completedAt = assessment.updatedAt;
    container.assessmentID = assessment.rjpId;
    cacheKey = `request.${getCacheKey({...container, type: "assessment"})}`;
    container.listener.current[cacheKey] = assessment;
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Results.initialized",
        expect.any(Object)
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Results.updated",
        expect.any(Object)
      );
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing", async() => {
    assessment.completedAt = null;
    container.listener.current[cacheKey] = assessment;
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
