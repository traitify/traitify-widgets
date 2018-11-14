import {Component} from "components/slide-deck";
import ComponentHandler from "support/component-handler";
import Traitify from "support/traitify";

jest.mock("lib/with-traitify");

describe("SlideDeck", () => {
  const createSlide = (index, complete) => (
    {
      caption: `Slide ${index}`,
      id: `s-${index}`,
      image_desktop: "https://cdn.traitify.com/slides/9bce2d27-44df-4c0c-9e31-4059b2933dce_desktop",
      response: complete ? Math.random() >= 0.5 : null,
      time_taken: complete ? Math.random() * 100 : null
    }
  );
  const assessment = {
    id: "xyz",
    locale_key: "en-us",
    slides: Array.from({length: 20}).map((_, i) => (createSlide(i, false)))
  };
  const assessmentWithoutSlides = {
    id: "xyz",
    locale_key: "en-us",
    slides: []
  };
  const defaultProps = {
    assessment,
    assessmentID: assessment.id,
    cache: {get: jest.fn().mockName("get"), set: jest.fn().mockName("set")},
    getAssessment: jest.fn().mockName("getAssessment"),
    getOption: jest.fn().mockName("getAssessment"),
    isReady: () => (true),
    translate: (key) => (key)
  };

  beforeEach(() => {
    defaultProps.cache.get.mockClear();
    defaultProps.cache.get.mockClear();
    defaultProps.getAssessment.mockClear();
    defaultProps.getOption.mockClear();
    defaultProps.traitify = new Traitify();
  });

  // TODO: Test render for snapshot
  // TODO: Test event methods
  //   back
  //     currentIndex stays correct
  //   respondMe
  //     currentIndex stays correct
  //   respondNotMe
  //     currentIndex stays correct
  //   retry
  //   toggleFullscreen
  //     each provider?
  // TODO: To be sorted
  //   updating slide completes assessment
  //   loading/isReady logic
  //   isReady callback

  describe("initialize", () => {
    // only initializes once
    //   setState only called once
    // doesn't initialize if
    //   already initialized
    //   no assessment
    //   no slides
    // loads slides from cache
    // gives correct starting position
    // sets start time
    // triggers initializion
    // if done
    //   call finish
    //   doesn't fetch images
    // if not done
    //   fetches images
  });

  it("renders current slide", () => {
    // const component = new ComponentHandler(<Component {...defaultProps} />);

    // expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", () => {
    const props = {...defaultProps};
    props.assessment = assessmentWithoutSlides;
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("triggers initialization callback", () => {
    const props = {...defaultProps};
    props.traitify.ui.trigger = jest.fn().mockName("trigger");
    new ComponentHandler(<Component {...props} />);

    expect(props.traitify.ui.trigger).toBeCalled();
  });

  it("normalizes time taken", () => {
    const component = new ComponentHandler(<Component {...defaultProps} />);
    const slides = Array.from({length: 20}).map((_, i) => (createSlide(i, true)));
    slides[0].response = true;
    slides[0].time_taken = -100;
    component.updateState({slides});

    const badSlides = component.instance.completedSlides()
      .filter((slide) => (slide.time_taken < 0));

    expect(badSlides).toHaveLength(0);
  });
});
