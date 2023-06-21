import {act} from "react-test-renderer";
import Component from "components/results/career/container";
import mutable from "lib/common/object/mutable";
import ComponentHandler from "support/component-handler";
import {mockCareers, mockHighlightedCareers, useAssessment, useCareers} from "support/container/http";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";
import careers from "support/json/careers.json";
import assessment from "support/json/assessment/type-based.json";

jest.mock("react-apexcharts", () => ((props) => <div className="mock" {...props}>Chart</div>));

describe("Results.CareerContainer", () => {
  let component;

  useContainer();
  useAssessment(assessment);
  useCareers(careers);

  describe("callbacks", () => {
    it("triggers initialization", async() => {
      await ComponentHandler.setup(Component);

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Careers.initialized",
        undefined
      );
    });

    it("triggers update", async() => {
      component = await ComponentHandler.setup(Component);
      await component.update();

      expect(container.listener.trigger).toHaveBeenCalledWith(
        "Careers.initialized",
        undefined
      );
    });
  });

  it("renders component with careers", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with no careers", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with highlightedCareers", async() => {
    const highlightedCareer = mutable(careers[0]);
    const highlightedPath = "/highlighted";
    highlightedCareer.career.title = "Test Highlighted Career Title";
    highlightedCareer.career.description = "Test Highlighted Career Description";
    mockHighlightedCareers([highlightedCareer], {path: highlightedPath});
    mockOption("career", {highlightedPath});
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
  });

  it("shows more careers", async() => {
    mockCareers(careers.slice(0, 3), {page: 1});
    mockCareers(careers.slice(3, 6), {page: 2});
    mockOption("career", {perPage: 3});
    component = await ComponentHandler.setup(Component);
    await act(async() => { component.findByText("Show More").props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("modal opens", async() => {
    component = await ComponentHandler.setup(Component);
    await act(async() => { component.findAllByText("Learn More")[0].props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("modal shows clubs", async() => {
    component = await ComponentHandler.setup(Component);
    await act(async() => { component.findAllByText("Learn More")[0].props.onClick(); });
    act(() => { component.findByText("Clubs").props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("modal shows employers", async() => {
    component = await ComponentHandler.setup(Component);
    await act(async() => { component.findAllByText("Learn More")[0].props.onClick(); });
    act(() => { component.findByText("Employers").props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("modal shows majors", async() => {
    component = await ComponentHandler.setup(Component);
    await act(async() => { component.findAllByText("Learn More")[0].props.onClick(); });
    act(() => { component.findByText("Clubs").props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("modal shows jobs", async() => {
    component = await ComponentHandler.setup(Component);
    await act(async() => { component.findAllByText("Learn More")[0].props.onClick(); });
    act(() => { component.findByText("Jobs").props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });

  it("modal shows resources", async() => {
    component = await ComponentHandler.setup(Component);
    await act(async() => { component.findAllByText("Learn More")[0].props.onClick(); });
    act(() => { component.findByText("Resources").props.onClick(); });

    expect(component.tree).toMatchSnapshot();
  });
});
