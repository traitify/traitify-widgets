import {act} from "react-test-renderer";
import mutable from "traitify/lib/common/object/mutable";
import Component from "components/survey/instructions";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import _assessment from "support/data/assessment.json";
import useContainer from "support/hooks/use-container";

describe("Instructions", () => {
  let assessment;
  let component;
  let props;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    props = {onStart: jest.fn().mockName("onStart")};

    mockAssessment(assessment);
  });

  describe("start", () => {
    it("calls prop", async() => {
      component = await ComponentHandler.setup(Component, {props});
      act(() => { component.instance.findByType("video").props.onPlay(); });
      act(() => { component.instance.find(({props: {className}}) => className?.includes("traitify--response-button")).props.onClick(); });

      expect(props.onStart).toHaveBeenCalled();
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders secondary instructions", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => { component.instance.findByType("video").props.onPlay(); });

    expect(component.tree).toMatchSnapshot();
  });
});
