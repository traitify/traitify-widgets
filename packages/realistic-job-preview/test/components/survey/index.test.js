import {act} from "react-test-renderer";
import mutable from "traitify/lib/common/object/mutable";
import Component from "components/survey";
import Instructions from "components/survey/instructions";
import {getCacheKey} from "lib/hooks/use-cache-key";
import ComponentHandler from "support/component-handler";
import _assessment from "support/data/assessment.json";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";

jest.mock("components/survey/instructions", () => (() => <div className="mock">Instructions</div>));

describe("Survey", () => {
  let assessment;
  let cacheKey;
  let component;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    container.assessmentID = assessment.rjpId;
    cacheKey = `request.${getCacheKey({...container, type: "assessment"})}`;
    container.listener.current[cacheKey] = assessment;
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.initialized",
        expect.any(Object)
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Survey.updated",
        expect.any(Object)
      );
    });
  });

  describe("back", () => {
    it("does nothing", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findByProps({className: "back"}).props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });

    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });
      act(() => { component.instance.findByProps({className: "back"}).props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("next", () => {
    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("submit", () => {
    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);
      act(() => { component.instance.findByType(Instructions).props.onStart(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[0].props.onClick(); });
      act(() => { component.instance.findAllByProps({className: "traitify--response-button"})[1].props.onClick(); });

      await flushAsync();

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders instructions", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing", async() => {
    assessment.completedAt = assessment.insertedAt;
    container.listener.current[cacheKey] = assessment;
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing without assessment", async() => {
    container.assessmentID = null;
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders question", async() => {
    component = await ComponentHandler.setup(Component);
    act(() => { component.instance.findByType(Instructions).props.onStart(); });

    expect(component.tree).toMatchSnapshot();
  });
});
