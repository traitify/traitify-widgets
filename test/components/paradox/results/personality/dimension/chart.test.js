import {Component} from "components/paradox/results/personality/dimension/chart";
import ComponentHandler from "support/component-handler";
import {mockProps} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";
import guide from "support/json/guide.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityDimensionChart", () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      ...mockProps(["followGuide", "isReady", "setElement", "translate", "ui"]),
      assessment,
      guide: {
        assessment_id: assessment.id,
        locale_key: assessment.locale_key,
        ...guide
      }
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionChart.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionColumns.initialized",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });

    it("triggers update", () => {
      component = new ComponentHandler(<Component {...props} />);
      props.ui.trigger.mockClear();
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionChart.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
      expect(props.ui.trigger).toHaveBeenCalledWith(
        "PersonalityDimensionColumns.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  it("renders component", () => {
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without guide", () => {
    props.guide = null;
    props.isReady.mockImplementation((value) => value !== "guide");
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation((value) => value !== "results");
    component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
