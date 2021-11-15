import {Component} from "components/paradox/results/personality/archetype/tips";
import ComponentHandler from "support/component-handler";
import {mockOptions} from "support/helpers";
import assessment from "support/json/assessment/dimension-based.json";

jest.mock("lib/with-traitify", () => ((value) => value));

const details = [];
const tipTypes = {
  firstPerson: [
    {body: "CZ", title: "Caution Zone"},
    {body: "SWY", title: "Settings that Work for You"},
    {body: "TU", title: "Tools to Use"}
  ],
  thirdPerson: [
    {body: "TP CZ", title: "Third Person Caution Zone"},
    {body: "TP SWY", title: "Third Person Settings that Work for You"},
    {body: "TP TU", title: "Third Person Tools to Use"}
  ]
};

Object.keys(tipTypes).forEach((perspective) => {
  tipTypes[perspective].forEach((type) => {
    Array.from(Array(5)).forEach((_, i) => {
      details.push({body: `${type.body} - ${i}`, title: type.title});
    });
  });
});

describe("Paradox.PersonalityArchetypeTips", () => {
  let props;

  beforeEach(() => {
    props = {
      assessment: {...assessment, archetype: {...assessment.archetype, details: [...details]}},
      getOption: jest.fn().mockName("getOption"),
      isReady: jest.fn().mockName("isReady").mockReturnValue(true),
      options: {},
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
        "PersonalityTips.initialized",
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
        "PersonalityTips.updated",
        expect.objectContaining({
          props: expect.any(Object),
          state: expect.any(Object)
        })
      );
    });
  });

  describe("thirdPerson", () => {
    beforeEach(() => {
      mockOptions(props.getOption, {perspective: "thirdPerson"});
    });

    it("renders component", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });

    it("renders firstPerson tips if no thirdPerson tips", () => {
      const typeKeys = tipTypes.thirdPerson.map((type) => type.title);
      props.assessment.archetype.details = details.filter(({title}) => !typeKeys.includes(title));
      const component = new ComponentHandler(<Component {...props} />);

      expect(component.tree).toMatchSnapshot();
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with available types", () => {
    props.assessment.archetype.details = details.filter(({title}) => title !== "Tools to Use");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with enabled types", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityTools"]});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders new type from clicking button", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.act(() => component.instance.findAllByType("button")[1].props.onClick());

    expect(component.tree).toMatchSnapshot();
  });

  it("renders new type from selecting option", () => {
    const component = new ComponentHandler(<Component {...props} />);
    const select = component.instance.findByType("select");
    const option = component.instance.findAllByType("option")[1];
    component.act(() => select.props.onChange({target: option.props}));

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if disabled", () => {
    mockOptions(props.getOption, {disabledComponents: ["PersonalityTips"]});
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if results not ready", () => {
    props.assessment = null;
    props.isReady.mockImplementation((value) => value !== "results");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no archetype", () => {
    props.assessment.archetype = null;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no tips", () => {
    const typeKeys = [];
    Object.keys(tipTypes).forEach((perspective) => {
      tipTypes[perspective].forEach((type) => typeKeys.push(type.title));
    });
    props.assessment.archetype.details = details.filter(({title}) => !typeKeys.includes(title));
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
