import Component from "components/results";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockCognitiveAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import cognitive from "support/data/assessment/cognitive/completed";
import dimensionBased from "support/data/assessment/personality/dimension-based";
import financialRisk from "support/data/assessment/personality/financial-risk";
import typeBased from "support/data/assessment/personality/type-based";
import useContainer from "support/hooks/use-container";

jest.mock("components/report/attract", () => (() => <div className="mock">Attract</div>));
jest.mock("components/report/candidate", () => (() => <div className="mock">Candidate</div>));
jest.mock("components/report/employee", () => (() => <div className="mock">Employee</div>));
jest.mock("components/report/manager", () => (() => <div className="mock">Manager</div>));
jest.mock("components/results/cognitive", () => (() => <div className="mock">Cognitive</div>));
jest.mock("components/results/financial-risk", () => (() => <div className="mock">Financial Risk</div>));

describe("Results", () => {
  let component;

  useContainer();

  afterEach(() => {
    delete container.assessmentID;
  });

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Results.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Results.updated",
        undefined
      );
    });
  });

  it("renders candidate report", async() => {
    container.assessmentID = dimensionBased.id;

    mockAssessment(dimensionBased);
    mockOption("report", "candidate");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders cognitive results", async() => {
    container.assessmentID = cognitive.id;

    mockCognitiveAssessment(cognitive);
    mockOption("surveyType", "cognitive");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders dimension based results", async() => {
    container.assessmentID = dimensionBased.id;

    mockAssessment(dimensionBased);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders employee report", async() => {
    container.assessmentID = dimensionBased.id;

    mockAssessment(dimensionBased);
    mockOption("report", "employee");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders financial risk results", async() => {
    container.assessmentID = financialRisk.id;

    mockAssessment(financialRisk);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders manager report", async() => {
    container.assessmentID = dimensionBased.id;

    mockAssessment(dimensionBased);
    mockOption("report", "manager");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders attract report", async() => {
    container.assessmentID = typeBased.id;

    mockAssessment(typeBased);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
