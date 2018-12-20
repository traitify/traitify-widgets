import {Component} from "components/results/type-based-results/career-results";
import ComponentHandler from "support/component-handler";
import assessment from "support/json/assessment/type-based.json";
import careers from "support/json/careers.json";

jest.mock("components/results/type-based-results/career", () => ((props) => (
  <div className="mock">Career - {props.career.title}</div>
)));
jest.mock("lib/with-traitify", () => ((value) => value));

describe("CareerResults", () => {
  let props;

  beforeEach(() => {
    props = {
      assessmentID: assessment.id,
      isReady: jest.fn().mockName("isReady").mockImplementation(() => true),
      locale: "en-us",
      options: {careerOptions: {}},
      traitify: {
        get: jest.fn().mockName("get"),
        put: jest.fn().mockName("put")
      },
      translate: jest.fn().mockName("translate").mockImplementation((value) => value),
      ui: {
        current: {},
        off: jest.fn().mockName("off"),
        on: jest.fn().mockName("on"),
        options: {careerOptions: {}},
        trigger: jest.fn().mockName("trigger")
      }
    };
  });

  describe("callbacks", () => {
    it("triggers initialization", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.trigger).toHaveBeenCalledWith("CareerResults.initialized", component.instance);
    });

    it("triggers update", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateProps();

      expect(props.ui.trigger).toHaveBeenCalledWith("CareerResults.updated", component.instance);
    });

    it("follows career callbacks", () => {
      const component = new ComponentHandler(<Component {...props} />);

      expect(props.ui.on).toHaveBeenCalledWith("Careers.fetch", component.instance.fetch);
      expect(props.ui.on).toHaveBeenCalledWith("Careers.fetching", component.instance.fetching);
      expect(props.ui.on).toHaveBeenCalledWith("Careers.mergeParams", component.instance.mergeParams);
      expect(props.ui.on).toHaveBeenCalledWith("Careers.updateParams", component.instance.updateParams);
    });

    it("unfollows career callbacks", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const {instance} = component;
      component.unmount();

      expect(props.ui.off).toHaveBeenCalledWith("Careers.fetch", instance.fetch);
      expect(props.ui.off).toHaveBeenCalledWith("Careers.fetching", instance.fetching);
      expect(props.ui.off).toHaveBeenCalledWith("Careers.mergeParams", instance.mergeParams);
      expect(props.ui.off).toHaveBeenCalledWith("Careers.updateParams", instance.updateParams);
    });
  });

  describe("fetching", () => {
    it("fetch does nothing if null params", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.fetch();

      expect(props.traitify.get).not.toHaveBeenCalled();
    });

    it("fetch aborts prevous request", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const request = {xhr: {abort: jest.fn().mockName("abort")}};
      props.ui.current["Careers.fetch"] = {};
      props.ui.current["Careers.fetching"] = true;
      props.ui.current["Careers.request"] = request;
      props.traitify.get.mockResolvedValue(Promise.resolve(careers));
      component.instance.fetch();

      expect(request.xhr.abort).toHaveBeenCalled();
      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetching", component.instance, true);
      expect(props.traitify.get).toHaveBeenCalled();
    });

    it("fetch triggers a request", (done) => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["Careers.fetch"] = {};
      props.traitify.get.mockResolvedValue(Promise.resolve(careers));
      component.instance.fetch();

      props.ui.trigger.mock.calls.find((call) => call[0] === "Careers.request")[2]
        .then(() => {
          expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetching", component.instance, true);
          expect(props.traitify.get).toHaveBeenCalled();
          expect(component.state.careers).toEqual(careers);
          expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetching", component.instance, false);
          done();
        });
    });

    it("fetch triggers a request that combines previous careers", (done) => {
      const component = new ComponentHandler(<Component {...props} />);
      component.updateState({careers: careers.slice(0, 10)});
      props.ui.current["Careers.fetch"] = {page: 2};
      props.traitify.get.mockResolvedValue(Promise.resolve(careers.slice(10)));
      component.instance.fetch();

      props.ui.trigger.mock.calls.find((call) => call[0] === "Careers.request")[2]
        .then(() => {
          expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetching", component.instance, true);
          expect(props.traitify.get).toHaveBeenCalled();
          expect(component.state.careers).toEqual(careers);
          expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetching", component.instance, false);
          done();
        });
    });

    it("fetching updates state", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["Careers.fetching"] = true;
      component.instance.fetching();

      expect(component.state.fetching).toBe(true);
    });

    it("merge params updates fetch with new params", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["Careers.fetch"] = {careers_per_page: 100, page: 2};
      props.ui.current["Careers.mergeParams"] = {careers_per_page: 10, locale_key: "en-us"};
      component.instance.mergeParams();

      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetch", component.instance, {
        careers_per_page: 10, locale_key: "en-us", page: 2
      });
    });

    it("update params triggers fetch", () => {
      const component = new ComponentHandler(<Component {...props} />);
      const params = {careers_per_page: 100, page: 1};
      props.ui.current["Careers.updateParams"] = params;
      component.instance.updateParams();

      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetch", component.instance, params);
    });

    it("show more does nothing if fetching", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["Careers.fetching"] = true;
      component.instance.showMore();

      expect(props.ui.trigger).not.toHaveBeenCalledWith(
        "Careers.mergeParams",
        component.instance,
        {page: 2}
      );
    });

    it("show more updates params for next page", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["Careers.fetch"] = {page: 2};
      component.instance.showMore();

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "Careers.mergeParams",
        component.instance,
        {page: 3}
      );
    });

    it("show more updates params with defaults", () => {
      const component = new ComponentHandler(<Component {...props} />);
      component.instance.showMore();

      expect(props.ui.trigger).toHaveBeenCalledWith(
        "Careers.mergeParams",
        component.instance,
        {page: 2}
      );
    });
  });

  describe("updates", () => {
    it("clears fetch params if the assessment or locale changes and assessment is not ready", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.isReady.mockImplementation(() => false);
      props.ui.current["Careers.fetch"] = {page: 2};
      component.updateProps({assessmentID: "other"});

      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetching", component.instance, false);
      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetch", component.instance, null);
    });

    it("triggers a fetch with blank params if the assessment changes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["Careers.fetch"] = {page: 2};
      component.updateProps({assessmentID: "other"});

      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetching", component.instance, false);
      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetch", component.instance, {});
    });

    it("triggers a fetch with current params if the locale changes", () => {
      const component = new ComponentHandler(<Component {...props} />);
      props.ui.current["Careers.fetch"] = {page: 2};
      component.updateProps({locale: "es-us"});

      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetching", component.instance, false);
      expect(props.ui.trigger).toHaveBeenCalledWith("Careers.fetch", component.instance, {page: 2});
    });
  });

  it("renders component", () => {
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if not ready", () => {
    props.isReady.mockImplementation(() => false);
    const component = new ComponentHandler(<Component {...props} />);

    expect(component.tree).toMatchSnapshot();
  });

  it("renders careers", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.updateState({careers});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders more careers button", () => {
    const component = new ComponentHandler(<Component {...props} />);
    component.updateState({careers, moreCareers: true});

    expect(component.tree).toMatchSnapshot();
  });
});
