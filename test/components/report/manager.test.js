import Component from "components/report/manager";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockGenericAssessment} from "support/container/http";
import {mockOption, useOption} from "support/container/options";
import genericAssessment from "support/data/assessment/generic/completed";
import assessment from "support/data/assessment/personality/completed";
import useContainer from "support/hooks/use-container";

jest.mock("components/results/cognitive/chart", () => (() => <div className="mock">Cognitive Chart</div>));
jest.mock("components/results/generic/breakdown", () => (() => <div className="mock">Generic Breakdown</div>));
jest.mock("components/results/generic/heading", () => (() => <div className="mock">Generic Heading</div>));
jest.mock("components/results/guide/client", () => (() => <div className="mock">Client Guide</div>));
jest.mock("components/results/guide/personality", () => (() => <div className="mock">Personality Guide</div>));
jest.mock("components/results/recommendation/chart", () => (() => <div className="mock">Recommendation Chart</div>));
jest.mock("components/results/recommendation/list", () => (() => <div className="mock">Recommendation List</div>));

describe("Report.Manager", () => {
  let component;

  useContainer();

  describe("showHeaders", () => {
    useOption("showHeaders", true);

    it("renders component", async() => {
      container.assessmentID = assessment.id;
      mockAssessment(assessment);
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", async() => {
    container.assessmentID = assessment.id;
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders generic component", async() => {
    container.assessmentID = genericAssessment.id;
    mockGenericAssessment(genericAssessment);
    mockOption("surveyType", "generic");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
