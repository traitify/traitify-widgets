import Component from "components/results";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import dimensionBased from "support/json/assessment/dimension-based.json";
import financialRisk from "support/json/assessment/financial-risk.json";
import typeBased from "support/json/assessment/type-based.json";

jest.mock("components/report/attract", () => (() => <div className="mock">Attract</div>));
jest.mock("components/report/candidate", () => (() => <div className="mock">Candidate</div>));
jest.mock("components/report/employee", () => (() => <div className="mock">Employee</div>));
jest.mock("components/report/manager", () => (() => <div className="mock">Manager</div>));
jest.mock("components/results/cognitive", () => (() => <div className="mock">Cognitive</div>));
jest.mock("components/results/financial-risk", () => (() => <div className="mock">Financial Risk</div>));

describe("Results", () => {
  let component;

  useContainer();

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
    mockAssessment(dimensionBased);
    mockOption("report", "candidate");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders cognitive results", async() => {
    mockOption("surveyType", "cognitive");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders dimension based results", async() => {
    mockAssessment(dimensionBased);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders employee report", async() => {
    mockAssessment(dimensionBased);
    mockOption("report", "employee");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders financial risk results", async() => {
    mockAssessment(financialRisk);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders manager report", async() => {
    mockAssessment(dimensionBased);
    mockOption("report", "employee");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders attract report", async() => {
    mockAssessment(typeBased);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
