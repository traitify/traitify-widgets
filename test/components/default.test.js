import Component from "components/default";
import ComponentHandler from "support/component-handler";
import {mockAssessment, useAssessment} from "support/container/http";
import useContainer from "support/hooks/use-container";
import assessment from "support/json/assessment/dimension-based.json";
import assessmentWithSlides from "support/json/assessment/with-slides.json";

jest.mock("components/results", () => (() => <div className="mock">Results</div>));
jest.mock("components/survey", () => (() => <div className="mock">Survey</div>));

describe("Default", () => {
  let component;

  useContainer();
  useAssessment(null, {id: assessment.id});

  it("renders results", async() => {
    mockAssessment(assessment, {id: assessment.id});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders survey", async() => {
    mockAssessment(assessmentWithSlides, {id: assessment.id});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
