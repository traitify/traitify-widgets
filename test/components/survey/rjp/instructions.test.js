/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/survey/rjp/instructions";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockRjpAssessment as mockAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import _assessment from "support/data/assessment/rjp/incomplete";
import useContainer from "support/hooks/use-container";

describe("Survey.RJP.Instructions", () => {
  let assessment;
  let component;
  let props;

  useContainer();

  beforeEach(() => {
    container.assessmentID = _assessment.id;

    assessment = mutable(_assessment);
    props = {onStart: jest.fn().mockName("onStart")};
    mockAssessment(assessment);
    mockOption("surveyType", "rjp");
  });

  it("renders instructions", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing without assessment", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("reveals start button after video plays", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => { component.instance.findByType("video").props.onPlay(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("triggers onStart", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => { component.instance.findByType("video").props.onPlay(); });
    act(() => component.findByText("Let's Go!").props.onClick());

    expect(props.onStart).toHaveBeenCalled();
  });
});
