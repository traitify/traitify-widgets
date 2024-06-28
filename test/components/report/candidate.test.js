import Component from "components/report/candidate";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("components/results/personality/archetype/heading", () => (() => <div className="mock">Personality Archetype Heading</div>));
jest.mock("components/results/personality/archetype/tips", () => (() => <div className="mock">Personality Archetype Tips</div>));
jest.mock("components/results/personality/dimension/list", () => (() => <div className="mock">Personality Dimension List</div>));
jest.mock("components/results/personality/trait/list", () => (() => <div className="mock">Personality Traits</div>));
jest.mock("components/results/feedback", () => (() => <div className="mock">Feedback</div>));

describe("Report.Candidate", () => {
  let component;

  useContainer();

  it("renders component", async() => {
    mockAssessment(assessment, {id: assessment.id});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
