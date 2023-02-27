import {Component} from "components/default";
import ComponentHandler from "support/component-handler";

jest.mock("components/results", () => (() => (<div className="mock">Results</div>)));
jest.mock("components/slide-deck", () => (() => (<div className="mock">Slide Deck</div>)));
jest.mock("lib/with-traitify");

describe("Default", () => {
  it("renders results", () => {
    const component = new ComponentHandler(<Component isReady={(type) => (type === "results")} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders slide deck", () => {
    const component = new ComponentHandler(<Component isReady={(type) => (type === "slides")} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders div if not ready", () => {
    const component = new ComponentHandler(<Component isReady={() => (false)} />);

    expect(component.tree).toMatchSnapshot();
  });
});
