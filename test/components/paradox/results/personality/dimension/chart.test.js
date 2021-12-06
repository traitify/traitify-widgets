import {Component} from "components/paradox/results/personality/dimension/chart";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/dimension-based.json";
import guide from "support/json/guide.json";

jest.mock("lib/with-traitify", () => ((value) => value));

describe("Paradox.PersonalityDimensionChart", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment,
      followGuide: jest.fn().mockName("followGuide"),
      guide: {
        assessment_id: assessment.id,
        locale_key: assessment.locale_key,
        ...guide
      },
      isReady: jest.fn().mockName("isReady"),
      setElement: jest.fn().mockName("setElement"),
      translate: jest.fn().mockName("translate").mockImplementation((value, options = {}) => `${value}, ${options}`),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        trigger: jest.fn().mockName("trigger")
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
      const component = new ComponentHandler(<Component {...props} />);
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
    props.isReady.mockReturnValue(true);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component without guide", () => {
    props.guide = null;
    props.isReady.mockImplementation((value) => value !== "guide");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
