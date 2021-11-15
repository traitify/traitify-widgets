import deprecations from "deprecations";
import Traitify from "lib/traitify";

describe("Deprecations", () => {
  let traitify;

  beforeEach(() => {
    traitify = new Traitify();
    deprecations(traitify);
    traitify.originalAjax = jest.fn().mockName("originalAjax");
  });

  describe("ajax", () => {
    it("passes the arguments", () => {
      const callback = () => {};
      const method = "post";
      const params = {deck_id: "career-deck"};
      const path = "/assessments";
      const promise = {then: jest.fn().mockName("then")};
      traitify.originalAjax.mockReturnValue(promise);
      traitify.ajax(method, path, callback, params);

      expect(traitify.originalAjax).toHaveBeenCalledWith(method, path, params);
      expect(promise.then).toHaveBeenCalledWith(callback);
    });

    it("returns the request", () => {
      traitify.originalAjax.mockReturnValue({then: () => "request"});
      const returnValue = traitify.ajax("post", "/assessments", () => {}, {});

      expect(returnValue).toBe("request");
    });
  });

  describe("request", () => {
    beforeEach(() => {
      traitify.ajax = jest.fn().mockName("ajax");
    });

    it("passes the arguments", () => {
      const method = "post";
      const params = {deck_id: "career-deck"};
      const path = "/assessments";
      traitify.request(method, path, params);

      expect(traitify.ajax).toHaveBeenCalledWith(method, path, null, params);
    });

    it("passes the image pack", () => {
      const method = "post";
      const params = {deck_id: "career-deck"};
      const path = "/assessments";
      traitify.ui.options.imagePack = "linear";
      traitify.request(method, path, params);

      expect(traitify.ajax).toHaveBeenCalledWith(method, `${path}?image_pack=linear`, null, params);
    });

    it("passes the image pack after query params", () => {
      const method = "post";
      const params = {deck_id: "career-deck"};
      const path = "/assessments?locale=en-us";
      traitify.ui.options.imagePack = "linear";
      traitify.request(method, path, params);

      expect(traitify.ajax).toHaveBeenCalledWith(method, `${path}&image_pack=linear`, null, params);
    });

    it("passes the image pack only once", () => {
      const method = "post";
      const params = {deck_id: "career-deck"};
      const path = "/assessments?locale=en-us&image_pack=linear";
      traitify.ui.options.imagePack = "linear";
      traitify.request(method, path, params);

      expect(traitify.ajax).toHaveBeenCalledWith(method, path, null, params);
    });

    it("returns the request", () => {
      traitify.ajax.mockReturnValue("request");
      const returnValue = traitify.request("post", "/assessments", {});

      expect(returnValue).toBe("request");
    });
  });

  describe("get", () => {
    beforeEach(() => {
      traitify.ajax = jest.fn().mockName("ajax");
    });

    it("passes the arguments", () => {
      const callback = () => {};
      const params = {deck_id: "career-deck"};
      const path = "/assessments";
      traitify.get(path, params, callback);

      expect(traitify.ajax).toHaveBeenCalledWith("GET", path, callback, params);
    });

    it("passes callback when params are blank", () => {
      const callback = () => {};
      const path = "/assessments";
      traitify.get(path, callback);

      expect(traitify.ajax).toHaveBeenCalledWith("GET", path, callback, null);
    });

    it("returns the request", () => {
      traitify.ajax.mockReturnValue("request");
      const returnValue = traitify.get("/assessments", {}, () => {});

      expect(returnValue).toBe("request");
    });
  });

  describe("put", () => {
    beforeEach(() => {
      traitify.request = jest.fn().mockName("request");
    });

    it("passes the arguments", () => {
      const params = {deck_id: "career-deck"};
      const path = "/assessments";
      traitify.oldIE = false;
      traitify.put(path, params);

      expect(traitify.request).toHaveBeenCalledWith("PUT", path, params);
    });

    it("uses a post request with old IE", () => {
      const params = {deck_id: "career-deck"};
      const path = "/assessments";
      traitify.oldIE = true;
      traitify.put(path, params);

      expect(traitify.request).toHaveBeenCalledWith("POST", path, params);
    });

    it("returns the request", () => {
      traitify.request.mockReturnValue("request");
      const returnValue = traitify.put("/assessments", {});

      expect(returnValue).toBe("request");
    });
  });

  describe("post", () => {
    beforeEach(() => {
      traitify.request = jest.fn().mockName("request");
    });

    it("passes the arguments", () => {
      const params = {deck_id: "career-deck"};
      const path = "/assessments";
      traitify.post(path, params);

      expect(traitify.request).toHaveBeenCalledWith("POST", path, params);
    });

    it("returns the request", () => {
      traitify.request.mockReturnValue("request");
      const returnValue = traitify.post("/assessments", {});

      expect(returnValue).toBe("request");
    });
  });

  describe("setImagePack", () => {
    it("calls function on ui", () => {
      traitify.ui.setImagePack = jest.fn().mockName("setImagePack");
      traitify.setImagePack("linear");

      expect(traitify.ui.setImagePack).toHaveBeenCalledWith("linear");
    });

    it("returns traitify", () => {
      const returnValue = traitify.setImagePack("linear");

      expect(returnValue).toBe(traitify);
    });
  });

  describe("component", () => {
    beforeEach(() => {
      traitify.ui.originalComponent = jest.fn().mockName("originalComponent").mockImplementation((options) => ({options}));
    });

    it("passes the options", () => {
      const options = {imagePack: "linear"};
      traitify.ui.component(options);

      expect(traitify.ui.originalComponent).toHaveBeenCalledWith(options);
    });

    it("returns a component with legacy functions", () => {
      const options = {imagePack: "linear"};
      const returnValue = traitify.ui.component(options);

      expect(returnValue).toEqual({
        allowFullScreen: expect.any(Function),
        assessmentId: expect.any(Function),
        options
      });
    });

    describe("allowFullScreen", () => {
      let allowFullscreen;
      let disableFullscreen;

      beforeEach(() => {
        allowFullscreen = jest.fn().mockName("allowFullscreen");
        disableFullscreen = jest.fn().mockName("disableFullscreen");
        traitify.ui.originalComponent.mockReturnValue({allowFullscreen, disableFullscreen});
      });

      it("calls allowFullscreen", () => {
        const component = traitify.ui.component();
        component.allowFullScreen(true);

        expect(allowFullscreen).toHaveBeenCalled();
        expect(disableFullscreen).not.toHaveBeenCalled();
      });

      it("calls disableFullscreen", () => {
        const component = traitify.ui.component();
        component.allowFullScreen(false);

        expect(allowFullscreen).not.toHaveBeenCalled();
        expect(disableFullscreen).toHaveBeenCalled();
      });
    });

    describe("assessmentId", () => {
      let assessmentID;

      beforeEach(() => {
        assessmentID = jest.fn().mockName("assessmentID");
        traitify.ui.originalComponent.mockReturnValue({assessmentID});
      });

      it("calls assessmentID", () => {
        const component = traitify.ui.component();
        component.assessmentId("xyz");

        expect(assessmentID).toHaveBeenCalledWith("xyz");
      });
    });
  });

  describe("allowBack", () => {
    let allowBack;
    let disableBack;

    beforeEach(() => {
      allowBack = jest.fn().mockName("allowBack");
      disableBack = jest.fn().mockName("disableBack");
      traitify.ui.component = jest.fn().mockName("component").mockReturnValue({allowBack, disableBack});
    });

    it("calls allowBack", () => {
      traitify.ui.allowBack(true);

      expect(allowBack).toHaveBeenCalled();
      expect(disableBack).not.toHaveBeenCalled();
    });

    it("calls disableBack", () => {
      traitify.ui.allowBack(false);

      expect(allowBack).not.toHaveBeenCalled();
      expect(disableBack).toHaveBeenCalled();
    });
  });

  describe("allowFullScreen", () => {
    let allowFullscreen;
    let disableFullscreen;

    beforeEach(() => {
      allowFullscreen = jest.fn().mockName("allowFullscreen");
      disableFullscreen = jest.fn().mockName("disableFullscreen");
      traitify.ui.component = jest.fn().mockName("component").mockReturnValue({allowFullscreen, disableFullscreen});
    });

    it("calls allowFullscreen", () => {
      traitify.ui.allowFullScreen(true);

      expect(allowFullscreen).toHaveBeenCalled();
      expect(disableFullscreen).not.toHaveBeenCalled();
    });

    it("calls disableFullscreen", () => {
      traitify.ui.allowFullScreen(false);

      expect(allowFullscreen).not.toHaveBeenCalled();
      expect(disableFullscreen).toHaveBeenCalled();
    });
  });

  describe("assessmentId", () => {
    let assessmentID;

    beforeEach(() => {
      assessmentID = jest.fn().mockName("assessmentID");
      traitify.ui.component = jest.fn().mockName("component").mockReturnValue({assessmentID});
    });

    it("calls assessmentID", () => {
      traitify.ui.assessmentId("xyz");

      expect(assessmentID).toHaveBeenCalledWith("xyz");
    });
  });

  describe("render", () => {
    let render;

    beforeEach(() => {
      render = jest.fn().mockName("render");
      traitify.ui.component = jest.fn().mockName("component").mockReturnValue({render});
    });

    it("calls render", () => {
      const options = {imagePack: "linear"};
      traitify.ui.render(options);

      expect(traitify.ui.component).toHaveBeenCalledWith(options);
      expect(render).toHaveBeenCalled();
    });
  });

  describe("locale", () => {
    let locale;

    beforeEach(() => {
      locale = jest.fn().mockName("locale");
      traitify.ui.component = jest.fn().mockName("component").mockReturnValue({locale});
    });

    it("calls locale", () => {
      traitify.ui.locale("es-us");

      expect(locale).toHaveBeenCalledWith("es-us");
    });
  });

  describe("perspective", () => {
    let perspective;

    beforeEach(() => {
      perspective = jest.fn().mockName("perspective");
      traitify.ui.component = jest.fn().mockName("component").mockReturnValue({perspective});
    });

    it("calls perspective", () => {
      traitify.ui.perspective("firstPerson");

      expect(perspective).toHaveBeenCalledWith("firstPerson");
    });
  });

  describe("target", () => {
    let target;

    beforeEach(() => {
      target = jest.fn().mockName("target");
      traitify.ui.component = jest.fn().mockName("component").mockReturnValue({target});
    });

    it("calls target", () => {
      traitify.ui.target(".results");

      expect(target).toHaveBeenCalledWith(".results");
    });
  });

  describe("targets", () => {
    let targets;

    beforeEach(() => {
      targets = jest.fn().mockName("targets");
      traitify.ui.component = jest.fn().mockName("component").mockReturnValue({targets});
    });

    it("calls targets", () => {
      traitify.ui.targets({Results: ".results"});

      expect(targets).toHaveBeenCalledWith({Results: ".results"});
    });
  });

  describe("dependencies", () => {
    let component;

    beforeEach(() => {
      traitify = new Traitify();
      component = traitify.ui.component();
    });

    it("can rely on internals", () => {
      expect(component.allowBack).toBeDefined();
      expect(component.allowFullscreen).toBeDefined();
      expect(component.disableBack).toBeDefined();
      expect(component.disableFullscreen).toBeDefined();
      expect(component.assessmentID).toBeDefined();
      expect(component.locale).toBeDefined();
      expect(component.perspective).toBeDefined();
      expect(component.render).toBeDefined();
      expect(component.target).toBeDefined();
      expect(component.targets).toBeDefined();
      expect(traitify.ajax).toBeDefined();
      expect(traitify.ui).toBeDefined();
      expect(traitify.ui.component).toBeDefined();
      expect(traitify.ui.options).toBeDefined();
      expect(traitify.ui.setImagePack).toBeDefined();
    });

    it("doesn't override internals", () => {
      expect(component.allowFullScreen).not.toBeDefined();
      expect(component.assessmentId).not.toBeDefined();
      expect(traitify.request).not.toBeDefined();
      expect(traitify.setImagePack).not.toBeDefined();
      expect(traitify.ui.allowBack).not.toBeDefined();
      expect(traitify.ui.allowFullScreen).not.toBeDefined();
      expect(traitify.ui.assessmentId).not.toBeDefined();
      expect(traitify.ui.locale).not.toBeDefined();
      expect(traitify.ui.perspective).not.toBeDefined();
      expect(traitify.ui.render).not.toBeDefined();
      expect(traitify.ui.target).not.toBeDefined();
      expect(traitify.ui.targets).not.toBeDefined();
    });
  });
});
