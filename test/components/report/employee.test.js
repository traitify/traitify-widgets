import Component from "components/report/employee";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockGenericAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import genericAssessment from "support/data/assessment/generic/completed";
import assessment from "support/data/assessment/personality/completed";
import useContainer from "support/hooks/use-container";

jest.mock("components/results/generic/conclusions", () => (() => <div className="mock">Generic Conclusions</div>));
jest.mock("components/results/personality/archetype/heading", () => (() => <div className="mock">Personality Archetype Heading</div>));
jest.mock("components/results/personality/archetype/skills", () => (() => <div className="mock">Personality Archetype Skills</div>));
jest.mock("components/results/personality/archetype/tips", () => (() => <div className="mock">Personality Archetype Tips</div>));
jest.mock("components/results/personality/dimension/list", () => (() => <div className="mock">Personality Dimension List</div>));

describe("Report.Employee", () => {
  let component;

  useContainer();

  it("renders generic component", async() => {
    container.assessmentID = genericAssessment.id;
    mockGenericAssessment(genericAssessment);
    mockOption("surveyType", "generic");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component", async() => {
    container.assessmentID = assessment.id;
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
