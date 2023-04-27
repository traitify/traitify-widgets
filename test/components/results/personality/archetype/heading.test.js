import Component from "components/results/personality/archetype/heading";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockDeck, useAssessment, useDeck} from "support/container/http";
import {useOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";
import deck from "support/json/deck/big-five.json";

const newDetails = [
  {body: "https://cdn.traitify.com/frtq/paradox/conservative_white.png", title: "Paradox - Badge"},
  {body: "https://cdn.traitify.com/content/archetype-videos/paradox/upholder.mp4", title: "Paradox - Video"},
  {body: "https://cdn.traitify.com/content/archetype-videos/paradox/upholder.vtt", title: "Paradox - Video - Text Track"},
  {body: "https://cdn.traitify.com/content/archetype-videos/paradox/upholder.jpg", title: "Paradox - Video - Thumbnail"}
];

const oldDetails = [
  ...assessment.archetype.details,
  {body: "Maybe just hire qualified candidates", title: "Hiring Manager Description"},
  {body: "https://cdn.traitify.com/frtq/conservative_white.png", title: "Badge"},
  {body: "https://cdn.traitify.com/content/archetype-videos/upholder.mp4", title: "Video"},
  {body: "https://cdn.traitify.com/content/archetype-videos/upholder.vtt", title: "Video - Text Track"},
  {body: "https://cdn.traitify.com/content/archetype-videos/upholder.jpg", title: "Video - Thumbnail"}
];

const details = [...oldDetails, ...newDetails];

describe("PersonalityArchetypeHeading", () => {
  let component;

  useContainer();
  useAssessment(assessment);
  useDeck(deck);

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityArchetype.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "PersonalityArchetype.updated",
        undefined
      );
    });
  });

  describe("fallbacks", () => {
    useOption("perspective", "thirdPerson");

    it("renders component in third person", async() => {
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component without badge", async() => {
      const updatedAssessment = mutable(assessment);
      updatedAssessment.archetype.details = details.filter(({title}) => !title.includes("Badge"));
      mockAssessment(updatedAssessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component without video", async() => {
      const updatedAssessment = mutable(assessment);
      updatedAssessment.archetype.details = details.filter(({title}) => !title.includes("Video"));
      mockAssessment(updatedAssessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", async() => {
    container.options.disabledComponents = ["PersonalityArchetype"];
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if deck not ready", async() => {
    mockDeck(null, {id: deck.id});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no archetype", async() => {
    const updatedAssessment = mutable(assessment);
    updatedAssessment.archetype = null;
    mockAssessment(updatedAssessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
