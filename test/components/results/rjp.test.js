/** @jest-environment jsdom */
import Component from "components/results/rjp";
import ComponentHandler from "support/component-handler";
import {mockRjpAssessment} from "support/container/http";
import {mockOption} from "support/container/options";
import completed from "support/data/assessment/rjp/completed";
import incomplete from "support/data/assessment/rjp/incomplete";
import useContainer from "support/hooks/use-container";

describe("Results.RJP", () => {
  let component;

  useContainer();

  beforeEach(() => {
    mockOption("surveyType", "rjp");
  });

  it("renders nothing if not completed", async() => {
    container.assessmentID = incomplete.id;
    mockRjpAssessment(incomplete);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders completion message", async() => {
    container.assessmentID = completed.id;
    mockRjpAssessment(completed);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("triggers initialization", async() => {
    container.assessmentID = completed.id;
    mockRjpAssessment(completed);
    await ComponentHandler.setup(Component);

    expect(container.listener.trigger).toHaveBeenCalledWith(
      "Results.initialized",
      expect.any(Object)
    );
  });
});
