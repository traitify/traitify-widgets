import Component from "components/survey";
import ComponentHandler from "support/component-handler";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";

jest.mock("components/survey/cognitive", () => (() => <div className="mock">Cognitive</div>));
jest.mock("components/survey/personality", () => (() => <div className="mock">Personality</div>));

describe("Survey", () => {
  let component;

  useContainer();

  it("renders cognitive", async() => {
    mockOption("surveyType", "cognitive");
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders personality", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
