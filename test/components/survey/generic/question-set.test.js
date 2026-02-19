/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/survey/generic/question-set";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import assessment from "support/data/assessment/generic/incomplete";
import useContainer from "support/hooks/use-container";

jest.mock("components/survey/generic/question", () => (() => <div className="mock">Question</div>));

describe("QuestionSet", () => {
  let component;
  let props;

  useContainer();

  beforeEach(() => {
    props = {
      first: true,
      last: false,
      onBack: jest.fn().mockName("onBack"),
      onNext: jest.fn().mockName("onNext"),
      set: mutable(assessment.survey.questionSets[0]),
      updateAnswer: jest.fn().mockName("updateAnswer")
    };
  });

  it("triggers onBack", async() => {
    props.first = false;
    component = await ComponentHandler.setup(Component, {props});
    act(() => component.instance.findByProps({onClick: props.onBack}).props.onClick());

    expect(props.onBack).toHaveBeenCalled();
  });

  it("triggers onNext", async() => {
    props.set.questions = props.set.questions.map((question) => ({...question, answer: question.responseOptions[0]}));
    component = await ComponentHandler.setup(Component, {props});
    act(() => component.findByText("Next").props.onClick());

    expect(props.onNext).toHaveBeenCalled();
  });

  it("disables next button", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.findByText("Next").props.disabled).toBe(true);
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders back", async() => {
    props.first = false;
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders submit", async() => {
    props.last = true;
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });
});
