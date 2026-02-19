/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/survey/generic/instructions";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {
  mockGenericAssessment as mockAssessment,
  mockGenericSkip,
  mockSettings,
  useSettings
} from "support/container/http";
import {mockOption} from "support/container/options";
import _assessment from "support/data/assessment/generic/incomplete";
import useContainer from "support/hooks/use-container";

describe("Instructions", () => {
  let assessment;
  let component;
  let props;

  useContainer();
  useSettings({});

  beforeEach(() => {
    container.assessmentID = _assessment.id;

    assessment = mutable(_assessment);
    props = {
      assessment,
      onClose: jest.fn().mockName("onClose")
    };
    mockAssessment(assessment);
    mockOption("surveyType", "generic");
  });

  describe("skip assessment accommodation", () => {
    beforeEach(() => {
      mockSettings({skip_assessment_accommodation: true});
    });

    it("renders instructions", async() => {
      component = await ComponentHandler.setup(Component, {props});

      expect(component.tree).toMatchSnapshot();
    });

    it("renders accommodation text", async() => {
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("Request Accommodation").props.onClick());

      expect(component.tree).toMatchSnapshot();
    });

    it("renders back action", async() => {
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("Request Accommodation").props.onClick());
      act(() => component.findByText("Back").props.onClick());

      expect(component.tree).toMatchSnapshot();
    });

    it("triggers accommodation request", async() => {
      const mock = mockGenericSkip({isSkipped: true});
      component = await ComponentHandler.setup(Component, {props});
      act(() => component.findByText("Request Accommodation").props.onClick());
      await act(async() => component.findByText("Yes, Request Accommodation").props.onClick());

      expect(mock.called).toBe(1);
    });
  });

  it("renders instructions", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("triggers onClose", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => component.findByText(assessment.survey.instructionButton).props.onClick());

    expect(props.onClose).toHaveBeenCalled();
  });
});
