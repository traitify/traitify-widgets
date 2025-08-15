import Component from "components/survey";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockCognitiveAssessment, mockExternalAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import cognitive from "support/data/assessment/cognitive/incomplete";
import external from "support/data/assessment/external/incomplete";
import personality from "support/data/assessment/personality/incomplete";

jest.mock("components/survey/cognitive", () => (() => <div className="mock">Cognitive</div>));
jest.mock("components/survey/personality", () => (() => <div className="mock">Personality</div>));

describe("Survey", () => {
  let component;

  useContainer();

  it("renders cognitive", async() => {
    container.assessmentID = cognitive.id;

    mockCognitiveAssessment(cognitive);
    mockOption("surveyType", "cognitive");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders external", async() => {
    container.assessmentID = external.id;

    mockExternalAssessment(external);
    mockOption("surveyType", "external");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders personality", async() => {
    container.assessmentID = personality.id;

    mockAssessment(personality);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
