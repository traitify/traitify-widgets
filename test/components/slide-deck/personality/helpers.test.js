/** @jest-environment jsdom */
import {
  completedSlides,
  dataChanged,
  dataMapper,
  getStateFromProps,
  isFinished,
  isFullscreen,
  isReady,
  loadingIndex,
  slideIndex,
  toggleFullscreen
} from "components/slide-deck/personality/helpers";
import assessment from "support/json/assessment/with-slides.json";

describe("Helpers", () => {
  describe("completedSlides", () => {
    it("filters out incomplete slides", () => {
      const completedLength = Math.round(assessment.slides.length / 2);
      const slides = [
        {...assessment.slides[0], response: false, time_taken: 600},
        ...assessment.slides.slice(1, completedLength).map((slide) => ({...slide, response: true})),
        ...assessment.slides.slice(completedLength)
      ];
      const result = completedSlides(slides);

      expect(result).toHaveLength(completedLength);
      expect(result[0]).toMatchObject({id: expect.any(String), response: false, time_taken: 600});
    });

    it("sets time taken if blank", () => {
      const slides = assessment.slides.map((slide) => ({...slide, response: true}));
      const result = completedSlides(slides);

      expect(result[0]).toMatchObject({id: expect.any(String), response: true, time_taken: 2});
    });
  });

  describe("dataChanged", () => {
    it("compares objects", () => {
      const result = dataChanged({id: "x"}, {id: "y"});

      expect(result).toBe(true);
    });

    it("compares values", () => {
      const result = dataChanged({id: "x"}, {id: "x"});

      expect(result).toBe(false);
    });
  });

  describe("dataMapper", () => {
    it("returns null if blank", () => {
      const result = dataMapper(undefined);

      expect(result).toBeNull();
    });

    it("skips blank data", () => {
      const result = dataMapper({});

      expect(result).toBe("[]");
    });

    it("stringifys the data", () => {
      const result = dataMapper({...assessment, slides: assessment.slides.slice(0, 4)});
      const data = [
        "[\"eafd274c-b825-48ba-9a00-60b827eba277\",\"en-us\"",
        "\"2ea19c7f-bf2b-4dc0-9bd3-b7e8566a54eb-Innovative\"",
        "\"fbd27c93-aaac-4757-886c-fa3a434c1dfe-Short Cuts\"",
        "\"8ade7c57-1c01-469b-af04-b336bd285902-Skydiving\"",
        "\"b29b503e-d8ab-41a9-b306-6cae1579f882-Fundraisers\"]"
      ].join(",");

      expect(result).toBe(data);
    });
  });

  describe("getStateFromProps", () => {
    let props;

    beforeEach(() => {
      props = {
        assessment,
        assessmentID: assessment.id,
        cache: {
          get: jest.fn().mockName("get"),
          set: jest.fn().mockName("set")
        },
        getOption: jest.fn().mockName("getOption")
      };
    });

    it("returns defaults without slides", () => {
      props.assessment = {...assessment, slides: null};
      const result = getStateFromProps(props);

      expect(result).toEqual({
        finished: false,
        finishRequestAttempts: 0,
        imageLoading: false,
        imageLoadingAttempts: 0,
        slides: [],
        showInstructions: false
      });
    });

    it("returns defaults with empty slides", () => {
      props.assessment = {...assessment, slides: []};
      const result = getStateFromProps(props);

      expect(result).toEqual({
        finished: false,
        finishRequestAttempts: 0,
        imageLoading: false,
        imageLoadingAttempts: 0,
        slides: [],
        showInstructions: false
      });
    });

    it("returns a copy of the slides", () => {
      const result = getStateFromProps(props);

      expect(result.slides).toEqual(assessment.slides);
      expect(result.slides).not.toBe(assessment.slides);
    });

    it("combines results from cache", () => {
      props.cache.get.mockReturnValue(assessment.slides.slice(0, 10).map(({id}) => ({
        id, response: false, time_taken: 600
      })));
      const result = getStateFromProps(props);

      expect(result.slides.filter((slide) => slide.response != null)).toHaveLength(10);
      expect(result.slides.filter((slide) => slide.time_taken != null)).toHaveLength(10);
      expect(result.slides).not.toEqual(assessment.slides);
    });

    it("gets instructions", () => {
      props.assessment = {...assessment, instructions: {instructional_text: "Click me or not me"}};
      props.getOption.mockImplementation((option) => option === "allowInstructions");
      const result = getStateFromProps(props);

      expect(result.instructions).toBe("Click me or not me");
      expect(result.showInstructions).toBe(true);
    });

    it("skips instructions unless showInstructions is set", () => {
      props.assessment = {...assessment, instructions: {instructional_text: "Click me or not me"}};
      const result = getStateFromProps(props);

      expect(result.instructions).toBeUndefined();
      expect(result.showInstructions).toBe(false);
    });
  });

  describe("isFinished", () => {
    it("returns false if slides are empty", () => {
      const result = isFinished([]);

      expect(result).toBe(false);
    });

    it("returns false if not all slides are completed", () => {
      const completedLength = Math.round(assessment.slides.length / 2);
      const result = isFinished([
        ...assessment.slides.slice(0, completedLength).map((slide) => ({...slide, response: true})),
        ...assessment.slides.slice(completedLength)
      ]);

      expect(result).toBe(false);
    });

    it("returns true if all slides are completed", () => {
      const result = isFinished(assessment.slides.map((slide) => ({...slide, response: true})));

      expect(result).toBe(true);
    });
  });

  describe("isFullscreen", () => {
    afterEach(() => {
      document.fullscreenElement = null;
      document.webkitFullscreenElement = null;
      document.mozFullScreenElement = null;
      document.msFullscreenElement = null;
    });

    it("checks fullscreenElement", () => {
      document.fullscreenElement = {};
      const result = isFullscreen();

      expect(result).toBe(true);
    });

    it("checks webkitFullscreenElement", () => {
      document.webkitFullscreenElement = {};
      const result = isFullscreen();

      expect(result).toBe(true);
    });

    it("checks mozFullScreenElement", () => {
      document.mozFullScreenElement = {};
      const result = isFullscreen();

      expect(result).toBe(true);
    });

    it("checks msFullscreenElement", () => {
      document.msFullscreenElement = {};
      const result = isFullscreen();

      expect(result).toBe(true);
    });

    it("falls back to false", () => {
      const result = isFullscreen();

      expect(result).toBe(false);
    });
  });

  describe("isReady", () => {
    it("returns false if completed slides aren't followed by at least 2 loaded slides", () => {
      const result = isReady([
        ...assessment.slides.slice(0, 10).map((slide) => ({...slide, response: true})),
        ...assessment.slides.slice(10, 12).map((slide) => ({...slide, loaded: true})),
        ...assessment.slides.slice(12)
      ]);

      expect(result).toBe(false);
    });

    it("returns false if slides are empty", () => {
      const result = isReady([]);

      expect(result).toBe(false);
    });

    it("returns true if completed slides precede loaded slides", () => {
      const result = isReady([
        ...assessment.slides.slice(0, 10).map((slide) => ({...slide, response: true})),
        ...assessment.slides.slice(10, 20).map((slide) => ({...slide, loaded: true})),
        ...assessment.slides.slice(20)
      ]);

      expect(result).toBe(true);
    });

    it("returns true if completed slides follow loaded slides", () => {
      const result = isReady([
        ...assessment.slides.slice(0, 10).map((slide) => ({...slide, loaded: true})),
        ...assessment.slides.slice(10, 20).map((slide) => ({...slide, response: true})),
        ...assessment.slides.slice(20)
      ]);

      expect(result).toBe(true);
    });

    it("returns true if all slides loaded", () => {
      const result = isReady(
        assessment.slides.map((slide) => ({...slide, loaded: true}))
      );

      expect(result).toBe(true);
    });
  });

  describe("loadingIndex", () => {
    it("skips completed slides", () => {
      const result = loadingIndex([
        ...assessment.slides.slice(0, 10).map((slide) => ({...slide, response: true})),
        ...assessment.slides.slice(10, 20).map((slide) => ({
          ...slide, loaded: true, response: true
        })),
        ...assessment.slides.slice(20)
      ]);

      expect(result).toBe(20);
    });

    it("skips completed or loaded slides", () => {
      const result = loadingIndex([
        ...assessment.slides.slice(0, 10).map((slide) => ({...slide, loaded: true})),
        ...assessment.slides.slice(10, 20).map((slide) => ({...slide, response: true})),
        ...assessment.slides.slice(20)
      ]);

      expect(result).toBe(20);
    });

    it("returns -1 if all slides loaded", () => {
      const result = loadingIndex(
        assessment.slides.map((slide) => ({...slide, loaded: true}))
      );

      expect(result).toBe(-1);
    });
  });

  describe("slideIndex", () => {
    it("skips completed slides", () => {
      const result = slideIndex([
        ...assessment.slides.slice(0, 10).map((slide) => ({...slide, response: true})),
        ...assessment.slides.slice(10)
      ]);

      expect(result).toBe(10);
    });

    it("returns -1 if all slides are completed", () => {
      const result = slideIndex(
        assessment.slides.map((slide) => ({...slide, response: true}))
      );

      expect(result).toBe(-1);
    });
  });

  describe("toggleFullscreen", () => {
    describe("exiting fullscreen", () => {
      let element;
      let originalExitFullscreen;
      let originalMozCancelFullScreen;
      let originalMsExitFullscreen;
      let originalWebkitExitFullscreen;

      beforeAll(() => {
        originalExitFullscreen = document.exitFullscreen;
        originalMozCancelFullScreen = document.mozCancelFullScreen;
        originalMsExitFullscreen = document.msExitFullscreen;
        originalWebkitExitFullscreen = document.webkitExitFullscreen;
      });

      beforeEach(() => {
        element = {requestFullscreen: jest.fn().mockName("requestFullscreen")};
        document.exitFullscreen = null;
        document.mozCancelFullScreen = null;
        document.msExitFullscreen = null;
        document.webkitExitFullscreen = null;
      });

      afterAll(() => {
        document.exitFullscreen = originalExitFullscreen;
        document.mozCancelFullScreen = originalMozCancelFullScreen;
        document.msExitFullscreen = originalMsExitFullscreen;
        document.webkitExitFullscreen = originalWebkitExitFullscreen;
      });

      it("calls exitFullscreen", () => {
        document.exitFullscreen = jest.fn().mockName("exitFullscreen");
        toggleFullscreen({current: true, element});

        expect(document.exitFullscreen).toHaveBeenCalled();
        expect(element.requestFullscreen).not.toHaveBeenCalled();
      });

      it("calls mozCancelFullScreen", () => {
        document.mozCancelFullScreen = jest.fn().mockName("exitFullscreen");
        toggleFullscreen({current: true, element});

        expect(document.mozCancelFullScreen).toHaveBeenCalled();
        expect(element.requestFullscreen).not.toHaveBeenCalled();
      });

      it("calls msExitFullscreen", () => {
        document.msExitFullscreen = jest.fn().mockName("exitFullscreen");
        toggleFullscreen({current: true, element});

        expect(document.msExitFullscreen).toHaveBeenCalled();
        expect(element.requestFullscreen).not.toHaveBeenCalled();
      });

      it("calls webkitExitFullscreen", () => {
        document.webkitExitFullscreen = jest.fn().mockName("exitFullscreen");
        toggleFullscreen({current: true, element});

        expect(document.webkitExitFullscreen).toHaveBeenCalled();
        expect(element.requestFullscreen).not.toHaveBeenCalled();
      });
    });

    describe("requesting fullscreen", () => {
      it("calls requestFullscreen", () => {
        const element = {requestFullscreen: jest.fn().mockName("requestFullscreen")};
        toggleFullscreen({current: false, element});

        expect(element.requestFullscreen).toHaveBeenCalled();
      });

      it("calls mozRequestFullScreen", () => {
        const element = {mozRequestFullScreen: jest.fn().mockName("requestFullscreen")};
        toggleFullscreen({current: false, element});

        expect(element.mozRequestFullScreen).toHaveBeenCalled();
      });

      it("calls msRequestFullscreen", () => {
        const element = {msRequestFullscreen: jest.fn().mockName("requestFullscreen")};
        toggleFullscreen({current: false, element});

        expect(element.msRequestFullscreen).toHaveBeenCalled();
      });

      it("calls webkitRequestFullscreen", () => {
        const element = {webkitRequestFullscreen: jest.fn().mockName("requestFullscreen")};
        toggleFullscreen({current: false, element});

        expect(element.webkitRequestFullscreen).toHaveBeenCalled();
      });
    });
  });
});
