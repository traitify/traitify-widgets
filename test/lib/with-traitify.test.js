import Airbrake from "airbrake-js";
import {render} from "preact";
import withTraitify from "lib/with-traitify";
import {createElement, domHooks} from "support/dom";
import DummyComponent from "support/dummy-component";
import Traitify from "support/traitify";

jest.mock("airbrake-js");
jest.mock("lib/helpers", ()=>({
  getDisplayName: jest.fn((component)=>(component.name)).mockName("getDisplayName"),
  loadFont: jest.fn().mockName("loadFont")
}));

let renderResult;
const getParentComponent = ()=>(renderResult._component);
const getComponent = ()=>(getParentComponent()._component);
const updateComponent = (options)=>{
  const component = getParentComponent();
  const prevProps = {...component.props};
  const prevState = {...component.state};
  component.props = {...component.props, ...options.props};
  component.state = {...component.state, ...options.state};
  component.componentDidUpdate(prevProps, prevState);
};

describe("withTraitify", ()=>{
  const assessment = {id: "abc", locale_key: "en-US", personality_types: [{name: "Openness"}]};
  const assessmentWithoutResults = {id: "abc", locale_key: "en-US", slides: [{name: "Snakes"}]};
  const deck = {id: "big-five", locale_key: "en-US", name: "Big Five"};
  const deckWithoutName = {id: "big-five", locale_key: "en-US"};
  let Component, traitify;

  domHooks();

  beforeEach(()=>{
    Airbrake.mockClear();

    Component = withTraitify(DummyComponent);
    traitify = new Traitify();
  });

  describe("addListener", ()=>{
    beforeEach(()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());
    });

    it("creates listeners object", ()=>{
      const callback = ()=>{};
      const key = "taco";
      const parentComponent = getParentComponent();
      delete parentComponent.listeners;
      parentComponent.addListener(key, callback);

      expect(parentComponent.listeners).toBeInstanceOf(Object);
      expect(parentComponent.listeners).toMatchObject({[key]: callback});
    });

    it("adds to listeners object", ()=>{
      const callback = ()=>{};
      const key = "taco";
      const otherCallback = ()=>{};
      const otherKey = "other taco";
      const parentComponent = getParentComponent();
      delete parentComponent.listeners;
      parentComponent.addListener(key, callback);
      parentComponent.addListener(otherKey, otherCallback);

      expect(parentComponent.listeners).toBeInstanceOf(Object);
      expect(parentComponent.listeners).toMatchObject({[key]: callback, [otherKey]: otherCallback});
    });
  });

  describe("componentWillUnmount", ()=>{
    beforeEach(()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());
    });

    it("unfollows listeners", ()=>{
      const parentComponent = getParentComponent();
      parentComponent.removeListener = jest.fn().mockName("removeListener");
      parentComponent.componentWillUnmount();

      expect(parentComponent.removeListener).toHaveBeenCalledWith("I18n.setLocale");
    });
  });

  describe("displayName", ()=>{
    it("returns correct name", ()=>{
      expect(Component.displayName).toBe("TraitifyDummyComponent");
    });
  });

  describe("airbrake", ()=>{
    it("gets disabled", ()=>{
      renderResult = render(<Component disableAirbrake={true} traitify={traitify} />, createElement());

      expect(getComponent().props.airbrake).toBeUndefined();
    });

    it("passes prop", ()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());

      expect(getComponent().props.airbrake).toBeInstanceOf(Airbrake);
    });

    it("passes through prop", ()=>{
      const airbrake = new Airbrake();
      renderResult = render(<Component airbrake={airbrake} traitify={traitify} />, createElement());

      expect(Airbrake.mock.instances).toHaveLength(1);
    });

    it("catches errors", ()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());
      renderResult._component.componentDidCatch();

      expect(getComponent().props.airbrake.notify).toHaveBeenCalled();
    });

    describe("filters errors", ()=>{
      let filter, originalLocation;

      beforeAll(()=>{
        originalLocation = window.location;
        Object.defineProperty(window, "location", {writable: true, value: {}});
      });

      beforeEach(()=>{
        renderResult = render(<Component traitify={traitify} />, createElement());
        filter = getComponent().props.airbrake.addFilter.mock.calls[0][0];
      });

      afterAll(()=>{
        Object.defineProperty(window, "location", {writable: false, value: originalLocation});
      });

      it("adds environment for development", ()=>{
        window.location.host = "app.lvh.me:3000";
        const result = filter({context: {}});

        expect(result.context.environment).toBe("development");
      });

      it("adds environment for staging", ()=>{
        window.location.host = "app.stag.traitify.com";
        const result = filter({context: {}});

        expect(result.context.environment).toBe("staging");
      });

      it("adds environment for production", ()=>{
        window.location.host = "app.traitify.com";
        const result = filter({context: {}});

        expect(result.context.environment).toBe("production");
      });

      it("adds environment for client", ()=>{
        window.location.host = "www.tomify.me";
        const result = filter({context: {}});

        expect(result.context.environment).toBe("client");
      });
    });
  });

  describe("cache", ()=>{
    let originalSessionStorage;

    beforeEach(()=>{
      originalSessionStorage = global.sessionStorage;
      global.sessionStorage = {
        getItem: jest.fn().mockName("getItem"),
        setItem: jest.fn().mockName("setItem")
      };
    });

    afterEach(()=>{
      global.sessionStorage = originalSessionStorage;
    });

    it("passes prop", ()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());

      expect(getComponent().props.cache).toBeDefined();
    });

    it("passes through prop", ()=>{
      const cache = {get: ()=>{}, set: ()=>{}};
      renderResult = render(<Component cache={cache} traitify={traitify} />, createElement());

      expect(getComponent().props.cache).toBe(cache);
    });

    describe("get", ()=>{
      it("calls getItem", ()=>{
        renderResult = render(<Component traitify={traitify} />, createElement());
        getComponent().props.cache.get("abc");

        expect(sessionStorage.getItem).toHaveBeenCalledWith("abc");
      });

      it("returns json", ()=>{
        global.sessionStorage.getItem = jest.fn(()=>("{\"id\": \"xyz\"}"));
        renderResult = render(<Component traitify={traitify} />, createElement());
        const result = getComponent().props.cache.get("abc");

        expect(result).toEqual({id: "xyz"});
      });

      it("returns nothing", ()=>{
        renderResult = render(<Component traitify={traitify} />, createElement());
        const result = getComponent().props.cache.get("abc");

        expect(result).toBeUndefined();
      });

      it("catches error", ()=>{
        global.sessionStorage.getItem = jest.fn(()=>{ throw new SyntaxError(); });
        renderResult = render(<Component traitify={traitify} />, createElement());
        const result = getComponent().props.cache.get("abc");

        expect(result).toBeUndefined();
      });
    });

    describe("set", ()=>{
      it("calls setItem with json", ()=>{
        renderResult = render(<Component traitify={traitify} />, createElement());
        getComponent().props.cache.set("abc", {id: "xyz"});

        expect(sessionStorage.setItem).toHaveBeenCalledWith("abc", "{\"id\":\"xyz\"}");
      });

      it("catches error", ()=>{
        global.sessionStorage.setItem = jest.fn(()=>{ throw new SyntaxError(); });
        renderResult = render(<Component traitify={traitify} />, createElement());
        const result = getComponent().props.cache.set("abc", {id: "xyz"});

        expect(result).toBeUndefined();
      });
    });
  });

  describe("followDeck", ()=>{
    const getDeck = jest.fn().mockName("getDeck");

    beforeEach(()=>{
      getDeck.mockClear();
      renderResult = render(<Component traitify={traitify} />, createElement());
      renderResult._component.updateDeck = function(){
        if(!this.state.deckID){ return; }

        getDeck();
      };
    });

    it("gets deck when state gets deckID", ()=>{
      getComponent().props.followDeck();
      updateComponent({state: {deck, deckID: deck.id}});

      expect(getDeck).toHaveBeenCalled();
    });

    it("gets deck if state has deckID", ()=>{
      updateComponent({state: {deck, deckID: deck.id}});
      getComponent().props.followDeck();

      expect(getDeck).toHaveBeenCalled();
    });

    it("doesn't get deck if state doesn't have deckID", ()=>{
      getComponent().props.followDeck();

      expect(getDeck).not.toHaveBeenCalled();
    });
  });

  describe("getAssessment", ()=>{
    let cache, originalWarn;

    beforeEach(()=>{
      originalWarn = console.warn;
      console.warn = jest.fn().mockName("warn");
      cache = {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      };
      renderResult = render(<Component cache={cache} traitify={traitify} />, createElement());
      renderResult._component.updateAssessment = function(){
        if(!this.state.assessmentID){ return; }

        const key = `${this.state.locale}.assessment.${this.state.assessmentID}`;

        this.listeners[key] = (_, assessment)=>{
          this.setState({assessment, assessmentID: assessment.id, deck: null, deckID: assessment.deck_id});
        };
        this.traitify.ui.on(key, this.listeners[key]);
      };
    });

    afterEach(()=>{
      console.warn = originalWarn;
    });

    it("requires assessmentID", (done)=>{
      getComponent().props.getAssessment().then(()=>{
        const props = getComponent().props;

        expect(props.assessment).toBeUndefined();
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("checks props", (done)=>{
      updateComponent({props: {assessment}});
      getComponent().props.getAssessment().then(()=>{
        const props = getComponent().props;

        expect(props.assessment).toBe(assessment);
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("skips props if no results", (done)=>{
      updateComponent({props: {assessment: assessmentWithoutResults}});
      getComponent().props.getAssessment().then(()=>{
        expect(getComponent().props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("checks cache", (done)=>{
      cache.get.mockReturnValue(assessment);
      updateComponent({props: {assessmentID: assessment.id}});
      getComponent().props.getAssessment().then(()=>{
        const props = getComponent().props;

        expect(props.assessment).toBe(assessment);
        expect(props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("skips cache if no results", (done)=>{
      cache.get.mockReturnValue(assessmentWithoutResults);
      updateComponent({props: {assessmentID: assessmentWithoutResults.id}});
      getComponent().props.getAssessment().then(()=>{
        expect(getComponent().props.assessment).not.toBe(assessmentWithoutResults);
        done();
      });
    });

    it("sets cache if results", (done)=>{
      traitify.ajax.mockReturnValue(Promise.resolve(assessment));
      updateComponent({props: {assessmentID: assessment.id}});
      getComponent().props.getAssessment().then(()=>{
        expect(getComponent().props.cache.set).toHaveBeenCalled();
        done();
      });
    });

    it("stops if there's an existing request", ()=>{
      const key = `en-us.assessment.${assessmentWithoutResults.id}`;
      const request = new Promise(()=>{});
      traitify.ui.requests[key] = request;
      updateComponent({props: {assessmentID: assessmentWithoutResults.id}});
      getComponent().props.getAssessment();

      expect(traitify.ui.requests[key]).toBe(request);
    });

    it("forces new request", ()=>{
      const key = `en-us.assessment.${assessmentWithoutResults.id}`;
      const request = new Promise(()=>{});
      traitify.ui.requests[key] = request;
      updateComponent({props: {assessmentID: assessmentWithoutResults.id}});
      getComponent().props.getAssessment({force: true});

      expect(traitify.ui.requests[key]).not.toBe(request);
    });

    it("catches error with request", (done)=>{
      const key = `en-us.assessment.${assessmentWithoutResults.id}`;
      traitify.ajax.mockReturnValue(Promise.reject("Error with request"));
      updateComponent({props: {assessmentID: assessmentWithoutResults.id}});
      getComponent().props.getAssessment().then(()=>{
        expect(console.warn).toHaveBeenCalledWith("Error with request");
        expect(traitify.ui.requests[key]).toBeUndefined();
        done();
      });
    });
  });

  describe("getDeck", ()=>{
    let cache, originalWarn;

    beforeEach(()=>{
      originalWarn = console.warn;
      console.warn = jest.fn().mockName("warn");
      cache = {
        get: jest.fn().mockName("get"),
        set: jest.fn().mockName("set")
      };
      renderResult = render(<Component cache={cache} traitify={traitify} />, createElement());
    });

    afterEach(()=>{
      console.warn = originalWarn;
    });

    it("requires deckID", (done)=>{
      getParentComponent().getDeck().then(()=>{
        const props = getComponent().props;

        expect(props.deck).toBeUndefined();
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("checks state", (done)=>{
      updateComponent({state: {deck, deckID: deck.id}});
      getParentComponent().getDeck().then(()=>{
        const props = getComponent().props;

        expect(props.deck).toBe(deck);
        expect(props.cache.get).not.toHaveBeenCalled();
        done();
      });
    });

    it("skips state if no name", (done)=>{
      updateComponent({state: {deck: deckWithoutName, deckID: deckWithoutName.id}});
      getParentComponent().getDeck().then(()=>{
        expect(getComponent().props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("checks cache", (done)=>{
      cache.get.mockReturnValue(deck);
      updateComponent({state: {deckID: deck.id}});
      getParentComponent().getDeck().then(()=>{
        const props = getComponent().props;

        expect(props.deck).toBe(deck);
        expect(props.cache.get).toHaveBeenCalled();
        done();
      });
    });

    it("skips cache if no name", (done)=>{
      cache.get.mockReturnValue(deckWithoutName);
      updateComponent({state: {deckID: deckWithoutName.id}});
      getParentComponent().getDeck().then(()=>{
        expect(getComponent().props.deck).not.toBe(deckWithoutName);
        done();
      });
    });

    it("sets cache if name", (done)=>{
      traitify.ajax.mockReturnValue(Promise.resolve(deck));
      updateComponent({state: {deckID: deck.id}});
      getParentComponent().getDeck().then(()=>{
        expect(getComponent().props.cache.set).toHaveBeenCalled();
        done();
      });
    });

    it("sets deck locale if missing", (done)=>{
      const deckWithoutLocale = {id: "big-five", name: "Big Five"};
      traitify.ajax.mockReturnValue(Promise.resolve(deckWithoutLocale));
      updateComponent({state: {deckID: deckWithoutLocale.id}});
      getParentComponent().getDeck().then(()=>{
        expect(getComponent().props.deck.locale_key).toBe(traitify.ui.i18n.locale);
        done();
      });
    });

    it("stops if there's an existing request", ()=>{
      const key = `en-us.deck.${deckWithoutName.id}`;
      const request = new Promise(()=>{});
      traitify.ui.requests[key] = request;
      updateComponent({state: {deckID: deckWithoutName.id}});
      getParentComponent().getDeck();

      expect(traitify.ui.requests[key]).toBe(request);
    });

    it("forces new request", ()=>{
      const key = `en-us.deck.${deckWithoutName.id}`;
      const request = new Promise(()=>{});
      traitify.ui.requests[key] = request;
      updateComponent({state: {deckID: deckWithoutName.id}});
      getParentComponent().getDeck({force: true});

      expect(traitify.ui.requests[key]).not.toBe(request);
    });

    it("catches error with request", (done)=>{
      const key = `en-us.deck.${deckWithoutName.id}`;
      traitify.ajax.mockReturnValue(Promise.reject("Error with request"));
      updateComponent({state: {deckID: deckWithoutName.id}});
      getParentComponent().getDeck().then(()=>{
        expect(console.warn).toHaveBeenCalledWith("Error with request");
        expect(traitify.ui.requests[key]).toBeUndefined();
        done();
      });
    });
  });

  describe("getOption", ()=>{
    it("checks prop", ()=>{
      renderResult = render(<Component allowBack={true} traitify={traitify} />, createElement());

      expect(getComponent().props.getOption("allowBack")).toBe(true);
    });

    it("prioritizes prop", ()=>{
      renderResult = render(<Component allowBack={true} options={{allowBack: false}} traitify={traitify} />, createElement());

      expect(getComponent().props.getOption("allowBack")).toBe(true);
    });

    it("checks options", ()=>{
      renderResult = render(<Component options={{allowBack: false}} traitify={traitify} />, createElement());

      expect(getComponent().props.getOption("allowBack")).toBe(false);
    });

    it("prioritizes options", ()=>{
      traitify.ui.options.allowBack = true;
      renderResult = render(<Component options={{allowBack: false}} traitify={traitify} />, createElement());

      expect(getComponent().props.getOption("allowBack")).toBe(false);
    });

    it("checks traitify ui", ()=>{
      traitify.ui.options.allowBack = true;
      renderResult = render(<Component traitify={traitify} />, createElement());

      expect(getComponent().props.getOption("allowBack")).toBe(true);
    });

    it("gives up", ()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());

      expect(getComponent().props.getOption("allowBack")).toBeUndefined();
    });
  });

  describe("i18n", ()=>{
    it("passes through traitify", ()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());

      expect(getComponent().props.i18n).toBe(traitify.ui.i18n);
    });

    it("changes locale", ()=>{
      traitify.ui.i18n.setLocale = jest.fn().mockName("setLocale");
      renderResult = render(<Component locale="es-us" traitify={traitify} />, createElement());

      expect(traitify.ui.i18n.setLocale).toHaveBeenCalledWith("es-us");
    });
  });

  describe("isReady", ()=>{
    beforeEach(()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());
    });

    describe("is ready", ()=>{
      beforeEach(()=>{
        updateComponent({
          state: {
            assessment: {id: "abc", personality_types: [{name: "Openness"}], slides: [{}]},
            deck: {id: "big-five", name: "Big Five"}
          }
        });
      });

      it("checks deck", ()=>{
        expect(getComponent().props.isReady("deck")).toBe(true);
      });

      it("checks results", ()=>{
        expect(getComponent().props.isReady("results")).toBe(true);
      });

      it("checks slides", ()=>{
        expect(getComponent().props.isReady("slides")).toBe(true);
      });
    });

    describe("half ready", ()=>{
      beforeEach(()=>{
        updateComponent({
          state: {
            assessment: {id: "abc"},
            deck: {id: "big-five"}
          }
        });
      });

      it("checks deck", ()=>{
        expect(getComponent().props.isReady("deck")).toBe(false);
      });

      it("checks results", ()=>{
        expect(getComponent().props.isReady("results")).toBe(false);
      });

      it("checks slides", ()=>{
        expect(getComponent().props.isReady("slides")).toBe(false);
      });
    });

    describe("isn't ready", ()=>{
      beforeEach(()=>{
        renderResult = render(<Component traitify={traitify} />, createElement());
      });

      it("checks deck", ()=>{
        expect(getComponent().props.isReady("deck")).toBe(false);
      });

      it("checks results", ()=>{
        expect(getComponent().props.isReady("results")).toBe(false);
      });

      it("checks slides", ()=>{
        expect(getComponent().props.isReady("slides")).toBe(false);
      });

      it("checks default", ()=>{
        expect(getComponent().props.isReady()).toBe(false);
      });
    });
  });

  describe("removeListener", ()=>{
    beforeEach(()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());
    });

    it("creates listeners object", ()=>{
      const callback = ()=>{};
      const key = "taco";
      delete getParentComponent().listeners;
      getParentComponent().addListener(key, callback);

      expect(getParentComponent().listeners).toBeInstanceOf(Object);
      expect(getParentComponent().listeners).toMatchObject({[key]: callback});
    });

    it("removes listener", ()=>{
      getParentComponent().listeners = {taco: ()=>{}};
      getParentComponent().removeListener("taco");

      expect(getParentComponent().listeners).toBeInstanceOf(Object);
      expect(getParentComponent().listeners.taco).toBeUndefined();
    });

    it("leaves other listeners", ()=>{
      const callback = ()=>{};
      getParentComponent().listeners = {
        taco: ()=>{},
        otherTaco: callback
      };
      getParentComponent().removeListener("taco");

      expect(getParentComponent().listeners.taco).toBeUndefined();
      expect(getParentComponent().listeners.otherTaco).toBe(callback);
    });
  });

  describe("setAssessmentID", ()=>{
    beforeEach(()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());
      renderResult._component.getAssessment = jest.fn().mockName("getAssessment");
    });

    it("checks assessment prop", ()=>{
      updateComponent({props: {assessment}});
      getParentComponent().setAssessmentID();
      getParentComponent().forceUpdate();
      const state = getParentComponent().state;

      expect(state.assessmentID).toBe(assessment.id);
    });

    it("checks assessmentID prop", ()=>{
      updateComponent({props: {assessmentID: assessment.id}});
      getParentComponent().setAssessmentID();
      getParentComponent().forceUpdate();
      const state = getParentComponent().state;

      expect(state.assessmentID).toBe(assessment.id);
    });

    it("gives up", ()=>{
      getParentComponent().setAssessmentID();
      getParentComponent().forceUpdate();
      const state = getParentComponent().state;

      expect(state.assessmentID).toBeUndefined();
    });
  });

  describe("traitify", ()=>{
    afterEach(()=>{
      delete window.Traitify;
    });

    it("passes through prop", ()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());

      expect(getComponent().props.traitify).toBe(traitify);
    });

    it("passes through window", ()=>{
      window.Traitify = traitify;
      renderResult = render(<Component />, createElement());

      expect(getComponent().props.traitify).toBe(window.Traitify);
    });

    it("errors without traitify", ()=>{
      const renderComponent = ()=>{ render(<Component />, createElement()); };

      expect(renderComponent).toThrow("Traitify must be passed as a prop or attached to window");
    });
  });

  describe("updateAssessment", ()=>{
    beforeEach(()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());
      renderResult._component.componentDidUpdate = jest.fn().mockName("componentDidUpdate");
      renderResult._component.getAssessment = jest.fn().mockName("getAssessment");
    });

    it("removes old listener if assessment changes", ()=>{
      const key = `en-us.assessment.${assessmentWithoutResults.id}`;
      const parentComponent = getParentComponent();
      parentComponent.removeListener = jest.fn().mockName("removeListener");
      parentComponent.updateAssessment({oldID: assessmentWithoutResults.id});

      expect(parentComponent.removeListener).toHaveBeenCalledWith(key);
    });

    it("removes old listener if locale changes", ()=>{
      const key = `es-us.assessment.${assessmentWithoutResults.id}`;
      const parentComponent = getParentComponent();
      updateComponent({state: {assessmentID: assessment.id}});
      parentComponent.removeListener = jest.fn().mockName("removeListener");
      parentComponent.updateAssessment({oldLocale: "es-us"});

      expect(parentComponent.removeListener).toHaveBeenCalledWith(key);
    });

    it("adds new listener", ()=>{
      const parentComponent = getParentComponent();
      updateComponent({state: {assessmentID: assessment.id}});
      parentComponent.addListener = jest.fn().mockName("addListener");
      parentComponent.updateAssessment();

      expect(parentComponent.addListener).toHaveBeenCalled();
    });

    it("gets assessment if no current value", ()=>{
      const parentComponent = getParentComponent();
      updateComponent({state: {assessmentID: assessment.id}});
      parentComponent.setState = jest.fn().mockName("setState");
      parentComponent.updateAssessment();

      expect(parentComponent.getAssessment).toHaveBeenCalled();
      expect(parentComponent.setState).not.toHaveBeenCalled();
    });

    it("uses current value", ()=>{
      const key = `en-us.assessment.${assessment.id}`;
      const parentComponent = getParentComponent();
      traitify.ui.current[key] = [{}, assessment];
      updateComponent({state: {assessmentID: assessment.id}});
      parentComponent.setState = jest.fn().mockName("setState");
      parentComponent.updateAssessment();

      expect(parentComponent.setState).toHaveBeenCalled();
      expect(parentComponent.getAssessment).not.toHaveBeenCalled();
    });
  });

  describe("updateDeck", ()=>{
    beforeEach(()=>{
      renderResult = render(<Component traitify={traitify} />, createElement());
      renderResult._component.componentDidUpdate = jest.fn().mockName("componentDidUpdate");
      renderResult._component.getDeck = jest.fn().mockName("getDeck");
    });

    it("removes old listener if deck changes", ()=>{
      const key = `en-us.deck.${deck.id}`;
      const parentComponent = getParentComponent();
      parentComponent.removeListener = jest.fn().mockName("removeListener");
      parentComponent.updateDeck({oldID: deck.id});

      expect(parentComponent.removeListener).toHaveBeenCalledWith(key);
    });

    it("removes old listener if locale changes", ()=>{
      const key = `es-us.deck.${deck.id}`;
      const parentComponent = getParentComponent();
      updateComponent({state: {deckID: deck.id}});
      parentComponent.removeListener = jest.fn().mockName("removeListener");
      parentComponent.updateDeck({oldLocale: "es-us"});

      expect(parentComponent.removeListener).toHaveBeenCalledWith(key);
    });

    it("adds new listener", ()=>{
      const parentComponent = getParentComponent();
      updateComponent({state: {deckID: deck.id}});
      parentComponent.addListener = jest.fn().mockName("addListener");
      parentComponent.removeListener = jest.fn().mockName("removeListener");
      parentComponent.updateDeck();

      expect(parentComponent.removeListener).not.toHaveBeenCalled();
      expect(parentComponent.addListener).toHaveBeenCalled();
    });

    it("gets deck if no current value", ()=>{
      const parentComponent = getParentComponent();
      updateComponent({state: {deckID: deck.id}});
      parentComponent.setState = jest.fn().mockName("setState");
      parentComponent.updateDeck();

      expect(parentComponent.getDeck).toHaveBeenCalled();
      expect(parentComponent.setState).not.toHaveBeenCalled();
    });

    it("uses current value", ()=>{
      const key = `en-us.deck.${deck.id}`;
      const parentComponent = getParentComponent();
      traitify.ui.current[key] = [{}, deck];
      updateComponent({state: {deckID: deck.id}});
      parentComponent.setState = jest.fn().mockName("setState");
      parentComponent.updateDeck();

      expect(parentComponent.setState).toHaveBeenCalled();
      expect(parentComponent.getDeck).not.toHaveBeenCalled();
    });
  });
});
