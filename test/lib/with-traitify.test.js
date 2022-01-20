/* eslint-disable no-console */
import withTraitify from "lib/with-traitify";
import ComponentHandler from "support/component-handler";
import DummyComponent, {ErrorComponent, OtherComponent} from "support/dummy-components";
import Traitify from "support/traitify";

jest.mock("lib/helpers", () => ({
  getDisplayName: jest.fn((component) => component.name).mockName("getDisplayName"),
  loadFont: jest.fn().mockName("loadFont")
}));

let component;
const getComponent = (Component) => component.renderer.root.findByType(Component);
const getDummyComponent = () => getComponent(DummyComponent);

describe("withTraitify", () => {
  let Component;
  let assessment;
  let assessmentWithoutResults;
  let benchmark;
  let cognitiveAssessment;
  let cognitiveAssessmentWithoutResults;
  let deck;
  let guide;
  let traitify;

  beforeEach(() => {
    const baseAssessment = {assessment_type: "DIMENSION_BASED", deck_id: "big-five", id: "abc", locale_key: "en-US", profile_ids: ["p-1"]};
    const baseCognitiveAssessment = {id: "def", localeKey: "en-US", questions: [{id: "q-1"}]};

    Component = withTraitify(DummyComponent);
    traitify = new Traitify();
    assessment = {...baseAssessment, personality_types: [{name: "Openness"}]};
    assessmentWithoutResults = {...baseAssessment, slides: [{caption: "Snakes"}]};
    benchmark = {id: "b-id", locale_key: "en-US", name: "Developer", range_types: [{name: "R"}, {name: "L"}]};
    cognitiveAssessment = {...baseCognitiveAssessment, completed: true};
    cognitiveAssessmentWithoutResults = {...baseCognitiveAssessment, completed: false};
    deck = {id: "big-five", locale_key: "en-US", name: "Big Five"};
    guide = {assessment_id: "abc", competencies: [{name: "Under Pressure"}], locale_key: "en-US"};
  });

  describe("addListener", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
    });

    it("creates listeners object", () => {
      const callback = () => {};
      const key = "taco";
      delete component.instance.listeners;
      component.instance.addListener(key, callback);

      expect(component.instance.listeners).toBeInstanceOf(Object);
      expect(component.instance.listeners).toMatchObject({[key]: callback});
    });

    it("adds to listeners object", () => {
      const callback = () => {};
      const key = "taco";
      const otherCallback = () => {};
      const otherKey = "other taco";
      delete component.instance.listeners;
      component.instance.addListener(key, callback);
      component.instance.addListener(otherKey, otherCallback);

      expect(component.instance.listeners).toBeInstanceOf(Object);
      expect(component.instance.listeners).toMatchObject({
        [key]: callback,
        [otherKey]: otherCallback
      });
    });
  });

  describe("componentWillUnmount", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
    });

    it("unfollows listeners", () => {
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.componentWillUnmount();

      expect(component.instance.removeListener).toHaveBeenCalledWith("i18n.setlocale");
    });
  });

  describe("displayName", () => {
    it("returns correct name", () => {
      expect(Component.displayName).toBe("TraitifyDummyComponent");
    });
  });

  describe("error handler", () => {
    let createError;
    let originalError;

    beforeEach(() => {
      originalError = console.error; // Required to hide console.error from React
      console.error = jest.fn().mockName("error");
      Component = withTraitify(ErrorComponent);
      createError = () => "uh oh";
      traitify.ui.trigger = jest.fn().mockName("trigger");
      component = new ComponentHandler(<Component createError={createError} traitify={traitify} />);
    });

    afterEach(() => {
      console.error = originalError;
    });

    it("emits error", () => {
      expect(traitify.ui.trigger).toHaveBeenCalledWith("Component.error", component.instance, {error: "uh oh", info: expect.any(Object)});
    });

    it("sets error", () => {
      expect(component.state.error).toBe("uh oh");
    });
  });

  describe("cache", () => {
    let originalSessionStorage;

    beforeAll(() => {
      originalSessionStorage = window.sessionStorage;
      delete window.sessionStorage;
      Object.defineProperty(window, "sessionStorage", {
        writable: true,
        value: {
          getItem: jest.fn().mockName("getItem"),
          setItem: jest.fn().mockName("setItem")
        }
      });
    });

    beforeEach(() => {
      sessionStorage.getItem.mockClear();
      sessionStorage.setItem.mockClear();
    });

    afterAll(() => {
      Object.defineProperty(window, "sessionStorage", {writable: true, value: originalSessionStorage});
    });

    it("passes prop", () => {
      component = new ComponentHandler(<Component traitify={traitify} />);

      expect(getDummyComponent().props.cache).toBeDefined();
    });

    it("passes through prop", () => {
      const cache = {get: () => {}, set: () => {}};
      component = new ComponentHandler(<Component cache={cache} traitify={traitify} />);

      expect(getDummyComponent().props.cache).toBe(cache);
    });

    describe("get", () => {
      it("calls getItem", () => {
        component = new ComponentHandler(<Component traitify={traitify} />);
        getDummyComponent().props.cache.get("abc");

        expect(sessionStorage.getItem).toHaveBeenCalledWith("abc");
      });

      it("returns json", () => {
        sessionStorage.getItem.mockReturnValueOnce("{\"id\": \"xyz\"}");
        component = new ComponentHandler(<Component traitify={traitify} />);
        const result = getDummyComponent().props.cache.get("abc");

        expect(result).toEqual({id: "xyz"});
      });

      it("returns nothing", () => {
        component = new ComponentHandler(<Component traitify={traitify} />);
        const result = getDummyComponent().props.cache.get("abc");

        expect(result).toBeNull();
      });

      it("catches error", () => {
        sessionStorage.getItem.mockImplementationOnce(() => { throw new SyntaxError(); });
        component = new ComponentHandler(<Component traitify={traitify} />);
        const result = getDummyComponent().props.cache.get("abc");

        expect(result).toBeNull();
      });
    });

    describe("set", () => {
      it("calls setItem with json", () => {
        component = new ComponentHandler(<Component traitify={traitify} />);
        getDummyComponent().props.cache.set("abc", {id: "xyz"});

        expect(sessionStorage.setItem).toHaveBeenCalledWith("abc", "{\"id\":\"xyz\"}");
      });

      it("catches error", () => {
        sessionStorage.setItem.mockImplementationOnce(() => { throw new SyntaxError(); });
        component = new ComponentHandler(<Component traitify={traitify} />);
        const result = getDummyComponent().props.cache.set("abc", {id: "xyz"});

        expect(result).toBeNull();
      });
    });
  });

  describe("followBenchmark", () => {
    const getBenchmark = jest.fn().mockName("getBenchmark");

    beforeEach(() => {
      getBenchmark.mockClear();
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.updateBenchmark = function() {
        if(!this.state.benchmarkID) { return; }

        getBenchmark();
      };
    });

    it("gets benchmark when state gets benchmarkID", () => {
      getDummyComponent().props.followBenchmark();
      component.updateState({benchmark, benchmarkID: benchmark.id});

      expect(getBenchmark).toHaveBeenCalled();
    });

    it("gets benchmark if state has benchmarkID", () => {
      component.updateState({benchmark, benchmarkID: benchmark.id});
      getDummyComponent().props.followBenchmark();

      expect(getBenchmark).toHaveBeenCalled();
    });

    it("gets benchmark if state has benchmarkID and benchmark is removed", () => {
      getDummyComponent().props.followBenchmark();
      component.updateState({benchmark, benchmarkID: benchmark.id});
      getBenchmark.mockClear();
      component.updateState({benchmark: null});

      expect(getBenchmark).toHaveBeenCalled();
    });

    it("doesn't get benchmark if state doesn't have benchmarkID", () => {
      getDummyComponent().props.followBenchmark();

      expect(getBenchmark).not.toHaveBeenCalled();
    });
  });

  describe("followDeck", () => {
    const getDeck = jest.fn().mockName("getDeck");

    beforeEach(() => {
      getDeck.mockClear();
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.updateDeck = function() {
        if(!this.state.deckID) { return; }

        getDeck();
      };
    });

    it("gets deck when state gets deckID", () => {
      getDummyComponent().props.followDeck();
      component.updateState({deck, deckID: deck.id});

      expect(getDeck).toHaveBeenCalled();
    });

    it("gets deck if state has deckID", () => {
      component.updateState({deck, deckID: deck.id});
      getDummyComponent().props.followDeck();

      expect(getDeck).toHaveBeenCalled();
    });

    it("gets deck if state has deckID and deck is removed", () => {
      getDummyComponent().props.followDeck();
      component.updateState({deck, deckID: deck.id});
      getDeck.mockClear();
      component.updateState({deck: null});

      expect(getDeck).toHaveBeenCalled();
    });

    it("doesn't get deck if state doesn't have deckID", () => {
      getDummyComponent().props.followDeck();

      expect(getDeck).not.toHaveBeenCalled();
    });
  });

  describe("followGuide", () => {
    const getGuide = jest.fn().mockName("getGuide");

    beforeEach(() => {
      getGuide.mockClear();
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.updateGuide = function() {
        if(!this.state.assessment) { return; }

        getGuide();
      };
    });

    it("gets guide when state gets assessment", () => {
      getDummyComponent().props.followGuide();
      component.updateState({assessment});

      expect(getGuide).toHaveBeenCalled();
    });

    it("gets guide if state has assessment", () => {
      component.updateState({assessment});
      getDummyComponent().props.followGuide();

      expect(getGuide).toHaveBeenCalled();
    });

    it("doesn't get guide if state doesn't have assessment", () => {
      getDummyComponent().props.followGuide();

      expect(getGuide).not.toHaveBeenCalled();
    });
  });

  describe("getAssessment", () => {
    let cache;
    let originalWarn;

    beforeEach(() => {
      originalWarn = console.warn;
      console.warn = jest.fn().mockName("warn");
      cache = {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      };
      component = new ComponentHandler(<Component cache={cache} traitify={traitify} />);
      component.instance.updateAssessment = function() {
        if(!this.state.assessmentID) { return; }

        const key = `${this.state.locale}.assessment.${this.state.assessmentID}`;

        this.listeners[key] = (_, _assessment) => {
          this.setState({
            assessment: _assessment,
            assessmentID: _assessment.id,
            deck: null,
            deckID: _assessment.deck_id
          });
        };
        this.traitify.ui.on(key, this.listeners[key]);
      };
    });

    afterEach(() => {
      console.warn = originalWarn;
    });

    it("requires assessmentID", (done) => {
      getDummyComponent().props.getAssessment().then(() => {
        const {props} = getDummyComponent();

        expect(props.assessment).toBeNull();
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("checks props", (done) => {
      component.updateProps({assessment});
      getDummyComponent().props.getAssessment().then(() => {
        const {props} = getDummyComponent();

        expect(props.assessment).toBe(assessment);
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("skips props if no results", (done) => {
      assessment = assessmentWithoutResults;
      component.updateProps({assessment});
      getDummyComponent().props.getAssessment().then(() => {
        expect(getDummyComponent().props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("checks cache", (done) => {
      cache.get.mockReturnValue(assessment);
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getAssessment().then(() => {
        const {props} = getDummyComponent();

        expect(props.assessment).toBe(assessment);
        expect(props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("skips cache if no results", (done) => {
      assessment = assessmentWithoutResults;
      cache.get.mockReturnValue(assessment);
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getAssessment().then(() => {
        expect(getDummyComponent().props.assessment).not.toBe(assessment);
        done();
      });
    });

    it("sets cache if results", (done) => {
      traitify.ajax.mockReturnValue(Promise.resolve(assessment));
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getAssessment().then(() => {
        expect(getDummyComponent().props.cache.set).toHaveBeenCalled();
        done();
      });
    });

    it("stops if there's an existing request", () => {
      assessment = assessmentWithoutResults;
      const key = `en-us.assessment.${assessment.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getAssessment();

      expect(traitify.ui.requests[key]).toBe(request);
    });

    it("forces new request", () => {
      assessment = assessmentWithoutResults;
      const key = `en-us.assessment.${assessment.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getAssessment({force: true});

      expect(traitify.ui.requests[key]).not.toBe(request);
    });

    it("catches error with request", (done) => {
      assessment = assessmentWithoutResults;
      const key = `en-us.assessment.${assessment.id}`;
      traitify.ajax.mockReturnValue(Promise.reject("Error with request"));
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getAssessment().then(() => {
        expect(console.warn).toHaveBeenCalledWith("Error with request");
        expect(traitify.ui.requests[key]).toBeUndefined();
        done();
      });
    });
  });

  describe("getBenchmark", () => {
    let cache;
    let originalWarn;
    let benchmarkWithoutName;

    beforeEach(() => {
      originalWarn = console.warn;
      console.warn = jest.fn().mockName("warn");
      cache = {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      };
      benchmarkWithoutName = {id: "b-id", locale_key: "en-US", range_types: [{name: "R"}, {name: "L"}]};
      component = new ComponentHandler(<Component cache={cache} traitify={traitify} />);
    });

    afterEach(() => {
      console.warn = originalWarn;
    });

    it("requires benchmarkID", (done) => {
      component.instance.getBenchmark().then(() => {
        const {props} = getDummyComponent();

        expect(props.benchmark).toBeNull();
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("checks state", (done) => {
      component.updateState({benchmark, benchmarkID: benchmark.id});
      component.instance.getBenchmark().then(() => {
        const {props} = getDummyComponent();

        expect(props.benchmark).toBe(benchmark);
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("skips state if no name", (done) => {
      benchmark = benchmarkWithoutName;
      component.updateState({benchmark, benchmarkID: benchmark.id});
      component.instance.getBenchmark().then(() => {
        expect(getDummyComponent().props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("checks cache", (done) => {
      cache.get.mockReturnValue(benchmark);
      component.updateState({benchmarkID: benchmark.id});
      component.instance.getBenchmark().then(() => {
        const {props} = getDummyComponent();

        expect(props.benchmark).toBe(benchmark);
        expect(props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("skips cache if no name", (done) => {
      benchmark = benchmarkWithoutName;
      cache.get.mockReturnValue(benchmark);
      component.updateState({benchmarkID: benchmark.id});
      component.instance.getBenchmark().then(() => {
        expect(getDummyComponent().props.benchmark).not.toBe(benchmark);
        done();
      });
    });

    it("sets cache if name", (done) => {
      traitify.ajax.mockReturnValue(Promise.resolve(benchmark));
      component.updateState({benchmarkID: benchmark.id});
      component.instance.getBenchmark().then(() => {
        expect(getDummyComponent().props.cache.set).toHaveBeenCalled();
        done();
      });
    });

    it("stops if there's an existing request", () => {
      benchmark = benchmarkWithoutName;
      const key = `en-us.benchmark.${benchmark.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateState({benchmarkID: benchmark.id});
      component.instance.getBenchmark();

      expect(traitify.ui.requests[key]).toBe(request);
    });

    it("forces new request", () => {
      benchmark = benchmarkWithoutName;
      const key = `en-us.benchmark.${benchmark.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateState({benchmarkID: benchmark.id});
      component.instance.getBenchmark({force: true});

      expect(traitify.ui.requests[key]).not.toBe(request);
    });

    it("catches error with request", (done) => {
      benchmark = benchmarkWithoutName;
      const key = `en-us.benchmark.${benchmark.id}`;
      traitify.ajax.mockReturnValue(Promise.reject("Error with request"));
      component.updateState({benchmarkID: benchmark.id});
      component.instance.getBenchmark().then(() => {
        expect(console.warn).toHaveBeenCalledWith("Error with request");
        expect(traitify.ui.requests[key]).toBeUndefined();
        done();
      });
    });
  });

  describe("getCognitiveAssessment", () => {
    let cache;
    let originalWarn;

    beforeEach(() => {
      originalWarn = console.warn;
      console.warn = jest.fn().mockName("warn");
      cache = {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      };
      component = new ComponentHandler(<Component cache={cache} surveyType="cognitive" traitify={traitify} />);
      component.instance.updateCognitiveAssessment = function() {
        if(!this.state.assessmentID) { return; }

        const key = `${this.state.locale}.cognitive-assessment.${this.state.assessmentID}`;

        this.listeners[key] = (_, _assessment) => {
          this.setState({
            assessment: _assessment,
            assessmentID: _assessment.id
          });
        };
        this.traitify.ui.on(key, this.listeners[key]);
      };
    });

    afterEach(() => {
      console.warn = originalWarn;
    });

    it("requires assessmentID", (done) => {
      getDummyComponent().props.getCognitiveAssessment().then(() => {
        const {props} = getDummyComponent();

        expect(props.assessment).toBeNull();
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("checks props", (done) => {
      assessment = cognitiveAssessment;
      component.updateProps({assessment});
      getDummyComponent().props.getCognitiveAssessment().then(() => {
        const {props} = getDummyComponent();

        expect(props.assessment).toBe(assessment);
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("skips props if no results", (done) => {
      assessment = cognitiveAssessmentWithoutResults;
      component.updateProps({assessment});
      getDummyComponent().props.getCognitiveAssessment().then(() => {
        expect(getDummyComponent().props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("checks cache", (done) => {
      assessment = cognitiveAssessment;
      cache.get.mockReturnValue(assessment);
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getCognitiveAssessment().then(() => {
        const {props} = getDummyComponent();

        expect(props.assessment).toBe(assessment);
        expect(props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("skips cache if no results", (done) => {
      assessment = cognitiveAssessmentWithoutResults;
      cache.get.mockReturnValue(assessment);
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getCognitiveAssessment().then(() => {
        expect(getDummyComponent().props.assessment).not.toBe(assessment);
        done();
      });
    });

    it("sets cache if request results", (done) => {
      assessment = cognitiveAssessment;
      traitify.ajax.mockReturnValue(Promise.resolve({
        data: {cognitiveTest: assessment}
      }));
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getCognitiveAssessment().then(() => {
        expect(getDummyComponent().props.cache.set).toHaveBeenCalled();
        done();
      });
    });

    it("skips setting cache if no results", (done) => {
      assessment = cognitiveAssessmentWithoutResults;
      traitify.ajax.mockReturnValue(Promise.resolve({
        data: {cognitiveTest: assessment}
      }));
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getCognitiveAssessment().then(() => {
        expect(getDummyComponent().props.cache.set).not.toHaveBeenCalled();
        done();
      });
    });

    it("stops if there's an existing request", () => {
      assessment = cognitiveAssessmentWithoutResults;
      const key = `en-us.cognitive-assessment.${assessment.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getCognitiveAssessment();

      expect(traitify.ui.requests[key]).toBe(request);
    });

    it("forces new request", () => {
      assessment = cognitiveAssessmentWithoutResults;
      const key = `en-us.cognitive-assessment.${assessment.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getCognitiveAssessment({force: true});

      expect(traitify.ui.requests[key]).not.toBe(request);
    });

    it("catches error with request", (done) => {
      assessment = cognitiveAssessmentWithoutResults;
      const key = `en-us.cognitive-assessment.${assessment.id}`;
      traitify.ajax.mockReturnValue(Promise.reject("Error with request"));
      component.updateProps({assessmentID: assessment.id});
      getDummyComponent().props.getCognitiveAssessment().then(() => {
        expect(console.warn).toHaveBeenCalledWith("Error with request");
        expect(traitify.ui.requests[key]).toBeUndefined();
        done();
      });
    });
  });

  describe("getDeck", () => {
    let cache;
    let deckWithoutName;
    let originalWarn;

    beforeEach(() => {
      originalWarn = console.warn;
      console.warn = jest.fn().mockName("warn");
      deckWithoutName = {id: "big-five", locale_key: "en-US"};
      cache = {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      };
      component = new ComponentHandler(<Component cache={cache} traitify={traitify} />);
    });

    afterEach(() => {
      console.warn = originalWarn;
    });

    it("requires deckID", (done) => {
      component.instance.getDeck().then(() => {
        const {props} = getDummyComponent();

        expect(props.deck).toBeNull();
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("checks state", (done) => {
      component.updateState({deck, deckID: deck.id});
      component.instance.getDeck().then(() => {
        const {props} = getDummyComponent();

        expect(props.deck).toBe(deck);
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("skips state if no name", (done) => {
      deck = deckWithoutName;
      component.updateState({deck, deckID: deck.id});
      component.instance.getDeck().then(() => {
        expect(getDummyComponent().props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("checks cache", (done) => {
      cache.get.mockReturnValue(deck);
      component.updateState({deckID: deck.id});
      component.instance.getDeck().then(() => {
        const {props} = getDummyComponent();

        expect(props.deck).toBe(deck);
        expect(props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("skips cache if no name", (done) => {
      deck = deckWithoutName;
      cache.get.mockReturnValue(deck);
      component.updateState({deckID: deck.id});
      component.instance.getDeck().then(() => {
        expect(getDummyComponent().props.deck).not.toBe(deck);
        done();
      });
    });

    it("sets cache if name", (done) => {
      traitify.ajax.mockReturnValue(Promise.resolve(deck));
      component.updateState({deckID: deck.id});
      component.instance.getDeck().then(() => {
        expect(getDummyComponent().props.cache.set).toHaveBeenCalled();
        done();
      });
    });

    it("sets deck locale if missing", (done) => {
      deck.locale_key = null;
      traitify.ajax.mockReturnValue(Promise.resolve(deck));
      component.updateState({deckID: deck.id});
      component.instance.getDeck().then(() => {
        expect(getDummyComponent().props.deck.locale_key).toBe(component.state.locale);
        done();
      });
    });

    it("stops if there's an existing request", () => {
      deck = deckWithoutName;
      const key = `en-us.deck.${deck.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateState({deckID: deck.id});
      component.instance.getDeck();

      expect(traitify.ui.requests[key]).toBe(request);
    });

    it("forces new request", () => {
      deck = deckWithoutName;
      const key = `en-us.deck.${deck.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateState({deckID: deck.id});
      component.instance.getDeck({force: true});

      expect(traitify.ui.requests[key]).not.toBe(request);
    });

    it("catches error with request", (done) => {
      deck = deckWithoutName;
      const key = `en-us.deck.${deck.id}`;
      traitify.ajax.mockReturnValue(Promise.reject("Error with request"));
      component.updateState({deckID: deck.id});
      component.instance.getDeck().then(() => {
        expect(console.warn).toHaveBeenCalledWith("Error with request");
        expect(traitify.ui.requests[key]).toBeUndefined();
        done();
      });
    });
  });

  describe("getGuide", () => {
    let cache;
    let originalWarn;
    let guideWithoutCompetencies;

    beforeEach(() => {
      originalWarn = console.warn;
      console.warn = jest.fn().mockName("warn");
      cache = {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      };
      component = new ComponentHandler(<Component cache={cache} traitify={traitify} />);
      guideWithoutCompetencies = {...guide, competencies: []};
    });

    afterEach(() => {
      console.warn = originalWarn;
    });

    it("requires assessment", (done) => {
      component.instance.getGuide().then(() => {
        const {props} = getDummyComponent();

        expect(props.guide).toBeNull();
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("checks state", (done) => {
      component.updateState({assessment, guide});
      component.instance.getGuide().then(() => {
        const {props} = getDummyComponent();

        expect(props.guide).toBe(guide);
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("skips state if no competencies", (done) => {
      guide = guideWithoutCompetencies;
      component.updateState({assessment, guide});
      component.instance.getGuide().then(() => {
        expect(getDummyComponent().props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("checks cache", (done) => {
      cache.get.mockReturnValue(guide);
      component.updateState({assessment});
      component.instance.getGuide().then(() => {
        const {props} = getDummyComponent();

        expect(props.guide).toBe(guide);
        expect(props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("skips cache if no competencies", (done) => {
      guide = guideWithoutCompetencies;
      cache.get.mockReturnValue(guide);
      component.updateState({assessment});
      component.instance.getGuide().then(() => {
        expect(getDummyComponent().props.guide).not.toBe(guide);
        done();
      });
    });

    it("sets cache if competencies", (done) => {
      traitify.ajax.mockReturnValue(Promise.resolve({data: {guide}}));
      component.updateState({assessment});
      component.instance.getGuide().then(() => {
        expect(getDummyComponent().props.cache.set).toHaveBeenCalled();
        done();
      });
    });

    it("sets guide assessment ID if missing", (done) => {
      guide.assessment_id = null;
      traitify.ajax.mockReturnValue(
        Promise.resolve({data: {guide}})
      );
      component.updateState({assessment});
      component.instance.getGuide().then(() => {
        expect(getDummyComponent().props.guide.assessment_id).toBe(component.state.assessment.id);
        done();
      });
    });

    it("sets guide locale if missing", (done) => {
      guide.locale_key = null;
      traitify.ajax.mockReturnValue(Promise.resolve({data: {guide}}));
      component.updateState({assessment});
      component.instance.getGuide().then(() => {
        expect(getDummyComponent().props.guide.locale_key).toBe(component.state.locale);
        done();
      });
    });

    it("sets guide to blank if no data", (done) => {
      traitify.ajax.mockReturnValue(Promise.resolve({}));
      component.updateState({assessment});
      component.instance.getGuide().then(() => {
        expect(getDummyComponent().props.guide).toBeNull();
        done();
      });
    });

    it("stops if there's an existing request", () => {
      const key = `en-us.guide.${assessment.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateState({assessment});
      component.instance.getGuide();

      expect(traitify.ui.requests[key]).toBe(request);
    });

    it("forces new request", () => {
      const key = `en-us.guide.${assessment.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateState({assessment});
      component.instance.getGuide({force: true});

      expect(traitify.ui.requests[key]).not.toBe(request);
    });

    it("catches error with request", (done) => {
      const key = `en-us.guide.${assessment.id}`;
      traitify.ajax.mockReturnValue(Promise.reject("Error with request"));
      component.updateState({assessment});
      component.instance.getGuide().then(() => {
        expect(console.warn).toHaveBeenCalledWith("Error with request");
        expect(traitify.ui.requests[key]).toBeUndefined();
        done();
      });
    });
  });

  describe("getOption", () => {
    describe("nested", () => {
      it("checks shallow prop", () => {
        component = new ComponentHandler(<Component timeLimit={300} traitify={traitify} />);

        expect(getDummyComponent().props.getOption("slideDeck", "timeLimit")).toBe(300);
      });

      it("checks prop", () => {
        component = new ComponentHandler(
          <Component slideDeck={{timeLimit: 300}} traitify={traitify} />
        );

        expect(getDummyComponent().props.getOption("slideDeck", "timeLimit")).toBe(300);
      });

      it("checks options", () => {
        component = new ComponentHandler(
          <Component options={{slideDeck: {timeLimit: 300}}} traitify={traitify} />
        );

        expect(getDummyComponent().props.getOption("slideDeck", "timeLimit")).toBe(300);
      });

      it("checks traitify ui", () => {
        traitify.ui.options.slideDeck = {timeLimit: 300};
        component = new ComponentHandler(<Component traitify={traitify} />);

        expect(getDummyComponent().props.getOption("slideDeck", "timeLimit")).toBe(300);
      });

      it("gives up", () => {
        component = new ComponentHandler(<Component traitify={traitify} />);

        expect(getDummyComponent().props.getOption("slideDeck", "timeLimit")).toBeUndefined();
      });
    });

    it("checks prop", () => {
      component = new ComponentHandler(<Component allowBack={true} traitify={traitify} />);

      expect(getDummyComponent().props.getOption("allowBack")).toBe(true);
    });

    it("prioritizes prop", () => {
      component = new ComponentHandler(
        <Component allowBack={true} options={{allowBack: false}} traitify={traitify} />
      );

      expect(getDummyComponent().props.getOption("allowBack")).toBe(true);
    });

    it("checks options", () => {
      component = new ComponentHandler(
        <Component options={{allowBack: false}} traitify={traitify} />
      );

      expect(getDummyComponent().props.getOption("allowBack")).toBe(false);
    });

    it("prioritizes options", () => {
      traitify.ui.options.allowBack = true;
      component = new ComponentHandler(
        <Component options={{allowBack: false}} traitify={traitify} />
      );

      expect(getDummyComponent().props.getOption("allowBack")).toBe(false);
    });

    it("checks traitify ui", () => {
      traitify.ui.options.allowBack = true;
      component = new ComponentHandler(<Component traitify={traitify} />);

      expect(getDummyComponent().props.getOption("allowBack")).toBe(true);
    });

    it("gives up", () => {
      component = new ComponentHandler(<Component traitify={traitify} />);

      expect(getDummyComponent().props.getOption("allowBack")).toBeUndefined();
    });
  });

  describe("i18n", () => {
    it("passes locale through ui", () => {
      component = new ComponentHandler(<Component traitify={traitify} />);

      expect(getDummyComponent().props.locale).toBe(traitify.ui.options.locale);
    });

    it("changes locale", () => {
      component = new ComponentHandler(<Component locale="es-us" traitify={traitify} />);

      expect(traitify.ui.options.locale).toBe("es-us");
    });

    it("follows locale change", () => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      traitify.ui.setLocale("es-us");

      expect(component.state.locale).toBe("es-us");
    });
  });

  describe("isReady", () => {
    describe("cognitive", () => {
      beforeEach(() => {
        component = new ComponentHandler(<Component surveyType="cognitive" traitify={traitify} />);
      });

      describe("is ready", () => {
        beforeEach(() => {
          component.updateState({assessment: {completed: true, id: "abc", questions: [{}]}});
        });

        it("checks questions", () => {
          expect(getDummyComponent().props.isReady("questions")).toBe(true);
        });

        it("checks results", () => {
          expect(getDummyComponent().props.isReady("results")).toBe(true);
        });
      });

      describe("half ready", () => {
        beforeEach(() => {
          component.updateState({assessment: {completed: false, id: "abc"}});
        });

        it("checks questions", () => {
          expect(getDummyComponent().props.isReady("questions")).toBe(false);
        });

        it("checks results", () => {
          expect(getDummyComponent().props.isReady("results")).toBe(false);
        });
      });

      describe("isn't ready", () => {
        beforeEach(() => {
          component = new ComponentHandler(<Component surveyType="cognitive" traitify={traitify} />);
        });

        it("checks questions", () => {
          expect(getDummyComponent().props.isReady("questions")).toBe(false);
        });

        it("checks results", () => {
          expect(getDummyComponent().props.isReady("results")).toBe(false);
        });

        it("checks default", () => {
          expect(getDummyComponent().props.isReady()).toBe(false);
        });
      });
    });

    describe("personality", () => {
      beforeEach(() => {
        component = new ComponentHandler(<Component traitify={traitify} />);
      });

      describe("is ready", () => {
        beforeEach(() => {
          component.updateState({
            assessment: {id: "abc", personality_types: [{name: "Openness"}], slides: [{}]},
            benchmark: {name: "Developer", range_types: [{id: "xyz"}]},
            deck: {id: "big-five", name: "Big Five"},
            guide: {competencies: [{}]}
          });
        });

        it("checks benchmark", () => {
          expect(getDummyComponent().props.isReady("benchmark")).toBe(true);
        });

        it("checks deck", () => {
          expect(getDummyComponent().props.isReady("deck")).toBe(true);
        });

        it("checks guide", () => {
          expect(getDummyComponent().props.isReady("guide")).toBe(true);
        });

        it("checks results", () => {
          expect(getDummyComponent().props.isReady("results")).toBe(true);
        });

        it("checks slides", () => {
          expect(getDummyComponent().props.isReady("slides")).toBe(true);
        });
      });

      describe("half ready", () => {
        beforeEach(() => {
          component.updateState({
            assessment: {id: "abc"},
            benchmark: {name: "Developer"},
            deck: {id: "big-five"},
            guide: {assessment_id: "abc"}
          });
        });

        it("checks benchmark", () => {
          expect(getDummyComponent().props.isReady("benchmark")).toBe(false);
        });

        it("checks deck", () => {
          expect(getDummyComponent().props.isReady("deck")).toBe(false);
        });

        it("checks guide", () => {
          expect(getDummyComponent().props.isReady("guide")).toBe(false);
        });

        it("checks results", () => {
          expect(getDummyComponent().props.isReady("results")).toBe(false);
        });

        it("checks slides", () => {
          expect(getDummyComponent().props.isReady("slides")).toBe(false);
        });
      });

      describe("isn't ready", () => {
        beforeEach(() => {
          component = new ComponentHandler(<Component traitify={traitify} />);
        });

        it("checks benchmark", () => {
          expect(getDummyComponent().props.isReady("benchmark")).toBe(false);
        });

        it("checks deck", () => {
          expect(getDummyComponent().props.isReady("deck")).toBe(false);
        });

        it("checks guide", () => {
          expect(getDummyComponent().props.isReady("guide")).toBe(false);
        });

        it("checks results", () => {
          expect(getDummyComponent().props.isReady("results")).toBe(false);
        });

        it("checks slides", () => {
          expect(getDummyComponent().props.isReady("slides")).toBe(false);
        });

        it("checks default", () => {
          expect(getDummyComponent().props.isReady()).toBe(false);
        });
      });
    });
  });

  describe("removeListener", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
    });

    it("creates listeners object", () => {
      const callback = () => {};
      const key = "taco";
      delete component.instance.listeners;
      component.instance.addListener(key, callback);

      expect(component.instance.listeners).toBeInstanceOf(Object);
      expect(component.instance.listeners).toMatchObject({[key]: callback});
    });

    it("removes listener", () => {
      component.instance.listeners = {taco: () => {}};
      component.instance.removeListener("taco");

      expect(component.instance.listeners).toBeInstanceOf(Object);
      expect(component.instance.listeners.taco).toBeUndefined();
    });

    it("leaves other listeners", () => {
      const callback = () => {};
      component.instance.listeners = {
        taco: () => {},
        otherTaco: callback
      };
      component.instance.removeListener("taco");

      expect(component.instance.listeners.taco).toBeUndefined();
      expect(component.instance.listeners.otherTaco).toBe(callback);
    });
  });

  describe("setAssessmentID", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.getAssessment = jest.fn().mockName("getAssessment");
    });

    it("checks assessment prop", () => {
      component.updateProps({assessment});
      component.instance.setAssessmentID();

      expect(component.state.assessmentID).toBe(assessment.id);
    });

    it("checks assessmentID prop", () => {
      component.updateProps({assessmentID: assessment.id});
      component.instance.setAssessmentID();

      expect(component.state.assessmentID).toBe(assessment.id);
    });

    it("gives up", () => {
      component.instance.setAssessmentID();

      expect(component.state.assessmentID).toBeNull();
    });
  });

  describe("setBenchmarkID", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.getBenchmark = jest.fn().mockName("getBenchmark");
    });

    it("checks benchmarkID prop", () => {
      component.updateProps({benchmarkID: benchmark.id});
      component.instance.setBenchmarkID();

      expect(component.state.benchmarkID).toBe(benchmark.id);
    });

    it("gives up", () => {
      component.instance.setBenchmarkID();

      expect(component.state.benchmarkID).toBeNull();
    });
  });

  describe("setElement", () => {
    let element;

    beforeEach(() => {
      element = document.createElement("div");
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.updateColorScheme = jest.fn().mockName("updateColorScheme");
    });

    it("calls element related methods", () => {
      component.act(() => { component.instance.setElement(element); });
      expect(component.instance.updateColorScheme).toHaveBeenCalledTimes(1);
    });

    it("sets element", () => {
      component.act(() => { component.instance.setElement(element); });
      expect(component.state.element).toBe(element);
    });
  });

  describe("theme", () => {
    describe("with theme component", () => {
      beforeEach(() => {
        Component = withTraitify(DummyComponent, {paradox: OtherComponent});
      });

      it("renders default component", () => {
        component = new ComponentHandler(<Component traitify={traitify} />);

        expect(component.child.type).toBe(DummyComponent);
      });

      it("renders theme component", () => {
        component = new ComponentHandler(<Component theme="paradox" traitify={traitify} />);

        expect(component.child.type).toBe(OtherComponent);
      });
    });

    describe("without theme component", () => {
      beforeEach(() => {
        Component = withTraitify(DummyComponent);
      });

      it("renders default component", () => {
        component = new ComponentHandler(<Component traitify={traitify} />);

        expect(component.child.type).toBe(DummyComponent);
      });

      it("renders fallback component", () => {
        component = new ComponentHandler(<Component theme="paradox" traitify={traitify} />);

        expect(component.child.type).toBe(DummyComponent);
      });
    });
  });

  describe("traitify", () => {
    let originalError;

    beforeEach(() => {
      // Required to hide console.error from React
      originalError = console.error;
      console.error = jest.fn().mockName("error");
    });

    afterEach(() => {
      delete window.Traitify;

      console.error = originalError;
    });

    it("passes through prop", () => {
      component = new ComponentHandler(<Component traitify={traitify} />);

      expect(getDummyComponent().props.traitify).toBe(traitify);
    });

    it("passes through ui", () => {
      component = new ComponentHandler(<Component ui={traitify.ui} />);

      expect(getDummyComponent().props.traitify).toBe(traitify);
    });

    it("passes through window", () => {
      window.Traitify = traitify;
      component = new ComponentHandler(<Component />);

      expect(getDummyComponent().props.traitify).toBe(window.Traitify);
    });

    it("errors without traitify", () => {
      const renderComponent = () => { new ComponentHandler(<Component />); };

      expect(renderComponent).toThrow("Traitify must be passed as a prop or attached to window");
    });
  });

  describe("updateAssessment", () => {
    beforeEach(() => {
      assessment = assessmentWithoutResults;
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.componentDidUpdate = jest.fn().mockName("componentDidUpdate");
      component.instance.getAssessment = jest.fn().mockName("getAssessment");
    });

    it("removes old listener if assessment changes", () => {
      const key = `en-us.assessment.${assessment.id}`;
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateAssessment({oldID: assessment.id});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("removes old listener if locale changes", () => {
      const key = `es-us.assessment.${assessment.id}`;
      component.updateState({assessmentID: assessment.id});
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateAssessment({oldLocale: "es-us"});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("adds new listener", () => {
      component.updateState({assessmentID: assessment.id});
      component.instance.addListener = jest.fn().mockName("addListener");
      component.instance.updateAssessment();

      expect(component.instance.addListener).toHaveBeenCalled();
    });

    it("gets assessment if no current value", () => {
      component.updateState({assessmentID: assessment.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateAssessment();

      expect(component.instance.getAssessment).toHaveBeenCalled();
      expect(component.instance.setState).not.toHaveBeenCalled();
    });

    it("uses current value", () => {
      const key = `en-us.assessment.${assessment.id}`;
      traitify.ui.current[key] = assessment;
      component.updateState({assessmentID: assessment.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateAssessment();

      expect(component.instance.setState).toHaveBeenCalled();
      expect(component.instance.getAssessment).not.toHaveBeenCalled();
    });
  });

  describe("updateBenchmark", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.componentDidUpdate = jest.fn().mockName("componentDidUpdate");
      component.instance.getBenchmark = jest.fn().mockName("getBenchmark");
    });

    it("removes old listener if benchmark changes", () => {
      const key = `en-us.benchmark.${benchmark.id}`;
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateBenchmark({oldID: benchmark.id});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("removes old listener if locale changes", () => {
      const key = `es-us.benchmark.${benchmark.id}`;
      component.updateState({benchmarkID: benchmark.id});
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateBenchmark({oldLocale: "es-us"});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("adds new listener", () => {
      component.updateState({benchmarkID: benchmark.id});
      component.instance.addListener = jest.fn().mockName("addListener");
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateBenchmark();

      expect(component.instance.removeListener).not.toHaveBeenCalled();
      expect(component.instance.addListener).toHaveBeenCalled();
    });

    it("gets benchmark if no current value", () => {
      component.updateState({benchmarkID: benchmark.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateBenchmark();

      expect(component.instance.getBenchmark).toHaveBeenCalled();
      expect(component.instance.setState).not.toHaveBeenCalled();
    });

    it("uses current value", () => {
      const key = `en-us.benchmark.${benchmark.id}`;
      traitify.ui.current[key] = benchmark;
      component.updateState({benchmarkID: benchmark.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateBenchmark();

      expect(component.instance.setState).toHaveBeenCalled();
      expect(component.instance.getBenchmark).not.toHaveBeenCalled();
    });
  });

  describe("updateCognitiveAssessment", () => {
    beforeEach(() => {
      assessment = cognitiveAssessment;
      component = new ComponentHandler(<Component surveyType="cognitive" traitify={traitify} />);
      component.instance.componentDidUpdate = jest.fn().mockName("componentDidUpdate");
      component.instance.getCognitiveAssessment = jest.fn().mockName("getCognitiveAssessment");
    });

    it("removes old listener if assessment changes", () => {
      const key = `en-us.cognitive-assessment.${assessment.id}`;
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateCognitiveAssessment({oldID: assessment.id});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("removes old listener if locale changes", () => {
      const key = `es-us.cognitive-assessment.${assessment.id}`;
      component.updateState({assessmentID: assessment.id});
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateCognitiveAssessment({oldLocale: "es-us"});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("adds new listener", () => {
      component.updateState({assessmentID: assessment.id});
      component.instance.addListener = jest.fn().mockName("addListener");
      component.instance.updateCognitiveAssessment();

      expect(component.instance.addListener).toHaveBeenCalled();
    });

    it("gets assessment if no current value", () => {
      component.updateState({assessmentID: assessment.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateCognitiveAssessment();

      expect(component.instance.getCognitiveAssessment).toHaveBeenCalled();
      expect(component.instance.setState).not.toHaveBeenCalled();
    });

    it("uses current value", () => {
      const key = `en-us.cognitive-assessment.${assessment.id}`;
      traitify.ui.current[key] = assessment;
      component.updateState({assessmentID: assessment.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateCognitiveAssessment();

      expect(component.instance.setState).toHaveBeenCalled();
      expect(component.instance.getCognitiveAssessment).not.toHaveBeenCalled();
    });
  });

  describe("updateColorScheme", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.setElement(document.createElement("div"));
      component.instance.getOption = jest.fn().mockName("getOption");
    });

    it("adds initial class", () => {
      component.instance.getOption.mockReturnValue("auto");
      component.instance.updateColorScheme();

      expect(component.state.element.classList).toContain("traitify--color-scheme-auto");
      expect(component.state.element.classList).not.toContain("traitify--color-scheme-dark");
      expect(component.state.element.classList).not.toContain("traitify--color-scheme-light");
    });

    it("defaults to light", () => {
      component.instance.updateColorScheme();

      expect(component.state.element.classList).not.toContain("traitify--color-scheme-auto");
      expect(component.state.element.classList).not.toContain("traitify--color-scheme-dark");
      expect(component.state.element.classList).toContain("traitify--color-scheme-light");
    });

    it("keeps current value", () => {
      component.instance.getOption.mockReturnValue("auto");
      component.instance.updateColorScheme();
      component.instance.updateColorScheme();

      expect(component.state.element.classList).toContain("traitify--color-scheme-auto");
      expect(component.state.element.classList).not.toContain("traitify--color-scheme-dark");
      expect(component.state.element.classList).not.toContain("traitify--color-scheme-light");
    });

    it("removes previous value", () => {
      component.instance.getOption.mockReturnValue("auto");
      component.instance.updateColorScheme();
      component.instance.getOption.mockReturnValue("dark");
      component.instance.updateColorScheme();

      expect(component.state.element.classList).not.toContain("traitify--color-scheme-auto");
      expect(component.state.element.classList).toContain("traitify--color-scheme-dark");
      expect(component.state.element.classList).not.toContain("traitify--color-scheme-light");
    });

    it("skips if no element", () => {
      component.instance.setElement(null);
      component.instance.getOption.mockClear();
      component.instance.updateColorScheme();

      expect(component.instance.getOption).not.toHaveBeenCalled();
    });
  });

  describe("updateDeck", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.componentDidUpdate = jest.fn().mockName("componentDidUpdate");
      component.instance.getDeck = jest.fn().mockName("getDeck");
    });

    it("removes old listener if deck changes", () => {
      const key = `en-us.deck.${deck.id}`;
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateDeck({oldID: deck.id});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("removes old listener if locale changes", () => {
      const key = `es-us.deck.${deck.id}`;
      component.updateState({deckID: deck.id});
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateDeck({oldLocale: "es-us"});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("adds new listener", () => {
      component.updateState({deckID: deck.id});
      component.instance.addListener = jest.fn().mockName("addListener");
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateDeck();

      expect(component.instance.removeListener).not.toHaveBeenCalled();
      expect(component.instance.addListener).toHaveBeenCalled();
    });

    it("gets deck if no current value", () => {
      component.updateState({deckID: deck.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateDeck();

      expect(component.instance.getDeck).toHaveBeenCalled();
      expect(component.instance.setState).not.toHaveBeenCalled();
    });

    it("uses current value", () => {
      const key = `en-us.deck.${deck.id}`;
      traitify.ui.current[key] = deck;
      component.updateState({deckID: deck.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateDeck();

      expect(component.instance.setState).toHaveBeenCalled();
      expect(component.instance.getDeck).not.toHaveBeenCalled();
    });
  });

  describe("updateGuide", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.componentDidUpdate = jest.fn().mockName("componentDidUpdate");
      component.instance.getGuide = jest.fn().mockName("getGuide");
    });

    it("removes old listener if guide changes", () => {
      const key = `en-us.guide.${assessment.id}`;
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateGuide({oldID: assessment.id});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("removes old listener if locale changes", () => {
      const key = `es-us.guide.${assessment.id}`;
      component.updateState({assessment});
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateGuide({oldLocale: "es-us"});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("adds new listener", () => {
      component.updateState({assessment});
      component.instance.addListener = jest.fn().mockName("addListener");
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateGuide();

      expect(component.instance.removeListener).not.toHaveBeenCalled();
      expect(component.instance.addListener).toHaveBeenCalled();
    });

    it("gets guide if no current value", () => {
      component.updateState({assessment});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateGuide();

      expect(component.instance.getGuide).toHaveBeenCalled();
      expect(component.instance.setState).not.toHaveBeenCalled();
    });

    it("uses current value", () => {
      const key = `en-us.guide.${assessment.id}`;
      traitify.ui.current[key] = guide;
      component.updateState({assessment});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateGuide();

      expect(component.instance.setState).toHaveBeenCalled();
      expect(component.instance.getGuide).not.toHaveBeenCalled();
    });

    it("doesn't get guide if no assessment ID", () => {
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateGuide();

      expect(component.instance.getGuide).not.toHaveBeenCalled();
      expect(component.instance.setState).not.toHaveBeenCalled();
    });

    it("doesn't get guide if wrong assessment type", () => {
      component.updateState({assessment: {...assessment, assessment_type: "TYPE_BASED"}});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateGuide();

      expect(component.instance.getGuide).not.toHaveBeenCalled();
      expect(component.instance.setState).not.toHaveBeenCalled();
    });
  });
});
