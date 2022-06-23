import Component from "components/paradox/results/personality/career/container";
import {mockProps, mockUI} from "support/helpers";
import careers from "support/json/careers.json";
import dimensionBasedResults from "support/json/assessment/dimension-based.json";
import ComponentHandler from "support/component-handler";
import I18n from "lib/i18n";
import {act} from "react-test-renderer";

jest.mock("lib/with-traitify", () => ((value) => value));
jest.mock("components/highchart", () => (() => <div className="mock">HighCharts</div>));

describe("Paradox.CareerContainer", () => {
  let component;
  let props;
  const highlightedCareer = JSON.parse(JSON.stringify(careers[0]));
  highlightedCareer.career.title = "Test Highlighted Career Title";
  highlightedCareer.career.description = "Test Highlighted Career Description";

  beforeEach(() => {
    props = {
      ...mockProps(["followBenchmark", "followGuide", "getOption", "isReady", "setElement", "translate", "traitify"]),
      locale: "en",
      i18n: I18n,
      assessment: dimensionBasedResults,
      assessmentID: "test",
      options: null
    };
    props.i18n.data = {"en-us": {}};
    props.traitify.get = (path, params) => {
      if(params.paged && params.careers_per_page < careers.length + 1) {
        const data = [];
        const start = ((params.page * params.careers_per_page) - 1) || 0;

        for(let i = start; i < start + params.careers_per_page; i += 1) {
          if(i > careers.length) {
            break;
          }
          data.push(careers[i]);
        }
        return Promise.resolve(data);
      }
      return Promise.resolve(path === "/highlighted" ? highlightedCareer : careers);
    };
    props.ui = mockUI();
  });

  it("renders component with careers", async() => {
    await act(async() => {
      component = new ComponentHandler(<Component assessmentID={props.assessmentID} {...props} />);
    });
    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with no careers", async() => {
    props.traitify.get = () => Promise.resolve([]);
    await act(async() => {
      component = new ComponentHandler(<Component assessmentID={props.assessmentID} {...props} />);
    });
    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with highlightedCareers", async() => {
    props.traitify.get = (path) => Promise.resolve(path === "/highlighted" ? [highlightedCareer] : careers);
    props.highlightedPath = "/highlighted";

    await act(async() => {
      component = new ComponentHandler(<Component assessmentID={props.assessmentID} {...props} />);
    });
    expect(component.tree).toMatchSnapshot();
  });

  it("show more button, shows more careers", async() => {
    props.perPage = 3;
    await act(async() => {
      component = new ComponentHandler(<Component assessmentID={props.assessmentID} {...props} />);
    });
    await act(async() => {
      component.instance.findAllByType("button")[5].props.onClick();
    });
    expect(component.tree).toMatchSnapshot();
  });

  it("modal opens", async() => {
    await act(async() => {
      component = new ComponentHandler(<Component assessmentID={props.assessmentID} {...props} />);
    });
    act(() => {
      component.instance.findAllByType("button")[2].props.onClick();
    });
    expect(component.tree).toMatchSnapshot();
  });

  // TODO: test for Search
  // TODO: test for Experience Level Search
  // TODOL test for Sort
});
