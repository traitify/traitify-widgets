import Component from "components/survey";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockCognitiveAssessment, mockExternalAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import cognitive from "support/json/assessment/cognitive.json";
import dimensionBased from "support/json/assessment/dimension-based.json";
import external from "support/json/assessment/external.json";

jest.mock("components/survey/cognitive", () => (() => <div className="mock">Cognitive</div>));
jest.mock("components/survey/personality", () => (() => <div className="mock">Personality</div>));

describe("Survey", () => {
  let component;

  useContainer();

  it("renders cognitive", async() => {
    mockCognitiveAssessment(cognitive);
    mockOption("surveyType", "cognitive");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders external", async() => {
    mockExternalAssessment(external);
    mockOption("surveyType", "external");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders personality", async() => {
    mockAssessment(dimensionBased);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
