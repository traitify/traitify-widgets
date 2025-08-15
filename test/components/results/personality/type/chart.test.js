import {act} from "react-test-renderer";
import Component from "components/results/personality/type/chart";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import _assessment from "support/data/assessment/personality/type-based";

describe("PersonalityTypeChart", () => {
  let assessment;
  let component;

  useContainer();

  beforeEach(() => {
    container.assessmentID = _assessment.id;

    assessment = mutable(_assessment);
    mockAssessment(assessment);
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTypeChart.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityTypeChart.updated",
        undefined
      );
    });
  });

  it("updates activeType", async() => {
    component = await ComponentHandler.setup(Component);
    const text = assessment.personality_types[1].personality_type.name;
    const button = component.instance
      .find((element) => element.props.alt === `${text} Badge` && element.parent.parent.type === "button")
      .parent.parent;
    act(() => button.props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("updates activeType through select", async() => {
    component = await ComponentHandler.setup(Component);
    const value = assessment.personality_types[1].personality_type.id;
    act(() => component.instance.findByType("select").props.onChange({target: {value}}));

    expect(component.tree).toMatchSnapshot();
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

  it("renders component with new data", async() => {
    assessment.personality_types[0].personality_type = {
      ...assessment.personality_types[0].personality_type,
      achieve: ["Learning, expanding a specific base of knowledge", "Finding your own take; adding a new twist", "Discovering a new way of approaching an old question"],
      act: ["“Losing yourself” in a creative process", "Adding something new to the world, uniquely your own", "Letting loose; being playful and whimsical"],
      appreciate: ["Questioning what’s been the norm", "Freedom and the importance of self expression", "Supporting beauty and artistic appeal"],
      explore: ["Creative productions, such as theater, music, film, design", "Understanding the human condition through ideas", "Searching for your “passion”"]
    };
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with some new data", async() => {
    assessment.personality_types[0].personality_type = {
      ...assessment.personality_types[0].personality_type,
      achieve: ["Learning, expanding a specific base of knowledge", "Finding your own take; adding a new twist", "Discovering a new way of approaching an old question"],
      explore: ["Creative productions, such as theater, music, film, design", "Understanding the human condition through ideas", "Searching for your “passion”"]
    };
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    mockOption("disabledComponents", ["PersonalityTypes"]);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no types", async() => {
    assessment.personality_types = [];
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
