/* eslint no-console: "off" */
import Airbrake from "airbrake-js";
import withTraitify from "lib/with-traitify";
import ComponentHandler from "support/component-handler";
import DummyComponent from "support/dummy-component";
import Traitify from "support/traitify";

jest.mock("airbrake-js");
jest.mock("lib/helpers", () => ({
  getDisplayName: jest.fn((component) => component.name).mockName("getDisplayName"),
  loadFont: jest.fn().mockName("loadFont")
}));

let component;
const getDummyComponent = () => (
  component.renderer.root.findByType(DummyComponent).instance
);

describe("withTraitify", () => {
  const assessmentWithResults = {id: "abc", locale_key: "en-US", personality_types: [{name: "Openness"}]};
  const assessmentWithoutResults = {id: "abc", locale_key: "en-US", slides: [{name: "Snakes"}]};
  const deck = {id: "big-five", locale_key: "en-US", name: "Big Five"};
  const deckWithoutName = {id: "big-five", locale_key: "en-US"};
  let Component;
  let traitify;

  beforeEach(() => {
    Airbrake.mockClear();

    Component = withTraitify(DummyComponent);
    traitify = new Traitify();
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

  describe("airbrake", () => {
    it("gets disabled", () => {
      component = new ComponentHandler(<Component disableAirbrake={true} traitify={traitify} />);

      expect(getDummyComponent().props.airbrake).toBeUndefined();
    });

    it("passes prop", () => {
      component = new ComponentHandler(<Component traitify={traitify} />);

      expect(getDummyComponent().props.airbrake).toBeInstanceOf(Airbrake);
    });

    it("passes through prop", () => {
      const airbrake = new Airbrake();
      component = new ComponentHandler(<Component airbrake={airbrake} traitify={traitify} />);

      expect(Airbrake.mock.instances).toHaveLength(1);
    });

    it("catches errors", () => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.componentDidCatch();

      expect(getDummyComponent().props.airbrake.notify).toHaveBeenCalled();
    });

    describe("filters errors", () => {
      let filter;
      let originalLocation;

      beforeAll(() => {
        originalLocation = window.location;
        delete window.location;
        Object.defineProperty(window, "location", {writable: true, value: {}});
      });

      beforeEach(() => {
        component = new ComponentHandler(<Component traitify={traitify} />);
        filter = getDummyComponent().props.airbrake.addFilter.mock.calls[0][0];
      });

      afterAll(() => {
        Object.defineProperty(window, "location", {writable: false, value: originalLocation});
      });

      it("adds environment for development", () => {
        window.location.host = "app.lvh.me:3000";
        const result = filter({context: {}});

        expect(result.context.environment).toBe("development");
      });

      it("adds environment for staging", () => {
        window.location.host = "app.stag.traitify.com";
        const result = filter({context: {}});

        expect(result.context.environment).toBe("staging");
      });

      it("adds environment for production", () => {
        window.location.host = "app.traitify.com";
        const result = filter({context: {}});

        expect(result.context.environment).toBe("production");
      });

      it("adds environment for client", () => {
        window.location.host = "www.tomify.me";
        const result = filter({context: {}});

        expect(result.context.environment).toBe("client");
      });
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

    it("doesn't get deck if state doesn't have deckID", () => {
      getDummyComponent().props.followDeck();

      expect(getDeck).not.toHaveBeenCalled();
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

        this.listeners[key] = (_, assessment) => {
          this.setState({
            assessment,
            assessmentID: assessment.id,
            deck: null,
            deckID: assessment.deck_id
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
      component.updateProps({assessment: assessmentWithResults});
      getDummyComponent().props.getAssessment().then(() => {
        const {props} = getDummyComponent();

        expect(props.assessment).toBe(assessmentWithResults);
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("skips props if no results", (done) => {
      component.updateProps({assessment: assessmentWithoutResults});
      getDummyComponent().props.getAssessment().then(() => {
        expect(getDummyComponent().props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("checks cache", (done) => {
      cache.get.mockReturnValue(assessmentWithResults);
      component.updateProps({assessmentID: assessmentWithResults.id});
      getDummyComponent().props.getAssessment().then(() => {
        const {props} = getDummyComponent();

        expect(props.assessment).toBe(assessmentWithResults);
        expect(props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("skips cache if no results", (done) => {
      cache.get.mockReturnValue(assessmentWithoutResults);
      component.updateProps({assessmentID: assessmentWithoutResults.id});
      getDummyComponent().props.getAssessment().then(() => {
        expect(getDummyComponent().props.assessment).not.toBe(assessmentWithoutResults);
        done();
      });
    });

    it("sets cache if results", (done) => {
      traitify.ajax.mockReturnValue(Promise.resolve(assessmentWithResults));
      component.updateProps({assessmentID: assessmentWithResults.id});
      getDummyComponent().props.getAssessment().then(() => {
        expect(getDummyComponent().props.cache.set).toHaveBeenCalled();
        done();
      });
    });

    it("stops if there's an existing request", () => {
      const key = `en-us.assessment.${assessmentWithoutResults.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateProps({assessmentID: assessmentWithoutResults.id});
      getDummyComponent().props.getAssessment();

      expect(traitify.ui.requests[key]).toBe(request);
    });

    it("forces new request", () => {
      const key = `en-us.assessment.${assessmentWithoutResults.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateProps({assessmentID: assessmentWithoutResults.id});
      getDummyComponent().props.getAssessment({force: true});

      expect(traitify.ui.requests[key]).not.toBe(request);
    });

    it("catches error with request", (done) => {
      const key = `en-us.assessment.${assessmentWithoutResults.id}`;
      traitify.ajax.mockReturnValue(Promise.reject("Error with request"));
      component.updateProps({assessmentID: assessmentWithoutResults.id});
      getDummyComponent().props.getAssessment().then(() => {
        expect(console.warn).toHaveBeenCalledWith("Error with request");
        expect(traitify.ui.requests[key]).toBeUndefined();
        done();
      });
    });
  });

  describe("getDeck", () => {
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
      component.updateState({deck: deckWithoutName, deckID: deckWithoutName.id});
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
      cache.get.mockReturnValue(deckWithoutName);
      component.updateState({deckID: deckWithoutName.id});
      component.instance.getDeck().then(() => {
        expect(getDummyComponent().props.deck).not.toBe(deckWithoutName);
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
      const deckWithoutLocale = {id: "big-five", name: "Big Five"};
      traitify.ajax.mockReturnValue(Promise.resolve(deckWithoutLocale));
      component.updateState({deckID: deckWithoutLocale.id});
      component.instance.getDeck().then(() => {
        expect(getDummyComponent().props.deck.locale_key).toBe(traitify.ui.i18n.locale);
        done();
      });
    });

    it("stops if there's an existing request", () => {
      const key = `en-us.deck.${deckWithoutName.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateState({deckID: deckWithoutName.id});
      component.instance.getDeck();

      expect(traitify.ui.requests[key]).toBe(request);
    });

    it("forces new request", () => {
      const key = `en-us.deck.${deckWithoutName.id}`;
      const request = new Promise(() => {});
      traitify.ui.requests[key] = request;
      component.updateState({deckID: deckWithoutName.id});
      component.instance.getDeck({force: true});

      expect(traitify.ui.requests[key]).not.toBe(request);
    });

    it("catches error with request", (done) => {
      const key = `en-us.deck.${deckWithoutName.id}`;
      traitify.ajax.mockReturnValue(Promise.reject("Error with request"));
      component.updateState({deckID: deckWithoutName.id});
      component.instance.getDeck().then(() => {
        expect(console.warn).toHaveBeenCalledWith("Error with request");
        expect(traitify.ui.requests[key]).toBeUndefined();
        done();
      });
    });
  });

  describe("getOption", () => {
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
    it("passes locale and translate through traitify", () => {
      component = new ComponentHandler(<Component traitify={traitify} />);

      expect(getDummyComponent().props.locale).toBe(traitify.ui.i18n.locale);
      expect(getDummyComponent().props.translate).toBe(traitify.ui.i18n.translate);
    });

    it("changes locale", () => {
      component = new ComponentHandler(<Component locale="es-us" traitify={traitify} />);

      expect(traitify.ui.i18n.locale).toBe("es-us");
    });

    it("follows locale change", () => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      traitify.ui.setLocale("es-us");

      expect(component.state.locale).toBe("es-us");
    });
  });

  describe("isReady", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
    });

    describe("is ready", () => {
      beforeEach(() => {
        component.updateState({
          assessment: {id: "abc", personality_types: [{name: "Openness"}], slides: [{}]},
          deck: {id: "big-five", name: "Big Five"}
        });
      });

      it("checks deck", () => {
        expect(getDummyComponent().props.isReady("deck")).toBe(true);
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
          deck: {id: "big-five"}
        });
      });

      it("checks deck", () => {
        expect(getDummyComponent().props.isReady("deck")).toBe(false);
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

      it("checks deck", () => {
        expect(getDummyComponent().props.isReady("deck")).toBe(false);
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
      component.updateProps({assessment: assessmentWithResults});
      component.instance.setAssessmentID();

      expect(component.state.assessmentID).toBe(assessmentWithResults.id);
    });

    it("checks assessmentID prop", () => {
      component.updateProps({assessmentID: assessmentWithResults.id});
      component.instance.setAssessmentID();

      expect(component.state.assessmentID).toBe(assessmentWithResults.id);
    });

    it("gives up", () => {
      component.instance.setAssessmentID();

      expect(component.state.assessmentID).toBeNull();
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

    it("passes through window", () => {
      window.Traitify = traitify;
      component = new ComponentHandler(<Component traitify={traitify} />);

      expect(getDummyComponent().props.traitify).toBe(window.Traitify);
    });

    it("errors without traitify", () => {
      const renderComponent = () => { new ComponentHandler(<Component />); };

      expect(renderComponent).toThrow("Traitify must be passed as a prop or attached to window");
    });
  });

  describe("updateAssessment", () => {
    beforeEach(() => {
      component = new ComponentHandler(<Component traitify={traitify} />);
      component.instance.componentDidUpdate = jest.fn().mockName("componentDidUpdate");
      component.instance.getAssessment = jest.fn().mockName("getAssessment");
    });

    it("removes old listener if assessment changes", () => {
      const key = `en-us.assessment.${assessmentWithoutResults.id}`;
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateAssessment({oldID: assessmentWithoutResults.id});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("removes old listener if locale changes", () => {
      const key = `es-us.assessment.${assessmentWithoutResults.id}`;
      component.updateState({assessmentID: assessmentWithoutResults.id});
      component.instance.removeListener = jest.fn().mockName("removeListener");
      component.instance.updateAssessment({oldLocale: "es-us"});

      expect(component.instance.removeListener).toHaveBeenCalledWith(key);
    });

    it("adds new listener", () => {
      component.updateState({assessmentID: assessmentWithResults.id});
      component.instance.addListener = jest.fn().mockName("addListener");
      component.instance.updateAssessment();

      expect(component.instance.addListener).toHaveBeenCalled();
    });

    it("gets assessment if no current value", () => {
      component.updateState({assessmentID: assessmentWithResults.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateAssessment();

      expect(component.instance.getAssessment).toHaveBeenCalled();
      expect(component.instance.setState).not.toHaveBeenCalled();
    });

    it("uses current value", () => {
      const key = `en-us.assessment.${assessmentWithResults.id}`;
      traitify.ui.current[key] = [{}, assessmentWithResults];
      component.updateState({assessmentID: assessmentWithResults.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateAssessment();

      expect(component.instance.setState).toHaveBeenCalled();
      expect(component.instance.getAssessment).not.toHaveBeenCalled();
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
      traitify.ui.current[key] = [{}, deck];
      component.updateState({deckID: deck.id});
      component.instance.setState = jest.fn().mockName("setState");
      component.instance.updateDeck();

      expect(component.instance.setState).toHaveBeenCalled();
      expect(component.instance.getDeck).not.toHaveBeenCalled();
    });
  });
});
