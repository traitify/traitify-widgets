import Component from "components/results/personality/base/heading";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import {mockOption, useOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import _assessment from "support/data/assessment/personality/type-based";

jest.mock("components/common/icon", () => ((props) => (
  <div className="mock">Icon - {props.icon.iconName}</div>
)));

describe("PersonalityBaseHeading", () => {
  let assessment;
  let component;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    assessment.archetype = assessment.personality_types
      .find(({personality_type: type}) => type.name === "Inventor")
      .personality_type;

    container.assessmentID = assessment.id;

    mockAssessment(assessment);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityBaseHeading.initialized",
        expect.objectContaining({personality: expect.any()})
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityBaseHeading.updated",
        expect.objectContaining({personality: expect.any()})
      );
    });
  });

  describe("fallbacks", () => {
    it("renders component with blend", async() => {
      assessment.archetype = null;
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component with types", async() => {
      assessment.archetype = null;
      assessment.personality_blend = null;
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("perspective", () => {
    useOption("perspective", "thirdPerson");

    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component with careers link", async() => {
      mockOption("careersLink", "/careers");
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with careers link", async() => {
    mockOption("careersLink", "/careers");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["PersonalityHeading"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
