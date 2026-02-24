import Component from "components/report";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import assessment from "support/data/assessment/personality/completed";
import useContainer from "support/hooks/use-container";

jest.mock("components/report/candidate", () => (() => <div className="mock">Candidate Report</div>));
jest.mock("components/report/employee", () => (() => <div className="mock">Employee Report</div>));
jest.mock("components/report/manager", () => (() => <div className="mock">Manager Report</div>));

describe("Report", () => {
  let component;

  useContainer();

  beforeEach(() => {
    container.assessmentID = assessment.id;
    mockAssessment(assessment);
  });

  it("renders candidate component by default", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders candidate component", async() => {
    mockOption("report", "candidate");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders employee component", async() => {
    mockOption("report", "employee");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders manager component", async() => {
    mockOption("report", "manager");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
