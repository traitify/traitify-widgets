import Component from "components/slide-deck/slide";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/with-slides.json";

describe("Slide", () => {
  let props;

  beforeEach(() => {
    props = {
      back: jest.fn().mockName("back"),
      getOption: jest.fn().mockName("getOption").mockReturnValue(false),
      isComplete: false,
      isFullscreen: false,
      showInstructions: false,
      slideIndex: 0,
      slides: assessment.slides,
      start: jest.fn().mockName("start"),
      toggleFullscreen: jest.fn().mockName("toggleFullscreen"),
      translate: jest.fn().mockName("translate").mockImplementation((value) => value),
      updateSlide: jest.fn().mockName("updateSlide")
    };
  });

  describe("actions", () => {
    describe("respondMe", () => {
      it("calls updateSlide", () => {
        const component = new ComponentHandler(<Component {...props} />);
        component.instance.respondMe();

        expect(props.updateSlide).toHaveBeenCalledWith(props.slideIndex, true);
      });
    });

    describe("respondNotMe", () => {
      it("calls updateSlide", () => {
        const component = new ComponentHandler(<Component {...props} />);
        component.instance.respondNotMe();

        expect(props.updateSlide).toHaveBeenCalledWith(props.slideIndex, false);
      });
    });
  });

  describe("update", () => {
    let focus;
    let querySelector;

    beforeAll(() => {
      focus = jest.fn().mockName("focus");
      querySelector = jest.spyOn(document, "querySelector");
    });

    beforeEach(() => {
      querySelector.mockReturnValue({focus});
    });

    afterEach(() => {
      focus.mockClear();
      querySelector.mockClear();
    });

    afterAll(() => {
      querySelector.mockRestore();
    });

    it("does nothing if neither the instructions or slide index change", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({isComplete: true});

      expect(focus).not.toHaveBeenCalled();
      expect(querySelector).not.toHaveBeenCalled();
    });

    it("focuses if the instructions change", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({showInstructions: true});

      expect(focus).toHaveBeenCalled();
      expect(querySelector).toHaveBeenCalled();
    });

    it("focuses if the slide index changes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({slideIndex: 1});

      expect(focus).toHaveBeenCalled();
      expect(querySelector).toHaveBeenCalled();
    });

    it("focuses if the instructions and slide index change", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps({showInstructions: true, slideIndex: 1});

      expect(focus).toHaveBeenCalled();
      expect(querySelector).toHaveBeenCalled();
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with previous slide", () => {
    props.slideIndex = props.slides.length - 1;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders component with previous and next slides", () => {
    props.slideIndex = 1;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders back button", () => {
    props.getOption.mockImplementation((option) => option === "allowBack");
    props.slideIndex = 1;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders back button unless first slide", () => {
    props.getOption.mockImplementation((option) => option === "allowBack");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders complete progress bar", () => {
    props.isComplete = true;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders fullscreen", () => {
    props.getOption.mockImplementation((option) => option === "allowFullscreen");
    props.isFullscreen = true;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders fullscreen button", () => {
    props.getOption.mockImplementation((option) => option === "allowFullscreen");
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders instructions", () => {
    props.getOption.mockReturnValue(true);
    props.instructions = "Click me or not me";
    props.showInstructions = true;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });
});
