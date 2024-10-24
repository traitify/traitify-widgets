import mutable from "traitify/lib/common/object/mutable";
import Component from "components/default";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import _assessment from "support/data/assessment.json";
import useContainer from "support/hooks/use-container";

jest.mock("components/results", () => (() => <div className="mock">Results</div>));
jest.mock("components/survey", () => (() => <div className="mock">Survey</div>));

describe("Default", () => {
  let assessment;
  let component;

  useContainer();

  beforeEach(() => {
    assessment = mutable(_assessment);
    assessment.completedAt = assessment.updatedAt;

    mockAssessment(assessment);
  });

  it("renders nothing", async() => {
    container.assessmentID = null;
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders results", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders survey", async() => {
    assessment.completedAt = null;
    mockAssessment(assessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
