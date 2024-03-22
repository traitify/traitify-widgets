import Component from "components/survey/personality";
import ComponentHandler from "support/component-handler";
import {mockAssessment} from "support/container/http";
import useContainer from "support/hooks/use-container";
import imageAssessment from "support/json/assessment/with-slides.json";
import textAssessment from "support/json/assessment/with-text-slides.json";

jest.mock("components/survey/personality/image", () => (() => <div className="mock">Image</div>));
jest.mock("components/survey/personality/text", () => (() => <div className="mock">Text</div>));

describe("Survey", () => {
  let component;

  useContainer();

  it("renders image", async() => {
    mockAssessment(imageAssessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing", async() => {
    mockAssessment(null);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders text", async() => {
    mockAssessment(textAssessment);
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
