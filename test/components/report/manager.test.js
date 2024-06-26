import Component from "components/report/manager";
import ComponentHandler from "support/component-handler";
import {useOption} from "support/container/options";
import useContainer from "support/hooks/use-container";

jest.mock("components/results/guide/personality", () => (() => <div className="mock">Personality Guide</div>));
jest.mock("components/results/recommendation/chart", () => (() => <div className="mock">Recommendation Chart</div>));
jest.mock("components/results/recommendation/list", () => (() => <div className="mock">Recommendation List</div>));

describe("Report.Manager", () => {
  let component;

  useContainer();

  describe("showHeaders", () => {
    useOption("showHeaders", true);

    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  describe("showRecommendationList", () => {
    useOption("showRecommendationList", true);

    it("renders component", async() => {
      component = await ComponentHandler.setup(Component);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });
});
