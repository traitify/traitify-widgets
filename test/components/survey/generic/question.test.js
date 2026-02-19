/** @jest-environment jsdom */
import {act} from "react-test-renderer";
import Component from "components/survey/generic/question";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import assessment from "support/data/assessment/generic/incomplete";
import useContainer from "support/hooks/use-container";

describe("Question", () => {
  let component;
  let props;

  useContainer();

  beforeEach(() => {

    props = {
      index: 0,
      question: mutable(assessment.survey.questionSets[0].questions[0]),
      updateAnswer: jest.fn().mockName("updateAnswer")
    };
  });

  it("triggers updateAnswer", async() => {
    component = await ComponentHandler.setup(Component, {props});
    act(() => component.instance.findAllByType("button")[0].props.onClick());

    expect(props.updateAnswer).toHaveBeenCalledWith(props.question.responseOptions[0]);
  });

  it("renders active answer", async() => {
    props.question.answer = props.question.responseOptions[0];
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders wide options", async() => {
    props.question.responseOptions = [
      {id: "response-1a", text: "This is a long response option text"},
      {id: "response-1b", text: "Response B"}
    ];
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });
});
